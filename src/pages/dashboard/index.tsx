import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { selectSelectedCharacter } from '../../store/slices/characterSlice';
import DashboardInitializer from '../../components/dashboard/DashboardInitializer';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // После загрузки пользователя проверяем состояние аутентификации
    if (isLoaded) {
      if (!isSignedIn) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        router.push('/sign-in');
      } else {
        // Данные пользователя загружены и он авторизован, убираем индикатор загрузки
        setTimeout(() => setLoading(false), 300); // Небольшая задержка для плавности UI
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // Если идет загрузка, показываем простой спиннер
  if (loading) {
    return (
      <>
        <Head>
          <title>Загрузка...</title>
          <meta name="description" content="Загрузка панели управления" />
        </Head>
        <div className="flex h-screen w-full items-center justify-center bg-slate-900">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white">Загрузка...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <Head>
          <title>Панель управления | GOTOGROW</title>
          <meta name="description" content="Управляйте своим персонажем и прогрессом." />
        </Head>
        
        {/* Компонент для инициализации данных */}
        <DashboardInitializer />
        
        {/* Верхняя навигация */}
        <Header activePage="dashboard" />
        
        {/* Основной контент */}
        <main className="container-wide py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Боковая панель */}
            <Sidebar activePage="dashboard" />
            
            {/* Основной контент */}
            <div className="md:w-3/4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Панель управления</h2>
              </div>
              
              <div className="card mb-6">
                <h3 className="text-xl font-bold mb-4">Добро пожаловать, {user?.firstName || user?.username || 'Пользователь'}!</h3>
                <p className="mb-4 text-slate-300">
                  {selectedCharacter ? (
                    `Ваш текущий персонаж: ${selectedCharacter.name}`
                  ) : (
                    'У вас еще нет выбранного персонажа. Выберите персонажа, чтобы начать игру.'
                  )}
                </p>
                
                <div className="flex space-x-4 mt-4">
                  {!selectedCharacter && (
                    <Link 
                      href="/character/select" 
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Выбрать персонажа
                    </Link>
                  )}
                  
                  <Link 
                    href="/levels" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Начать игру
                  </Link>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 text-white">Ваш прогресс</h3>
                <div className="card">
                  <p className="text-slate-300">Скоро здесь будет отображаться ваш прогресс!</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Подвал */}
        <footer className="bg-slate-800 border-t border-slate-700 py-6">
          <div className="container-wide">
            <p className="text-center text-sm text-slate-400">© 2023 GOTOGROW. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;