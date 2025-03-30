import React, { useState } from 'react';
import { styles } from '../common/styles';
import uxAnalysisData from '../data/uxAnalysisData';
import MentorTip from '../../../../components/common/MentorTip';
import StepNavigation from '../../../../components/common/StepNavigation';

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
  const [activeTab, setActiveTab] = useState<'userSegments' | 'userJourney'>('userSegments');
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [selectedStep, setSelectedStep] = useState<string>('');
  const [userInsight, setUserInsight] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'excellent' | 'good' | 'average' | 'poor'>('average');
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState<string>('');
  const [improvementPlan, setImprovementPlan] = useState<{[key: string]: boolean}>({});

  const userSegments: UserSegment[] = [
    {
      id: 'new_users',
      name: 'Новые пользователи',
      description: 'Пользователи, которые зарегистрировались в TaskMaster не более 2 недель назад и находятся в процессе освоения продукта. Часто не знакомы с терминологией и ключевыми концепциями управления задачами.',
      painPoints: [
        'Непонятная терминология и обозначения полей',
        'Слишком много обязательных полей без объяснения их назначения',
        'Отсутствие подсказок и руководства по процессу',
        'Непонятно, какие поля обязательны для заполнения',
        'Сложно понять, как правильно настроить приоритеты и теги'
      ],
      insights: [
        'Создание упрощенного режима с минимальным набором полей для новых пользователей',
        'Добавление интерактивных подсказок, объясняющих назначение каждого поля',
        'Внедрение пошагового процесса с подробными инструкциями',
        'Визуальное выделение обязательных полей и предоставление примеров заполнения',
        'Предложение готовых шаблонов для типичных задач'
      ]
    },
    {
      id: 'power_users',
      name: 'Опытные пользователи',
      description: 'Пользователи, которые активно используют TaskMaster более 3 месяцев, хорошо знакомы со всеми функциями и создают множество задач ежедневно. Часто работают в команде и используют расширенные функции.',
      painPoints: [
        'Процесс создания задачи занимает слишком много времени',
        'Отсутствие быстрых способов дублирования и модификации существующих задач',
        'Ограниченные возможности для массового создания задач',
        'Недостаточно горячих клавиш для быстрого заполнения полей',
        'Отсутствие возможности сохранения пользовательских шаблонов'
      ],
      insights: [
        'Внедрение клавиатурных сокращений для всех действий в форме',
        'Создание функции дублирования существующих задач с возможностью изменения',
        'Разработка API или интеграции для массового создания задач',
        'Добавление возможности создания и сохранения пользовательских шаблонов',
        'Оптимизация процесса с фокусом на минимизацию количества кликов'
      ]
    },
    {
      id: 'mobile_users',
      name: 'Мобильные пользователи',
      description: 'Пользователи, которые преимущественно работают с TaskMaster через мобильное приложение. Часто создают задачи в дороге или на встречах, предпочитают быстрый и удобный доступ с ограниченным вводом текста.',
      painPoints: [
        'Интерфейс слишком перегружен для маленького экрана',
        'Сложно заполнять большое количество полей на мобильном устройстве',
        'Неудобная работа с календарем и выбором времени',
        'Отсутствие возможности использовать голосовой ввод',
        'Медленная загрузка формы на мобильных устройствах'
      ],
      insights: [
        'Создание специальной мобильной версии с упрощенным интерфейсом',
        'Внедрение голосового ввода для создания задач',
        'Адаптация календаря и полей выбора времени для удобства на мобильных устройствах',
        'Разработка функции быстрого создания задач с минимальным количеством обязательных полей',
        'Оптимизация производительности для быстрой загрузки на мобильных устройствах'
      ]
    }
  ];
  
  const userJourneySteps: UserJourneyStep[] = [
    {
      id: 'step1',
      name: 'Инициация создания задачи',
      description: 'Пользователь нажимает кнопку "Создать задачу" и переходит на первый экран формы. Здесь он должен ввести базовую информацию о задаче.',
      painPoints: [
        'Кнопка "Создать задачу" недостаточно заметна для новых пользователей',
        'Переход к форме занимает слишком много времени (3-4 секунды)',
        'Некоторые пользователи ожидают увидеть упрощенную форму, а не полную',
        'Нет быстрого доступа к созданию задачи из разных разделов приложения'
      ]
    },
    {
      id: 'step2',
      name: 'Заполнение основной информации',
      description: 'Пользователь вводит название, описание и назначает исполнителя задачи. Эти поля являются обязательными для заполнения.',
      painPoints: [
        'Неочевидно, что поле "Описание" является обязательным',
        'Сложный механизм поиска и выбора исполнителя, особенно в больших командах',
        'Отсутствие автосохранения введенных данных при случайном закрытии формы',
        'Нет предложений или шаблонов для типичных названий и описаний задач'
      ]
    },
    {
      id: 'step3',
      name: 'Указание сроков и приоритета',
      description: 'Пользователь устанавливает дедлайн, приоритет и предполагаемую длительность выполнения задачи.',
      painPoints: [
        'Календарь для выбора даты неудобен, особенно на мобильных устройствах',
        'Непонятная система приоритетов (числовые значения вместо понятных обозначений)',
        'Сложно установить повторяющиеся задачи или серии задач',
        'Нет возможности быстро выбрать типичные значения (сегодня, завтра, конец недели)'
      ]
    },
    {
      id: 'step4',
      name: 'Настройка дополнительных параметров',
      description: 'Пользователь может добавить теги, метки, прикрепить файлы и связать задачу с другими задачами или проектами.',
      painPoints: [
        'Слишком много параметров на одном экране, что вызывает когнитивную перегрузку',
        'Неясно, какие параметры действительно важны для эффективного управления задачами',
        'Сложный механизм прикрепления файлов и связывания с другими задачами',
        'Отсутствие подсказок о том, как использовать теги и метки для лучшей организации'
      ]
    },
    {
      id: 'step5',
      name: 'Подтверждение и создание задачи',
      description: 'Пользователь просматривает введенную информацию и подтверждает создание задачи, нажимая кнопку "Создать".',
      painPoints: [
        'Нет четкого обзора всех введенных данных перед созданием',
        'Слишком долгое время обработки после нажатия кнопки "Создать" (до 2 секунд)',
        'Отсутствие подтверждения успешного создания задачи',
        'Нет опции "Создать и создать еще одну" для быстрого создания нескольких задач'
      ]
    }
  ];
  
  const handleTabChange = (tab: 'userSegments' | 'userJourney') => {
    setActiveTab(tab);
    setSelectedSegment('');
    setSelectedStep('');
    setUserInsight('');
    setSubmitted(false);
    setFeedback('');
    setSelectedProblems([]);
    setSelectedSolution(null);
    setUserNotes('');
    setImprovementPlan({});
  };
  
  const handleSegmentSelect = (segmentId: string) => {
    setSelectedSegment(segmentId);
    setUserInsight('');
    setSubmitted(false);
    setFeedback('');
  };
  
  const handleStepSelect = (stepId: string) => {
    setSelectedStep(stepId);
    setUserInsight('');
    setSubmitted(false);
    setFeedback('');
  };
  
  const handleInsightChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInsight(e.target.value);
    setSubmitted(false);
    setFeedback('');
  };
  
  const handleProblemSelect = (problem: string) => {
    setSelectedProblems(prev => {
      if (prev.includes(problem)) {
        return prev.filter(p => p !== problem);
      }
      return [...prev, problem];
    });
  };
  
  const handleSolutionSelect = (solution: string) => {
    setSelectedSolution(solution);
  };
  
  const handleImprovementToggle = (improvement: string) => {
    setImprovementPlan(prev => ({
      ...prev,
      [improvement]: !prev[improvement]
    }));
  };
  
  const analyzeInsight = (insight: string, type: 'segment' | 'step'): { score: number, feedback: string } => {
    let score = 0;
    let feedback = '';
    
    if (insight.length < 50) {
      return { 
        score: 0, 
        feedback: 'Ваше решение слишком короткое. Попробуйте более детально описать ваши идеи и как они решают выявленные проблемы.' 
      };
    }
    
    // Check for specific UX terms and concepts
    const uxTerms = [
      'пользовательский опыт', 'юзабилити', 'интерфейс', 'доступность', 
      'интуитивность', 'взаимодействие', 'удобство', 'простота', 'эффективность'
    ];
    
    uxTerms.forEach(term => {
      if (insight.toLowerCase().includes(term.toLowerCase())) {
        score += 1;
      }
    });
    
    // Check if the insight addresses specific pain points
    const relevantPainPoints = type === 'segment' 
      ? userSegments.find(s => s.id === selectedSegment)?.painPoints || []
      : userJourneySteps.find(s => s.id === selectedStep)?.painPoints || [];
    
    let addressedPainPoints = 0;
    relevantPainPoints.forEach(point => {
      const keywords = point.toLowerCase().split(' ').filter(word => word.length > 4);
      if (keywords.some(keyword => insight.toLowerCase().includes(keyword))) {
        addressedPainPoints += 1;
      }
    });
    
    score += Math.min(3, addressedPainPoints);
    
    // Check for solution specificity
    if (insight.includes('конкретно') || insight.includes('специально') || 
        insight.includes('именно') || insight.includes('точно')) {
      score += 1;
    }
    
    // Check for mentioning metrics or measurements
    if (insight.includes('метрик') || insight.includes('измер') || 
        insight.includes('конверси') || insight.includes('успешност') ||
        insight.includes('эффективност') || insight.includes('время')) {
      score += 1;
    }
    
    // Generate feedback based on score
    if (score >= 7) {
      feedback = 'Отличный анализ! Вы предложили конкретное решение, которое напрямую адресует выявленные проблемы пользователей. Ваш подход демонстрирует глубокое понимание принципов UX и фокус на улучшении пользовательского опыта.';
      return { score, feedback };
    } else if (score >= 4) {
      feedback = 'Хороший анализ. Вы определили некоторые ключевые проблемы и предложили разумные решения. Для улучшения можно было бы более конкретно связать ваши предложения с выявленными болевыми точками пользователей и упомянуть, как вы будете измерять успех изменений.';
      return { score, feedback };
    } else {
      feedback = 'Ваш анализ можно улучшить. Постарайтесь более конкретно обратиться к болевым точкам пользователей и предложить решения, которые напрямую их адресуют. Используйте терминологию UX и объясните, как ваши предложения улучшат пользовательский опыт.';
      return { score, feedback };
    }
  };
  
  const handleSubmit = () => {
    if (userInsight.trim()) {
      const type = activeTab === 'userSegments' ? 'segment' : 'step';
      const result = analyzeInsight(userInsight, type);
      
      setFeedback(result.feedback);
      
      if (result.score >= 7) {
        setFeedbackType('excellent');
      } else if (result.score >= 4) {
        setFeedbackType('good');
      } else {
        setFeedbackType('average');
      }
      
      setSubmitted(true);
    }
  };
  
  const renderUserSegments = () => {
    return (
      <div className={styles.segmentsContainer}>
        <div className={styles.segmentsList}>
          {userSegments.map(segment => (
            <div 
              key={segment.id}
              className={`${styles.segmentCard} ${selectedSegment === segment.id ? styles.segmentCardSelected : ''}`}
              onClick={() => handleSegmentSelect(segment.id)}
            >
              <h3 className={styles.segmentName}>{segment.name}</h3>
              <p className={styles.segmentDescription}>{segment.description}</p>
            </div>
          ))}
        </div>
        
        {selectedSegment && (
          <div className={styles.segmentDetails}>
            <h3 className={styles.detailsTitle}>Болевые точки</h3>
            <ul className={styles.painPointsList}>
              {userSegments.find(s => s.id === selectedSegment)?.painPoints.map((point, index) => (
                <li key={index} className={styles.painPoint}>{point}</li>
              ))}
            </ul>
            
            <h3 className={styles.practiceTitle}>Практическое задание</h3>
            <p className={styles.practiceDescription}>
              На основе анализа болевых точек данного сегмента пользователей, предложите UX-решение, 
              которое могло бы улучшить процесс создания задач именно для этой группы. 
              Будьте конкретны и обоснуйте, как ваше решение адресует выявленные проблемы.
            </p>
            
            <textarea 
              className={styles.textarea}
              placeholder="Опишите ваше UX-решение здесь..."
              value={userInsight}
              onChange={handleInsightChange}
              rows={6}
            />
            
            <button 
              className={styles.btnPrimary}
              onClick={handleSubmit}
              disabled={!userInsight.trim()}
            >
              Получить обратную связь
            </button>
            
            {submitted && feedback && (
              <div className={`${styles.feedbackBox} ${styles[`feedback${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)}`]}`}>
                <h3 className={styles.feedbackTitle}>
                  {feedbackType === 'excellent' ? 'Отлично!' : 
                   feedbackType === 'good' ? 'Хорошо!' : 
                   feedbackType === 'average' ? 'Неплохо!' : 'Можно лучше!'}
                </h3>
                <p className={styles.feedbackText}>{feedback}</p>
                
                {feedbackType === 'excellent' && (
                  <div className={styles.exampleSolution}>
                    <h4 className={styles.exampleTitle}>Пример возможного решения:</h4>
                    <p className={styles.exampleText}>
                      {userSegments.find(s => s.id === selectedSegment)?.insights[0]}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  const renderUserJourney = () => {
    return (
      <div className={styles.journeyContainer}>
        <div className={styles.journeySteps}>
          {userJourneySteps.map((step, index) => (
            <div 
              key={step.id}
              className={`${styles.journeyStep} ${selectedStep === step.id ? styles.journeyStepSelected : ''}`}
              onClick={() => handleStepSelect(step.id)}
            >
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepName}>{step.name}</h3>
                <p className={styles.stepBrief}>{step.description.substring(0, 60)}...</p>
              </div>
            </div>
          ))}
        </div>
        
        {selectedStep && (
          <div className={styles.stepDetails}>
            <h3 className={styles.detailsTitle}>{userJourneySteps.find(s => s.id === selectedStep)?.name}</h3>
            <p className={styles.stepDescription}>
              {userJourneySteps.find(s => s.id === selectedStep)?.description}
            </p>
            
            <h3 className={styles.detailsSubtitle}>Болевые точки на этом этапе</h3>
            <ul className={styles.painPointsList}>
              {userJourneySteps.find(s => s.id === selectedStep)?.painPoints.map((point, index) => (
                <li key={index} className={styles.painPoint}>{point}</li>
              ))}
            </ul>
            
            <h3 className={styles.practiceTitle}>Практическое задание</h3>
            <p className={styles.practiceDescription}>
              Проанализируйте болевые точки на данном этапе пользовательского пути и предложите 
              UX-решение, которое улучшит опыт пользователя. Будьте конкретны и обоснуйте, 
              как ваше решение адресует выявленные проблемы.
            </p>
            
            <textarea 
              className={styles.textarea}
              placeholder="Опишите ваше UX-решение здесь..."
              value={userInsight}
              onChange={handleInsightChange}
              rows={6}
            />
            
            <button 
              className={styles.btnPrimary}
              onClick={handleSubmit}
              disabled={!userInsight.trim()}
            >
              Получить обратную связь
            </button>
            
            {submitted && feedback && (
              <div className={`${styles.feedbackBox} ${styles[`feedback${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)}`]}`}>
                <h3 className={styles.feedbackTitle}>
                  {feedbackType === 'excellent' ? 'Отлично!' : 
                   feedbackType === 'good' ? 'Хорошо!' : 
                   feedbackType === 'average' ? 'Неплохо!' : 'Можно лучше!'}
                </h3>
                <p className={styles.feedbackText}>{feedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  const steps = [
    // Шаг 1: Описание кейса и анализ текущей ситуации
    <div key="case-analysis" className={styles.section}>
      <h1 className={styles.header}>UX-анализ: практика</h1>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
        <h2 className="text-xl font-semibold text-indigo-400 mb-4">Кейс TaskMaster</h2>
        <p className="text-slate-300 mb-4">
          Вы - UX-аналитик в команде TaskMaster. Недавние исследования показали, что пользователи 
          испытывают трудности при создании задач, особенно с мобильных устройств. Ваша задача - 
          провести UX-анализ и предложить решения для улучшения пользовательского опыта.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Текущие метрики:</h3>
            <ul className="list-disc list-inside text-slate-300">
              <li>Время создания задачи: 3 мин 24 сек</li>
              <li>Отказы при создании: 55%</li>
              <li>Конверсия на Desktop: 58%</li>
              <li>Конверсия на мобильных: 32%</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Отзывы пользователей:</h3>
            <ul className="list-disc list-inside text-slate-300">
              <li>"Слишком много обязательных полей"</li>
              <li>"Неудобно использовать на телефоне"</li>
              <li>"Непонятно, какие поля важны"</li>
              <li>"Процесс занимает много времени"</li>
            </ul>
          </div>
        </div>
      </div>

      <MentorTip
        content={
          <div>
            <h3 className="text-lg font-bold mb-2">Ментор</h3>
            <p>Начните с анализа имеющихся данных. Обратите внимание на разницу в метриках между desktop и mobile версиями.</p>
          </div>
        }
        position="right"
      />
    </div>,

    // Шаг 2: Выявление проблем
    <div key="problem-identification" className={styles.section}>
      <h2 className={styles.subheader}>Выявление проблем</h2>
      
      <p className="text-slate-300 mb-4">
        На основе данных и отзывов, выберите ключевые проблемы UX:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          {
            id: "complex_form",
            title: "Сложная форма",
            description: "Много обязательных полей, сложная структура",
            impact: "Высокий процент отказов"
          },
          {
            id: "mobile_ux",
            title: "Проблемы на мобильных",
            description: "Низкая конверсия, неудобный интерфейс",
            impact: "32% конверсия vs 58% на desktop"
          },
          {
            id: "time_consuming",
            title: "Длительный процесс",
            description: "Среднее время создания задачи > 3 минут",
            impact: "Потеря пользователей"
          },
          {
            id: "unclear_fields",
            title: "Непонятные поля",
            description: "Пользователи не понимают назначение полей",
            impact: "Ошибки при заполнении"
          }
        ].map(problem => (
          <div
            key={problem.id}
            className={`bg-slate-800 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedProblems.includes(problem.id)
                ? 'border-indigo-500 bg-indigo-900/30'
                : 'border-slate-700 hover:border-slate-500'
            }`}
            onClick={() => handleProblemSelect(problem.id)}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3>
            <p className="text-slate-300 mb-2">{problem.description}</p>
            <p className="text-indigo-400 text-sm">Влияние: {problem.impact}</p>
          </div>
        ))}
      </div>

      <MentorTip
        content={
          <div>
            <h3 className="text-lg font-bold mb-2">Ментор</h3>
            <p>Приоритизируйте проблемы на основе их влияния на пользователей и бизнес-метрики.</p>
          </div>
        }
        position="left"
      />
    </div>,

    // Шаг 3: Анализ пользовательского пути
    <div key="user-journey" className={styles.section}>
      <h2 className={styles.subheader}>Анализ пользовательского пути</h2>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6">
        <h3 className="text-xl font-semibold text-indigo-400 mb-4">Текущий процесс создания задачи</h3>
        
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Начало",
              action: "Нажатие кнопки 'Новая задача'",
              metrics: "Конверсия: 95%",
              problems: "Кнопка не всегда заметна на мобильных"
            },
            {
              step: 2,
              title: "Основные поля",
              action: "Заполнение обязательных полей",
              metrics: "Конверсия: 70%",
              problems: "Слишком много обязательных полей"
            },
            {
              step: 3,
              title: "Дополнительные поля",
              action: "Заполнение дополнительной информации",
              metrics: "Конверсия: 45%",
              problems: "Пользователи не понимают необходимость полей"
            },
            {
              step: 4,
              title: "Завершение",
              action: "Сохранение задачи",
              metrics: "Конверсия: 85%",
              problems: "Длительное время загрузки на мобильных"
            }
          ].map(step => (
            <div key={step.step} className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">{step.step}</span>
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-semibold">{step.title}</h4>
                <p className="text-slate-300">{step.action}</p>
                <p className="text-indigo-400 text-sm">{step.metrics}</p>
                <p className="text-red-400 text-sm">{step.problems}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Ваши заметки:</h3>
        <textarea
          className="w-full bg-slate-800 text-white p-4 rounded border border-slate-600 min-h-32"
          placeholder="Запишите ваши наблюдения и идеи по улучшению пользовательского пути..."
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
        />
      </div>

      <MentorTip
        content={
          <div>
            <h3 className="text-lg font-bold mb-2">Ментор</h3>
            <p>Обратите внимание на точки наибольшего оттока пользователей. Что может быть причиной такой высокой потери на этапе дополнительных полей?</p>
          </div>
        }
        position="right"
      />
    </div>,

    // Шаг 4: Выбор решения
    <div key="solution" className={styles.section}>
      <h2 className={styles.subheader}>Выбор решения</h2>
      
      <p className="text-slate-300 mb-4">
        На основе проведенного анализа, выберите наиболее эффективное решение:
      </p>

      <div className="space-y-4">
        {[
          {
            id: "progressive_disclosure",
            title: "Прогрессивное раскрытие",
            description: "Показывать дополнительные поля только при необходимости",
            benefits: ["Упрощение начального взаимодействия", "Снижение когнитивной нагрузки"],
            impact: "Ожидаемое улучшение конверсии на 25%"
          },
          {
            id: "mobile_first",
            title: "Mobile-First редизайн",
            description: "Полный редизайн с фокусом на мобильный опыт",
            benefits: ["Оптимизация под мобильные устройства", "Улучшение навигации"],
            impact: "Ожидаемое улучшение мобильной конверсии на 40%"
          },
          {
            id: "quick_add",
            title: "Быстрое добавление",
            description: "Отдельный режим для быстрого создания простых задач",
            benefits: ["Ускорение процесса", "Удобство для базовых задач"],
            impact: "Сокращение времени создания на 60%"
          }
        ].map(solution => (
          <div
            key={solution.id}
            className={`bg-slate-800 p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedSolution === solution.id
                ? 'border-indigo-500 bg-indigo-900/30'
                : 'border-slate-700 hover:border-slate-500'
            }`}
            onClick={() => handleSolutionSelect(solution.id)}
          >
            <h3 className="text-xl font-semibold text-white mb-2">{solution.title}</h3>
            <p className="text-slate-300 mb-4">{solution.description}</p>
            <div className="space-y-2">
              <h4 className="text-indigo-400 font-semibold">Преимущества:</h4>
              <ul className="list-disc list-inside text-slate-300">
                {solution.benefits.map(benefit => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
              <p className="text-green-400 mt-2">{solution.impact}</p>
            </div>
          </div>
        ))}
      </div>

      <MentorTip
        content={
          <div>
            <h3 className="text-lg font-bold mb-2">Ментор</h3>
            <p>Оцените каждое решение с точки зрения баланса между улучшением UX и сложностью реализации.</p>
          </div>
        }
        position="bottom"
      />
    </div>,

    // Шаг 5: План улучшений
    <div key="improvement-plan" className={styles.section}>
      <h2 className={styles.subheader}>План улучшений</h2>
      
      <p className="text-slate-300 mb-4">
        Составьте план реализации выбранного решения, отметив необходимые шаги:
      </p>

      <div className="space-y-4">
        {[
          {
            id: "research",
            title: "Дополнительные исследования",
            tasks: ["Провести юзабилити-тестирование прототипа", "Собрать обратную связь от пользователей"]
          },
          {
            id: "design",
            title: "Дизайн и прототипирование",
            tasks: ["Создать прототип нового интерфейса", "Протестировать на разных устройствах"]
          },
          {
            id: "development",
            title: "Разработка",
            tasks: ["Реализовать новый интерфейс", "Внедрить систему аналитики"]
          },
          {
            id: "testing",
            title: "Тестирование и запуск",
            tasks: ["Провести A/B тестирование", "Собрать метрики использования"]
          }
        ].map(phase => (
          <div key={phase.id} className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">{phase.title}</h3>
            <div className="space-y-2">
              {phase.tasks.map(task => (
                <label key={task} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-indigo-500"
                    checked={improvementPlan[task] || false}
                    onChange={() => handleImprovementToggle(task)}
                  />
                  <span className="text-slate-300">{task}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <MentorTip
        content={
          <div>
            <h3 className="text-lg font-bold mb-2">Ментор</h3>
            <p>Хороший план улучшений должен включать как быстрые победы, так и долгосрочные улучшения. Не забудьте про метрики успеха!</p>
          </div>
        }
        position="bottom"
      />
    </div>
  ];

  return (
    <div className={styles.container}>
      <StepNavigation
        steps={steps}
        onComplete={onComplete}
        completeButtonText="Завершить практику"
      />
    </div>
  );
};

export default UXAnalysisPractice; 