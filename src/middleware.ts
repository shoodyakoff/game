import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

// Константы для ограничения запросов
const MAX_REQUESTS_PER_MINUTE = 60;
const REQUEST_WINDOW_MS = 60 * 1000; // 1 минута

// Хранилище запросов в памяти для анти-DDoS (в продакшене лучше использовать Redis)
const requestStore: { [key: string]: { count: number; resetTime: number } } = {};

// Основной middleware
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Добавляем заголовки безопасности
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Добавляем Content-Security-Policy для продакшена
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    );
  }
  
  // Проверяем авторизацию для защищенных маршрутов
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/levels') ||
    request.nextUrl.pathname.startsWith('/game')
  ) {
    // Проверяем наличие сессии
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    // Если сессии нет, перенаправляем на страницу входа
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', encodeURIComponent(request.url));
      return NextResponse.redirect(url);
    }
    
    // Проверка для маршрутов, требующих персонажа
    const hasCharacter = token.hasCharacter as boolean;
    if (
      (request.nextUrl.pathname.startsWith('/game') || 
       request.nextUrl.pathname.startsWith('/levels')) && 
      !hasCharacter
    ) {
      const url = new URL('/character', request.url);
      url.searchParams.set('redirectTo', encodeURIComponent(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  // Настройка CORS для API-запросов
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Получаем домен из переменных окружения или используем дефолтные значения
    const allowedOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || 
                          ['https://shoodyakoff-game-13b1.twc1.net', 'http://localhost:3000'];
    
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    
    // Для разработки разрешаем все запросы
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, { status: 204, headers: response.headers });
      }
    }
    // В продакшене проверяем, входит ли origin в список разрешенных
    else if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      
      // Для предзапросов OPTIONS сразу возвращаем ответ
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, { status: 204, headers: response.headers });
      }
    }
    
    // Простая защита от DDoS - ограничение количества запросов
    const ip = request.ip || 'unknown';
    const now = Date.now();
    
    // Инициализация или сброс счетчика, если время истекло
    if (!requestStore[ip] || requestStore[ip].resetTime < now) {
      requestStore[ip] = { count: 1, resetTime: now + REQUEST_WINDOW_MS };
    } else {
      requestStore[ip].count += 1;
      
      // Если превышен лимит запросов, возвращаем ошибку 429
      if (requestStore[ip].count > MAX_REQUESTS_PER_MINUTE) {
        response.headers.set('Retry-After', '60');
        return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
          headers: response.headers,
        });
      }
    }
    
    // Периодическая очистка хранилища (каждые 5 минут)
    const CLEANUP_INTERVAL = 5 * 60 * 1000;
    if (global.middlewareCleanupTimeout === undefined) {
      global.middlewareCleanupTimeout = setTimeout(() => {
        for (const ip in requestStore) {
          if (requestStore[ip].resetTime < now) {
            delete requestStore[ip];
          }
        }
        global.middlewareCleanupTimeout = undefined;
      }, CLEANUP_INTERVAL);
    }
  }
  
  return response;
}

// Указываем, для каких путей должен срабатывать middleware
export const config = {
  matcher: [
    // Применяем к API-запросам
    '/api/:path*',
    // И к защищенным страницам
    '/dashboard/:path*',
    '/profile/:path*',
    '/levels/:path*',
    '/game/:path*',
    '/character',
    // Добавляем страницы аутентификации
    '/auth/login',
    '/auth/register',
    '/auth/logout',
  ],
};

// Объявление типа глобальной переменной для работы с таймаутом
declare global {
  var middlewareCleanupTimeout: NodeJS.Timeout | undefined;
} 