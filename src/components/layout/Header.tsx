import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import LogoutButton from '../LogoutButton';
import UserProfile from '../UserProfile';

type HeaderProps = {
  activePage: 'dashboard' | 'levels' | 'profile';
};

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  const { user, isSignedIn } = useUser();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="bg-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-indigo-600">GO</span>
            <span className="text-white">TO</span>
            <span className="text-indigo-600">GROW</span>
          </h1>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li>
              <Link 
                href="/dashboard" 
                className={activePage === 'dashboard' ? "nav-link-active" : "nav-link"}
              >
                Прогресс
              </Link>
            </li>
            <li>
              <Link 
                href="/levels" 
                className={activePage === 'levels' ? "nav-link-active" : "nav-link"}
              >
                Играть
              </Link>
            </li>
            <li>
              <Link 
                href="/profile" 
                className={activePage === 'profile' ? "nav-link-active" : "nav-link"}
              >
                Профиль
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          {isClient && isSignedIn && user && (
            <UserProfile 
              className="text-sm text-slate-300 hidden md:flex items-center"
            />
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header; 