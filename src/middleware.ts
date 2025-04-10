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
    
    // Настройка Content-Security-Policy
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://clerk.gotogrow.app https://*.clerk.accounts.dev; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.clerk.dev; font-src 'self' data:; connect-src 'self' https://clerk.gotogrow.app https://*.clerk.accounts.dev; frame-src 'self' https://clerk.gotogrow.app https://*.clerk.accounts.dev;"
    );
    
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