import { useSelector, useDispatch } from 'react-redux';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { selectSelectedCharacter } from '../../store/slices/characterSlice';

const Levels: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const [isClient, setIsClient] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedCharacterInfo, setSelectedCharacterInfo] = useState<any>(null);
  
  useEffect(() => {
    // Указываем, что мы находимся на клиенте
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      // Получаем информацию о пользователе из localStorage
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
      }
      
      // Получаем информацию о выбранном персонаже из localStorage
      const character = localStorage.getItem('selectedCharacter');
      if (character) {
        setSelectedCharacterInfo(JSON.parse(character));
      }
    }
  }, []); // Пустой массив зависимостей, чтобы эффект выполнился только один раз
  
  // Отдельный эффект для редиректа
  useEffect(() => {
    if (isClient && selectedCharacterInfo === null && selectedCharacter === null) {
      router.push('/character?redirectTo=/levels');
    }
  }, [isClient, selectedCharacterInfo, selectedCharacter, router]);
  
  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  // Функция для получения статуса пройденности уровня
  const resetLevelProgress = (levelId: string) => {
    const updatedCompletedLevels = { ...completedLevels };
    delete updatedCompletedLevels[levelId];
    setCompletedLevels(updatedCompletedLevels);
    localStorage.setItem('completedLevels', JSON.stringify(updatedCompletedLevels));
  };

  // Функция для проверки доступности уровня
  const isLevelAvailable = (levelId: number, completedLevels: any) => {
    // Уровень 1 всегда доступен
    if (levelId === 1) return true;
    
    // Для следующих уровней проверяем, пройден ли предыдущий уровень
    const previousLevelCompleted = completedLevels[levelId - 1] || false;
    return previousLevelCompleted;
  };

  // Функция для получения прогресса уровня
  const getLevelProgress = (levelId: number, completedLevels: any) => {
    // Если уровень пройден, возвращаем 100%
    if (completedLevels[levelId]) return 100;
    
    // Для непройденных уровней можно было бы возвращать сохраненный прогресс,
    // но пока просто возвращаем 0
    return 0;
  };
  
  // Проверка завершенных уровней
  const [completedLevels, setCompletedLevels] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    // Получаем информацию о завершенных уровнях
    if (isClient) {
      const checkCompletedLevels = () => {
        const completed: {[key: string]: boolean} = {};
        
        // Проверяем завершенность для каждого уровня
        const level1Completed = localStorage.getItem('level1-completed') === 'true';
        const level2Completed = localStorage.getItem('level-project-planning-completed') === 'true';
        const level3Completed = localStorage.getItem('level-team-management-completed') === 'true';
        const level4Completed = localStorage.getItem('level-crisis-handling-completed') === 'true';
        
        completed['1'] = level1Completed;
        completed['project-planning'] = level2Completed;
        completed['team-management'] = level3Completed;
        completed['crisis-handling'] = level4Completed;
        
        setCompletedLevels(completed);
      };
      
      checkCompletedLevels();
    }
  }, [isClient]);
  
  const levels = [
    {
      id: 1,
      title: 'Введение в продуктовое мышление',
      description: 'Познакомьтесь с основами продуктового мышления и сделайте первые шаги в роли продакт-менеджера.',
      duration: '30-40 мин',
      image: '/images/levels/level_1.jpeg',
      difficulty: 'Начальный',
      players: 124,
      available: true,
      unlocked: true,
      skills: ['Продуктовое мышление', 'Анализ пользовательских потребностей', 'Принятие решений на основе данных'],
      progress: getLevelProgress(1, completedLevels),
      tags: ['Основы', 'Аналитика'],
      completed: completedLevels['1'] || false
    },
    {
      id: 2,
      title: 'Планирование проекта',
      description: 'Научитесь планировать продуктовые проекты, приоритизировать задачи и распределять ресурсы.',
      duration: '40-50 мин',
      image: '/images/levels/level_2.jpeg',
      difficulty: 'Начальный',
      players: 98,
      available: isLevelAvailable(2, completedLevels),
      unlocked: true,
      skills: ['Планирование проектов', 'Приоритизация', 'Управление ресурсами', 'Определение MVP'],
      progress: getLevelProgress(2, completedLevels),
      tags: ['Планирование', 'Приоритизация'],
      completed: completedLevels['2'] || false
    },
    {
      id: 'team-management',
      title: 'Управление командой',
      description: 'Научитесь эффективно управлять командой разработчиков и распределять задачи для достижения целей.',
      image: '/images/levels/level_3.jpeg',
      difficulty: 'Средний',
      players: 89,
      tags: ['Управление', 'Коммуникация'],
      unlocked: true,
      completed: completedLevels['team-management'] || false
    },
    {
      id: 'crisis-handling',
      title: 'Кризисный менеджмент',
      description: 'Справляйтесь с неожиданными проблемами и принимайте быстрые решения в критических ситуациях.',
      image: '/images/levels/level_4.jpeg',
      difficulty: 'Продвинутый',
      players: 67,
      tags: ['Решение проблем', 'Стресс-менеджмент'],
      unlocked: false,
      completed: completedLevels['crisis-handling'] || false
    }
  ];
  
  return (
    <ProtectedRoute characterRequired={true}>
      <div className="min-h-screen bg-slate-900">
        <Head>
          <title>Уровни | GOTOGROW</title>
          <meta name="description" content="Выберите уровень для прохождения" />
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
              {isClient && userInfo && (
                <span className="text-sm text-slate-300 hidden md:inline-block">
                  Привет, {userInfo?.username || userInfo?.email}
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
                {selectedCharacterInfo && (
                  <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                    <h4 className="text-sm uppercase text-slate-400 font-medium tracking-wider mb-2">Ваш персонаж</h4>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-600/30 rounded-lg flex items-center justify-center mr-3">
                        {selectedCharacterInfo.icon ? (
                          <img 
                            src={selectedCharacterInfo.icon} 
                            alt={selectedCharacterInfo.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{selectedCharacterInfo.name}</h3>
                        <div className="flex mt-1">
                          <span className="text-xs text-indigo-400 px-2 py-0.5 bg-indigo-900/30 rounded">
                            {selectedCharacterInfo.type === 'product-lead' && 'Стратег'}
                            {selectedCharacterInfo.type === 'agile-coach' && 'Поддержка'}
                            {selectedCharacterInfo.type === 'growth-hacker' && 'DPS'}
                            {selectedCharacterInfo.type === 'ux-visionary' && 'Дизайнер'}
                            {selectedCharacterInfo.type === 'tech-pm' && 'Гибрид'}
                            {!selectedCharacterInfo.type && 'Персонаж'}
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
                        <a className="flex items-center text-slate-300 rounded-lg p-2 hover:bg-slate-700 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Прогресс
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/levels" legacyBehavior>
                        <a className="flex items-center text-white bg-slate-700 rounded-lg p-2 hover:bg-slate-600 transition-colors">
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
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Уровни игры</h2>
              </div>
              
              {/* Список уровней */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {levels.map((level) => (
                  <motion.div 
                    key={level.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`card hover:shadow-lg transition-all ${!level.unlocked ? 'opacity-70' : ''}`}
                  >
                    <div className="relative aspect-video mb-4 bg-slate-800 rounded-lg overflow-hidden">
                      {!level.unlocked && (
                        <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center z-10">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-slate-500 mb-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium text-slate-400">Уровень заблокирован</span>
                          </div>
                        </div>
                      )}
                      {level.completed && (
                        <div className="absolute top-2 left-2 z-10">
                          <div className="bg-green-600 text-white rounded-full p-1" title="Уровень пройден">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {level.image && (
                        <img 
                          src={level.image}
                          alt={level.title}
                          className="object-cover w-full h-full"
                        />
                      )}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                          ${level.difficulty === 'Начальный' ? 'bg-green-600/80 text-white' : ''}
                          ${level.difficulty === 'Средний' ? 'bg-amber-500/80 text-white' : ''}
                          ${level.difficulty === 'Продвинутый' ? 'bg-red-600/80 text-white' : ''}
                        `}>
                          {level.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">
                      {level.title}
                      {level.completed && (
                        <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                          Пройден
                        </span>
                      )}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">{level.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {level.tags && level.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        {level.players} игроков
                      </span>
                      <div className="flex space-x-2">
                        {level.unlocked && (
                          <button
                            onClick={() => resetLevelProgress(level.id.toString())}
                            className="inline-flex items-center text-sm bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg transition-colors"
                            title="Сбросить прогресс"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                        {level.unlocked ? (
                          <Link href={`/levels/${level.id}`} legacyBehavior>
                            <a className={`inline-flex items-center text-sm ${
                              level.completed 
                                ? 'bg-indigo-800 hover:bg-indigo-900' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            } text-white px-3 py-1.5 rounded-lg transition-colors`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              {level.completed ? 'Играть снова' : 'Начать уровень'}
                            </a>
                          </Link>
                        ) : (
                          <button 
                            disabled
                            className="inline-flex items-center text-sm bg-slate-700 text-slate-400 px-3 py-1.5 rounded-lg cursor-not-allowed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Заблокировано
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Levels; 