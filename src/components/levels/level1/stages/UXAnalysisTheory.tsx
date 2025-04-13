import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StepNavigation from '../../shared/navigation/StepNavigation';
import { styles } from '../common/styles';
import { isLevelReset } from '../../shared/utils/levelResetUtils';

interface UXAnalysisTheoryProps {
  onComplete: () => void;
}

const UXAnalysisTheory: React.FC<UXAnalysisTheoryProps> = ({ onComplete }) => {
  // Состояние для текущего шага, инициализируем из localStorage
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Проверяем, был ли сброс уровня
      const isReset = isLevelReset(1);
      
      if (isReset) {
        // Если был сброс, устанавливаем шаг на 0
        localStorage.setItem('ux_analysis_theory_step', '0');
        setCurrentStep(0);
      } else {
        // Если не было сброса, пробуем загрузить сохраненный шаг
        const savedStep = localStorage.getItem('ux_analysis_theory_step');
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10));
        }
      }
    }
  }, []);

  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const handlePrincipleSelect = (principle: string) => {
    if (selectedPrinciples.includes(principle)) {
      setSelectedPrinciples(prev => prev.filter(p => p !== principle));
    } else {
      setSelectedPrinciples(prev => [...prev, principle]);
    }
  };

  const handleNextStep = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep(currentStep + 1);
      // Прокручиваем к новой секции
      const element = document.getElementById(`step-${currentStep + 1}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      onComplete();
    }
  };

  // Простая карточка с информацией
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
    // Базовые стили с улучшенными тенями и градиентами
    const baseStyles = "rounded-xl p-5 transition-all duration-300 shadow-lg";
    
    // Улучшенные стили для разных вариантов
    const variantStyles = {
      default: "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:shadow-slate-700/30 hover:border-slate-600",
      highlighted: "bg-gradient-to-br from-indigo-900/40 to-indigo-950/60 border border-indigo-700/50 hover:shadow-indigo-700/30 hover:border-indigo-600/60",
      warning: "bg-gradient-to-br from-amber-900/40 to-amber-950/60 border border-amber-700/50 hover:shadow-amber-700/30 hover:border-amber-600/60",
      success: "bg-gradient-to-br from-emerald-900/40 to-emerald-950/60 border border-emerald-700/50 hover:shadow-emerald-700/30 hover:border-emerald-600/60"
    };
    
    // Активные стили с более выразительным выделением
    const activeStyles = {
      default: "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/30",
      highlighted: "ring-2 ring-indigo-400 shadow-lg shadow-indigo-400/30",
      warning: "ring-2 ring-amber-500 shadow-lg shadow-amber-500/30",
      success: "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/30"
    };

    // Стили анимаций
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
  
  // Секция с градиентным фоном
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
    // Улучшенные стили для разных цветовых схем
    const colorStyles = {
      indigo: "bg-gradient-to-br from-indigo-900/40 to-indigo-950/70 border-indigo-700/60",
      blue: "bg-gradient-to-br from-blue-900/40 to-blue-950/70 border-blue-700/60",
      purple: "bg-gradient-to-br from-purple-900/40 to-purple-950/70 border-purple-700/60",
      amber: "bg-gradient-to-br from-amber-900/40 to-amber-950/70 border-amber-700/60",
      emerald: "bg-gradient-to-br from-emerald-900/40 to-emerald-950/70 border-emerald-700/60",
    };

    // Добавляем анимацию если нужно
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

  // Интерактивный опрос
  const InteractivePoll: React.FC<{question: string; options: string[]}> = ({question, options}) => {
    const [selected, setSelected] = useState<number | null>(null);
    
    return (
      <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">{question}</h3>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div 
              key={index}
              onClick={() => setSelected(index)}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${selected === index ? 'bg-indigo-900/50 border-indigo-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border mr-3 flex-shrink-0 ${selected === index ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'}`}>
                  {selected === index && <span className="flex items-center justify-center h-full text-white text-xs">✓</span>}
                </div>
                <span className="text-slate-200">{option}</span>
              </div>
            </div>
          ))}
        </div>
        {selected !== null && (
          <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-800 rounded">
            <p className="text-indigo-300 text-sm">
              {selected === 0 ? 'Хороший выбор! Понимание пользователей — это ключевой аспект UX-анализа.' : 
              selected === 1 ? 'Отлично! Действительно, UX-дизайн направлен на улучшение опыта пользователей, делая интерфейсы более удобными и интуитивно понятными.' : 
              selected === 2 ? 'Верно! UX-дизайн включает множество аспектов, от исследований до тестирования, с фокусом на потребности пользователей.' : 
              'Интересный выбор! Визуальная привлекательность важна, но UX охватывает более широкий спектр аспектов взаимодействия пользователя с продуктом.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Компонент для выбора метода UX-исследования в зависимости от ситуации
  const UXMethodSelector: React.FC = () => {
    const [selected, setSelected] = useState<string | null>(null);
    const [situation, setSituation] = useState<number>(0);
    
    const situations = [
      {
        title: "Ситуация 1: Новый функционал",
        description: "Вам нужно разработать новую функцию для приложения, но вы не знаете, какие конкретно проблемы она должна решать.",
        bestMethod: "interviews",
        feedback: {
          interviews: "Отличный выбор! Интервью с пользователями помогут выявить реальные проблемы и потребности, прежде чем приступать к проектированию решения.",
          surveys: "Неплохой вариант, но опросы дадут вам много количественных данных, тогда как на этом этапе важнее глубокое понимание проблем, которое лучше получить через интервью.",
          usability: "Это преждевременный выбор. Без понимания проблемы пользователей, нечего будет тестировать на юзабилити.",
          analytics: "Аналитика может помочь определить, где пользователи испытывают трудности, но без прямого взаимодействия с ними трудно понять причины этих трудностей."
        }
      },
      {
        title: "Ситуация 2: Оптимизация конверсии",
        description: "У вас низкий процент конверсии на странице оформления заказа, и нужно выяснить, как его улучшить.",
        bestMethod: "analytics",
        feedback: {
          interviews: "Интервью могут дать полезные инсайты, но для начала лучше понять, где именно проблема с помощью количественных данных.",
          surveys: "Опросы могут помочь, но они не покажут, как пользователи реально взаимодействуют со страницей.",
          usability: "Хороший вариант для детального анализа проблем, но сначала лучше использовать аналитику для определения узких мест.",
          analytics: "Отличный выбор! Аналитика покажет, на каком шаге пользователи покидают процесс оформления заказа, что даст отправную точку для дальнейшего исследования."
        }
      },
      {
        title: "Ситуация 3: Запуск редизайна",
        description: "Вы планируете масштабный редизайн интерфейса и хотите проверить, насколько новая версия удобнее старой.",
        bestMethod: "usability",
        feedback: {
          interviews: "Интервью могут дать общую обратную связь, но не позволят оценить конкретные аспекты пользовательского взаимодействия с редизайном.",
          surveys: "Опросы хороши для сбора мнений большого количества пользователей, но не покажут реальные проблемы взаимодействия с интерфейсом.",
          usability: "Отличный выбор! Юзабилити-тестирование позволит напрямую наблюдать, как пользователи взаимодействуют с новым интерфейсом, и выявить конкретные проблемы.",
          analytics: "Аналитика будет полезна после запуска редизайна, но до запуска лучше провести юзабилити-тестирование, чтобы предотвратить проблемы."
        }
      }
    ];
    
    const handleNext = () => {
      setSituation((prev) => (prev + 1) % situations.length);
      setSelected(null);
    };
    
    return (
      <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700 mt-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-2">{situations[situation].title}</h3>
        <p className="text-slate-300 mb-4">{situations[situation].description}</p>
        
        <p className="text-indigo-400 font-medium mb-3">Выберите наиболее подходящий метод исследования для этой ситуации:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div 
            onClick={() => setSelected('interviews')}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selected === 'interviews' ? 'bg-indigo-900/50 border-indigo-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
          >
            <h4 className="font-medium text-white mb-1">Интервью с пользователями</h4>
            <p className="text-slate-300 text-sm">Глубинные беседы для понимания потребностей и проблем</p>
          </div>
          
          <div 
            onClick={() => setSelected('surveys')}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selected === 'surveys' ? 'bg-indigo-900/50 border-indigo-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
          >
            <h4 className="font-medium text-white mb-1">Опросы и анкеты</h4>
            <p className="text-slate-300 text-sm">Сбор количественных данных от большого числа пользователей</p>
          </div>
          
          <div 
            onClick={() => setSelected('usability')}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selected === 'usability' ? 'bg-indigo-900/50 border-indigo-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
          >
            <h4 className="font-medium text-white mb-1">Юзабилити-тестирование</h4>
            <p className="text-slate-300 text-sm">Наблюдение за пользователями при выполнении задач</p>
          </div>
          
          <div 
            onClick={() => setSelected('analytics')}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selected === 'analytics' ? 'bg-indigo-900/50 border-indigo-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
          >
            <h4 className="font-medium text-white mb-1">Анализ данных и метрик</h4>
            <p className="text-slate-300 text-sm">Изучение поведенческих данных пользователей</p>
          </div>
        </div>
        
        {selected && (
          <div className={`mt-4 p-4 rounded-lg border ${selected === situations[situation].bestMethod ? 'bg-green-900/30 border-green-700' : 'bg-amber-900/30 border-amber-700'}`}>
            <div className="flex items-start">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 ${selected === situations[situation].bestMethod ? 'bg-green-700' : 'bg-amber-700'}`}>
                <span className="text-white font-medium text-xs">{selected === situations[situation].bestMethod ? '✓' : '!'}</span>
              </div>
              <p className="text-slate-200 text-sm">
                {situations[situation].feedback[selected as keyof typeof situations[0]['feedback']]}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm transition-colors"
              >
                Следующая ситуация
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Компонент для интерактивной метрики с примером
  const MetricExample: React.FC<{title: string; description: string; examples: string[]; icon: string}> = ({title, description, examples, icon}) => {
    const [showExamples, setShowExamples] = useState(false);
    
    return (
      <div className="bg-slate-800/70 p-5 rounded-lg border border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center mb-3">
          <div className="text-2xl mr-3">{icon}</div>
          <h3 className="text-lg font-semibold text-indigo-400">{title}</h3>
        </div>
        <p className="text-slate-300 mb-3">{description}</p>
        <button 
          onClick={() => setShowExamples(!showExamples)}
          className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-700 transition-colors rounded text-white text-sm flex items-center"
        >
          {showExamples ? 'Скрыть примеры' : 'Показать примеры'}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ml-2 transition-transform duration-300 ${showExamples ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showExamples && (
          <div className="mt-3 space-y-2 pl-2 border-l-2 border-indigo-500">
            {examples.map((example, index) => (
              <p key={index} className="text-slate-300 text-sm pl-3">{example}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Данные для шагов
  const stepsData = [
    {
      id: "intro",
      title: "Что такое UX-дизайн",
      content: (
        <>
          <GradientSection 
            colorScheme="indigo" 
            className="mb-4"
            withAnimation={true}
          >
            <p className="text-slate-300 mb-4">
              UX-дизайн (User Experience) — это процесс создания продуктов, которые обеспечивают
              значимый и релевантный опыт для пользователей. Он включает в себя проектирование
              всего процесса взаимодействия пользователя с продуктом, включая удобство использования,
              доступность и эффективность.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800/30">
                <h3 className="text-indigo-400 font-semibold mb-2">Хороший UX приводит к:</h3>
                <ul className="list-disc list-inside text-slate-300">
                  <li>Увеличению конверсии</li>
                  <li>Повышению удовлетворенности</li>
                  <li>Росту лояльности</li>
                  <li>Улучшению бренда</li>
                </ul>
              </div>
              
              <InfoCard
                title="Плохой UX приводит к:"
                description={
                  <ul className="list-disc list-inside">
                    <li>Разочарованию пользователей</li>
                    <li>Потере клиентов</li>
                    <li>Негативным отзывам</li>
                    <li>Снижению доверия к продукту</li>
                  </ul>
                }
                variant="warning"
                animation="scale"
              />
            </div>
          </GradientSection>
          
          <h3 className="text-xl font-bold text-indigo-400 mb-4">UX-дизайн это гораздо больше, чем просто внешний вид:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InfoCard 
              title="Исследование пользователей" 
              description="Глубокое понимание потребностей, целей и болей пользователей через интервью, наблюдения и аналитику для принятия обоснованных решений."
              icon="🔍"
              variant="highlighted"
              animation="fade"
            />
            <InfoCard 
              title="Информационная архитектура" 
              description="Организация и структурирование контента для обеспечения интуитивной навигации и поиска нужной информации."
              icon="🏗️"
              variant="highlighted"
              animation="fade"
            />
            <InfoCard 
              title="Юзабилити-тестирование" 
              description="Проверка продукта с реальными пользователями для выявления проблем и оптимизации взаимодействия до финального запуска."
              icon="🧪"
              variant="highlighted"
              animation="fade"
            />
            <InfoCard 
              title="Создание пользовательских путей" 
              description="Проектирование целостного опыта пользователя на всех этапах взаимодействия с продуктом от первого контакта до достижения цели."
              icon="🗺️"
              variant="highlighted"
              animation="fade"
            />
          </div>
          
          <InteractivePoll 
            question="Что, по вашему мнению, наиболее точно описывает UX-дизайн?"
            options={[
              "Создание красивых и эстетичных интерфейсов",
              "Проектирование полноценного опыта взаимодействия пользователя с продуктом",
              "Создание понятных и удобных интерфейсов",
              "Решение проблем пользователей через дизайн"
            ]}
          />
          
          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/60 rounded-lg p-6 mt-8">
            <div className="flex items-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-bold text-blue-400">Пример из практики: Airbnb</h3>
            </div>
            
            <div className="flex items-start">
              <div className="hidden md:block flex-shrink-0 mr-6">
                <div className="w-28 h-28 bg-blue-800/40 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 50 50" className="w-20 h-20 text-pink-500" fill="currentColor">
                    <path d="M24.8,0C11.144,0,0,11.092,0,24.748c0,13.699,11.144,24.793,24.8,24.793 c13.699,0,24.841-11.094,24.841-24.793C49.641,11.092,38.499,0,24.8,0z M35.577,35.898c-0.254,0.588-0.912,0.922-1.538,0.76 c-3.18-0.994-6.304-1.548-9.309-1.548c-3.117,0-6.305,0.554-9.485,1.548c-0.127,0.042-0.253,0.067-0.374,0.067 c-0.497,0-0.977-0.301-1.164-0.795c-0.205-0.65,0.142-1.355,0.789-1.58c3.497-1.111,6.98-1.725,10.233-1.725 c3.222,0,6.646,0.612,10.095,1.741C35.426,34.585,35.83,35.254,35.577,35.898z M38.346,29.143 c-0.325,0.76-1.161,1.148-1.911,0.894c-3.863-1.217-7.725-1.9-11.522-1.9c-3.821,0-7.683,0.684-11.522,1.9 c-0.164,0.053-0.327,0.076-0.489,0.076c-0.64,0-1.251-0.391-1.499-1.011c-0.269-0.854,0.205-1.759,1.058-2.028 c4.224-1.33,8.513-2.077,12.451-2.077c3.938,0,8.227,0.747,12.452,2.077C38.302,27.471,38.651,28.378,38.346,29.143z M41.6,21.056 c-0.385,0.897-1.433,1.343-2.329,0.97c-4.403-1.866-9.741-2.847-15.06-2.847c-5.324,0-10.664,0.98-15.064,2.847 c-0.205,0.074-0.41,0.12-0.61,0.12c-0.726,0-1.406-0.427-1.723-1.148c-0.341-0.798,0.03-1.728,0.828-2.069 c4.899-2.091,10.729-3.226,16.568-3.226c5.841,0,11.669,1.135,16.567,3.226C41.517,19.111,41.94,20.198,41.6,21.056z"/>
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-slate-200 mb-4">
                  Airbnb является одним из наиболее ярких примеров компании, в которой UX-дизайн стал ключевым фактором успеха. Когда компания испытывала трудности в начале пути, именно редизайн пользовательского опыта привел к значительному росту.
                </p>
                
                <div className="rounded-lg bg-slate-800/70 p-4 mb-4 border border-slate-700">
                  <h4 className="text-blue-300 font-semibold mb-2">Как Airbnb улучшили UX:</h4>
                  <ul className="space-y-2 ml-4">
                    <li className="flex">
                      <div className="w-6 h-6 rounded-full bg-blue-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">1</span>
                      </div>
                      <p className="text-slate-300 text-sm"><span className="text-blue-400 font-medium">Фотографии высокого качества:</span> Компания отправила профессиональных фотографов для съемки жилья, что значительно улучшило восприятие пользователей и повысило доверие.</p>
                    </li>
                    <li className="flex">
                      <div className="w-6 h-6 rounded-full bg-blue-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">2</span>
                      </div>
                      <p className="text-slate-300 text-sm"><span className="text-blue-400 font-medium">Система отзывов и рейтингов:</span> Создание двусторонней системы рейтингов, где оцениваются и гости, и хозяева, что создало атмосферу взаимной ответственности.</p>
                    </li>
                    <li className="flex">
                      <div className="w-6 h-6 rounded-full bg-blue-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">3</span>
                      </div>
                      <p className="text-slate-300 text-sm"><span className="text-blue-400 font-medium">Упрощенный процесс бронирования:</span> Оптимизация шагов от поиска до оплаты, с акцентом на самую важную информацию на каждом этапе.</p>
                    </li>
                    <li className="flex">
                      <div className="w-6 h-6 rounded-full bg-blue-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">4</span>
                      </div>
                      <p className="text-slate-300 text-sm"><span className="text-blue-400 font-medium">Персонализация и рекомендации:</span> Внедрение алгоритмов, которые предлагают жилье на основе предпочтений пользователя, истории просмотров и бронирований.</p>
                    </li>
                  </ul>
                </div>
                
                <p className="text-slate-300">
                  <span className="text-blue-300 font-semibold">Результат:</span> Благодаря этим улучшениям UX, Airbnb превратилась из стартапа, находящегося на грани провала, в компанию с оценкой более $100 миллиардов. Этот пример демонстрирует, как продуманный UX-дизайн может кардинально изменить судьбу продукта.
                </p>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      id: "principles",
      title: "Основные принципы UX-дизайна",
      content: (
        <>
          <p className="text-slate-300 mb-6">
            Следующие принципы UX-дизайна являются фундаментальными для создания качественного пользовательского опыта.
            Эти принципы основаны на психологии пользователей, когнитивных особенностях восприятия и доказанных практиках дизайна.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
              <div className="flex items-start">
                <div className="text-indigo-400 mr-3 text-2xl font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400 mb-3">Понимание пользователя</h3>
                  <p className="text-slate-300 mb-3">
                    Глубокое исследование целевой аудитории, её потребностей, целей, контекста использования и поведенческих паттернов.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-green-900/20 p-3 rounded border border-green-800/30">
                      <h4 className="text-green-400 text-sm font-semibold mb-1">✓ Хороший пример</h4>
                      <p className="text-slate-300 text-sm">Приложение для тренировок предлагает разные программы для начинающих и опытных спортсменов, учитывая их физическую подготовку.</p>
                    </div>
                    <div className="bg-red-900/20 p-3 rounded border border-red-800/30">
                      <h4 className="text-red-400 text-sm font-semibold mb-1">✗ Плохой пример</h4>
                      <p className="text-slate-300 text-sm">Банковское приложение использует сложную финансовую терминологию, непонятную обычным пользователям.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
              <div className="flex items-start">
                <div className="text-indigo-400 mr-3 text-2xl font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400 mb-3">Простота и удобство</h3>
                  <p className="text-slate-300 mb-3">
                    Минимизация когнитивной нагрузки на пользователя, создание интуитивно понятных интерфейсов, которые не требуют обучения.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-green-900/20 p-3 rounded border border-green-800/30">
                      <h4 className="text-green-400 text-sm font-semibold mb-1">✓ Хороший пример</h4>
                      <p className="text-slate-300 text-sm">Google поисковая строка с автозаполнением и исправлением опечаток - минимум действий для получения результата.</p>
                    </div>
                    <div className="bg-red-900/20 p-3 rounded border border-red-800/30">
                      <h4 className="text-red-400 text-sm font-semibold mb-1">✗ Плохой пример</h4>
                      <p className="text-slate-300 text-sm">Сайт с перегруженным меню из 20+ пунктов, где пользователь не может быстро найти нужный раздел.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
              <div className="flex items-start">
                <div className="text-indigo-400 mr-3 text-2xl font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400 mb-3">Последовательность</h3>
                  <p className="text-slate-300 mb-3">
                    Единообразие интерфейсов и логики взаимодействия в рамках всего продукта, использование знакомых паттернов и стандартов.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-green-900/20 p-3 rounded border border-green-800/30">
                      <h4 className="text-green-400 text-sm font-semibold mb-1">✓ Хороший пример</h4>
                      <p className="text-slate-300 text-sm">Приложение, где все кнопки подтверждения действий имеют одинаковый цвет и расположение в интерфейсе.</p>
                    </div>
                    <div className="bg-red-900/20 p-3 rounded border border-red-800/30">
                      <h4 className="text-red-400 text-sm font-semibold mb-1">✗ Плохой пример</h4>
                      <p className="text-slate-300 text-sm">Сайт, где в разных разделах используются разные способы навигации и разное расположение элементов управления.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
              <div className="flex items-start">
                <div className="text-indigo-400 mr-3 text-2xl font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400 mb-3">Обратная связь</h3>
                  <p className="text-slate-300 mb-3">
                    Информирование пользователя о результатах его действий, статусе системы и возможных ошибках в понятной и доступной форме.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-green-900/20 p-3 rounded border border-green-800/30">
                      <h4 className="text-green-400 text-sm font-semibold mb-1">✓ Хороший пример</h4>
                      <p className="text-slate-300 text-sm">Анимация загрузки с индикатором прогресса при отправке формы, показывающая, что процесс идет.</p>
                    </div>
                    <div className="bg-red-900/20 p-3 rounded border border-red-800/30">
                      <h4 className="text-red-400 text-sm font-semibold mb-1">✗ Плохой пример</h4>
                      <p className="text-slate-300 text-sm">Неинформативное сообщение об ошибке "Произошла ошибка" без указания причины и способа её исправления.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
              <div className="flex items-start">
                <div className="text-indigo-400 mr-3 text-2xl font-bold flex-shrink-0">5</div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400 mb-3">Доступность</h3>
                  <p className="text-slate-300 mb-3">
                    Создание продуктов, которыми могут пользоваться люди с различными возможностями, включая тех, кто имеет ограниченные возможности.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-green-900/20 p-3 rounded border border-green-800/30">
                      <h4 className="text-green-400 text-sm font-semibold mb-1">✓ Хороший пример</h4>
                      <p className="text-slate-300 text-sm">Веб-сайт с хорошим контрастом текста, поддержкой клавиатурной навигации и альтернативными текстами для изображений.</p>
                    </div>
                    <div className="bg-red-900/20 p-3 rounded border border-red-800/30">
                      <h4 className="text-red-400 text-sm font-semibold mb-1">✗ Плохой пример</h4>
                      <p className="text-slate-300 text-sm">Приложение с мелким нечитаемым текстом на низкоконтрастном фоне, недоступное для людей с нарушениями зрения.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
              <div className="flex items-start">
                <div className="text-indigo-400 mr-3 text-2xl font-bold flex-shrink-0">6</div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-400 mb-3">Контроль пользователя</h3>
                  <p className="text-slate-300 mb-3">
                    Предоставление пользователю ощущения контроля над интерфейсом и возможность отменить или изменить свои действия.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-green-900/20 p-3 rounded border border-green-800/30">
                      <h4 className="text-green-400 text-sm font-semibold mb-1">✓ Хороший пример</h4>
                      <p className="text-slate-300 text-sm">Функция "отменить отправку" в Gmail, дающая пользователям несколько секунд на отмену отправки письма.</p>
                    </div>
                    <div className="bg-red-900/20 p-3 rounded border border-red-800/30">
                      <h4 className="text-red-400 text-sm font-semibold mb-1">✗ Плохой пример</h4>
                      <p className="text-slate-300 text-sm">Автовоспроизведение видео с громким звуком без возможности быстро остановить или приглушить его.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          <div className="bg-indigo-900/30 border border-indigo-800/50 rounded-lg p-5 mb-6">
            <h3 className="text-xl font-semibold text-indigo-300 mb-3">Учет принципов UX в контексте TaskMaster</h3>
            <p className="text-slate-300 mb-4">
              Применив эти принципы к нашему проекту TaskMaster, мы можем значительно улучшить пользовательский опыт:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">•</span>
                <p className="text-slate-300">Упростить процесс создания новых задач, сократив количество обязательных полей</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">•</span>
                <p className="text-slate-300">Обеспечить понятную обратную связь при выполнении или изменении задач</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">•</span>
                <p className="text-slate-300">Создать последовательный интерфейс с едиными паттернами для всего приложения</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">•</span>
                <p className="text-slate-300">Предоставить пользователям контроль, включая возможность отменять действия и настраивать интерфейс</p>
              </li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: "research",
      title: "Методы UX-исследований",
      content: (
        <>
          <p className="text-slate-300 mb-6">
            UX-исследования — это фундамент успешного дизайна. Они позволяют принимать решения на основе реальных данных и потребностей пользователей, а не догадок или личных предпочтений. Различные методы исследований подходят для разных этапов проектирования и различных задач.
          </p>
          
          <GradientSection className="mb-8" colorScheme="blue" withAnimation={true} bordered={true}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-blue-300 mb-4">Качественные исследования</h3>
                <p className="text-slate-300 mb-4">
                  Направлены на глубокое понимание проблем, потребностей и мотиваций пользователей. Отвечают на вопрос "почему?".
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                    <div className="flex items-start">
                      <span className="text-blue-400 mr-3 text-xl">👥</span>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Интервью пользователей</h4>
                        <p className="text-slate-300 text-sm mb-2">Индивидуальные беседы с представителями целевой аудитории для выявления их потребностей, проблем и ожиданий.</p>
                        <div className="bg-blue-950/50 p-2 rounded">
                          <p className="text-blue-300 text-xs">Когда использовать: начальные этапы проектирования, понимание проблемы, оценка идей.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                    <div className="flex items-start">
                      <span className="text-blue-400 mr-3 text-xl">🧪</span>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Юзабилити-тестирование</h4>
                        <p className="text-slate-300 text-sm mb-2">Наблюдение за пользователями, выполняющими задачи с вашим продуктом, для выявления проблем взаимодействия.</p>
                        <div className="bg-blue-950/50 p-2 rounded">
                          <p className="text-blue-300 text-xs">Когда использовать: тестирование прототипов, оценка существующего продукта, сравнение альтернатив.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                    <div className="flex items-start">
                      <span className="text-blue-400 mr-3 text-xl">🔍</span>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Контекстное исследование</h4>
                        <p className="text-slate-300 text-sm mb-2">Изучение пользователей в реальной среде использования продукта, чтобы понять контекст и факторы влияния.</p>
                        <div className="bg-blue-950/50 p-2 rounded">
                          <p className="text-blue-300 text-xs">Когда использовать: понимание реального опыта пользователей, выявление скрытых потребностей.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-blue-300 mb-4">Количественные исследования</h3>
                <p className="text-slate-300 mb-4">
                  Сбор и анализ числовых данных для выявления паттернов и тенденций в поведении пользователей. Отвечают на вопросы "что?" и "сколько?".
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                    <div className="flex items-start">
                      <span className="text-blue-400 mr-3 text-xl">📊</span>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Анализ метрик</h4>
                        <p className="text-slate-300 text-sm mb-2">Сбор и анализ данных о том, как пользователи взаимодействуют с продуктом (время на странице, путь пользователя, конверсии).</p>
                        <div className="bg-blue-950/50 p-2 rounded">
                          <p className="text-blue-300 text-xs">Когда использовать: определение проблемных мест, оценка эффективности изменений, A/B тестирование.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                    <div className="flex items-start">
                      <span className="text-blue-400 mr-3 text-xl">📝</span>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Опросы и анкеты</h4>
                        <p className="text-slate-300 text-sm mb-2">Сбор структурированной информации от большого количества пользователей для выявления общих тенденций и предпочтений.</p>
                        <div className="bg-blue-950/50 p-2 rounded">
                          <p className="text-blue-300 text-xs">Когда использовать: измерение удовлетворенности, приоритизация функций, сегментация аудитории.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                    <div className="flex items-start">
                      <span className="text-blue-400 mr-3 text-xl">🔄</span>
                      <div>
                        <h4 className="text-white font-semibold mb-1">A/B-тестирование</h4>
                        <p className="text-slate-300 text-sm mb-2">Сравнение двух версий интерфейса для определения, какая из них лучше работает по измеряемым метрикам.</p>
                        <div className="bg-blue-950/50 p-2 rounded">
                          <p className="text-blue-300 text-xs">Когда использовать: оптимизация интерфейса, проверка гипотез, улучшение конверсии.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GradientSection>
          
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-5 rounded-lg border border-blue-800/40 mb-8">
            <h3 className="text-xl font-semibold text-blue-300 mb-3">Применение UX-исследований на разных этапах</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                <h4 className="text-indigo-400 font-semibold mb-2">
                  <span className="inline-block w-8 h-8 rounded-full bg-indigo-700 text-white text-center leading-8 mr-2">1</span>
                  Стадия исследования
                </h4>
                <ul className="text-slate-300 space-y-2 text-sm pl-10">
                  <li className="list-disc">Интервью пользователей</li>
                  <li className="list-disc">Анализ конкурентов</li>
                  <li className="list-disc">Опросы и анкеты</li>
                  <li className="list-disc">Создание персон</li>
                </ul>
              </div>
              
              <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                <h4 className="text-indigo-400 font-semibold mb-2">
                  <span className="inline-block w-8 h-8 rounded-full bg-indigo-700 text-white text-center leading-8 mr-2">2</span>
                  Стадия проектирования
                </h4>
                <ul className="text-slate-300 space-y-2 text-sm pl-10">
                  <li className="list-disc">Юзабилити-тестирование</li>
                  <li className="list-disc">Сортировка карточек</li>
                  <li className="list-disc">Интерактивные прототипы</li>
                  <li className="list-disc">Экспертная оценка</li>
                </ul>
              </div>
              
              <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                <h4 className="text-indigo-400 font-semibold mb-2">
                  <span className="inline-block w-8 h-8 rounded-full bg-indigo-700 text-white text-center leading-8 mr-2">3</span>
                  Стадия оптимизации
                </h4>
                <ul className="text-slate-300 space-y-2 text-sm pl-10">
                  <li className="list-disc">A/B-тестирование</li>
                  <li className="list-disc">Анализ метрик</li>
                  <li className="list-disc">Исследование удовлетворенности</li>
                  <li className="list-disc">Тепловые карты</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Выбор правильного метода исследования</h3>
          <p className="text-slate-300 mb-4">
            Каждый метод исследования имеет свои сильные стороны и ограничения. Выбор метода зависит от:
          </p>
          <ul className="list-disc list-inside text-slate-300 mb-6 space-y-1">
            <li>Этапа проектирования (исследование, проектирование, оценка)</li>
            <li>Цели исследования (понимание проблемы, тестирование решения, оптимизация)</li>
            <li>Имеющихся ресурсов (время, бюджет, доступ к пользователям)</li>
            <li>Типа необходимых данных (качественные или количественные)</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-blue-400 mb-4">Практическое упражнение: выбор метода исследования</h3>
          <p className="text-slate-300 mb-4">
            Давайте попрактикуемся в выборе правильного метода UX-исследования для различных ситуаций:
          </p>
          
          <UXMethodSelector />
        </>
      )
    },
    {
      id: "metrics",
      title: "Ключевые метрики UX",
      content: (
        <>
          <p className="text-slate-300 mb-6">
            Измерение пользовательского опыта - важный аспект UX-дизайна. Метрики помогают объективно оценить качество взаимодействия пользователей с продуктом и принимать обоснованные решения по его улучшению. Различные метрики позволяют измерять разные аспекты UX.
          </p>
          
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-6 rounded-lg border border-indigo-800/50">
              <h3 className="text-xl font-semibold text-indigo-300 mb-4">Категории UX-метрик</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800/30">
                  <h4 className="text-indigo-400 font-semibold mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Эффективность
                  </h4>
                  <p className="text-slate-300 text-sm">Насколько успешно пользователи достигают своих целей?</p>
                </div>
                
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800/30">
                  <h4 className="text-indigo-400 font-semibold mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Результативность
                  </h4>
                  <p className="text-slate-300 text-sm">Сколько времени и усилий требуется для выполнения задач?</p>
                </div>
                
                <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800/30">
                  <h4 className="text-indigo-400 font-semibold mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Удовлетворенность
                  </h4>
                  <p className="text-slate-300 text-sm">Насколько пользователи довольны взаимодействием с продуктом?</p>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-indigo-400 mb-4">Бизнес-метрики, связанные с UX</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MetricExample
              title="Конверсия"
              icon="📈"
              description="Процент пользователей, совершающих целевое действие. Показывает эффективность пользовательского пути и влияние UX на бизнес-результаты."
              examples={[
                "Процент посетителей, завершивших покупку в интернет-магазине (увеличился с 2.3% до 3.8% после редизайна корзины)",
                "Процент пользователей, создавших аккаунт после посещения целевой страницы (вырос на 25% после упрощения формы регистрации)",
                "Доля пользователей, подписавшихся на рассылку (удвоилась после введения прогрессивной формы)"
              ]}
            />
            
            <MetricExample
              title="Вовлеченность"
              icon="⏱️"
              description="Показатели активности и интереса пользователей. Демонстрируют, насколько продукт удерживает внимание и мотивирует к взаимодействию."
              examples={[
                "Среднее время на сайте выросло с 2:30 до 4:15 минут после обновления дизайна главной страницы",
                "Количество просматриваемых страниц за сессию увеличилось на 38% после улучшения навигации",
                "Частота возврата пользователей в приложение повысилась на 22% после добавления системы достижений"
              ]}
            />
            
            <MetricExample
              title="Удержание"
              icon="🔄"
              description="Доля пользователей, продолжающих использовать продукт через определенное время. Отражает долгосрочную ценность и удовлетворенность."
              examples={[
                "30-дневное удержание пользователей подписки выросло с 45% до 67% после редизайна UI",
                "Отток пользователей снизился на 18% после введения онбординга для новых пользователей",
                "Годовой показатель продления подписки вырос на 25% после улучшения пользовательского опыта"
              ]}
            />
            
            <MetricExample
              title="Эффективность поддержки"
              icon="💬"
              description="Показатели, связанные с обращениями в поддержку. Хороший UX снижает количество проблем и упрощает их самостоятельное решение."
              examples={[
                "Количество обращений в поддержку снизилось на 35% после улучшения раздела FAQ и инструкций",
                "Время разрешения обращений сократилось на 40% после внедрения контекстных подсказок в интерфейсе",
                "Доля пользователей, решивших проблему самостоятельно через базу знаний, выросла с 25% до 58%"
              ]}
            />
          </div>
          
          <h3 className="text-xl font-semibold text-indigo-400 mb-4">Специализированные UX-метрики</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <MetricExample
              title="Показатели удовлетворенности"
              icon="😊"
              description="Стандартизированные метрики, измеряющие субъективную оценку пользователями вашего продукта."
              examples={[
                "Net Promoter Score (NPS) - вырос с 23 до 42 баллов после обновления дизайна личного кабинета",
                "System Usability Scale (SUS) - повысился с 68 до 82 после упрощения процесса оплаты",
                "Customer Satisfaction Score (CSAT) - увеличился с 3.7/5 до 4.5/5 после улучшения мобильной версии"
              ]}
            />
            
            <MetricExample
              title="Метрики юзабилити"
              icon="🎯"
              description="Показатели, измеряющие эффективность и результативность взаимодействия с интерфейсом."
              examples={[
                "Показатель успешности задач вырос с 75% до 94% после редизайна навигации",
                "Среднее время выполнения задачи сократилось с 48 до 23 секунд после оптимизации формы поиска",
                "Количество ошибок при заполнении форм снизилось на 62% после добавления контекстной валидации"
              ]}
            />
            
            <MetricExample
              title="Показатели взаимодействия"
              icon="👆"
              description="Детальные метрики о том, как пользователи взаимодействуют с конкретными элементами интерфейса."
              examples={[
                "Коэффициент использования функции поиска вырос на 78% после добавления автоподсказок",
                "Количество скроллинга снизилось на 35% после реорганизации страницы товара",
                "Время принятия решения сократилось на 42% после редизайна страницы сравнения тарифов"
              ]}
            />
            
            <MetricExample
              title="Показатели доступности"
              icon="♿"
              description="Метрики, оценивающие насколько продукт удобен для пользователей с различными ограничениями."
              examples={[
                "Соответствие стандартам WCAG повысилось с уровня A до AA после обновления цветовой схемы и контрастности",
                "Время выполнения задач пользователями, использующими программы чтения с экрана, сократилось на 60%",
                "Количество успешно заполненных форм пользователями с моторными нарушениями выросло на 35%"
              ]}
            />
          </div>
          
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-6 rounded-lg border border-indigo-800/50 mb-6">
            <h3 className="text-xl font-semibold text-indigo-300 mb-4">Ключевые принципы работы с UX-метриками</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-white font-medium text-xs">1</span>
                </div>
                <p className="text-slate-300"><span className="text-indigo-400 font-medium">Выбирайте релевантные метрики</span> — измеряйте то, что действительно важно для вашего продукта и бизнес-целей.</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-white font-medium text-xs">2</span>
                </div>
                <p className="text-slate-300"><span className="text-indigo-400 font-medium">Сочетайте количественные и качественные данные</span> — цифры показывают «что» происходит, качественные исследования объясняют «почему».</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-white font-medium text-xs">3</span>
                </div>
                <p className="text-slate-300"><span className="text-indigo-400 font-medium">Устанавливайте базовый уровень</span> — всегда измеряйте показатели до внесения изменений, чтобы иметь точку отсчета.</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-white font-medium text-xs">4</span>
                </div>
                <p className="text-slate-300"><span className="text-indigo-400 font-medium">Сегментируйте данные</span> — анализируйте метрики для разных групп пользователей, платформ, устройств и сценариев использования.</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <span className="text-white font-medium text-xs">5</span>
                </div>
                <p className="text-slate-300"><span className="text-indigo-400 font-medium">Отслеживайте динамику</span> — важны не только абсолютные значения, но и тенденции изменения метрик со временем.</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
            <h3 className="text-lg font-semibold text-indigo-400 mb-3">Применение UX-метрик в TaskMaster</h3>
            <p className="text-slate-300 mb-4">
              Для оценки эффективности улучшений TaskMaster мы можем использовать следующие ключевые метрики:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/60 p-3 rounded border border-slate-600/60">
                <h4 className="text-indigo-300 font-medium mb-2">Эффективность создания задач</h4>
                <p className="text-slate-400 text-sm">Процент успешно созданных задач относительно начатых процессов создания</p>
              </div>
              <div className="bg-slate-700/60 p-3 rounded border border-slate-600/60">
                <h4 className="text-indigo-300 font-medium mb-2">Время выполнения ключевых операций</h4>
                <p className="text-slate-400 text-sm">Среднее время на создание задачи, изменение статуса, добавление комментария</p>
              </div>
              <div className="bg-slate-700/60 p-3 rounded border border-slate-600/60">
                <h4 className="text-indigo-300 font-medium mb-2">Показатель удовлетворенности</h4>
                <p className="text-slate-400 text-sm">SUS-оценка интерфейса до и после внесения UX-улучшений</p>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      id: "conclusion",
      title: "Применение UX в нашем проекте",
      content: (
        <>
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-700/50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-purple-300 mb-4">UX-анализ проекта TaskMaster</h3>
            <p className="text-slate-300 mb-6">
              TaskMaster имеет несколько критических проблем с пользовательским опытом, которые могут быть решены 
              путем применения принципов UX-дизайна и методов исследования, которые мы изучили. Рассмотрим 
              основные области для улучшения и возможные решения.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
                <h4 className="text-lg font-semibold text-purple-400 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Исследование пользователей
                </h4>
                
                <div className="bg-red-900/20 p-4 rounded border border-red-800/30 mb-4">
                  <h5 className="text-red-400 text-sm font-semibold mb-2">Выявленные проблемы:</h5>
                  <ul className="space-y-2 pl-5">
                    <li className="list-disc text-slate-300 text-sm">Высокий процент отказа (40%) при создании новых задач</li>
                    <li className="list-disc text-slate-300 text-sm">Большое количество обращений в поддержку по базовым вопросам</li>
                    <li className="list-disc text-slate-300 text-sm">Низкая вовлеченность новых пользователей (30% не возвращаются после регистрации)</li>
                  </ul>
                </div>
                
                <div className="bg-green-900/20 p-4 rounded border border-green-800/30">
                  <h5 className="text-green-400 text-sm font-semibold mb-2">Предлагаемые решения:</h5>
                  <ul className="space-y-2 pl-5">
                    <li className="list-disc text-slate-300 text-sm">Провести интервью с пользователями для понимания их целей и болевых точек</li>
                    <li className="list-disc text-slate-300 text-sm">Создать персонажи и карты пользовательских путей</li>
                    <li className="list-disc text-slate-300 text-sm">Анализировать обращения в поддержку для выявления паттернов проблем</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
                <h4 className="text-lg font-semibold text-purple-400 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Интерфейс и взаимодействие
                </h4>
                
                <div className="bg-red-900/20 p-4 rounded border border-red-800/30 mb-4">
                  <h5 className="text-red-400 text-sm font-semibold mb-2">Выявленные проблемы:</h5>
                  <ul className="space-y-2 pl-5">
                    <li className="list-disc text-slate-300 text-sm">Сложная навигация со слишком многими уровнями вложенности</li>
                    <li className="list-disc text-slate-300 text-sm">Перегруженная форма создания задачи с множеством необязательных полей</li>
                    <li className="list-disc text-slate-300 text-sm">Непонятные иконки и отсутствие подсказок во многих элементах управления</li>
                  </ul>
                </div>
                
                <div className="bg-green-900/20 p-4 rounded border border-green-800/30">
                  <h5 className="text-green-400 text-sm font-semibold mb-2">Предлагаемые решения:</h5>
                  <ul className="space-y-2 pl-5">
                    <li className="list-disc text-slate-300 text-sm">Упростить структуру навигации и сократить количество кликов для достижения цели</li>
                    <li className="list-disc text-slate-300 text-sm">Редизайн формы создания задачи с приоритизацией основных полей</li>
                    <li className="list-disc text-slate-300 text-sm">Добавить понятные подсказки и обучающие элементы для новых пользователей</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
                <h4 className="text-lg font-semibold text-purple-400 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Процессы и рабочие потоки
                </h4>
                
                <div className="bg-red-900/20 p-4 rounded border border-red-800/30 mb-4">
                  <h5 className="text-red-400 text-sm font-semibold mb-2">Выявленные проблемы:</h5>
                  <ul className="space-y-2 pl-5">
                    <li className="list-disc text-slate-300 text-sm">Отсутствие интеграции между разными компонентами системы</li>
                    <li className="list-disc text-slate-300 text-sm">Недостаточная обратная связь при выполнении действий</li>
                    <li className="list-disc text-slate-300 text-sm">Сложный процесс отчетности и аналитики по задачам</li>
                  </ul>
                </div>
                
                <div className="bg-green-900/20 p-4 rounded border border-green-800/30">
                  <h5 className="text-green-400 text-sm font-semibold mb-2">Предлагаемые решения:</h5>
                  <ul className="space-y-2 pl-5">
                    <li className="list-disc text-slate-300 text-sm">Разработать интегрированные рабочие потоки между разделами системы</li>
                    <li className="list-disc text-slate-300 text-sm">Улучшить систему уведомлений и подтверждений при выполнении действий</li>
                    <li className="list-disc text-slate-300 text-sm">Создать простой и гибкий инструмент генерации отчетов</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
                <h4 className="text-lg font-semibold text-purple-400 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Метрики и измерения
                </h4>
                
                <div className="bg-red-900/20 p-4 rounded border border-red-800/30 mb-4">
                  <h5 className="text-red-400 text-sm font-semibold mb-2">Выявленные проблемы:</h5>
                  <ul className="space-y-2 pl-5">
                    <li className="list-disc text-slate-300 text-sm">Отсутствие ключевых показателей эффективности для оценки пользовательского опыта</li>
                    <li className="list-disc text-slate-300 text-sm">Нет системы для сбора обратной связи от пользователей</li>
                    <li className="list-disc text-slate-300 text-sm">Невозможность отследить, как изменения влияют на пользовательский опыт</li>
                  </ul>
                </div>
                
                <div className="bg-green-900/20 p-4 rounded border border-green-800/30">
                  <h5 className="text-green-400 text-sm font-semibold mb-2">Предлагаемые решения:</h5>
                  <ul className="space-y-2 pl-5">
                    <li className="list-disc text-slate-300 text-sm">Внедрить аналитическую систему для отслеживания ключевых UX-метрик</li>
                    <li className="list-disc text-slate-300 text-sm">Создать механизм сбора отзывов и предложений от пользователей</li>
                    <li className="list-disc text-slate-300 text-sm">Регулярно проводить A/B-тестирование изменений интерфейса</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-purple-300 mb-4">План улучшения UX в TaskMaster</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-b from-purple-900/30 to-purple-950/50 p-4 rounded-lg border border-purple-800/30">
                <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center mb-3">
                  <span className="text-xl font-semibold text-white">1</span>
                </div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Исследование</h4>
                <ul className="space-y-1 text-slate-300 text-sm pl-4">
                  <li className="list-disc">Интервью с 10 активными пользователями</li>
                  <li className="list-disc">Анализ данных аналитики</li>
                  <li className="list-disc">Аудит конкурентов</li>
                  <li className="list-disc">Создание персонажей</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-b from-purple-900/30 to-purple-950/50 p-4 rounded-lg border border-purple-800/30">
                <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center mb-3">
                  <span className="text-xl font-semibold text-white">2</span>
                </div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Проектирование</h4>
                <ul className="space-y-1 text-slate-300 text-sm pl-4">
                  <li className="list-disc">Переработка структуры навигации</li>
                  <li className="list-disc">Упрощение форм и процессов</li>
                  <li className="list-disc">Создание прототипа</li>
                  <li className="list-disc">Юзабилити-тестирование</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-b from-purple-900/30 to-purple-950/50 p-4 rounded-lg border border-purple-800/30">
                <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center mb-3">
                  <span className="text-xl font-semibold text-white">3</span>
                </div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Внедрение и оценка</h4>
                <ul className="space-y-1 text-slate-300 text-sm pl-4">
                  <li className="list-disc">Поэтапное внедрение изменений</li>
                  <li className="list-disc">A/B-тестирование компонентов</li>
                  <li className="list-disc">Отслеживание ключевых метрик</li>
                  <li className="list-disc">Дальнейшая оптимизация</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700 mb-8">
            <h3 className="text-lg font-semibold text-indigo-400 mb-3">Кейс-стади: Улучшение UX в аналогичном проекте</h3>
            <div className="flex items-start">
              <div className="hidden md:block w-24 h-24 bg-slate-700/60 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-indigo-400 font-semibold mb-2">Trello: От сложного к простому</h4>
                <p className="text-slate-300 mb-3 text-sm">
                  Trello — сервис управления задачами, который стал успешным благодаря тщательной проработке пользовательского опыта.
                  В начале разработки команда столкнулась с проблемами, схожими с TaskMaster.
                </p>
                
                <div className="bg-slate-700/40 p-3 rounded mb-3">
                  <h5 className="text-indigo-300 text-sm font-semibold mb-2">Ключевые UX-улучшения Trello:</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-700/60 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">1</span>
                      </div>
                      <p className="text-slate-300 text-sm">Интуитивный Drag-and-Drop интерфейс, понятный без обучения</p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-700/60 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">2</span>
                      </div>
                      <p className="text-slate-300 text-sm">Визуальная организация задач с помощью карточек и досок</p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-700/60 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">3</span>
                      </div>
                      <p className="text-slate-300 text-sm">Мгновенная визуальная обратная связь при любых действиях</p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-700/60 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">4</span>
                      </div>
                      <p className="text-slate-300 text-sm">Постепенное раскрытие функциональности (от простого к сложному)</p>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-indigo-900/30 p-3 rounded border border-indigo-800/30">
                  <h5 className="text-indigo-400 text-sm font-semibold mb-1">Результаты:</h5>
                  <ul className="space-y-1 pl-5">
                    <li className="list-disc text-slate-300 text-sm">Увеличение удержания пользователей на 35%</li>
                    <li className="list-disc text-slate-300 text-sm">Сокращение времени на создание задачи с 45 до 12 секунд</li>
                    <li className="list-disc text-slate-300 text-sm">Снижение количества обращений в поддержку на 60%</li>
                    <li className="list-disc text-slate-300 text-sm">Более 50 миллионов пользователей благодаря интуитивному UX</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-slate-300 mb-6">
            Применение принципов UX-дизайна и методов UX-исследования к TaskMaster может значительно улучшить 
            пользовательский опыт, повысить эффективность работы с приложением и увеличить ключевые бизнес-метрики. 
            UX-анализ — это непрерывный процесс, который должен стать неотъемлемой частью разработки продукта.
          </p>
          
          <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-700/30">
            <p className="text-indigo-300 text-center italic">
              "Хороший дизайн — это не только то, как что-то выглядит. Это то, как оно работает." — Стив Джобс
            </p>
          </div>
        </>
      )
    }
  ];

  // Создаем массив шагов для использования с StepNavigation
  const stepsContent = stepsData.map((step, index) => (
    <div key={step.id} className="step-container">
      <h2 className="text-2xl font-bold mb-4 text-indigo-400">
        {index + 1}. {step.title}
      </h2>
      
      <div className="border-l-4 border-indigo-500 pl-6 py-2 relative">
        <div className="min-h-[350px] pb-4">
          {step.content}
        </div>
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
        <h1 className="text-3xl font-bold text-white mb-4">Теория UX-анализа</h1>
        <p className="text-slate-400 italic max-w-3xl">
          Изучите основы UX-анализа и научитесь применять их для улучшения пользовательского опыта в приложениях.
        </p>
      </motion.div>

      <StepNavigation 
        steps={stepsContent}
        onComplete={onComplete}
        completeButtonText="Начать практику"
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        persistStepKey="ux_analysis_theory_step"
      />
    </div>
  );
};

export default UXAnalysisTheory; 