import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LogoutButton from '../LogoutButton';
import { useUser } from '@clerk/nextjs';

const Header: React.FC = () => {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  
  return (
    <header className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Левая часть: логотип и навигация */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <div className="bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="text-indigo-400 font-bold text-xl">GO<span className="text-indigo-300">TO</span><span className="text-indigo-200">GROW</span></span>
            </Link>
            
            <nav className="hidden md:ml-10 md:flex space-x-2">
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === '/dashboard' 
                    ? 'bg-slate-700 text-white' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                Прогресс
              </Link>
              <Link 
                href="/play" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === '/play' 
                    ? 'bg-slate-700 text-white' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                Играть
              </Link>
              <Link 
                href="/profile" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === '/profile' 
                    ? 'bg-slate-700 text-white' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                Профиль
              </Link>
            </nav>
          </div>
          
          {/* Правая часть: профиль и выход */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="hidden md:block">
                <span className="text-gray-300 text-sm mr-2">
                  {isSignedIn && user ? user.firstName || user.username : ''}
                </span>
              </div>
              
              {/* Аватар пользователя */}
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                {isSignedIn && user ? (
                  <span className="text-white font-bold text-sm">
                    {(user.firstName || user.username || 'U').charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <span className="text-white font-bold text-sm">У</span>
                )}
              </div>
              
              {/* Кнопка выхода */}
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 