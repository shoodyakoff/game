import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface UserProfileProps {
  className?: string;
  showName?: boolean;
}

/**
 * Компонент для отображения информации о пользователе в навигации:
 * имя и аватар с инициалами
 */
const UserProfile: React.FC<UserProfileProps> = ({ 
  className = 'bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center',
  showName = true
}) => {
  // Получаем данные пользователя из NextAuth сессии и Redux
  const { data: session } = useSession();
  const { user: reduxUser } = useSelector((state: RootState) => state.auth);

  // Получаем актуальное имя пользователя
  const getUserName = () => {
    // Приоритет отдаем NextAuth сессии
    if (session?.user?.name) {
      return session.user.name;
    }
    
    // Запасной вариант - Redux состояние
    return reduxUser?.username || 'Пользователь';
  };
  
  // Получаем инициал пользователя для аватара
  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <Link href="/profile" legacyBehavior>
      <a className={className}>
        {showName && <span className="mr-2">{getUserName()}</span>}
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {getUserInitial()}
          </span>
        </div>
      </a>
    </Link>
  );
};

export default UserProfile; 