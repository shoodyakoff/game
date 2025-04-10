import React from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/router';

interface LogoutButtonProps {
  className?: string;
}

/**
 * Кнопка выхода из системы, использующая Clerk
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Очищаем локальные данные перед выходом
      localStorage.removeItem('characterData');
      
      // Выход из системы Clerk
      await signOut(() => {
        // После успешного выхода перенаправляем на главную страницу
        router.push('/');
      });
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      // В случае ошибки всё равно перенаправляем на главную страницу
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className || 'bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors'}
    >
      Выйти
    </button>
  );
};

export default LogoutButton; 