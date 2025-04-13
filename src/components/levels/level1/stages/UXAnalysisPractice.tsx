import React, { useState, useEffect } from 'react';
import { styles } from '../common/styles';
import uxAnalysisData from '../data/uxAnalysisData';
import MentorTip from '../../shared/feedback/MentorTip';
import { motion } from 'framer-motion';
import StepNavigation from '../../shared/navigation/StepNavigation';

// Компонент для градиентной секции
const GradientSection = ({
  title,
  subtitle,
  children,
  withAnimation = false,
  colorScheme = 'indigo',
  bordered = false,
  rounded = false
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  withAnimation?: boolean;
  colorScheme?: 'indigo' | 'amber' | 'emerald';
  bordered?: boolean;
  rounded?: boolean;
}) => {
  const baseStyles = "p-6 mb-8";
  
  const colorStyles = {
    indigo: "bg-gradient-to-br from-indigo-900/40 to-indigo-950/60",
    amber: "bg-gradient-to-br from-amber-900/40 to-amber-950/60",
    emerald: "bg-gradient-to-br from-emerald-900/40 to-emerald-950/60"
  };
  
  const borderStyles = {
    indigo: "border border-indigo-700/50",
    amber: "border border-amber-700/50",
    emerald: "border border-emerald-700/50"
  };
  
  return (
    <motion.div
      className={`
        ${baseStyles}
        ${colorStyles[colorScheme]}
        ${bordered ? borderStyles[colorScheme] : ''}
        ${rounded ? 'rounded-lg' : ''}
      `}
      initial={withAnimation ? { opacity: 0, y: 20 } : undefined}
      animate={withAnimation ? { opacity: 1, y: 0 } : undefined}
      transition={withAnimation ? { duration: 0.5 } : undefined}
    >
      <div className="mb-4">
        <h2 className={`text-2xl font-bold ${colorScheme === 'indigo' ? 'text-indigo-300' : colorScheme === 'amber' ? 'text-amber-300' : 'text-emerald-300'}`}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
};

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

interface UserSegment {
  id: string;
  name: string;
  description: string;
  painPoints: string[];
  insights: string[];
}

interface UserJourneyStep {
  id: string;
  name: string;
  description: string;
  painPoints: string[];
}

type UXAnalysisPracticeProps = {
  onComplete: () => void;
};

const UXAnalysisPractice: React.FC<UXAnalysisPracticeProps> = ({ onComplete }) => {
  const [segmentNotes, setSegmentNotes] = useState<string>('');
  const [journeyNotes, setJourneyNotes] = useState<string>('');
  const [improvementPlan, setImprovementPlan] = useState<{[key: string]: boolean}>({});
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Сохраняем и восстанавливаем состояние в localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('ux_analysis_practice_state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setSegmentNotes(state.segmentNotes || '');
        setJourneyNotes(state.journeyNotes || '');
        setImprovementPlan(state.improvementPlan || {});
        setSelectedProblems(state.selectedProblems || []);
        setSelectedSolution(state.selectedSolution || '');
        setActiveSection(state.activeSection || null);
      } catch (e) {
        console.error('Ошибка при восстановлении состояния:', e);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('ux_analysis_practice_state', JSON.stringify({
      segmentNotes,
      journeyNotes,
      improvementPlan,
      selectedProblems,
      selectedSolution,
      activeSection
    }));
  }, [segmentNotes, journeyNotes, improvementPlan, selectedProblems, selectedSolution, activeSection]);
  
  const [userSegments, setUserSegments] = useState<UserSegment[]>([
    {
      id: "new_users",
      name: "Новые пользователи",
      description: "Пользователи, которые зарегистрировались в TaskMaster недавно",
      painPoints: [
        "Сложность в понимании интерфейса",
        "Трудности с созданием первых задач",
        "Неуверенность в правильности заполнения полей"
      ],
      insights: [
        "Нуждаются в подсказках и обучении",
        "Предпочитают простые формы с минимумом полей",
        "Ценят быстрое достижение результата"
      ]
    },
    {
      id: "power_users",
      name: "Опытные пользователи",
      description: "Пользователи, которые используют TaskMaster ежедневно",
      painPoints: [
        "Недостаточно гибкие настройки",
        "Ограниченные возможности для продвинутого использования",
        "Потеря времени на рутинные действия"
      ],
      insights: [
        "Ценят горячие клавиши и быстрый доступ",
        "Готовы к более сложному интерфейсу ради функциональности",
        "Предпочитают настраиваемые шаблоны"
      ]
    },
    {
      id: "mobile_users",
      name: "Мобильные пользователи",
      description: "Пользователи, которые в основном работают с мобильной версией",
      painPoints: [
        "Неоптимизированный интерфейс для маленьких экранов",
        "Сложность ввода на мобильной клавиатуре",
        "Длительное время загрузки"
      ],
      insights: [
        "Используют приложение в дороге или между задачами",
        "Ценят минимализм и быстродействие",
        "Предпочитают визуальные элементы текстовым"
      ]
    }
  ]);
  
  const [userJourney, setUserJourney] = useState<UserJourneyStep[]>([
    {
      id: "discover",
      name: "Обнаружение",
      description: "Пользователь решает создать новую задачу",
      painPoints: [
        "Кнопка 'Создать задачу' не всегда заметна",
        "Пользователь не уверен, какой тип задачи выбрать"
      ]
    },
    {
      id: "basic_info",
      name: "Основная информация",
      description: "Заполнение обязательных полей задачи",
      painPoints: [
        "Слишком много обязательных полей",
        "Неясные требования к заполнению",
        "Сложные поля без подсказок"
      ]
    },
    {
      id: "details",
      name: "Детализация",
      description: "Добавление дополнительной информации",
      painPoints: [
        "Неочевидная необходимость дополнительных полей",
        "Избыточные поля для простых задач",
        "Сложная навигация между группами полей"
      ]
    },
    {
      id: "review",
      name: "Проверка",
      description: "Финальный просмотр и создание задачи",
      painPoints: [
        "Нет понятного предпросмотра задачи",
        "Слишком долгое время сохранения на мобильных устройствах",
        "Сложно вернуться к редактированию предыдущих шагов"
      ]
    }
  ]);
  
  const handleProblemSelect = (problemId: string) => {
    if (selectedProblems.includes(problemId)) {
      setSelectedProblems(selectedProblems.filter(id => id !== problemId));
    } else {
      setSelectedProblems([...selectedProblems, problemId]);
    }
  };
  
  const handleSolutionSelect = (solutionId: string) => {
    setSelectedSolution(solutionId);
  };
  
  const handleImprovementToggle = (key: string) => {
    setImprovementPlan(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Функция для плавного скролла к разделу
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Определяем содержимое шагов
  const stepsContent = [
    // Шаг 1: Введение
    <div key="introduction">
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-4">UX-анализ: практика</h1>
        <p className="text-slate-400 italic max-w-3xl">
          В этом практическом задании вы будете применять принципы UX-анализа для улучшения процесса создания задачи в приложении TaskMaster.
        </p>
      </motion.div>
      
      <GradientSection
        title="Практическое задание по UX-анализу"
        colorScheme="indigo"
        bordered
        rounded
        withAnimation
      >
        <div className="text-slate-300 mb-6">
          <p className="mb-4">
            В этом практическом задании вы будете применять принципы UX-анализа для улучшения процесса создания задачи в приложении TaskMaster.
            Вам предстоит проанализировать пользовательские сегменты и путь пользователя, выявить проблемы и предложить решения.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-indigo-900/30 p-4 rounded-lg">
              <h3 className="text-indigo-400 font-semibold mb-2">Анализ сегментов пользователей</h3>
              <p className="text-slate-300">
                Изучите различные группы пользователей, их потребности и проблемы, с которыми они сталкиваются
                при создании задач в TaskMaster.
              </p>
            </div>
            
            <div className="bg-indigo-900/30 p-4 rounded-lg">
              <h3 className="text-indigo-400 font-semibold mb-2">Анализ пути пользователя</h3>
              <p className="text-slate-300">
                Исследуйте каждый шаг пользователя при создании задачи, выявите проблемные места
                и предложите улучшения для оптимизации процесса.
              </p>
            </div>
          </div>
        </div>
        
        <MentorTip
          tip="В этом задании важно не только выявить проблемы, но и предложить конкретные решения, основанные на принципах UX-дизайна, которые вы изучили в теоретической части."
          position="bottom-right"
          avatar="/characters/avatar_mentor.png"
          name="Ментор"
        />
      </GradientSection>
    </div>,
    
    // Шаг 2: Анализ сегментов пользователей
    <div key="userSegments">
      <GradientSection
        title="Анализ пользовательских сегментов"
        subtitle="Изучите различные группы пользователей и их потребности"
        colorScheme="indigo"
        bordered
        rounded
        withAnimation
      >
        <p className="text-slate-300 mb-4">
          Изучите сегменты пользователей TaskMaster и их особенности:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {userSegments.map(segment => (
            <InfoCard
              key={segment.id}
              title={segment.name}
              description={
                <div>
                  <p className="mb-2">{segment.description}</p>
                  <h4 className="font-semibold text-indigo-300 mt-3 mb-1">Проблемы:</h4>
                  <ul className="list-disc list-inside text-sm">
                    {segment.painPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                  <h4 className="font-semibold text-indigo-300 mt-3 mb-1">Инсайты:</h4>
                  <ul className="list-disc list-inside text-sm">
                    {segment.insights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
              }
              variant="highlighted"
            />
          ))}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Ваши заметки по сегментам:</h3>
          <textarea
            className="w-full bg-slate-800 text-white p-4 rounded border border-slate-600 min-h-32"
            placeholder="Запишите ваши наблюдения о пользовательских сегментах и их потребностях..."
            value={segmentNotes}
            onChange={(e) => setSegmentNotes(e.target.value)}
          />
        </div>
        
        <MentorTip
          tip="Анализ пользовательских сегментов помогает лучше понять разнообразие потребностей. При разработке UX важно учитывать особенности каждого сегмента, но при этом не перегружать интерфейс."
          position="right-bottom"
          avatar="/characters/avatar_mentor.png"
          name="Ментор"
        />
      </GradientSection>
    </div>,
    
    // Шаг 3: Анализ пути пользователя
    <div key="userJourney">
      <GradientSection
        title="Исследуйте каждый шаг процесса создания задачи"
        subtitle="Проанализируйте каждый этап процесса создания задачи и выделите проблемные места,
        которые мешают пользователям эффективно работать с TaskMaster."
        colorScheme="indigo"
        bordered
        rounded
        withAnimation
      >
        <p className="text-slate-300 mb-4">
          Рассмотрите каждый этап создания задачи в TaskMaster:
        </p>
        
        <div className="space-y-4 mb-6">
          {userJourney.map((step, index) => (
            <div key={step.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">{index + 1}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-white">{step.name}</h3>
                  <p className="text-slate-300 mb-3">{step.description}</p>
                  
                  <h4 className="text-indigo-400 font-semibold mb-2">Болевые точки:</h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {step.painPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                  
                  <div className="mt-4">
                    <h4 className="text-indigo-400 font-semibold mb-2">Возможные улучшения:</h4>
                    <div className="space-y-2">
                      {[
                        { id: `${step.id}_1`, label: "Упростить интерфейс" },
                        { id: `${step.id}_2`, label: "Добавить подсказки" },
                        { id: `${step.id}_3`, label: "Оптимизировать для мобильных" }
                      ].map(improvement => (
                        <label key={improvement.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={improvementPlan[improvement.id] || false}
                            onChange={() => handleImprovementToggle(improvement.id)}
                            className="rounded border-slate-500 text-indigo-500 focus:ring-indigo-500"
                          />
                          <span className="text-slate-300">{improvement.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Ваши идеи по улучшению:</h3>
          <textarea
            className="w-full bg-slate-800 text-white p-4 rounded border border-slate-600 min-h-32"
            placeholder="Запишите ваши идеи по улучшению пользовательского пути..."
            value={journeyNotes}
            onChange={(e) => setJourneyNotes(e.target.value)}
          />
        </div>
        
        <MentorTip
          tip="При анализе пути пользователя важно выявить наиболее проблемные этапы и сфокусироваться на их улучшении. Иногда достаточно небольших изменений, чтобы значительно улучшить общий опыт."
          position="bottom-left"
          avatar="/characters/avatar_mentor.png"
          name="Ментор"
        />
      </GradientSection>
    </div>,
    
    // Шаг 4: Заключение
    <div key="conclusion">
      <GradientSection
        title="Заключение и рекомендации"
        subtitle="Ключевые выводы и рекомендации"
        colorScheme="indigo"
        bordered
        rounded
        withAnimation
      >
        <div className="text-slate-300">
          <p className="mb-4">
            Поздравляем с завершением практического задания по UX-анализу! 
            Вы проанализировали различные аспекты пользовательского опыта и предложили решения 
            для улучшения процесса создания задач в TaskMaster.
          </p>
          
          <div className="mt-6">
            <h3 className="text-indigo-400 font-semibold mb-4">Ключевые выводы:</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Разные сегменты пользователей имеют специфические потребности и сталкиваются с разными проблемами</li>
              <li>Каждый шаг в пути пользователя может быть оптимизирован для повышения эффективности</li>
              <li>Баланс между простотой для новичков и функциональностью для опытных пользователей критически важен</li>
              <li>Мобильный опыт требует особого внимания и адаптации интерфейса</li>
            </ul>
          </div>
        </div>
      </GradientSection>
    </div>
  ];
  
  return (
    <div className={styles.container}>
      <StepNavigation 
        steps={stepsContent}
        onComplete={onComplete}
        showBackButton={true}
        continueButtonText="Далее"
        completeButtonText="Завершить"
        showProgress={true}
        showStepNumbers={true}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        persistStepKey="ux_analysis_practice_step"
      />
    </div>
  );
};

export default UXAnalysisPractice; 