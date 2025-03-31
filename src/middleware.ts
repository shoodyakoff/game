import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Публичные маршруты, которые не требуют аутентификации
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/logout',
  '/auth/error',
  '/api/auth',
  '/api/healthcheck',
  '/healthcheck',
  '/about',
  '/docs',
  '_next',
  'favicon.ico'
];

// Функция для проверки, является ли маршрут публичным
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => path.startsWith(`/${route}`) || path === route);
};

export async function middleware(request: NextRequest) {
  console.log('Middleware вызван для пути:', request.nextUrl.pathname);
  
  // Проверяем, является ли маршрут публичным
  if (isPublicRoute(request.nextUrl.pathname)) {
    console.log('Публичный маршрут, пропускаем проверку аутентификации:', request.nextUrl.pathname);
    return NextResponse.next();
  }
  
  // Статические файлы и API (кроме защищенных) пропускаем
  if (request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.startsWith('/api/public')) {
    console.log('Статический или публичный API маршрут, пропускаем');
    return NextResponse.next();
  }
  
  try {
    // Получаем токен из cookies
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    console.log('Результат проверки токена:', { 
      hasToken: !!token, 
      tokenId: token?.id,
      userEmail: token?.email 
    });
    
    // Если токен отсутствует, перенаправляем на страницу входа
    if (!token) {
      console.log('Токен не найден, перенаправление на страницу входа');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // Проверка прав на защищенные маршруты (например, админка)
    if (request.nextUrl.pathname.startsWith('/admin') && token.role !== 'admin') {
      console.log('Доступ в админку запрещен для роли:', token.role);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Если все проверки прошли успешно, пропускаем запрос
    console.log('Аутентификация успешна, пропускаем запрос');
    return NextResponse.next();
  } catch (error) {
    console.error('Ошибка в middleware:', error);
    // В случае ошибки перенаправляем на страницу входа
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Указываем, для каких маршрутов применять middleware
export const config = {
  matcher: [
    /*
     * Совпадение со всеми маршрутами, кроме:
     * 1. Маршруты статических файлов (_next)
     * 2. Несуществующие API маршруты
     * 3. /api/auth - маршруты аутентификации (необходимы для работы NextAuth)
     * 4. /api/healthcheck - для проверки работоспособности
     */
    '/((?!api/auth|api/healthcheck|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Объявление типа глобальной переменной для работы с таймаутом
declare global {
  var middlewareCleanupTimeout: NodeJS.Timeout | undefined;
} 