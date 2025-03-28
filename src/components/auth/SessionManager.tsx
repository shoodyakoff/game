import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { refreshSession } from '../../lib/session';

/**
 * Компонент для автоматического управления сессией пользователя
 * Проверяет актуальность данных сессии и при необходимости обновляет их
 */
const SessionManager: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
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
  
  // Этот компонент не рендерит ничего
  return null;
};

export default SessionManager; 