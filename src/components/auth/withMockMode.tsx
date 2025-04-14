import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMockUser } from './MockProviders';

// Проверка, включен ли мок-режим
const isMockMode = process.env.NEXT_PUBLIC_CLERK_MOCK_MODE === 'true';

export interface WithAuthProps {
  user: any; // Тип пользователя (Clerk User или Mock User)
  isSignedIn: boolean;
  isLoaded: boolean;
}

// HOC для работы с аутентификацией в мок-режиме
export default function withMockMode<P extends WithAuthProps>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, keyof WithAuthProps>> {
  return function WithMockModeWrapper(props: Omit<P, keyof WithAuthProps>) {
    const [mounted, setMounted] = useState(false);
    
    // Данные аутентификации в зависимости от режима
    const clerkAuth = isMockMode ? { user: null, isSignedIn: false, isLoaded: false } : useUser();
    const mockUser = isMockMode ? useMockUser() : null;
    
    // Подготовка общих пропсов для компонента
    const authProps: WithAuthProps = {
      user: isMockMode ? mockUser : clerkAuth.user,
      isSignedIn: isMockMode ? !!mockUser : clerkAuth.isSignedIn,
      isLoaded: isMockMode ? true : clerkAuth.isLoaded
    };
    
    // Используем useEffect для монтирования на клиенте
    useEffect(() => {
      setMounted(true);
    }, []);
    
    // Не рендерим контент на сервере в мок-режиме
    if (isMockMode && !mounted) {
      return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse">Загрузка...</div>
      </div>;
    }
    
    // Передаем компоненту все его пропсы + пропсы для аутентификации
    return <Component {...(props as P)} {...authProps} />;
  };
} 