import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { RootState } from '../../store';
import { selectSelectedCharacter } from '../../store/slices/characterSlice';
import LogoutButton from '../../components/LogoutButton';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

const Levels: NextPage = () => {
  const router = useRouter();
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const [isClient, setIsClient] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedCharacterInfo, setSelectedCharacterInfo] = useState<any>(null);
  const { user, isSignedIn, isLoaded } = useUser();
  
  useEffect(() => {
    // Указываем, что мы находимся на клиенте
    setIsClient(true);
    
    // Получаем данные о персонаже из Redux
    if (selectedCharacter) {
      setSelectedCharacterInfo(selectedCharacter);
    }
  }, [selectedCharacter]); 
  
  // Отдельный эффект для редиректа
  useEffect(() => {
    if (isClient && isLoaded && !isSignedIn && !selectedCharacterInfo) {
      router.push('/character/select?redirectTo=/levels');
    }
  }, [isClient, selectedCharacterInfo, isSignedIn, isLoaded, router]);
  
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
    <ProtectedRoute requireCharacter={true}>
      <div className="min-h-screen bg-slate-900">
        <Head>
          <title>Уровни | GOTOGROW</title>
          <meta name="description" content="Выберите уровень для прохождения" />
        </Head>
        
        <Header activePage="levels" />
        
        <main className="container-wide py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Боковая панель */}
            <Sidebar activePage="levels" />
            
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
                            className="inline-flex items-center text-sm bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg transition-colors"
                            title="Сбросить прогресс"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                        {level.unlocked ? (
                          <Link 
                            href={`/levels/${level.id}`} 
                            className={`inline-flex items-center text-sm ${
                              level.completed 
                                ? 'bg-indigo-800 hover:bg-indigo-900' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            } text-white px-3 py-1.5 rounded-lg transition-colors`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            {level.completed ? 'Играть снова' : 'Начать уровень'}
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