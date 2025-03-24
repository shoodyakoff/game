import { useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { selectSelectedCharacter } from '../../store/slices/characterSlice';
import { checkAuthStatus } from '../../store/slices/authSlice';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: ReactNode;
  characterRequired?: boolean;
}

/**
 * Компонент для защиты маршрутов, требующих авторизации
 * Перенаправляет неавторизованных пользователей на страницу входа
 * и сохраняет исходный URL для возврата после авторизации
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, characterRequired = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const [isInitialized, setIsInitialized] = useState(false);

  // Проверяем статус аутентификации при монтировании компонента
  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkAuthStatus());
      setIsInitialized(true);
    };
    
    checkAuth();
  }, [dispatch]);

  // Выполняем перенаправление только после инициализации
  useEffect(() => {
    if (!isInitialized) return;

    // Проверяем токен локально для предотвращения мигания при обновлении страницы
    const hasLocalToken = typeof window !== 'undefined' && !!localStorage.getItem('token');

    if (!loading && !isAuthenticated && !hasLocalToken) {
      // Сохраняем текущий URL для возврата после авторизации
      const returnUrl = encodeURIComponent(router.asPath);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
    } else if (!loading && isAuthenticated && characterRequired && !selectedCharacter) {
      // Если требуется персонаж, но он не выбран, перенаправляем на страницу выбора
      // с указанием, куда вернуться после выбора
      const returnUrl = encodeURIComponent(router.asPath);
      
      // Всегда используем корректный URL для перенаправления
      const currentPath = router.asPath;
      
      // Проверяем, является ли текущий путь страницей "Играть" (проверяем как /dashboard, так и /levels)
      if (currentPath.includes('/dashboard') || currentPath.includes('/levels')) {
        router.push(`/character?redirectTo=/levels`);
      } else {
        router.push(`/character?redirectTo=${returnUrl}`);
      }
    }
  }, [loading, isAuthenticated, router, characterRequired, selectedCharacter, isInitialized]);

  // Показываем пустой div во время загрузки или перенаправления
  if (loading || !isInitialized || (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('token')) || (characterRequired && !selectedCharacter)) {
    return <div className="min-h-screen bg-slate-900"></div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 