import React, { useState, useEffect } from 'react';
import { styles } from '../common/styles';
import StepNavigation from '../../shared/navigation/StepNavigation';
import { motion } from 'framer-motion';
import { isLevelReset } from '../../shared/utils/levelResetUtils';

interface ProductThinkingPracticeProps {
  onComplete: () => void;
}

// Компонент для карточки с информацией
const InfoCard = ({ 
  title, 
  description, 
  icon, 
  isActive, 
  onClick, 
  variant = 'default',
  className = '',
  animation = 'none'
}: {
  title: string;
  description: React.ReactNode;
  icon?: string | React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'highlighted' | 'warning' | 'success';
  className?: string;
  animation?: 'none' | 'fade' | 'scale' | 'slide';
}) => {
  const baseStyles = "rounded-xl p-5 transition-all duration-300 shadow-lg";
  
  const variantStyles = {
    default: "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:shadow-slate-700/30 hover:border-slate-600",
    highlighted: "bg-gradient-to-br from-indigo-900/40 to-indigo-950/60 border border-indigo-700/50 hover:shadow-indigo-700/30 hover:border-indigo-600/60",
    warning: "bg-gradient-to-br from-amber-900/40 to-amber-950/60 border border-amber-700/50 hover:shadow-amber-700/30 hover:border-amber-600/60",
    success: "bg-gradient-to-br from-emerald-900/40 to-emerald-950/60 border border-emerald-700/50 hover:shadow-emerald-700/30 hover:border-emerald-600/60"
  };
  
  const activeStyles = {
    default: "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/30",
    highlighted: "ring-2 ring-indigo-400 shadow-lg shadow-indigo-400/30",
    warning: "ring-2 ring-amber-500 shadow-lg shadow-amber-500/30",
    success: "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/30"
  };

  const getAnimationProps = () => {
    switch (animation) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5 }
        };
      case 'scale':
        return {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.3 }
        };
      case 'slide':
        return {
          initial: { x: -20, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          transition: { duration: 0.4 }
        };
      default:
        return {};
    }
  };
  
  return (
    <motion.div 
      className={`
        ${baseStyles} 
        ${variantStyles[variant]} 
        ${isActive ? activeStyles[variant] : ''}
        ${onClick ? 'cursor-pointer transform hover:-translate-y-1' : ''} 
        ${className}
      `}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : {}}
      {...getAnimationProps()}
    >
      {icon && (
        <div className={`text-2xl mb-3 ${variant === 'warning' ? 'text-amber-500' : 
          variant === 'success' ? 'text-emerald-500' : 
          variant === 'highlighted' ? 'text-indigo-400' : 'text-white'}`}>
          {icon}
        </div>
      )}
      <h3 className={`text-lg font-bold mb-3 ${
        variant === 'warning' ? 'text-amber-300' : 
        variant === 'success' ? 'text-emerald-300' : 
        variant === 'highlighted' ? 'text-indigo-300' : 'text-white'
      }`}>{title}</h3>
      <div className="text-slate-300">
        {description}
      </div>
    </motion.div>
  );
};

