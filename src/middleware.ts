import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Основной middleware
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Пути, доступные без авторизации
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/api/auth/callback',
    '/api/auth/session',
    '/api/auth/csrf',
    '/api/auth/update-session'
  ];
  
  // Проверяем, является ли путь API маршрутом
  const isApiRoute = path.startsWith('/api/');
  
  // Путь для выбора персонажа
  const characterSelectionPath = '/character/select';
  
  // Защищенные пути, требующие персонажа
  const characterProtectedPaths = [
    '/dashboard',
    '/game',
    '/level'
  ];
  
  // Получаем токен из сессии
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Проверяем наличие cookie, указывающего на недавний выбор персонажа
  const hasJustSelectedCharacter = request.cookies.get('just_selected_character')?.value === 'true';
  
  // Расширенное логирование для отладки
  console.log(`[Middleware] Path: ${path}, Token: ${token ? 'Yes' : 'No'}, HasChar: ${token?.hasCharacter || false}, JustSelected: ${hasJustSelectedCharacter || false}`);
  
  // Проверяем статические ресурсы и пропускаем их
  if (path.startsWith('/_next') || 
      path.startsWith('/images/') || 
      path.startsWith('/characters/') || 
      path.startsWith('/favicon')) {
    return NextResponse.next();
  }
  
  // 1. Если пользователь не авторизован и путь не публичный
  if (!token && !publicPaths.some(p => path === p || path.startsWith('/api/auth/'))) {
    // Для API запросов возвращаем 401
    if (isApiRoute) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized', message: 'Требуется авторизация' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
    
    // Редирект на вход с сохранением исходного URL
    console.log(`[Middleware] Перенаправление неаутентифицированного пользователя на логин`);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  }
  
  // 2. Если пользователь авторизован и пытается посетить публичные пути авторизации
  if (token && (path === '/auth/login' || path === '/auth/register')) {
    const redirectTo = token.hasCharacter === true ? '/dashboard' : '/character/select';
    console.log(`[Middleware] Перенаправление аутентифицированного пользователя с ${path} на ${redirectTo}`);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }
  
  // 3. Если у пользователя уже есть персонаж и он пытается выбрать персонажа
  if (token && path === characterSelectionPath && token.hasCharacter === true) {
    console.log('[Middleware] Пользователь уже имеет персонажа, перенаправление на дашборд');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // 4. Если у пользователя нет персонажа и он пытается посетить защищенные пути
  if (token && characterProtectedPaths.some(p => path.startsWith(p)) && token.hasCharacter !== true) {
    // Если персонаж только что выбран (есть cookie), разрешаем доступ к дашборду
    if (hasJustSelectedCharacter) {
      console.log('[Middleware] Доступ разрешен, т.к. персонаж только что выбран');
      
      // Очищаем cookie для следующих запросов
      const response = NextResponse.next();
      // Устанавливаем значение в false и время жизни в 0 (удаляем)
      response.cookies.set('just_selected_character', 'false', { 
        maxAge: 0,
        path: '/'
      });
      
      console.log('[Middleware] Cookie just_selected_character удален');
      return response;
    }
    
    // Для API запросов возвращаем 403
    if (isApiRoute) {
      return new NextResponse(
        JSON.stringify({ error: 'Character Required', message: 'Требуется выбрать персонажа' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
    
    // Устанавливаем кастомные заголовки для отладки
    const response = NextResponse.redirect(new URL(characterSelectionPath, request.url));
    response.headers.set('X-Debug-Redirect', 'No character found');
    console.log('[Middleware] Перенаправление на страницу выбора персонажа из:', path);
    return response;
  }

  return NextResponse.next();
}

// Определяем пути, для которых будет вызываться middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

// Объявление типа глобальной переменной для работы с таймаутом
declare global {
  var middlewareCleanupTimeout: NodeJS.Timeout | undefined;
} 