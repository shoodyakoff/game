import React, { useState } from 'react';
import styles from '../common/styles';
import metricsData from '../common/metrics-data';

interface ChartProps {
  data: any[];
  title: string;
  type: 'bar' | 'line' | 'table';
  xKey?: string;
  yKey?: string;
  columns?: string[];
}

type MetricsPracticeProps = {
  onComplete: () => void;
};

const MetricsPractice = ({ onComplete }: MetricsPracticeProps) => {
  const [selectedChart, setSelectedChart] = useState<string>('dailyMetrics');
  const [selectedInsights, setSelectedInsights] = useState<string[]>([]);
  const [userConclusion, setUserConclusion] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'warning'>('warning');

  // Простой компонент для визуализации данных
  const Chart: React.FC<ChartProps> = ({ data, title, type, xKey, yKey, columns }) => {
    if (type === 'table' && columns) {
      return (
        <div className={styles.chartContainer}>
          <h4 className={styles.chartTitle}>{title}</h4>
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  {columns.map((col, i) => (
                    <th key={i}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col, j) => {
                      const key = col.toLowerCase().replace(/ /g, '');
                      let value = row[key] || row[Object.keys(row).find(k => k.toLowerCase() === key) || ''];
                      
                      // Форматирование значений для читаемости
                      if (typeof value === 'number') {
                        if (value > 1 && key.includes('rate')) {
                          value = `${value.toFixed(1)}%`;
                        } else if (key.includes('time')) {
                          value = `${value.toFixed(0)} сек`;
                        } else if (value < 10) {
                          value = value.toFixed(1);
                        }
                      }
                      
                      return <td key={j}>{value}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Заглушка для графиков (в реальном приложении здесь был бы настоящий график)
    return (
      <div className={styles.chartContainer}>
        <h4 className={styles.chartTitle}>{title}</h4>
        <div className={styles.chartPlaceholder}>
          <p>Представьте, что здесь отображается график {type === 'bar' ? 'столбчатый' : 'линейный'}</p>
          <div className={styles.mockChart}>
            {type === 'bar' && (
              <div className={styles.barChartMock}>
                {data.slice(0, 7).map((item, i) => {
                  const value = yKey ? item[yKey] : 50;
                  const heightPercentage = yKey ? (value / Math.max(...data.map(d => d[yKey])) * 100) : (40 + Math.random() * 50);
                  return (
                    <div key={i} className={styles.barContainer}>
                      <div 
                        className={styles.bar} 
                        style={{height: `${heightPercentage}%`}}
                      ></div>
                      <div className={styles.barLabel}>
                        {xKey ? item[xKey].toString().slice(5) : `Элем. ${i+1}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {type === 'line' && (
              <div className={styles.lineChartMock}>
                <svg viewBox="0 0 100 50" className={styles.lineChart}>
                  <polyline
                    fill="none"
                    stroke="#0070f3"
                    strokeWidth="2"
                    points={
                      data.slice(0, 7).map((item, i) => {
                        const value = yKey ? item[yKey] : 50;
                        const x = i * (100 / 6);
                        const maxValue = Math.max(...data.map(d => yKey ? d[yKey] : 50));
                        const y = 50 - (value / maxValue * 40);
                        return `${x},${y}`;
                      }).join(' ')
                    }
                  />
                </svg>
                <div className={styles.lineChartLabels}>
                  {data.slice(0, 7).map((item, i) => (
                    <div key={i} className={styles.lineChartLabel}>
                      {xKey ? item[xKey].toString().slice(5) : `Элем. ${i+1}`}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.dataPreview}>
            <strong>Данные для анализа:</strong>
            <pre className={styles.codeBlock}>
              {JSON.stringify(data.slice(0, 3), null, 2)}
              {data.length > 3 ? '...' : ''}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'dailyMetrics':
        return (
          <Chart 
            data={metricsData.dailyMetrics} 
            title="Ежедневные метрики создания задач (последние 14 дней)" 
            type="line"
            xKey="date"
            yKey="completionRate"
          />
        );
      case 'funnelSteps':
        return (
          <Chart 
            data={metricsData.funnelSteps} 
            title="Воронка создания задачи" 
            type="bar"
            xKey="step"
            yKey="users"
          />
        );
      case 'userSegments':
        return (
          <Chart 
            data={metricsData.userSegments} 
            title="Показатели по сегментам пользователей" 
            type="table"
            columns={["Сегмент", "Процент завершения", "Среднее время", "Частота ошибок", "Удовлетворенность"]}
          />
        );
      case 'abTests':
        return (
          <Chart 
            data={metricsData.abTests} 
            title="Результаты A/B тестирования" 
            type="table"
            columns={["Вариант", "Процент завершения", "Среднее время", "Частота ошибок", "Удовлетворенность"]}
          />
        );
      case 'competitorData':
        return (
          <Chart 
            data={metricsData.competitorData} 
            title="Сравнение с конкурентами" 
            type="table"
            columns={["Продукт", "Процент завершения", "Среднее время", "Удовлетворенность"]}
          />
        );
      default:
        return null;
    }
  };

  const handleInsightToggle = (insight: string) => {
    if (selectedInsights.includes(insight)) {
      setSelectedInsights(selectedInsights.filter(i => i !== insight));
    } else {
      setSelectedInsights([...selectedInsights, insight]);
    }
  };

  const handleSubmitAnalysis = () => {
    const requiredInsightsCount = 4;
    
    // Проверяем, выбрано ли достаточное количество правильных выводов
    const correctInsightsSelected = metricsData.keyInsights
      .filter(insight => selectedInsights.includes(insight))
      .length;
    
    if (correctInsightsSelected >= requiredInsightsCount && userConclusion.length >= 100) {
      setFeedback('Отлично! Вы правильно проанализировали метрики и сделали обоснованные выводы. Вы можете перейти к следующему этапу.');
      setFeedbackType('success');
      setSubmitted(true);
    } else if (correctInsightsSelected < requiredInsightsCount) {
      setFeedback(`Пожалуйста, выберите больше ключевых выводов из анализа метрик (минимум ${requiredInsightsCount}).`);
      setFeedbackType('warning');
    } else {
      setFeedback('Пожалуйста, напишите более подробное заключение (минимум 100 символов).');
      setFeedbackType('warning');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Анализ метрик процесса создания задач</h2>
        <p className={styles.sectionDescription}>
          Изучите представленные метрики, выберите ключевые выводы и составьте заключение о проблемах в текущем процессе создания задач.
        </p>
      </div>

      <div className={styles.metricsNav}>
        <button 
          className={`${styles.metricsNavButton} ${selectedChart === 'dailyMetrics' ? styles.active : ''}`}
          onClick={() => setSelectedChart('dailyMetrics')}
        >
          Ежедневные метрики
        </button>
        <button 
          className={`${styles.metricsNavButton} ${selectedChart === 'funnelSteps' ? styles.active : ''}`}
          onClick={() => setSelectedChart('funnelSteps')}
        >
          Воронка создания
        </button>
        <button 
          className={`${styles.metricsNavButton} ${selectedChart === 'userSegments' ? styles.active : ''}`}
          onClick={() => setSelectedChart('userSegments')}
        >
          Сегменты пользователей
        </button>
        <button 
          className={`${styles.metricsNavButton} ${selectedChart === 'abTests' ? styles.active : ''}`}
          onClick={() => setSelectedChart('abTests')}
        >
          A/B тесты
        </button>
        <button 
          className={`${styles.metricsNavButton} ${selectedChart === 'competitorData' ? styles.active : ''}`}
          onClick={() => setSelectedChart('competitorData')}
        >
          Конкуренты
        </button>
      </div>

      <div className={styles.chartSection}>
        {renderSelectedChart()}
      </div>

      <div className={styles.analysisSection}>
        <h3 className={styles.analysisTitle}>Ваш анализ метрик</h3>
        
        <div className={styles.insightsSelection}>
          <h4>Выберите ключевые выводы из анализа метрик:</h4>
          <div className={styles.insightsList}>
            {metricsData.keyInsights.map((insight, index) => (
              <div key={index} className={styles.insightItem}>
                <input 
                  type="checkbox" 
                  id={`insight-${index}`}
                  checked={selectedInsights.includes(insight)}
                  onChange={() => handleInsightToggle(insight)}
                />
                <label htmlFor={`insight-${index}`}>{insight}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.conclusionSection}>
          <h4>Ваше заключение и рекомендации:</h4>
          <textarea 
            className={styles.conclusionTextarea}
            value={userConclusion}
            onChange={(e) => setUserConclusion(e.target.value)}
            placeholder="На основе изученных метрик опишите основные проблемы процесса создания задач и предложите свои рекомендации по его улучшению..."
            rows={6}
          />
          
          <div className={styles.wordCount}>
            {userConclusion.length} / 100 символов (минимум)
          </div>
        </div>
        
        <button 
          className={styles.submitButton}
          onClick={handleSubmitAnalysis}
        >
          Отправить анализ
        </button>
        
        {feedback && (
          <div className={`mt-8 p-4 rounded-lg ${
            feedbackType === 'success' 
              ? 'bg-green-800/30 border border-green-700' 
              : 'bg-yellow-800/30 border border-yellow-700'
          }`}>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              {feedbackType === 'success' ? 'Отличная работа!' : 'Есть над чем поработать'}
            </h3>
            <p className="text-slate-300">{feedback}</p>
          </div>
        )}
      </div>
      
      {submitted && feedbackType === 'success' && (
        <div className="flex justify-end mt-6">
          <button
            className={styles.btnPrimary}
            onClick={onComplete}
          >
            Завершить упражнение
          </button>
        </div>
      )}
      
      <div className={styles.mentorTip}>
        <h4 className={styles.mentorTipTitle}>Совет ментора:</h4>
        <p className={styles.mentorTipText}>
          При анализе метрик ищите аномалии и тренды. Обратите внимание на этапы с наибольшим оттоком пользователей, 
          разницу в показателях между сегментами и сравнение с конкурентами. Успешный продакт-менеджер должен уметь 
          выделять наиболее значимые метрики и делать на их основе правильные выводы.
        </p>
      </div>
    </div>
  );
};

export default MetricsPractice; 