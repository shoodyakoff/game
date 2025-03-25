import { useRouter } from 'next/router';
import { useState } from 'react';
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

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Очищаем состояние Redux для обратной совместимости
      dispatch(reduxLogout());
      
      // Используем NextAuth для выхода
      await signOut({ 
        redirect: true,
        callbackUrl: '/auth/login'
      });
      
      // Примечание: этот код не выполнится при redirect: true,
      // так как страница будет перезагружена
      // router.push('/auth/login');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      
      // В случае ошибки все равно пытаемся перенаправить
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
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