// Компонент для секции с градиентным фоном
const GradientSection = ({ 
  title, 
  subtitle,
  children, 
  className = '',
  colorScheme = 'indigo',
  withAnimation = false,
  bordered = false,
  rounded = false
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  colorScheme?: 'indigo' | 'blue' | 'purple' | 'amber' | 'emerald';
  withAnimation?: boolean;
  bordered?: boolean;
  rounded?: boolean;
}) => {
  const colorStyles = {
    indigo: "bg-gradient-to-br from-indigo-900/40 to-indigo-950/70 border-indigo-700/60",
    blue: "bg-gradient-to-br from-blue-900/40 to-blue-950/70 border-blue-700/60",
    purple: "bg-gradient-to-br from-purple-900/40 to-purple-950/70 border-purple-700/60",
    amber: "bg-gradient-to-br from-amber-900/40 to-amber-950/70 border-amber-700/60",
    emerald: "bg-gradient-to-br from-emerald-900/40 to-emerald-950/70 border-emerald-700/60",
  };

  const animationProps = withAnimation ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};
  
  return (
    <motion.div 
      className={`p-6 ${bordered ? 'border' : ''} ${rounded ? 'rounded-xl' : 'rounded-lg'} shadow-xl ${colorStyles[colorScheme]} ${className}`}
      {...animationProps}
    >
      {title && (
        <h3 className={`text-xl font-bold mb-2 ${
          colorScheme === 'indigo' ? 'text-indigo-300' : 
          colorScheme === 'blue' ? 'text-blue-300' : 
          colorScheme === 'purple' ? 'text-purple-300' :
          colorScheme === 'amber' ? 'text-amber-300' :
          'text-emerald-300'
        }`}>{title}</h3>
      )}
      {subtitle && <p className="text-slate-400 mb-4">{subtitle}</p>}
      {children}
    </motion.div>
  );
};

