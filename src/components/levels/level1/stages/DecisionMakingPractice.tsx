import React, { useState, useEffect } from 'react';
import { styles } from '../common/styles';
import { decisionAlternatives, decisionCriteria, businessContext, feedbackTexts } from '../data/decisionMakingData';
import StepNavigation from '../../shared/navigation/StepNavigation';
import MentorTip from '../../shared/feedback/MentorTip';

type DecisionMakingPracticeProps = {
  onComplete: () => void;
};

const DecisionMakingPractice = ({ onComplete }: DecisionMakingPracticeProps) => {
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);
  const [alternativeRatings, setAlternativeRatings] = useState<{[key: number]: {[key: string]: number}}>({});
  const [justification, setJustification] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackLevel, setFeedbackLevel] = useState<'excellent' | 'good' | 'average' | 'poor'>('average');
  const [weightedScores, setWeightedScores] = useState<{[key: number]: number}>({});

  useEffect(() => {
    // Инициализация пустых рейтингов для всех альтернатив и критериев
    const initialRatings: {[key: number]: {[key: string]: number}} = {};
    
    decisionAlternatives.forEach(alt => {
      initialRatings[alt.id] = {};
      decisionCriteria.forEach(criterion => {
        initialRatings[alt.id][criterion.id] = 0;
      });
    });
    
    setAlternativeRatings(initialRatings);
  }, []);

  useEffect(() => {
    // Расчет взвешенных оценок при изменении рейтингов
    const scores: {[key: number]: number} = {};
    
    Object.keys(alternativeRatings).forEach(altId => {
      const altIdNum = parseInt(altId);
      scores[altIdNum] = 0;
      
      Object.keys(alternativeRatings[altIdNum]).forEach(criterionId => {
        const criterion = decisionCriteria.find(c => c.id === criterionId);
        if (criterion) {
          scores[altIdNum] += alternativeRatings[altIdNum][criterionId] * criterion.weight;
        }
      });
      
      // Округление до 2 знаков после запятой
      scores[altIdNum] = Math.round(scores[altIdNum] * 100) / 100;
    });
    
    setWeightedScores(scores);
  }, [alternativeRatings]);

  const handleRatingChange = (alternativeId: number, criterionId: string, value: number) => {
    setAlternativeRatings(prev => ({
      ...prev,
      [alternativeId]: {
        ...prev[alternativeId],
        [criterionId]: value
      }
    }));
  };

  const handleAlternativeSelect = (id: number) => {
    setSelectedAlternative(id);
  };

  const handleJustificationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJustification(e.target.value);
  };

  const evaluateDecision = () => {
    if (selectedAlternative === null || justification.trim().length < 100) {
      return null;
    }

    // Определяем лучшее решение для этого кейса (Альтернатива 1 в нашем случае)
    const bestAlternative = 1;
    
    // Проверка обоснования на ключевые факторы
    const justificationLower = justification.toLowerCase();
    const keyFactors = [
      'конверс', 'срок', 'ресурс', 'быстр', 'реализац',
      'a/b', 'тест', 'данн', 'мобильн', 'прост', 'новых пользователей'
    ];
    
    const factorsFound = keyFactors.filter(factor => justificationLower.includes(factor)).length;
    const factorPercentage = factorsFound / keyFactors.length;
    
    // Логика определения уровня обратной связи
    let level: 'excellent' | 'good' | 'average' | 'poor' = 'average';
    
    if (selectedAlternative === bestAlternative && factorPercentage > 0.7) {
      level = 'excellent';
    } else if (selectedAlternative === bestAlternative && factorPercentage > 0.4) {
      level = 'good';
    } else if (selectedAlternative !== bestAlternative && alternativeRatings[selectedAlternative]?.impact_conversion > 7) {
      level = 'average';
    } else {
      level = 'poor';
    }
    
    setFeedbackLevel(level);
    setShowFeedback(true);
    
    return level;
  };

  // Шаги для StepNavigation
  const stepsContent = [
    // Шаг 1: Введение и бизнес-контекст
    <div key="context" className={styles.section}>
      <h1 className={styles.header}>Практика принятия решений</h1>
      <h2 className={styles.subheader}>Задача: Выбор оптимального решения для улучшения процесса создания задач</h2>
      <p className={styles.text}>
        В этом упражнении вам предстоит выбрать оптимальное решение для улучшения процесса создания задач 
        в TaskMaster, используя структурированный подход к принятию решений. Вам необходимо оценить 
        альтернативные решения, учесть бизнес-контекст и выбрать наиболее подходящий вариант.
      </p>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8 mt-6">
        <h3 className={styles.subheader}>Бизнес-контекст решения</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-indigo-300 mb-2">Временные рамки</h4>
            <p className={styles.text}>{businessContext.timeline}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-indigo-300 mb-2">Доступные ресурсы</h4>
            <p className={styles.text}>{businessContext.resources}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-indigo-300 mb-2">Приоритеты</h4>
            <p className={styles.text}>{businessContext.priorities}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-indigo-300 mb-2">Ограничения</h4>
            <p className={styles.text}>{businessContext.constraints}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-indigo-300 mb-2">Целевые показатели</h4>
            <p className={styles.text}>{businessContext.kpis}</p>
          </div>
        </div>
      </div>
      
      <MentorTip
        tip="Внимательно изучите бизнес-контекст перед анализом альтернатив. Обратите особое внимание на временные рамки, ресурсы и приоритеты, так как они сильно влияют на выбор оптимального решения."
        position="bottom-right"
      />
    </div>,
    
    // Шаг 2: Альтернативные решения
    <div key="alternatives" className={styles.section}>
      <h2 className={styles.subheader}>Альтернативные решения</h2>
      <p className={styles.text}>
        Рассмотрите каждую из предложенных альтернатив с учетом их влияния на пользователей, 
        конверсию, удержание, а также с точки зрения реализации и измерения результатов.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 mt-6">
        {decisionAlternatives.map(alternative => (
          <div key={alternative.id} className="bg-slate-700 p-5 rounded-lg border border-slate-600">
            <h4 className="text-lg font-semibold text-indigo-400 mb-3">{alternative.name}</h4>
            <p className={styles.text}>{alternative.description}</p>
            
            <div className="mt-4 space-y-4">
              <div>
                <h5 className="font-medium text-indigo-300 mb-1">Влияние на пользователей</h5>
                <p className={styles.text}>{alternative.impact.users}</p>
              </div>
              <div>
                <h5 className="font-medium text-indigo-300 mb-1">Влияние на конверсию</h5>
                <p className={styles.text}>{alternative.impact.conversion}</p>
              </div>
              <div>
                <h5 className="font-medium text-indigo-300 mb-1">Влияние на удержание</h5>
                <p className={styles.text}>{alternative.impact.retention}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <h5 className="font-medium text-indigo-300 mb-1">Преимущества</h5>
                <ul className={styles.list}>
                  {alternative.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-indigo-300 mb-1">Недостатки</h5>
                <ul className={styles.list}>
                  {alternative.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <h5 className="font-medium text-indigo-300 mb-1">Реализация</h5>
                <div className="mt-2 space-y-1 text-slate-300">
                  <p><strong>Сложность:</strong> {alternative.implementation.complexity}</p>
                  <p><strong>Сроки:</strong> {alternative.implementation.timeframe}</p>
                  <p><strong>Ресурсы:</strong> {alternative.implementation.resources}</p>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-indigo-300 mb-1">Ключевые метрики</h5>
                <div className="mt-2 space-y-1 text-slate-300">
                  <p><strong>Основные:</strong> {alternative.metrics.primary.join(', ')}</p>
                  <p><strong>Второстепенные:</strong> {alternative.metrics.secondary.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <MentorTip
        tip="Рассматривая альтернативы, думайте не только о краткосрочном эффекте, но и о долгосрочных последствиях. Также учитывайте, насколько хорошо решение согласуется с общей стратегией развития продукта."
        position="bottom-left"
      />
    </div>,
    
    // Шаг 3: Оценка альтернатив
    <div key="evaluation" className={styles.section}>
      <h2 className={styles.subheader}>Оценка альтернатив</h2>
      <p className={styles.text}>
        Оцените каждую альтернативу по заданным критериям, используя шкалу от 1 до 10. 
        Система автоматически рассчитает взвешенную оценку на основе важности критериев.
      </p>
      
      <div className="overflow-x-auto rounded-lg border border-slate-600 my-6">
        <table className="w-full border-collapse bg-slate-800">
          <thead className="bg-slate-700 text-indigo-300">
            <tr>
              <th className="p-3 text-left">Критерий / Альтернатива</th>
              <th className="p-3">Вес</th>
              {decisionAlternatives.map(alt => (
                <th key={alt.id} className="p-3">{alt.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {decisionCriteria.map(criterion => (
              <tr key={criterion.id} className="border-t border-slate-600">
                <td className="p-3" title={criterion.description}>{criterion.name}</td>
                <td className="p-3 text-center">{criterion.weight}</td>
                {decisionAlternatives.map(alt => (
                  <td key={`${alt.id}-${criterion.id}`} className="p-3 text-center">
                    <select 
                      value={alternativeRatings[alt.id]?.[criterion.id] || 0}
                      onChange={(e) => handleRatingChange(alt.id, criterion.id, parseInt(e.target.value))}
                      className={styles.input}
                    >
                      <option value={0}>Выберите оценку</option>
                      <option value={1}>1 - Очень низкая</option>
                      <option value={2}>2 - Низкая</option>
                      <option value={3}>3 - Ниже среднего</option>
                      <option value={4}>4 - Немного ниже среднего</option>
                      <option value={5}>5 - Средняя</option>
                      <option value={6}>6 - Немного выше среднего</option>
                      <option value={7}>7 - Выше среднего</option>
                      <option value={8}>8 - Высокая</option>
                      <option value={9}>9 - Очень высокая</option>
                      <option value={10}>10 - Превосходная</option>
                    </select>
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-slate-700 font-bold">
              <td colSpan={2} className="p-3"><strong>Взвешенная оценка</strong></td>
              {decisionAlternatives.map(alt => (
                <td key={`score-${alt.id}`} className="p-3 text-center">
                  {weightedScores[alt.id] ? weightedScores[alt.id].toFixed(2) : '-'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      <MentorTip
        tip="При оценке альтернатив старайтесь быть объективным. Учитывайте не только оценку по каждому критерию, но и вес критерия. Взвешенная оценка поможет вам выбрать наиболее сбалансированное решение."
        position="top-right"
      />
    </div>,
    
    // Шаг 4: Принятие решения
    <div key="decision" className={styles.section}>
      <h2 className={styles.subheader}>Принятие решения</h2>
      <p className={styles.text}>
        На основе проведенной оценки выберите оптимальное решение и обоснуйте свой выбор. 
        Учитывайте взвешенные оценки, но не забывайте о контексте и о том, что не все факторы 
        можно полностью учесть в формальной модели оценки.
      </p>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8 mt-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4">Выбор альтернативы</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {decisionAlternatives.map(alt => (
            <div 
              key={alt.id}
              className={`bg-slate-700 p-4 rounded-lg border-2 cursor-pointer
                ${selectedAlternative === alt.id 
                  ? 'border-indigo-500 bg-indigo-900/30' 
                  : 'border-slate-600 hover:border-slate-500'
                }
              `}
              onClick={() => handleAlternativeSelect(alt.id)}
            >
              <div className="flex items-start">
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mr-3 mt-1
                  ${selectedAlternative === alt.id
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-slate-500'
                  }
                `}>
                  {selectedAlternative === alt.id && (
                    <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white">{alt.name}</h4>
                  <p className="text-sm text-slate-300">{alt.description.substring(0, 100)}...</p>
                  {weightedScores[alt.id] && (
                    <p className="text-sm mt-2">
                      <span className="text-indigo-400 font-medium">Взвешенная оценка:</span> {weightedScores[alt.id].toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-indigo-400 mb-3">Обоснование выбора</h3>
          <p className="text-sm text-slate-300 mb-2">
            Опишите, почему выбранная альтернатива является оптимальной, учитывая 
            бизнес-контекст, результаты оценки и другие факторы.
          </p>
          <textarea
            className={styles.textarea}
            value={justification}
            onChange={handleJustificationChange}
            rows={6}
            placeholder="Введите ваше обоснование здесь (минимум 100 символов)"
          ></textarea>
          <p className="text-xs text-slate-400 mt-1">
            {justification.length} / 100 символов минимум
            {justification.length < 100 && (
              <span className="text-red-400"> (требуется минимум 100 символов)</span>
            )}
          </p>
        </div>
      </div>
      
      <MentorTip
        tip="Качественное обоснование должно ссылаться на данные, учитывать преимущества и недостатки выбранного решения, а также объяснять, почему оно лучше альтернатив в данном контексте."
        position="bottom-right"
      />
    </div>,
    
    // Шаг 5: Обратная связь и результаты
    <div key="feedback" className={styles.section}>
      <h2 className={styles.subheader}>Обратная связь и результаты</h2>
      
      {showFeedback ? (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8 mt-6">
          <h3 className="text-xl font-semibold mb-4">
            {feedbackLevel === 'excellent' && <span className="text-green-400">Отличное решение!</span>}
            {feedbackLevel === 'good' && <span className="text-blue-400">Хорошее решение</span>}
            {feedbackLevel === 'average' && <span className="text-yellow-400">Неплохое решение</span>}
            {feedbackLevel === 'poor' && <span className="text-red-400">Требуется доработка</span>}
          </h3>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300">{feedbackTexts[feedbackLevel].main}</p>
            <h4 className="text-indigo-400 mt-4">Сильные стороны:</h4>
            <ul className="list-disc pl-5 text-slate-300">
              {feedbackTexts[feedbackLevel].strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
            
            <h4 className="text-indigo-400 mt-4">Области для улучшения:</h4>
            <ul className="list-disc pl-5 text-slate-300">
              {feedbackTexts[feedbackLevel].improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
            
            <h4 className="text-indigo-400 mt-4">Советы на будущее:</h4>
            <p className="text-slate-300">{feedbackTexts[feedbackLevel].tips}</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8 mt-6 text-center">
          <p className="text-lg text-slate-300 mb-4">
            Чтобы получить обратную связь, выберите альтернативу и напишите обоснование (минимум 100 символов).
          </p>
          <button 
            className={`${styles.btnPrimary} ${(!selectedAlternative || justification.length < 100) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={evaluateDecision}
            disabled={!selectedAlternative || justification.length < 100}
          >
            Получить обратную связь
          </button>
        </div>
      )}
      
      <MentorTip
        tip="Процесс принятия решений — это навык, который улучшается с практикой. Анализируйте свои прошлые решения и их последствия, чтобы непрерывно совершенствоваться."
        position="bottom-right"
      />
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
      />
    </div>
  );
};

export default DecisionMakingPractice; 