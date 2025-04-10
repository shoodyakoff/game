import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Основное middleware с использованием Clerk
export default authMiddleware({
  // Публичные маршруты, доступные без аутентификации
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-in/(.*)",
    "/sign-up",
    "/sign-up/(.*)",
    "/api/healthcheck",
    "/api/health"
  ],
  
  // Маршруты, которые нужно игнорировать
  ignoredRoutes: [
    "/api/webhooks/clerk"
  ],
  
  // Функция для кастомизации поведения при отсутствии авторизации
  afterAuth(auth, req) {
    // Создаем новый ответ
    const response = NextResponse.next();
    
    // Настройка Content-Security-Policy с разрешениями для разработки
    if (process.env.NODE_ENV === 'development') {
      // В режиме разработки используем более либеральную политику
      response.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.gotogrow.app https://*.clerk.accounts.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https://images.clerk.dev https://via.placeholder.com; connect-src 'self' https://clerk.gotogrow.app https://*.clerk.accounts.dev https://api.clerk.dev; frame-src 'self' https://clerk.gotogrow.app https://*.clerk.accounts.dev; worker-src 'self' blob:;"
      );
    } else {
      // В production используем более строгую политику
      response.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://clerk.gotogrow.app https://*.clerk.accounts.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https://images.clerk.dev https://via.placeholder.com; connect-src 'self' https://clerk.gotogrow.app https://*.clerk.accounts.dev https://api.clerk.dev; frame-src 'self' https://clerk.gotogrow.app https://*.clerk.accounts.dev; worker-src 'self' blob:;"
      );
    }
    
    // Дополнительные заголовки безопасности
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    
    // Если пользователь не авторизован и маршрут не публичный, 
    // перенаправляем на страницу входа
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    return response;
  }
});

// Конфигурация для middleware
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 