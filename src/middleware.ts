import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Публичные маршруты, которые не требуют аутентификации
const publicRoutes = [
  '/',
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
  return publicRoutes.some(route => path.startsWith(`/${route}`) || path === route || path.startsWith(route));
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Всегда пропускаем статические файлы и API healthcheck
  if (path.startsWith('/_next') || 
      path.startsWith('/api/healthcheck') ||
      path.startsWith('/api/auth') || 
      path.startsWith('/favicon')) {
    return NextResponse.next();
  }
  
  // Проверяем, является ли маршрут публичным и пропускаем проверку
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }
  
  try {
    // Получаем токен из cookies
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // Если токен отсутствует, перенаправляем на страницу входа
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // Если все проверки прошли успешно, пропускаем запрос
    return NextResponse.next();
  } catch (error) {
    console.error('Ошибка в middleware:', error);
    // В случае ошибки также пропускаем запрос, чтобы не блокировать приложение
    return NextResponse.next();
  }
}

// Указываем, для каких маршрутов применять middleware
export const config = {
  matcher: [
    '/((?!api/auth|api/healthcheck|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Объявление типа глобальной переменной для работы с таймаутом
declare global {
  var middlewareCleanupTimeout: NodeJS.Timeout | undefined;
} 