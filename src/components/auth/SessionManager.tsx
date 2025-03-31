import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { refreshSession } from '../../lib/session';

/**
 * Компонент для автоматического управления сессией пользователя
 * Проверяет актуальность данных сессии и при необходимости обновляет их
 */

// Публичные пути, доступные без авторизации
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/about",
  "/docs",
];

const SessionManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
  // При первой загрузке проверяем данные сессии
  useEffect(() => {
    const checkSession = async () => {
      if (status === 'authenticated' && session?.user) {
        // Получаем информацию о куке session_debug из middleware
        const sessionDebug = document.cookie
          .split('; ')
          .find(row => row.startsWith('session_debug='))
          ?.split('=')[1];
          
        if (sessionDebug) {
          try {
            const debugData = JSON.parse(decodeURIComponent(sessionDebug));
            console.log('[SessionManager] Debug data:', debugData);
            
            // Если у нас конфликт данных сессии, обновляем её
            if (debugData.hasCharacter !== session.user.hasCharacter) {
              console.log('[SessionManager] Session conflict detected, refreshing');
              await refreshSession({ forceRefresh: true });
            }
          } catch (e) {
            console.error('[SessionManager] Error parsing debug data:', e);
          }
        }
      }
    };
    
    checkSession();
  }, [session, status]);
  
  // Регулярное обновление сессии на защищенных маршрутах
  useEffect(() => {
    // Защищенные маршруты, где нужно проверять сессию
    const protectedRoutes = ['/dashboard', '/game', '/level'];
    const isProtectedRoute = protectedRoutes.some(route => 
      router.pathname.startsWith(route)
    );
    
    if (status === 'authenticated' && isProtectedRoute) {
      // Проверяем сессию каждые 5 минут
      const sessionCheckInterval = setInterval(async () => {
        if (lastRefresh === null || new Date().getTime() - lastRefresh.getTime() > 5 * 60 * 1000) {
          console.log('[SessionManager] Periodic session refresh');
          await refreshSession({ forceRefresh: false });
          setLastRefresh(new Date());
        }
      }, 5 * 60 * 1000);
      
      return () => clearInterval(sessionCheckInterval);
    }
  }, [session, status, router.pathname, lastRefresh]);
  
  useEffect(() => {
    // Путь текущей страницы
    const currentPath = router.pathname;
    
    // Проверяем, является ли текущий путь публичным
    const isPublicPath = publicRoutes.some(
      route => currentPath === route || currentPath.startsWith(`${route}/`)
    );
    
    console.log("SessionManager statuses:", {
      currentPath,
      isPublic: isPublicPath,
      sessionStatus: status,
      hasSession: !!session,
      userId: session?.user?.id
    });
    
    // Если загрузка сессии завершена, но сессии нет и путь не публичный
    if (status === "unauthenticated" && !isPublicPath) {
      console.log("Перенаправление: нет сессии на защищенном пути");
      const callbackUrl = encodeURIComponent(
        router.asPath !== "/auth/logout" ? router.asPath : "/"
      );
      router.push(`/auth/login?callbackUrl=${callbackUrl}`);
    } 
    // Если сессия существует и пользователь на странице входа/регистрации
    else if (status === "authenticated" && 
             (currentPath === "/auth/login" || currentPath === "/auth/register")) {
      console.log("Перенаправление: пользователь авторизован на странице входа/регистрации");
      router.push("/dashboard");
    }
    // Завершаем загрузку, когда статус сессии определен
    else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, router, session]);

  // Показываем загрузку, пока проверяем сессию
  if (isLoading && status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700">Загрузка...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SessionManager; 