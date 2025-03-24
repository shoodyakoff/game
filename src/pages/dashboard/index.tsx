import { useSelector, useDispatch } from 'react-redux';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { selectSelectedCharacter } from '../../store/slices/characterSlice';

const Dashboard: NextPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Указываем, что мы находимся на клиенте
    setIsClient(true);
  }, []);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
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
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <Head>
          <title>Прогресс | GOTOGROW</title>
          <meta name="description" content="Отслеживайте свой прогресс в игре" />
        </Head>
        
        <header className="bg-slate-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-0 leading-none">
                <span className="text-indigo-600">GO</span>
                <span className="text-white">TO</span>
                <span className="text-indigo-600">GROW</span>
              </h1>
            </div>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-4">
                <li>
                  <Link href="/dashboard" legacyBehavior>
                    <a className="nav-link-active">Прогресс</a>
                  </Link>
                </li>
                <li>
                  <Link href="/levels" legacyBehavior>
                    <a className="nav-link">Играть</a>
                  </Link>
                </li>
                <li>
                  <Link href="/profile" legacyBehavior>
                    <a className="nav-link">Профиль</a>
                  </Link>
                </li>
              </ul>
            </nav>
            
            <div className="flex items-center space-x-4">
              {isClient && user && (
                <span className="text-sm text-slate-300 hidden md:inline-block">
                  Привет, {user?.username || user?.email}
                </span>
              )}
              <button 
                onClick={handleLogout}
                className="bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 px-4 rounded-lg transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </header>
        
        <main className="container-wide py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Боковая панель */}
            <div className="md:w-1/4">
              <div className="card mb-6">
                {/* Информация о персонаже */}
                {selectedCharacter && (
                  <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                    <h4 className="text-sm uppercase text-slate-400 font-medium tracking-wider mb-2">Ваш персонаж</h4>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-600/30 rounded-lg flex items-center justify-center mr-3">
                        {selectedCharacter.icon ? (
                          <img 
                            src={selectedCharacter.icon} 
                            alt={selectedCharacter.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{selectedCharacter.name}</h3>
                        <div className="flex mt-1">
                          <span className="text-xs text-indigo-400 px-2 py-0.5 bg-indigo-900/30 rounded">
                            {selectedCharacter.type === 'product-lead' && 'Стратег'}
                            {selectedCharacter.type === 'agile-coach' && 'Поддержка'}
                            {selectedCharacter.type === 'growth-hacker' && 'DPS'}
                            {selectedCharacter.type === 'ux-visionary' && 'Дизайнер'}
                            {selectedCharacter.type === 'tech-pm' && 'Гибрид'}
                            {!selectedCharacter.type && 'Персонаж'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href="/character" legacyBehavior>
                      <a className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Сменить персонажа
                      </a>
                    </Link>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <h4 className="text-sm uppercase text-slate-500 font-medium tracking-wider mb-3">Навигация</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/dashboard" legacyBehavior>
                        <a className="flex items-center text-white bg-slate-700 rounded-lg p-2 hover:bg-slate-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Прогресс
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/levels" legacyBehavior>
                        <a className="flex items-center text-slate-300 rounded-lg p-2 hover:bg-slate-700 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Играть
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" legacyBehavior>
                        <a className="flex items-center text-slate-300 rounded-lg p-2 hover:bg-slate-700 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Профиль
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="card p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                <h3 className="font-bold text-lg mb-2">Нужна помощь?</h3>
                <p className="text-slate-200 text-sm mb-3">Посетите наш справочный центр, если у вас возникли вопросы.</p>
                <Link href="/help" legacyBehavior>
                  <a className="inline-block bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                    Поддержка
                  </a>
                </Link>
              </div>
            </div>
            
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
                      <Link href="/character" legacyBehavior>
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
  );
};

export default Dashboard;