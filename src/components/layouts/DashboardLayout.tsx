import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const navigation = [
    { name: 'Дашборд', href: '/dashboard', current: router.pathname === '/dashboard' },
    { name: 'Уровни', href: '/levels', current: router.pathname.startsWith('/levels') },
    { name: 'Персонаж', href: '/character', current: router.pathname.startsWith('/character') },
    { name: 'Профиль', href: '/profile', current: router.pathname.startsWith('/profile') },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Верхняя навигация */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-white font-bold text-xl">
                GOTOGROW
              </Link>
              <div className="hidden md:flex ml-8 space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? 'text-white border-b-2 border-indigo-500'
                        : 'text-slate-300 hover:text-white'
                    } px-1 py-2`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              {isSignedIn && (
                <UserButton afterSignOutUrl="/" />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Подвал */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-auto py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-slate-400">© 2023 GOTOGROW. Все права защищены.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-sm text-slate-400 hover:text-white">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-sm text-slate-400 hover:text-white">
                Условия использования
              </Link>
              <Link href="/help" className="text-sm text-slate-400 hover:text-white">
                Помощь
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout; 