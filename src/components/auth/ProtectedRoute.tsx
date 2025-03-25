import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCharacter?: boolean;
}

/**
 * Компонент для защиты маршрутов, требующих авторизации
 * Перенаправляет неавторизованных пользователей на страницу входа
 * и сохраняет исходный URL для возврата после авторизации
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireCharacter = false
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  
  // Отслеживаем, произошла ли проверка аутентификации
  const [isVerified, setIsVerified] = useState(false);

  // Используем hasCharacter из сессии NextAuth, если доступен
  const hasCharacter = session?.user?.hasCharacter || false;

  // Выполняем проверку аутентификации
  useEffect(() => {
    if (status !== 'loading') {
      setIsVerified(true);
    }
  }, [status]);

  // Выполняем перенаправление, если необходимо
  useEffect(() => {
    if (!isVerified) return;

    if (!isAuthenticated) {
      // Сохраняем текущий URL для возврата после авторизации
      const currentPath = encodeURIComponent(router.asPath);
      router.push(`/auth/login?callbackUrl=${currentPath}`);
    } else if (requireCharacter && !hasCharacter) {
      // Если требуется персонаж, но он не выбран, перенаправляем на страницу выбора
      router.push('/character');
    }
  }, [isAuthenticated, requireCharacter, hasCharacter, router, isVerified]);

  // Показываем загрузчик во время проверки аутентификации
  if (loading || !isVerified || (!isAuthenticated || (requireCharacter && !hasCharacter))) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Если пользователь аутентифицирован, показываем содержимое страницы
  return <>{children}</>;
};

export default ProtectedRoute; 