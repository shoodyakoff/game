import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { styles } from '../common/styles';
import { LevelStage } from '../../../../types/level';
import MentorTip from '../../../common/MentorTip';
import { motion } from 'framer-motion';
import { selectSelectedCharacter } from '../../../../store/slices/characterSlice';
import Image from 'next/image';

interface IntroductionProps {
  onComplete?: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onComplete }) => {
  const router = useRouter();
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const [expandedSections, setExpandedSections] = useState<string[]>(['company']);
  
  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    } else {
      router.push('/level1');
    }
  };
  
  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };
  
  const isSectionExpanded = (section: string) => {
    return expandedSections.includes(section);
  };

  // Получаем иконку персонажа
  const getCharacterIconPath = (characterId: string | undefined): string => {
    if (!characterId) return '/characters/product-lead-icon.png'; // Дефолтная иконка
    
    return `/characters/${characterId}-icon.png`;
  };
  
  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.header}>Добро пожаловать в TaskMaster!</h2>
        
        <div className="bg-indigo-900/30 p-5 rounded-lg border border-indigo-700/50 mb-8">
          <h3 className="text-xl font-bold text-indigo-300 mb-3">Ваша миссия</h3>
          <p className="text-slate-300">
            В роли младшего продуктового менеджера вам предстоит решить первую серьезную 
            задачу — <span className="text-indigo-300 font-bold">улучшить проблемный процесс создания задач</span>, 
            который вызывает отток пользователей. Ваши решения повлияют на будущее всего продукта!
          </p>
        </div>
        
        <div className="flex justify-end mb-6">
          <MentorTip
            content={
              <>
                <h3 className="text-lg font-bold mb-2">Введение в продуктовое мышление</h3>
                <p className="mb-2">В этом уровне вы познакомитесь с основами продуктового мышления и узнаете, как применять его на практике.</p>
                <p className="mb-2">Что вы изучите:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Что такое продуктовое мышление и почему оно важно</li>
                  <li>Как анализировать пользовательский опыт</li>
                  <li>Какие метрики важны для продукта</li>
                  <li>Как принимать решения, основанные на данных</li>
                </ul>
              </>
            }
            position="left"
            className="z-10"
          />
        </div>
        
        {/* Секция "О компании" */}
        <div className="mb-8">
          <div className="flex border-l-4 border-indigo-500 pl-4">
            <div className="flex-1">
              <div 
                className="bg-slate-800/50 p-6 rounded-lg cursor-pointer border border-slate-700 hover:border-indigo-600 transition-all"
                onClick={() => toggleSection('company')}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">О компании</h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 text-indigo-400 transition-transform ${isSectionExpanded('company') ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {isSectionExpanded('company') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-indigo-600/20 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                      </div>
                      <div>
                        <p className={styles.text}>
                          TaskMaster — это растущий сервис управления задачами, который за последний год увеличил свою аудиторию на 300%, привлекая как отдельных пользователей, так и целые команды.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-indigo-300 text-xl font-bold">+300%</p>
                            <p className="text-sm text-slate-400">рост пользователей</p>
                          </div>
                          <div className="bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-amber-400 text-xl font-bold">-15%</p>
                            <p className="text-sm text-slate-400">отток новых пользователей</p>
                          </div>
                          <div className="bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-red-400 text-xl font-bold">55%</p>
                            <p className="text-sm text-slate-400">не завершают создание задачи</p>
                          </div>
                        </div>
                        <p className="mt-4 text-amber-300 font-medium">
                          Проблема: Несмотря на рост, команда заметила, что многие пользователи бросают приложение после неудачных попыток создания задач. Процесс оказался слишком сложным и недружелюбным.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {!isSectionExpanded('company') && (
                  <div className="h-4"></div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Секция "Ваша роль" */}
        <div className="mb-8">
          <div className="flex border-l-4 border-indigo-500 pl-4">
            <div className="flex-1">
              <div 
                className="bg-slate-800/50 p-6 rounded-lg cursor-pointer border border-slate-700 hover:border-indigo-600 transition-all"
                onClick={() => toggleSection('role')}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Ваша роль</h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 text-indigo-400 transition-transform ${isSectionExpanded('role') ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {isSectionExpanded('role') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-600/20 p-3 rounded-lg">
                        {selectedCharacter ? (
                          <div className="h-16 w-16 relative">
                            <Image 
                              src={getCharacterIconPath(selectedCharacter.id)} 
                              alt={selectedCharacter.name}
                              className="rounded-full object-cover border-2 border-indigo-500"
                              layout="fill"
                            />
                          </div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={styles.text}>
                          Вы недавно присоединились к команде TaskMaster в качестве младшего продакт-менеджера. 
                          Ваша первая серьезная задача — проанализировать и улучшить процесс создания задач в приложении.
                        </p>
                        <div className="bg-slate-700/30 p-4 rounded-lg my-4">
                          <h4 className="text-indigo-300 font-semibold mb-2">Ваши обязанности:</h4>
                          <ul className="list-disc pl-5 space-y-2 text-slate-300">
                            <li>Изучить проблему с позиции пользователя и бизнеса</li>
                            <li>Проанализировать данные о использовании продукта</li>
                            <li>Предложить и обосновать решение для улучшения</li>
                            <li>Составить план внедрения и тестирования</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {!isSectionExpanded('role') && (
                  <div className="h-4"></div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Секция "Чему вы научитесь и что получите" */}
        <div className="mb-8">
          <div className="flex border-l-4 border-indigo-500 pl-4">
            <div className="flex-1">
              <div 
                className="bg-slate-800/50 p-6 rounded-lg cursor-pointer border border-slate-700 hover:border-indigo-600 transition-all"
                onClick={() => toggleSection('goals')}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Чему вы научитесь и что получите</h3>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 text-indigo-400 transition-transform ${isSectionExpanded('goals') ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {isSectionExpanded('goals') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-800/50 flex items-center">
                        <div className="w-10 h-10 bg-indigo-700/40 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-indigo-300">Анализ пользовательского опыта</h4>
                          <p className="text-xs text-slate-300">Выявление ключевых проблем в пути пользователя</p>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-800/50 flex items-center">
                        <div className="w-10 h-10 bg-indigo-700/40 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-indigo-300">Работа с метриками продукта</h4>
                          <p className="text-xs text-slate-300">Анализ данных для принятия решений</p>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-800/50 flex items-center">
                        <div className="w-10 h-10 bg-indigo-700/40 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-indigo-300">Упрощение интерфейсов</h4>
                          <p className="text-xs text-slate-300">Создание интуитивно понятных решений</p>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-800/50 flex items-center">
                        <div className="w-10 h-10 bg-indigo-700/40 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-indigo-300">Продуктовое мышление</h4>
                          <p className="text-xs text-slate-300">Баланс интересов пользователя и бизнеса</p>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-800/50 flex items-center">
                        <div className="w-10 h-10 bg-indigo-700/40 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-indigo-300">Обоснование решений</h4>
                          <p className="text-xs text-slate-300">Убедительное представление идей</p>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-800/50 flex items-center">
                        <div className="w-10 h-10 bg-indigo-700/40 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-indigo-300">Практические навыки</h4>
                          <p className="text-xs text-slate-300">Реальный опыт решения проблем</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {!isSectionExpanded('goals') && (
                  <div className="h-4"></div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Кнопка "Начать" */}
        <div className="flex justify-center mt-10">
          <button 
            onClick={handleContinue}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors flex items-center"
          >
            Начать обучение
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Introduction; 