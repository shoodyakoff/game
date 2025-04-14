// Маршруты, доступные без аутентификации
export const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-in/(.*)",
  "/sign-up",
  "/sign-up/(.*)",
  "/api/healthcheck",
  "/api/health"
];

// Маршруты, доступные только для неаутентифицированных пользователей
export const authRoutes = [
  "/sign-in",
  "/sign-in/(.*)",
  "/sign-up",
  "/sign-up/(.*)"
];

// Маршруты, которые нужно игнорировать при проверке аутентификации
export const ignoredRoutes = [
  "/api/webhooks/clerk"
]; 