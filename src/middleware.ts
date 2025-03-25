import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Константы для ограничения запросов
const MAX_REQUESTS_PER_MINUTE = 60;
const REQUEST_WINDOW_MS = 60 * 1000; // 1 минута

// Хранилище запросов в памяти для анти-DDoS (в продакшене лучше использовать Redis)
const requestStore: { [key: string]: { count: number; resetTime: number } } = {};

// Основной middleware
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Определяем пути, которые можно пройти без аутентификации
  const isPublicPath = 
    path === '/' || 
    path === '/auth/login' || 
    path === '/auth/register' || 
    path.startsWith('/api/auth/') || 
    path.startsWith('/images/') || 
    path.startsWith('/characters/') || 
    path.startsWith('/_next/') || 
    path.startsWith('/favicon');
  
  // Получаем токен сессии
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Логирование для отладки
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] Path: ${path}, Public: ${isPublicPath}, Token: ${token ? 'Yes' : 'No'}`);
  }
  
  // Обрабатываем CORS для API-запросов
  if (path.startsWith('/api/')) {
    // Получаем текущий инстанс ответа
    const response = NextResponse.next();
    
    // Устанавливаем CORS заголовки
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
    
    // Для OPTIONS запросов возвращаем 200
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200 });
    }
    
    return response;
  }
  
  // Если пользователь не аутентифицирован и пытается получить доступ к защищенному пути
  if (!isPublicPath && !token) {
    // Сохраняем текущий URL в параметре returnUrl
    const returnUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/auth/login?returnUrl=${returnUrl}`, request.url));
  }
  
  // Для путей аутентификации, когда пользователь уже вошел в систему
  if ((path === '/auth/login' || path === '/auth/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Проверяем маршруты, которые требуют выбора персонажа
  const requireCharacterRoutes = [
    '/dashboard', 
    '/game', 
    '/leaderboard', 
    '/characters'
  ];
  
  // Если путь требует персонажа, а у пользователя его нет
  if (
    requireCharacterRoutes.some(route => path.startsWith(route)) && 
    token && 
    token.hasCharacter === false &&
    !request.cookies.get('character_redirect') // Предотвращаем бесконечный цикл редиректов
  ) {
    // Устанавливаем временную куку для предотвращения бесконечных редиректов
    const response = NextResponse.redirect(new URL('/character/select', request.url));
    response.cookies.set('character_redirect', '1', { maxAge: 30 }); // Куки на 30 секунд
    
    return response;
  }
  
  // Очищаем куку redirect, если мы находимся на странице выбора персонажа
  if (path === '/character/select' || path.startsWith('/api/character/')) {
    const response = NextResponse.next();
    response.cookies.delete('character_redirect');
    return response;
  }
  
  return NextResponse.next();
}

// Конфигурация путей, для которых будет срабатывать middleware
export const config = {
  matcher: [
    /*
     * Сопоставление всех путей, кроме:
     * - Файлов из папок _next (статические файлы Next.js)
     * - Файлов из папки images (изображения)
     * - Файлов из папки characters (изображения персонажей)
     * - Файла favicon.ico (иконка сайта)
     */
    '/((?!_next/|images/|characters/|favicon.ico).*)',
  ],
};

// Объявление типа глобальной переменной для работы с таймаутом
declare global {
  var middlewareCleanupTimeout: NodeJS.Timeout | undefined;
} 