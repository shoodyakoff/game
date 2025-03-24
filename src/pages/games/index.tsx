import { useSelector, useDispatch } from 'react-redux';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const Games: NextPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Указываем, что мы находимся на клиенте
    setIsClient(true);
  }, []);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const games = [
    {
      id: 'project-manager',
      title: 'Проджект-менеджер',
      description: 'Управляйте проектами и командой разработчиков, достигайте целей в срок и в рамках бюджета.',
      image: '/images/games/project-manager.jpg',
      level: 'Новичок',
      players: 125,
      tags: ['Управление', 'Стратегия']
    },
    {
      id: 'code-master',
      title: 'Мастер кода',
      description: 'Решайте задачи программирования и алгоритмические головоломки разной сложности.',
      image: '/images/games/code-master.jpg',
      level: 'Средний',
      players: 89,
      tags: ['Программирование', 'Логика']
    },
    {
      id: 'crypto-trader',
      title: 'Крипто-трейдер',
      description: 'Торгуйте виртуальными криптовалютами и зарабатывайте на колебаниях рынка.',
      image: '/images/games/crypto-trader.jpg',
      level: 'Продвинутый',
      players: 67,
      tags: ['Финансы', 'Анализ']
    }
  ];
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <Head>
          <title>Игры | GOTOGROW</title>
          <meta name="description" content="Доступные игры на игровом портале" />
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
              <h1 className="text-2xl font-bold">
                <span className="text-indigo-600">GO</span>
                <span className="text-white">TO</span>
                <span className="text-indigo-600">GROW</span>
              </h1>
            </div>
            
            <nav className="hidden md:block">
              <ul className="flex space-x-4">
                <li>
                  <Link href="/dashboard" legacyBehavior>
                    <a className="nav-link">Прогресс</a>
                  </Link>
                </li>
                <li>
                  <Link href="/levels" legacyBehavior>
                    <a className="nav-link-active">Играть</a>
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
                <div className="flex items-center mb-4">
                  {isClient && user ? (
                    <>
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-lg font-bold text-white">{user.username?.charAt(0) || user.email?.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{user.username || user.email}</h3>
                        <p className="text-slate-400 text-sm">Игрок</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-lg font-bold text-white">...</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Загрузка...</h3>
                        <p className="text-slate-400 text-sm">Игрок</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <h4 className="text-sm uppercase text-slate-500 font-medium tracking-wider mb-3">Навигация</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/dashboard" legacyBehavior>
                        <a className="flex items-center text-slate-300 rounded-lg p-2 hover:bg-slate-700 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Дашборд
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/games" legacyBehavior>
                        <a className="flex items-center text-white bg-slate-700 rounded-lg p-2 hover:bg-slate-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Мои игры
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
                    <li>
                      <Link href="/settings" legacyBehavior>
                        <a className="flex items-center text-slate-300 rounded-lg p-2 hover:bg-slate-700 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Настройки
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="card">
                <h3 className="font-bold text-lg mb-3">Фильтры</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-slate-400 mb-2">Уровень сложности</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox mr-2" defaultChecked />
                        <span>Новичок</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox mr-2" defaultChecked />
                        <span>Средний</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox mr-2" defaultChecked />
                        <span>Продвинутый</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-slate-400 mb-2">Категории</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox mr-2" defaultChecked />
                        <span>Управление</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox mr-2" defaultChecked />
                        <span>Программирование</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox mr-2" defaultChecked />
                        <span>Финансы</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox mr-2" defaultChecked />
                        <span>Стратегия</span>
                      </label>
                    </div>
                  </div>
                  
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Применить фильтры
                  </button>
                </div>
              </div>
            </div>
            
            {/* Основной контент */}
            <div className="md:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Доступные игры</h2>
                <div className="flex items-center">
                  <span className="text-slate-400 mr-2">Сортировать:</span>
                  <select className="form-select bg-slate-800 border-slate-700 text-white text-sm rounded-lg">
                    <option value="popularity">По популярности</option>
                    <option value="newest">Сначала новые</option>
                    <option value="level">По уровню сложности</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {games.map((game) => (
                  <motion.div 
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="card bg-slate-800/50 hover:bg-slate-800 transition-colors overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 z-10" />
                      <div 
                        className="absolute inset-0 bg-indigo-900/30"
                        style={{ 
                          backgroundImage: game.image ? `url(${game.image})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <div className="absolute bottom-4 left-4 z-20">
                        <span className="px-2 py-1 bg-indigo-600 text-xs rounded-full text-white">
                          {game.level}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">{game.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {game.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-slate-700 text-xs rounded-full text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">
                          <span className="text-emerald-500 font-medium">{game.players}</span> игроков онлайн
                        </span>
                        <Link href={`/games/${game.id}`} legacyBehavior>
                          <a className="inline-flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors">
                            Играть
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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

export default Games; 