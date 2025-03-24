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
            <h3 className={styles.tabContentTitle}>Бизнес-контекст решения</h3>
            <div className={styles.contextContainer}>
              <div className={styles.contextItem}>
                <h4 className={styles.contextItemTitle}>Временные рамки</h4>
                <p className={styles.contextItemText}>{businessContext.timeline}</p>
              </div>
              <div className={styles.contextItem}>
                <h4 className={styles.contextItemTitle}>Доступные ресурсы</h4>
                <p className={styles.contextItemText}>{businessContext.resources}</p>
              </div>
              <div className={styles.contextItem}>
                <h4 className={styles.contextItemTitle}>Приоритеты</h4>
                <p className={styles.contextItemText}>{businessContext.priorities}</p>
              </div>
              <div className={styles.contextItem}>
                <h4 className={styles.contextItemTitle}>Ограничения</h4>
                <p className={styles.contextItemText}>{businessContext.constraints}</p>
              </div>
              <div className={styles.contextItem}>
                <h4 className={styles.contextItemTitle}>Целевые показатели</h4>
                <p className={styles.contextItemText}>{businessContext.kpis}</p>
              </div>
            </div>
          </div>
        );
      case 'alternatives':
        return (
          <div className={styles.tabContent}>
            <h3 className={styles.tabContentTitle}>Альтернативные решения</h3>
            <div className={styles.alternativesContainer}>
              {decisionAlternatives.map(alternative => (
                <div key={alternative.id} className={styles.alternativeCard}>
                  <h4 className={styles.alternativeTitle}>{alternative.name}</h4>
                  <p className={styles.alternativeDescription}>{alternative.description}</p>
                  
                  <div className={styles.alternativeSections}>
                    <div className={styles.alternativeSection}>
                      <h5 className={styles.alternativeSectionTitle}>Влияние на пользователей</h5>
                      <p className={styles.alternativeSectionText}>{alternative.impact.users}</p>
                    </div>
                    <div className={styles.alternativeSection}>
                      <h5 className={styles.alternativeSectionTitle}>Влияние на конверсию</h5>
                      <p className={styles.alternativeSectionText}>{alternative.impact.conversion}</p>
                    </div>
                    <div className={styles.alternativeSection}>
                      <h5 className={styles.alternativeSectionTitle}>Влияние на удержание</h5>
                      <p className={styles.alternativeSectionText}>{alternative.impact.retention}</p>
                    </div>
                  </div>
                  
                  <div className={styles.alternativeSections}>
                    <div className={styles.alternativeSection}>
                      <h5 className={styles.alternativeSectionTitle}>Преимущества</h5>
                      <ul className={styles.alternativeList}>
                        {alternative.pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.alternativeSection}>
                      <h5 className={styles.alternativeSectionTitle}>Недостатки</h5>
                      <ul className={styles.alternativeList}>
                        {alternative.cons.map((con, index) => (
                          <li key={index}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className={styles.alternativeSections}>
                    <div className={styles.alternativeSection}>
                      <h5 className={styles.alternativeSectionTitle}>Реализация</h5>
                      <div className={styles.implementationDetails}>
                        <p><strong>Сложность:</strong> {alternative.implementation.complexity}</p>
                        <p><strong>Сроки:</strong> {alternative.implementation.timeframe}</p>
                        <p><strong>Ресурсы:</strong> {alternative.implementation.resources}</p>
                      </div>
                    </div>
                    <div className={styles.alternativeSection}>
                      <h5 className={styles.alternativeSectionTitle}>Ключевые метрики</h5>
                      <div className={styles.metricsDetails}>
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
            <h3 className={styles.tabContentTitle}>Оценка альтернатив</h3>
            <div className={styles.evaluationMatrix}>
              <table className={styles.evaluationTable}>
                <thead>
                  <tr>
                    <th>Критерий / Альтернатива</th>
                    <th>Вес</th>
                    {decisionAlternatives.map(alt => (
                      <th key={alt.id}>{alt.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {decisionCriteria.map(criterion => (
                    <tr key={criterion.id}>
                      <td title={criterion.description}>{criterion.name}</td>
                      <td>{criterion.weight}</td>
                      {decisionAlternatives.map(alt => (
                        <td key={`${alt.id}-${criterion.id}`}>
                          <select 
                            value={alternativeRatings[alt.id]?.[criterion.id] || 0}
                            onChange={(e) => handleRatingChange(alt.id, criterion.id, parseInt(e.target.value))}
                            className={styles.ratingSelect}
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
                  <tr className={styles.weighedScoreRow}>
                    <td colSpan={2}><strong>Взвешенная оценка</strong></td>
                    {decisionAlternatives.map(alt => (
                      <td key={`score-${alt.id}`} className={styles.scoreCell}>
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
            <h3 className={styles.tabContentTitle}>Принятие решения</h3>
            <div className={styles.decisionContainer}>
              <div className={styles.alternativeSelection}>
                <h4 className={styles.selectionTitle}>Выберите оптимальное решение:</h4>
                {decisionAlternatives.map(alt => (
                  <div key={alt.id} className={styles.selectionOption}>
                    <input 
                      type="radio" 
                      id={`alt-${alt.id}`} 
                      name="alternative" 
                      value={alt.id}
                      checked={selectedAlternative === alt.id}
                      onChange={() => handleAlternativeSelect(alt.id)}
                    />
                    <label htmlFor={`alt-${alt.id}`}>
                      {alt.name} 
                      {weightedScores[alt.id] ? ` (Взвешенная оценка: ${weightedScores[alt.id]})` : ''}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className={styles.justificationSection}>
                <h4 className={styles.justificationTitle}>Обоснуйте ваше решение:</h4>
                <textarea 
                  className={styles.justificationTextarea}
                  value={justification}
                  onChange={handleJustificationChange}
                  placeholder="Опишите, почему вы выбрали данное решение. Учтите бизнес-контекст, результаты оценки альтернатив, а также потенциальные риски и преимущества. Минимум 100 символов."
                  rows={8}
                />
              </div>
              
              <button 
                className={styles.submitButton}
                onClick={handleSubmitDecision}
                disabled={selectedAlternative === null || justification.trim().length < 100}
              >
                Отправить решение
              </button>
            </div>
            
            {showFeedback && (
              <div className={styles.feedbackContainer}>
                <h3 className={styles.feedbackTitle}>Обратная связь на ваше решение</h3>
                <p className={styles.feedbackText}>{feedbackTexts[feedbackLevel]}</p>
                
                <div className={styles.mentorTip}>
                  <h4 className={styles.mentorTipTitle}>Совет ментора:</h4>
                  <p className={styles.mentorTipText}>
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
        
        <div className={styles.tabsContainer}>
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