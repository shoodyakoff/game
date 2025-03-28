import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { logout as reduxLogout } from '../store/slices/authSlice';

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // Флаг, предотвращающий многократные нажатия
  const isProcessingRef = useRef(false);

  const handleLogout = async () => {
    // Предотвращаем двойные нажатия и множественные запросы
    if (isProcessingRef.current || isLoading) {
      return;
    }
    
    try {
      isProcessingRef.current = true;
      setIsLoading(true);
      
      console.log('Начат процесс выхода из системы');
      
      // Очищаем состояние Redux для обратной совместимости
      dispatch(reduxLogout());
      
      // Очищаем все связанные с сессией данные из localStorage/sessionStorage
      if (typeof window !== 'undefined') {
        // Очищаем все проверки сессий
        const keys = Object.keys(window.sessionStorage);
        keys.forEach(key => {
          if (key.startsWith('session_check_')) {
            window.sessionStorage.removeItem(key);
          }
        });
        
        window.sessionStorage.removeItem('__session_refreshed');
        window.sessionStorage.removeItem('redirectAfterReload');
        
        // Очищаем cookie, связанные с выбором персонажа
        document.cookie = 'just_selected_character=false; path=/; max-age=0';
        document.cookie = 'next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      
      // Используем NextAuth для выхода без автоматического редиректа
      // Это позволит нам выполнить очистку данных и затем перенаправить
      await signOut({ 
        redirect: false
      });
      
      console.log('Выход выполнен успешно, перенаправление на страницу входа');
      
      // Используем прямое перенаправление вместо router.push для предотвращения ошибок
      // "Abort fetching component for route"
      if (typeof window !== 'undefined') {
        // Используем небольшую задержку для завершения процесса выхода из системы
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 100);
      }
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      
      // В случае ошибки используем прямое перенаправление
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    } finally {
      setIsLoading(false);
      // Сбрасываем флаг обработки с задержкой
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1000); // Предотвращаем повторное нажатие в течение 1 секунды
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`${className || 'bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 px-4 rounded-lg transition-colors'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Выход...' : 'Выйти'}
    </button>
  );
};

export default LogoutButton; 