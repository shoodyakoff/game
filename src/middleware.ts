import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Публичные маршруты, доступные без аутентификации
const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-in/(.*)",
  "/sign-up",
  "/sign-up/(.*)",
  "/api/healthcheck",
  "/api/health"
];

// Проверка, включен ли мок-режим (показываем все переменные окружения для диагностики)
const isMockMode = process.env.NEXT_PUBLIC_CLERK_MOCK_MODE === 'true';
console.log('[Auth Middleware] Environment:', {
  mockMode: isMockMode,
  nodeEnv: process.env.NODE_ENV,
  clerkPubKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.slice(0, 10) + '...',
  noVerification: process.env.NEXT_PUBLIC_CLERK_NO_VERIFICATION
});

// Простая мок-функция для пропуска проверки аутентификации
const mockMiddleware = (req: NextRequest) => {
  console.log('[Auth Middleware] Using mock middleware, bypassing Clerk');
  return NextResponse.next();
};

// Если мок-режим включен или мы находимся в процессе сборки, используем простую функцию
const isDev = process.env.NODE_ENV === 'development';
const useClerk = !isMockMode && process.env.NODE_ENV !== 'test';

// Экспортируем нужное middleware в зависимости от режима
export default useClerk
  ? authMiddleware({
      publicRoutes: publicRoutes,
      ignoredRoutes: ["/api/webhooks/clerk"]
    })
  : mockMiddleware;

// Конфигурация для middleware
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  
  // Отключаем Edge Runtime и используем Node.js
  runtime: "nodejs"
}; 