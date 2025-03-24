import React, { useState } from 'react';
import { styles } from '../common/styles';
import uxAnalysisData from '../data/uxAnalysisData';

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

const UxAnalysisPractice = ({ onComplete }: UXAnalysisPracticeProps) => {
  const [activeTab, setActiveTab] = useState<'userSegments' | 'userJourney'>('userSegments');
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [selectedStep, setSelectedStep] = useState<string>('');
  const [userInsight, setUserInsight] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'excellent' | 'good' | 'average' | 'poor'>('average');

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
  
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>UX-анализ: практика</h1>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'userSegments' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabChange('userSegments')}
        >
          Анализ сегментов пользователей
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'userJourney' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabChange('userJourney')}
        >
          Анализ пользовательского пути
        </button>
      </div>
      
      <section className={styles.section}>
        {activeTab === 'userSegments' ? (
          <>
            <h2 className={styles.subheader}>Анализ сегментов пользователей</h2>
            <p className={styles.text}>
              Разные группы пользователей имеют различные потребности, ожидания и проблемы при использовании продукта.
              Анализ сегментов помогает лучше понять различия между группами пользователей и разработать 
              решения, учитывающие их уникальные потребности.
            </p>
            <p className={styles.text}>
              Выберите сегмент пользователей ниже, чтобы изучить их болевые точки и предложить решение.
            </p>
            {renderUserSegments()}
          </>
        ) : (
          <>
            <h2 className={styles.subheader}>Анализ пользовательского пути</h2>
            <p className={styles.text}>
              Пользовательский путь (User Journey) отображает последовательность шагов, которые пользователь проходит 
              для достижения определенной цели в продукте. Анализ каждого шага помогает выявить конкретные проблемы 
              и возможности для улучшения на разных этапах взаимодействия.
            </p>
            <p className={styles.text}>
              Выберите этап пользовательского пути создания задачи, чтобы изучить болевые точки и предложить решение.
            </p>
            {renderUserJourney()}
          </>
        )}
      </section>
      
      <div className={styles.mentorTip}>
        <h3 className={styles.mentorTipTitle}>Совет ментора:</h3>
        <p className={styles.mentorTipText}>
          При проведении UX-анализа важно не только выявить проблемы, но и понять их первопричины.
          Задавайте вопрос "почему?" несколько раз, чтобы добраться до корня проблемы. Например,
          если пользователи путаются в форме, спросите: "Почему они путаются?", затем "Почему информация
          не представлена понятно?" и т.д. Это поможет вам разработать решения, которые устраняют
          не симптомы, а настоящие причины проблем.
        </p>
      </div>
      
      {submitted && (
        <div className="mt-8">
          <div className={`p-4 rounded-lg ${
            feedbackType === 'excellent' || feedbackType === 'good' 
              ? 'bg-green-800/30 border border-green-700' 
              : 'bg-yellow-800/30 border border-yellow-700'
          }`}>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              {feedbackType === 'excellent' || feedbackType === 'good' 
                ? 'Отличная работа!' 
                : 'Есть над чем поработать'}
            </h3>
            <p className="text-slate-300">{feedback}</p>
          </div>
          
          {(feedbackType === 'excellent' || feedbackType === 'good') && (
            <div className="flex justify-end mt-6">
              <button
                className={styles.btnPrimary}
                onClick={onComplete}
              >
                Завершить упражнение
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UxAnalysisPractice; 