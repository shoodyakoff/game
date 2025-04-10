import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Компонент-обертка для защищенных маршрутов.
 * Проверяет аутентификацию пользователя и выбор персонажа,
 * но в основном используется как заглушка, так как 
 * аутентификация происходит через middleware Clerk.
 */
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  requireCharacter?: boolean;
}> = ({ 
  children,
  requireCharacter = false
}) => {
  // Используется только для проверки на клиенте
  // Основная защита происходит через middleware
  return <>{children}</>;
};

export default ProtectedRoute; 