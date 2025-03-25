import React, { useState, useEffect } from 'react';
import { styles } from '../common/styles';
import { decisionAlternatives, decisionCriteria, businessContext, feedbackTexts } from '../data/decisionMakingData';

type DecisionMakingPracticeProps = {
  onComplete: () => void;
};

const DecisionMakingPractice = ({ onComplete }: DecisionMakingPracticeProps) => {
  const [activeTab, setActiveTab] = useState('context');
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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

  const handleSubmitDecision = () => {
    if (selectedAlternative === null || justification.trim().length < 100) {
      alert('Пожалуйста, выберите альтернативу и предоставьте подробное обоснование (минимум 100 символов)');
      return;
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
    if (selectedAlternative === bestAlternative && factorPercentage > 0.7) {
      setFeedbackLevel('excellent');
    } else if (selectedAlternative === bestAlternative && factorPercentage > 0.4) {
      setFeedbackLevel('good');
    } else if (selectedAlternative !== bestAlternative && alternativeRatings[selectedAlternative]?.impact_conversion > 7) {
      setFeedbackLevel('average');
    } else {
      setFeedbackLevel('poor');
    }
    
    setShowFeedback(true);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'context':
        return (
          <div className={styles.tabContent}>
            <h3 className={styles.subheader}>Бизнес-контекст решения</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        );
      case 'alternatives':
        return (
          <div className={styles.tabContent}>
            <h3 className={styles.subheader}>Альтернативные решения</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          </div>
        );
      case 'evaluation':
        return (
          <div className={styles.tabContent}>
            <h3 className={styles.subheader}>Оценка альтернатив</h3>
            <div className="overflow-x-auto rounded-lg border border-slate-600 my-4">
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
                        <strong>{weightedScores[alt.id] || 0}</strong>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'decision':
        return (
          <div className={styles.tabContent}>
            <h3 className={styles.subheader}>Принятие решения</h3>
            <div className="space-y-6">
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-indigo-400 mb-3">Выберите оптимальное решение:</h4>
                {decisionAlternatives.map(alt => (
                  <div key={alt.id} className="flex items-center mb-2 p-2 hover:bg-slate-600 rounded">
                    <input 
                      type="radio" 
                      id={`alt-${alt.id}`} 
                      name="alternative" 
                      value={alt.id}
                      checked={selectedAlternative === alt.id}
                      onChange={() => handleAlternativeSelect(alt.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`alt-${alt.id}`} className="flex-grow">
                      {alt.name} 
                      {weightedScores[alt.id] ? ` (Взвешенная оценка: ${weightedScores[alt.id]})` : ''}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium text-indigo-400 mb-3">Обоснуйте ваше решение:</h4>
                <textarea 
                  className={styles.textarea}
                  value={justification}
                  onChange={handleJustificationChange}
                  placeholder="Опишите, почему вы выбрали данное решение. Учтите бизнес-контекст, результаты оценки альтернатив, а также потенциальные риски и преимущества. Минимум 100 символов."
                  rows={8}
                />
              </div>
              
              <button 
                className={`${styles.btnPrimary} mt-6 ${selectedAlternative === null || justification.trim().length < 100 ? styles.btnDisabled : ''}`}
                onClick={handleSubmitDecision}
                disabled={selectedAlternative === null || justification.trim().length < 100}
              >
                Отправить решение
              </button>
            </div>
            
            {showFeedback && (
              <div className="mt-8 bg-slate-700 p-6 rounded-lg border border-slate-600">
                <h3 className="text-xl font-semibold text-indigo-400 mb-4">Обратная связь на ваше решение</h3>
                <p className={styles.text}>{feedbackTexts[feedbackLevel]}</p>
                
                <div className="bg-slate-600 p-4 rounded-lg mt-6">
                  <h4 className="text-lg font-medium text-indigo-300 mb-2">Совет ментора:</h4>
                  <p className={styles.text}>
                    В процессе принятия решений в продуктовой разработке ключевую роль играет баланс между краткосрочными 
                    и долгосрочными целями. Правильное решение должно учитывать не только текущие ограничения (время, 
                    ресурсы, бюджет), но и соответствовать стратегическим целям продукта. Также важно основывать 
                    решения на данных, а не только на интуиции или личных предпочтениях.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Практика принятия решений</h1>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Задача: Выбор оптимального решения для улучшения процесса создания задач</h2>
        <p className={styles.text}>
          В этом упражнении вам предстоит выбрать оптимальное решение для улучшения процесса создания задач 
          в TaskMaster, используя структурированный подход к принятию решений. Вам необходимо оценить 
          альтернативные решения, учесть бизнес-контекст и выбрать наиболее подходящий вариант.
        </p>
        
        <div className="mt-6 bg-slate-800 rounded-lg shadow-md border border-slate-700 p-4">
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'context' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('context')}
            >
              Бизнес-контекст
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'alternatives' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('alternatives')}
            >
              Альтернативы
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'evaluation' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('evaluation')}
            >
              Оценка
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'decision' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('decision')}
            >
              Решение
            </button>
          </div>
          
          {renderTab()}
        </div>
      </section>

      {showFeedback && (
        <div className="mt-8">
          <div className={`p-4 rounded-lg ${
            feedbackLevel === 'excellent' || feedbackLevel === 'good' 
              ? 'bg-green-800/30 border border-green-700' 
              : 'bg-yellow-800/30 border border-yellow-700'
          }`}>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              {feedbackLevel === 'excellent' || feedbackLevel === 'good' 
                ? 'Отличная работа!' 
                : 'Есть над чем поработать'}
            </h3>
            <p className="text-slate-300">{feedbackTexts[feedbackLevel]}</p>
          </div>
          
          {(feedbackLevel === 'excellent' || feedbackLevel === 'good') && (
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

export default DecisionMakingPractice; 