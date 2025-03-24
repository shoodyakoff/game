import React, { useState } from 'react';
import { styles } from '../common/styles';

interface ProblemStatement {
  id: string;
  text: string;
  quality: 'good' | 'average' | 'poor';
  feedback: string;
}

type ProductThinkingPracticeProps = {
  onComplete: () => void;
};

const ProductThinkingPractice = ({ onComplete }: ProductThinkingPracticeProps) => {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [userProblem, setUserProblem] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackQuality, setFeedbackQuality] = useState<'excellent' | 'good' | 'average' | 'poor' | ''>('');
  
  const problemStatements: ProblemStatement[] = [
    {
      id: '1',
      text: 'Пользователям сложно создавать задачи в TaskMaster.',
      quality: 'poor',
      feedback: 'Это слишком общая формулировка. В ней не указана конкретная проблема, нет количественных данных, не определена целевая аудитория и не указаны последствия проблемы для бизнеса.'
    },
    {
      id: '2',
      text: 'Процесс создания задач в TaskMaster занимает много времени и вызывает трудности у новых пользователей.',
      quality: 'average',
      feedback: 'Формулировка становится более конкретной — упоминается время и целевая аудитория (новые пользователи), но всё ещё не хватает количественных данных и бизнес-последствий.'
    },
    {
      id: '3',
      text: 'Новые пользователи тратят в среднем 3 минуты на создание задачи в TaskMaster, и 40% из них не завершают процесс из-за сложности формы, что приводит к низкой конверсии и негативно влияет на удержание пользователей.',
      quality: 'good',
      feedback: 'Отличная формулировка! В ней присутствуют конкретные данные (3 минуты, 40%), указана целевая аудитория (новые пользователи), определена причина проблемы (сложность формы) и бизнес-последствия (низкая конверсия и удержание).'
    }
  ];
  
  const keywordGroups = [
    ['время', 'минут', 'секунд', 'длительность', 'долго', 'быстро'],
    ['новые пользователи', 'новички', 'начинающие', 'первый раз', 'неопытные'],
    ['конверсия', 'завершение', 'бросают', 'не заканчивают', 'отказ', 'воронка'],
    ['процент', '%', 'доля', 'часть', 'количество', 'число', 'метрика'],
    ['бизнес', 'доход', 'прибыль', 'ценность', 'рост', 'удержание', 'отток']
  ];
  
  const checkForQualityKeywords = (text: string): number => {
    let matchCount = 0;
    const lowercaseText = text.toLowerCase();
    
    keywordGroups.forEach(group => {
      if (group.some(keyword => lowercaseText.includes(keyword.toLowerCase()))) {
        matchCount++;
      }
    });
    
    return matchCount;
  };
  
  const handleProblemSelection = (id: string) => {
    setSelectedProblem(id);
    setSubmitted(false);
    setFeedback('');
    setFeedbackQuality('');
  };
  
  const handleUserProblemChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserProblem(e.target.value);
    setSubmitted(false);
    setFeedback('');
    setFeedbackQuality('');
  };
  
  const handleSubmit = () => {
    if (selectedProblem) {
      const selected = problemStatements.find(p => p.id === selectedProblem);
      if (selected) {
        setFeedback(selected.feedback);
        setFeedbackQuality(selected.quality === 'good' ? 'excellent' : selected.quality === 'average' ? 'good' : 'poor');
      }
    } else if (userProblem.trim()) {
      const keywordCount = checkForQualityKeywords(userProblem);
      
      if (keywordCount >= 4) {
        setFeedbackQuality('excellent');
        setFeedback('Отличная формулировка проблемы! Вы включили конкретные данные, определили целевую аудиторию, указали причину проблемы и её бизнес-последствия. Такая формулировка значительно облегчит поиск эффективного решения.');
      } else if (keywordCount >= 2) {
        setFeedbackQuality('good');
        setFeedback('Хорошая формулировка, но можно улучшить. Постарайтесь добавить больше конкретных данных, чётко определить целевую аудиторию и указать бизнес-последствия проблемы.');
      } else {
        setFeedbackQuality('poor');
        setFeedback('Формулировка слишком общая. Попробуйте описать проблему более конкретно, используя количественные данные, указав целевую аудиторию и бизнес-последствия.');
      }
    }
    
    setSubmitted(true);
  };
  
  const completeExercise = () => {
    onComplete();
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Продуктовое мышление: практика</h1>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Определение проблемы</h2>
        <p className={styles.text}>
          Первый важный навык продуктового мышления — умение правильно формулировать проблему. 
          Точная и конкретная формулировка проблемы помогает найти эффективное решение.
        </p>
        <p className={styles.text}>
          Хорошая формулировка проблемы должна включать:
        </p>
        <ul className={styles.list}>
          <li>Конкретные данные и метрики</li>
          <li>Целевую аудиторию, испытывающую проблему</li>
          <li>Причину возникновения проблемы</li>
          <li>Последствия для пользователей и бизнеса</li>
        </ul>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Задание 1: Оцените формулировки проблемы</h2>
        <p className={styles.text}>
          Ниже представлены различные формулировки проблемы процесса создания задач в TaskMaster. 
          Выберите одну и получите обратную связь о её качестве.
        </p>
        
        <div className={styles.problemOptions}>
          {problemStatements.map(problem => (
            <div 
              key={problem.id} 
              className={`${styles.problemOption} ${selectedProblem === problem.id ? styles.problemOptionSelected : ''}`}
              onClick={() => handleProblemSelection(problem.id)}
            >
              <p className={styles.problemText}>{problem.text}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.orDivider}>
          <span>или</span>
        </div>
        
        <h2 className={styles.subheader}>Задание 2: Сформулируйте проблему самостоятельно</h2>
        <p className={styles.text}>
          Опираясь на данные и отзывы команды TaskMaster, сформулируйте проблему процесса создания задач 
          своими словами. Постарайтесь сделать формулировку максимально конкретной и полезной для поиска решения.
        </p>
        
        <textarea 
          className={styles.textarea}
          placeholder="Сформулируйте проблему здесь..."
          value={userProblem}
          onChange={handleUserProblemChange}
          rows={5}
        />
        
        <button 
          className={styles.btnPrimary}
          onClick={handleSubmit}
          disabled={!selectedProblem && !userProblem.trim()}
        >
          Получить обратную связь
        </button>
        
        {submitted && feedback && (
          <div className={`${styles.feedbackBox} ${styles[`feedback${feedbackQuality.charAt(0).toUpperCase() + feedbackQuality.slice(1)}`]}`}>
            <h3 className={styles.feedbackTitle}>
              {feedbackQuality === 'excellent' ? 'Отлично!' : 
               feedbackQuality === 'good' ? 'Хорошо!' : 
               feedbackQuality === 'average' ? 'Неплохо!' : 'Можно лучше!'}
            </h3>
            <p className={styles.feedbackText}>{feedback}</p>
          </div>
        )}
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Практические рекомендации</h2>
        <div className={styles.tipsBox}>
          <h3 className={styles.tipsTitle}>Как улучшить формулировку проблемы:</h3>
          <ul className={styles.tipsList}>
            <li>
              <strong>Будьте конкретны:</strong> Вместо "много пользователей" используйте "40% новых пользователей"
            </li>
            <li>
              <strong>Используйте данные:</strong> "В среднем 3 минуты" вместо "много времени"
            </li>
            <li>
              <strong>Укажите последствия:</strong> "Что приводит к снижению конверсии на 20% и увеличению оттока пользователей"
            </li>
            <li>
              <strong>Сегментируйте аудиторию:</strong> "Новые пользователи мобильной версии" вместо "пользователи"
            </li>
            <li>
              <strong>Укажите причину:</strong> "Из-за сложности формы и неясных обязательных полей" 
            </li>
          </ul>
        </div>
      </section>
      
      <div className={styles.mentorTip}>
        <h3 className={styles.mentorTipTitle}>Совет ментора:</h3>
        <p className={styles.mentorTipText}>
          Часто команды бросаются решать проблему, которая плохо определена, и в итоге создают решения, 
          которые не решают реальных трудностей пользователей. Потратив больше времени на точное определение 
          проблемы, вы сэкономите недели на разработке ненужных функций и существенно повысите шансы на успех.
        </p>
      </div>
      
      {submitted && (
        <div className="mt-8">
          <div className={`p-4 rounded-lg ${
            feedbackQuality === 'excellent' || feedbackQuality === 'good' 
              ? 'bg-green-800/30 border border-green-700' 
              : 'bg-yellow-800/30 border border-yellow-700'
          }`}>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              {feedbackQuality === 'excellent' || feedbackQuality === 'good' 
                ? 'Хорошая работа!' 
                : 'Есть над чем поработать'}
            </h3>
            <p className="text-slate-300">{feedback}</p>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              className={styles.btnPrimary}
              onClick={completeExercise}
            >
              Завершить упражнение
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductThinkingPractice; 