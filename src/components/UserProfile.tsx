import React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

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
  // Получаем данные пользователя из Clerk
  const { user, isLoaded } = useUser();

  // Если данные еще загружаются или пользователь не авторизован, не отображаем ничего
  if (!isLoaded || !user) {
    return null;
  }

  // Получаем актуальное имя пользователя
  const getUserName = () => {
    return user.firstName || 
           user.username || 
           user.emailAddresses[0]?.emailAddress?.split('@')[0] || 
           'Пользователь';
  };
  
  // Получаем инициал пользователя для аватара
  const getUserInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <Link 
      href="/profile" 
      className={className}
    >
      {showName && <span className="mr-2">{getUserName()}</span>}
      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-bold">
          {getUserInitial()}
        </span>
      </div>
    </Link>
  );
};

export default UserProfile; 