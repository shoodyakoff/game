import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { styles } from '../common/styles';
import { LevelStage, getNextStage } from '../../shared/LevelStages';

interface FeedbackProps {
  onComplete?: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ onComplete }) => {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);
  const [difficultyConcepts, setDifficultyConcepts] = useState<string[]>([]);
  const [usefulConcepts, setUsefulConcepts] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Проверка валидности формы - оценка должна быть выбрана
  const isValid = rating !== null;

  const concepts = [
    { id: 'product_mindset', name: 'Продуктовое мышление' },
    { id: 'ux_analysis', name: 'UX-анализ' },
    { id: 'metrics', name: 'Работа с метриками' },
    { id: 'decision_making', name: 'Принятие решений' },
    { id: 'team_work', name: 'Работа в команде' },
    { id: 'conversion_optimization', name: 'Оптимизация конверсии' }
  ];

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleDifficultyConceptsChange = (conceptId: string) => {
    setDifficultyConcepts(prev => {
      if (prev.includes(conceptId)) {
        return prev.filter(id => id !== conceptId);
      } else {
        return [...prev, conceptId];
      }
    });
  };

  const handleUsefulConceptsChange = (conceptId: string) => {
    setUsefulConcepts(prev => {
      if (prev.includes(conceptId)) {
        return prev.filter(id => id !== conceptId);
      } else {
        return [...prev, conceptId];
      }
    });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    // В реальном приложении здесь был бы API-запрос для отправки данных
    console.log({
      rating,
      difficultyConcepts,
      usefulConcepts,
      comment
    });
    
    setSubmitted(true);
  };

  const handleContinue = () => {
    // Переходим к следующему этапу (в данном случае - к квизу)
    if (onComplete) {
      onComplete();
    } else {
      const nextStage = getNextStage(LevelStage.FEEDBACK);
      router.push(`/level1?stage=${nextStage}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Обратная связь</h1>
      
      {!submitted ? (
        <div className="space-y-6">
          <section className={styles.section}>
            <h2 className={styles.subheader}>Ваше мнение важно для нас!</h2>
            <p className={styles.text}>
              Пожалуйста, поделитесь своими впечатлениями от пройденного материала. 
              Ваша обратная связь поможет нам сделать курс еще лучше.
            </p>
            
            <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">Общая оценка уровня</h3>
              <div className="flex justify-center space-x-4 mb-2">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border ${rating === value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'}`}
                    onClick={() => handleRatingChange(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Совсем не понравилось</span>
                <span>Очень понравилось</span>
              </div>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">Какие концепции были наиболее сложными для понимания?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {concepts.map(concept => (
                  <div key={concept.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`difficulty-${concept.id}`}
                      checked={difficultyConcepts.includes(concept.id)}
                      onChange={() => handleDifficultyConceptsChange(concept.id)}
                      className="h-4 w-4 text-indigo-600 border-slate-500 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor={`difficulty-${concept.id}`} className="text-slate-300">{concept.name}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">Какие концепции были наиболее полезными для вас?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {concepts.map(concept => (
                  <div key={concept.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`useful-${concept.id}`}
                      checked={usefulConcepts.includes(concept.id)}
                      onChange={() => handleUsefulConceptsChange(concept.id)}
                      className="h-4 w-4 text-indigo-600 border-slate-500 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor={`useful-${concept.id}`} className="text-slate-300">{concept.name}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">Дополнительные комментарии (необязательно)</h3>
              <textarea
                className="w-full p-3 border border-slate-600 bg-slate-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
                placeholder="Расскажите нам подробнее о вашем опыте прохождения уровня. Что понравилось больше всего? Что можно улучшить?"
                value={comment}
                onChange={handleCommentChange}
                rows={5}
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                className={styles.btnPrimary}
                onClick={handleSubmit}
                disabled={!isValid}
              >
                Отправить отзыв
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
          <section className={styles.section}>
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-indigo-400 mb-4">Спасибо за ваш отзыв!</h2>
              <p className={styles.text}>
                Мы высоко ценим ваше мнение и используем обратную связь для постоянного улучшения нашего курса.
                Ваши комментарии помогут нам сделать обучение более эффективным и интересным для будущих учеников.
              </p>
              
              <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-6 my-8">
                <h3 className="text-xl font-semibold text-indigo-400 mb-3">Что дальше?</h3>
                <p className={styles.text}>
                  Теперь вас ждет небольшой тест для проверки полученных знаний. 
                  После его прохождения вы завершите уровень и получите сертификат!
                </p>
              </div>
              
              <button
                className={styles.btnPrimary}
                onClick={handleContinue}
              >
                Перейти к тесту
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Feedback; 