const ProductThinkingPractice: React.FC<ProductThinkingPracticeProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState({
    userProblem: '',
    valueProposition: '',
    problemSelection: [] as string[],
    priorityOrder: [] as string[],
    solution: ''
  });
  
  // Устанавливаем ключ сессии для сохранения состояния компонента между переходами
  const STORAGE_KEY = 'product_thinking_practice';
  
  // Инициализируем состояние с нуля
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Проверяем, был ли сброс уровня
      const isReset = isLevelReset(1);
      
      if (isReset) {
        // Если был сброс, устанавливаем шаг на 0 и очищаем ответы
        localStorage.setItem(`${STORAGE_KEY}_step`, '0');
        localStorage.setItem(`${STORAGE_KEY}_answers`, JSON.stringify({
          userProblem: '',
          valueProposition: '',
          problemSelection: [],
          priorityOrder: [],
          solution: ''
        }));
        setAnswers({
          userProblem: '',
          valueProposition: '',
          problemSelection: [],
          priorityOrder: [],
          solution: ''
        });
        setCurrentStep(0);
      } else {
        // Если не было сброса, пробуем загрузить сохраненные данные
        const savedStep = localStorage.getItem(`${STORAGE_KEY}_step`);
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10));
        }
        
        const savedAnswers = localStorage.getItem(`${STORAGE_KEY}_answers`);
        if (savedAnswers) {
          try {
            setAnswers(JSON.parse(savedAnswers));
          } catch (error) {
            console.error('Ошибка при загрузке сохраненных ответов:', error);
          }
        }
      }
      
      // Вне зависимости от сброса, устанавливаем флаг посещения
      localStorage.setItem(`${STORAGE_KEY}_visited`, 'true');
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_answers`, JSON.stringify(answers));
    }
  }, [answers]);
  
  const handleTextChange = (field: keyof typeof answers, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProblemSelection = (problem: string) => {
    setAnswers(prev => {
      const problemSelection = [...prev.problemSelection];
      const index = problemSelection.indexOf(problem);
      
      if (index >= 0) {
        problemSelection.splice(index, 1);
      } else if (problemSelection.length < 3) {
        problemSelection.push(problem);
      }
      
      return {
        ...prev,
        problemSelection
      };
    });
  };

  const handlePriorityChange = (itemId: string, direction: 'up' | 'down') => {
    setAnswers(prev => {
      const newOrder = [...prev.priorityOrder];
      const currentIndex = newOrder.indexOf(itemId);
      
      if (currentIndex < 0) return prev;
      
      if (direction === 'up' && currentIndex > 0) {
        // Перемещаем элемент вверх
        [newOrder[currentIndex], newOrder[currentIndex - 1]] = 
        [newOrder[currentIndex - 1], newOrder[currentIndex]];
      } else if (direction === 'down' && currentIndex < newOrder.length - 1) {
        // Перемещаем элемент вниз
        [newOrder[currentIndex], newOrder[currentIndex + 1]] = 
        [newOrder[currentIndex + 1], newOrder[currentIndex]];
      }
      
      return {
        ...prev,
        priorityOrder: newOrder
      };
    });
  };

  // Возможные проблемы пользователей для выбора
  const potentialProblems = [
    { id: 'time-management', text: 'Трудности с эффективным управлением временем' },
    { id: 'task-overload', text: 'Перегруженность большим количеством задач' },
    { id: 'priority', text: 'Сложности с определением приоритетов задач' },
    { id: 'collaboration', text: 'Проблемы с совместной работой над задачами' },
    { id: 'reminders', text: 'Забывание о важных задачах и сроках' },
    { id: 'complexity', text: 'Сложность в разбиении больших задач на меньшие' },
    { id: 'tracking', text: 'Отсутствие видимости общего прогресса по проектам' },
    { id: 'motivation', text: 'Недостаток мотивации для выполнения рутинных задач' }
  ];

  // Возможные решения для приоритизации
  const possibleSolutions = [
    { id: 'quick-add', text: 'Быстрое добавление задач одним касанием' },
    { id: 'smart-categories', text: 'Умная категоризация задач на основе их содержания' },
    { id: 'ai-priority', text: 'ИИ-помощник для определения приоритетов' },
    { id: 'voice-input', text: 'Голосовой ввод для создания задач в движении' },
    { id: 'templates', text: 'Шаблоны задач для часто повторяющихся действий' },
    { id: 'gamification', text: 'Элементы геймификации для повышения мотивации' }
  ];

  // Инициализация порядка решений, если это еще не сделано
  useEffect(() => {
    if (answers.priorityOrder.length === 0) {
      setAnswers(prev => ({
        ...prev,
        priorityOrder: possibleSolutions.map(solution => solution.id)
      }));
    }
  }, [answers.priorityOrder.length]);
  
  // Данные для шагов практики
  const practiceStepsData = [
    {
      id: "intro",
      title: "Практическое задание: Продуктовое мышление",
      content: (
        <>
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-4" id="step1-title">Практическое задание: Продуктовое мышление</h1>
            <p className="text-slate-400 italic max-w-3xl">
              В этом практическом задании вы примените ключевые аспекты продуктового мышления к TaskMaster — 
              приложению для управления задачами. Вы будете действовать как продукт-менеджер, который думает 
              в первую очередь о создании ценности для пользователя.
            </p>
          </motion.div>

          <GradientSection 
            title="О продукте TaskMaster" 
            subtitle="Мобильное приложение для управления задачами"
            colorScheme="indigo"
            withAnimation={true}
            bordered={true}
            rounded={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                title="Описание продукта"
                description="TaskMaster - мобильное приложение для управления задачами, помогающее пользователям организовывать и отслеживать свои ежедневные дела, проекты и обязанности."
                icon="📱"
                variant="highlighted"
                animation="scale"
              />
              
              <InfoCard
                title="Целевая аудитория"
                description={
                  <ul className="list-disc list-inside">
                    <li>Менеджеры проектов</li>
                    <li>Предприниматели</li>
                    <li>HR-специалисты</li>
                    <li>Студенты</li>
                    <li>Активные пользователи: 25-45 лет</li>
                  </ul>
                }
                icon="👥"
                variant="highlighted"
                animation="scale"
              />
              
              <InfoCard
                title="Текущие возможности"
                description={
                  <ul className="list-disc list-inside">
                    <li>Создание и редактирование задач</li>
                    <li>Установка сроков и напоминаний</li>
                    <li>Базовая категоризация</li>
                    <li>Отслеживание прогресса</li>
                    <li>Интеграция с календарем</li>
                  </ul>
                }
                icon="✅"
                variant="highlighted"
                animation="scale"
              />
              
              <InfoCard
                title="Обратная связь от пользователей"
                description={
                  <ul className="list-disc list-inside">
                    <li>"Приложение полезное, но требует много времени для ввода данных"</li>
                    <li>"Хочу более интеллектуальные функции для организации задач"</li>
                    <li>"Теряю мотивацию при работе с большим списком задач"</li>
                    <li>"Не всегда понятно, за что взяться в первую очередь"</li>
                    <li>"Когда количество задач превышает 20, приложение становится неудобным"</li>
                    <li>"Хотелось бы быстрее создавать повторяющиеся задачи"</li>
                    <li>"Сложно держать в голове общую картину, когда задач много"</li>
                    <li>"Тяжело делиться задачами с коллегами и отслеживать их выполнение"</li>
                    <li>"Часто забываю о задачах, даже при установленных напоминаниях"</li>
                    <li>"Нужно много кликов для создания простой задачи"</li>
                    <li>"Трудно возвращаться к приложению регулярно, нет привычки"</li>
                  </ul>
                }
                icon="💬"
                variant="warning"
                animation="scale"
              />
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-indigo-300 mb-4">Ваша задача как продакт-менеджера:</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Определить реальные проблемы пользователей</li>
                <li>Сформулировать ценностное предложение</li>
                <li>Применить критическое мышление для выбора проблем для решения</li>
                <li>Приоритизировать потенциальные решения</li>
                <li>Предложить идею для реализации с наибольшей ценностью для пользователей</li>
              </ul>
            </div>
          </GradientSection>
        </>
      )
    },
    {
      id: "user_problem",
      title: "Определение проблемы пользователей",
      content: (
        <GradientSection 
          title="Выявление критических проблем" 
          subtitle="Применяем первый аспект продуктового мышления — выявление реальных потребностей"
          colorScheme="indigo"
          withAnimation={true}
        >
          <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/50 mb-4">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2" id="step2-title">Задание 1: Определение проблемы</h3>
            <p className="text-slate-200">
              Исходя из обратной связи пользователей, сформулируйте основную проблему, которую испытывают пользователи TaskMaster в их собственных словах. Ответ должен отражать реальную боль пользователей, а не внутренние задачи компании.
            </p>
            <div className="p-3 bg-indigo-900/30 rounded mt-3 border border-indigo-700/30">
              <p className="text-indigo-300 font-medium">Важно:</p>
              <p className="text-slate-300 text-sm">Продуктовое мышление начинается с понимания настоящих проблем пользователей. Не путайте проблему пользователя с решением или с бизнес-задачей!</p>
            </div>
          </div>
          
          <textarea
            className="w-full bg-slate-800 text-white p-4 rounded border border-slate-600 min-h-32"
            placeholder="Пример: Пользователи тратят слишком много времени на..."
            value={answers.userProblem}
            onChange={(e) => handleTextChange('userProblem', e.target.value)}
          />
          
          <div className="mt-6 bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/50">
            <h3 className="text-lg font-semibold text-indigo-300 mb-3">Выберите 3 наиболее критичные проблемы пользователей</h3>
            <p className="text-slate-300 mb-4">Основываясь на обратной связи, выберите три самые важные проблемы, которые нужно решить в первую очередь:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {potentialProblems.map(problem => (
                <div 
                  key={problem.id}
                  onClick={() => handleProblemSelection(problem.id)}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all duration-200
                    ${answers.problemSelection.includes(problem.id) 
                      ? 'border-indigo-500 bg-indigo-900/40 shadow-md shadow-indigo-500/20' 
                      : 'border-slate-700 bg-slate-800/40 hover:bg-slate-700/40'}
                  `}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center
                        ${answers.problemSelection.includes(problem.id) 
                          ? 'border-indigo-500 bg-indigo-500' 
                          : 'border-slate-600'}
                      `}>
                        {answers.problemSelection.includes(problem.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-200">{problem.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-indigo-400 mt-4">
              {answers.problemSelection.length}/3 проблемы выбрано
            </p>
          </div>
        </GradientSection>
      )
    },
    {
      id: "value_proposition",
      title: "Ценностное предложение",
      content: (
        <GradientSection 
          title="Формулировка ценностного предложения" 
          subtitle="Как продукт решает проблемы пользователей лучше, чем альтернативы"
          colorScheme="indigo"
          withAnimation={true}
        >
          <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/50 mb-6">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2" id="step3-title">Задание 2: Ценностное предложение</h3>
            <p className="text-slate-200 mb-4">
              Сформулируйте четкое ценностное предложение для TaskMaster, которое отвечает на выбранные вами проблемы пользователей. Используйте формулу:
            </p>
            
            <div className="bg-indigo-800/30 p-3 rounded-lg border border-indigo-600/30 mb-4">
              <p className="text-indigo-300 font-mono">
                TaskMaster помогает [кому?] решить [какую проблему?] путем [как именно?], в отличие от [альтернативных решений].
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 mb-4">
              <div className="bg-indigo-900/40 p-3 rounded-lg">
                <p className="text-sm text-indigo-300 font-semibold">Выбранные вами проблемы:</p>
                <ul className="list-disc list-inside text-slate-300 mt-1">
                  {answers.problemSelection.map(problemId => {
                    const problem = potentialProblems.find(p => p.id === problemId);
                    return problem ? <li key={problemId}>{problem.text}</li> : null;
                  })}
                </ul>
              </div>
            </div>
            
            <div className="p-3 bg-indigo-900/30 rounded mt-3 border border-indigo-700/30">
              <p className="text-indigo-300 font-medium">Пример хорошего ценностного предложения:</p>
              <p className="text-slate-300 text-sm italic">
                "Spotify Discover Weekly помогает любителям музыки открывать новые треки, соответствующие их вкусу, с помощью персонализированных еженедельных плейлистов, созданных алгоритмами на основе их предпочтений, в отличие от ручного поиска или стандартных топ-чартов."
              </p>
            </div>
          </div>
          
          <textarea
            className="w-full bg-slate-800 text-white p-4 rounded border border-slate-600 min-h-32"
            placeholder="TaskMaster помогает [кому?] решить [какую проблему?] путем [как именно?], в отличие от [альтернативных решений]."
            value={answers.valueProposition}
            onChange={(e) => handleTextChange('valueProposition', e.target.value)}
          />
        </GradientSection>
      )
    },
    {
      id: "prioritization",
      title: "Приоритизация решений",
      content: (
        <GradientSection 
          title="Балансирование противоречивых приоритетов" 
          subtitle="Третий аспект продуктового мышления — поиск золотой середины"
          colorScheme="indigo"
          withAnimation={true}
        >
          <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/50 mb-6">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2" id="step4-title">Задание 3: Приоритизация решений</h3>
            <p className="text-slate-200 mb-4">
              Расположите следующие потенциальные решения в порядке приоритета, учитывая их ценность для пользователя, 
              техническую сложность реализации и стратегическое значение для продукта.
            </p>
            
            <div className="p-3 bg-indigo-900/30 rounded mt-3 border border-indigo-700/30">
              <p className="text-indigo-300 font-medium">Примените продуктовое мышление:</p>
              <p className="text-slate-300 text-sm">
                Продуктовое мышление требует баланса между потребностями пользователей, бизнес-целями и 
                техническими возможностями. Какие решения принесут наибольшую пользу при разумных затратах?
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {answers.priorityOrder.map((solutionId, index) => {
              const solution = possibleSolutions.find(s => s.id === solutionId);
              if (!solution) return null;
              
              return (
                <div 
                  key={solutionId}
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center"
                >
                  <div className="flex-shrink-0 mr-3 font-bold text-xl text-indigo-400 w-7">
                    {index + 1}.
                  </div>
                  <div className="flex-grow">
                    <p className="text-white font-medium">{solution.text}</p>
                  </div>
                  <div className="flex-shrink-0 ml-3 space-x-1.5">
                    <button 
                      className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700"
                      disabled={index === 0}
                      onClick={() => handlePriorityChange(solutionId, 'up')}
                    >
                      <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button 
                      className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700"
                      disabled={index === answers.priorityOrder.length - 1}
                      onClick={() => handlePriorityChange(solutionId, 'down')}
                    >
                      <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </GradientSection>
      )
    },
    {
      id: "solution",
      title: "Решение с наибольшей ценностью",
      content: (
        <GradientSection 
          title="Предложение решения" 
          subtitle="Применение продуктового мышления для создания ценности"
          colorScheme="indigo"
          withAnimation={true}
        >
          <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/50 mb-6">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2" id="step5-title">Задание 4: Предложение решения</h3>
            <p className="text-slate-200">
              Опишите конкретное решение для TaskMaster, которое создаст максимальную ценность для пользователей,
              основываясь на выбранных вами проблемах и приоритизированных подходах. Укажите, как это решение:
            </p>
            
            <ul className="list-disc list-inside text-slate-300 mt-3 space-y-1">
              <li>Решает выявленные проблемы пользователей</li>
              <li>Создает уникальное преимущество перед альтернативами</li>
              <li>Соответствует ценностному предложению</li>
              <li>Имеет потенциал для дальнейшего развития продукта</li>
            </ul>
          </div>
          
          <textarea
            className="w-full bg-slate-800 text-white p-4 rounded border border-slate-600 min-h-36"
            placeholder="Опишите ваше решение здесь..."
            value={answers.solution}
            onChange={(e) => handleTextChange('solution', e.target.value)}
          />
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-indigo-300 mb-4">Результаты вашего продуктового мышления:</h3>
            <div className="grid grid-cols-1 gap-4">
              <InfoCard
                title="Выявленные проблемы пользователей"
                description={
                  answers.problemSelection.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {answers.problemSelection.map(problemId => {
                        const problem = potentialProblems.find(p => p.id === problemId);
                        return problem ? <li key={problemId}>{problem.text}</li> : null;
                      })}
                    </ul>
                  ) : "Вы пока не выбрали проблемы пользователей"
                }
                variant="default"
              />
              <InfoCard
                title="Ценностное предложение"
                description={answers.valueProposition || "Вы пока не сформулировали ценностное предложение"}
                variant="highlighted"
              />
              <InfoCard
                title="Приоритетное решение"
                description={
                  answers.priorityOrder.length > 0 ? (
                    <div>
                      {(() => {
                        const topSolutionId = answers.priorityOrder[0];
                        const topSolution = possibleSolutions.find(s => s.id === topSolutionId);
                        return topSolution ? topSolution.text : "Не выбрано";
                      })()}
                    </div>
                  ) : "Вы пока не приоритизировали решения"
                }
                variant="success"
              />
              <InfoCard
                title="Ваше предложенное решение"
                description={answers.solution || "Вы пока не предложили решение"}
                variant="default"
              />
            </div>
          </div>
        </GradientSection>
      )
    }
  ];
  
  // Создаем массив шагов для использования с StepNavigation
  const practiceSteps = practiceStepsData.map((step, index) => (
    <div key={step.id}>
      <h2 className="text-2xl font-bold mb-6 text-indigo-400">
        {index + 1}. {step.title}
      </h2>
      
      <div className="border-l-4 border-indigo-500 pl-6">
        {step.content}
      </div>
    </div>
  ));
  
  return (
    <div className={styles.container}>
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-4">Практика: Продуктовое мышление</h1>
        <p className="text-slate-400 italic max-w-3xl">
          Примените ключевые принципы продуктового мышления, фокусируясь на ценности для пользователей.
        </p>
      </motion.div>

      <StepNavigation 
        steps={practiceSteps}
        onComplete={onComplete}
        completeButtonText="Завершить"
        continueButtonText="Продолжить"
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        persistStepKey={`${STORAGE_KEY}_step`}
      />
    </div>
  );
};

export default ProductThinkingPractice; 