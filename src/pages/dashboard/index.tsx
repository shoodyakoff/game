import { useSelector, useDispatch } from 'react-redux';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import LogoutButton from '../../components/LogoutButton';
import { RootState } from '../../store';
import { selectSelectedCharacter } from '../../store/slices/characterSlice';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import DashboardInitializer from '../../components/dashboard/DashboardInitializer';

// Задержка загрузки компонентов для предотвращения ошибок маршрутизации
const DelayedComponents = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return show ? <>{children}</> : null;
};

const Dashboard: NextPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const isMounted = useRef(true);
  
  // Устанавливаем флаг размонтирования для предотвращения обновления состояния unmounted компонента
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Используем этот эффект для корректного отрисовки на стороне клиента
  useEffect(() => {
    // Указываем, что мы находимся на клиенте
    setIsClient(true);
    
    // Устанавливаем таймаут для отслеживания проблем с загрузкой
    const loadTimeout = setTimeout(() => {
      if (isLoading && isMounted.current) {
        setIsLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(loadTimeout);
  }, [isLoading]);
  
  // Эффект для управления состоянием загрузки
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
    } else if (status === 'authenticated') {
      if (isMounted.current) {
        setIsLoading(false);
        setLoadError(null);
      }
    } else if (status === 'unauthenticated') {
      if (isMounted.current) {
        setIsLoading(false);
        router.push('/auth/login').catch(error => {
          console.error('Ошибка при перенаправлении:', error);
          window.location.href = '/auth/login';
        });
      }
    }
  }, [status, router]);

  // Фиктивные данные для прогресса
  const progressData = {
    completedLevels: 2,
    totalLevels: 10,
    currentExperience: 450,
    nextLevelExperience: 500,
    achievements: 5,
    totalAchievements: 20,
    lastPlayed: '2 часа назад',
    nextGoal: 'Пройти уровень "Управление командой"'
  };
  
  // Если еще не загрузились на клиенте, показываем заглушку
  if (!isClient) {
    return null;
  }
  
  // Показываем загрузчик, если данные еще загружаются
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Если возникла ошибка при загрузке страницы
  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-slate-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Ошибка загрузки</h2>
          <p className="text-slate-300 mb-4">{loadError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Компонент для проверки и обновления сессии */}
      <DashboardInitializer />
      
      {/* Основной контент с задержкой для предотвращения ошибок маршрутизации */}
      <DelayedComponents>
        <ProtectedRoute>
          <div className="min-h-screen bg-slate-900">
            <Head>
              <title>Прогресс | GOTOGROW</title>
              <meta name="description" content="Отслеживайте свой прогресс в игре" />
            </Head>
            
            <Header activePage="dashboard" />
            
            <main className="container-wide py-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Боковая панель */}
                <Sidebar activePage="dashboard" />
                
                {/* Основной контент */}
                <div className="md:w-3/4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="card mb-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Добро пожаловать в личный кабинет</h2>
                        <span className="px-3 py-1 bg-indigo-600 text-xs rounded-full text-white">Игрок</span>
                      </div>
                      
                      <p className="text-slate-400 mb-6">
                        Здесь вы можете отслеживать свой прогресс в игре, достижения и просматривать статистику.
                        {selectedCharacter ? (
                          <span> Ваш текущий персонаж: <strong className="text-white">{selectedCharacter.name}</strong>.</span>
                        ) : (
                          <span> У вас еще нет выбранного персонажа. Выберите персонажа, чтобы начать игру.</span>
                        )}
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                        <Link href="/levels" legacyBehavior>
                          <a className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                            Выбрать уровень
                          </a>
                        </Link>
                      
                        <Link href="/profile" legacyBehavior>
                          <a className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Редактировать профиль
                          </a>
                        </Link>
                        
                        {!selectedCharacter && (
                          <Link href="/character/select" legacyBehavior>
                            <a className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Выбрать персонажа
                            </a>
                          </Link>
                        )}
                      </div>
                    </div>
                    
                    {/* Прогресс-бар опыта */}
                    <div className="card mb-6">
                      <h3 className="text-lg font-bold text-white mb-4">Прогресс игры</h3>
                      
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Уровни</span>
                          <span className="text-sm text-white font-medium">{progressData.completedLevels} / {progressData.totalLevels}</span>
                        </div>
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full" 
                            style={{width: `${(progressData.completedLevels / progressData.totalLevels) * 100}%`}}
                          ></div>
                        </div>
                    </div>
                    
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Опыт</span>
                          <span className="text-sm text-white font-medium">{progressData.currentExperience} / {progressData.nextLevelExperience}</span>
                        </div>
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" 
                            style={{width: `${(progressData.currentExperience / progressData.nextLevelExperience) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 mt-6">
                        <div className="md:w-1/2">
                          <h4 className="text-sm uppercase text-slate-500 font-medium tracking-wider mb-3">Статистика</h4>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-slate-400">Пройдено уровней:</span>
                              <span className="text-white font-medium">{progressData.completedLevels}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-slate-400">Заработано опыта:</span>
                              <span className="text-white font-medium">{progressData.currentExperience}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-slate-400">Достижений получено:</span>
                              <span className="text-white font-medium">{progressData.achievements} из {progressData.totalAchievements}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-slate-400">Последняя активность:</span>
                              <span className="text-white font-medium">{progressData.lastPlayed}</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="md:w-1/2">
                          <h4 className="text-sm uppercase text-slate-500 font-medium tracking-wider mb-3">Следующая цель</h4>
                          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
                            <p className="text-white text-sm mb-2">{progressData.nextGoal}</p>
                            <Link href="/levels" legacyBehavior>
                              <a className="text-indigo-400 text-sm font-medium hover:text-indigo-300">
                                Перейти к уровню &rarr;
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="card bg-slate-800/50 hover:bg-slate-800 transition-colors">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h3 className="font-bold">Рейтинг</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">Ваше место в таблице лидеров</p>
                        <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between items-center">
                          <span className="text-sm text-white">145 место</span>
                          <Link href="/leaderboard" legacyBehavior>
                            <a className="text-indigo-400 text-sm font-medium hover:text-indigo-300">Подробнее &rarr;</a>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="card bg-slate-800/50 hover:bg-slate-800 transition-colors">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-bold">Достижения</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">Полученные награды и звания</p>
                        <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between items-center">
                          <span className="text-sm text-white">{progressData.achievements} получено</span>
                          <Link href="/achievements" legacyBehavior>
                            <a className="text-indigo-400 text-sm font-medium hover:text-indigo-300">Посмотреть &rarr;</a>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="card bg-slate-800/50 hover:bg-slate-800 transition-colors">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-rose-500/20 text-rose-500 rounded-lg flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                          </div>
                          <h3 className="font-bold">Статистика</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">Подробная информация о прогрессе</p>
                        <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between items-center">
                          <span className="text-sm text-white">15 показателей</span>
                          <Link href="/statistics" legacyBehavior>
                            <a className="text-indigo-400 text-sm font-medium hover:text-indigo-300">Посмотреть &rarr;</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </main>
            
            <footer className="bg-slate-800/50 border-t border-slate-700 py-6">
              <div className="container-wide">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm text-slate-400">© 2023 GOTOGROW. Все права защищены.</p>
                  </div>
                  <div className="flex space-x-4">
                    <Link href="/privacy" legacyBehavior>
                      <a className="text-sm text-slate-400 hover:text-white">Политика конфиденциальности</a>
                    </Link>
                    <Link href="/terms" legacyBehavior>
                      <a className="text-sm text-slate-400 hover:text-white">Условия использования</a>
                    </Link>
                    <Link href="/help" legacyBehavior>
                      <a className="text-sm text-slate-400 hover:text-white">Помощь</a>
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ProtectedRoute>
      </DelayedComponents>
    </>
  );
};

export default Dashboard;