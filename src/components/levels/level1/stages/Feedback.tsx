import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { styles } from '../common/styles';
import { LevelStage, getNextStage } from '../common/LevelStages';

const Feedback = () => {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(null);
  const [difficultyConcepts, setDifficultyConcepts] = useState<string[]>([]);
  const [usefulConcepts, setUsefulConcepts] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
    const nextStage = getNextStage(LevelStage.FEEDBACK);
    router.push(`/level1?stage=${nextStage}`);
  };

  const isSubmitDisabled = rating === null;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Обратная связь</h1>
      
      {!submitted ? (
        <div className={styles.feedbackForm}>
          <section className={styles.section}>
            <h2 className={styles.subheader}>Ваше мнение важно для нас!</h2>
            <p className={styles.text}>
              Пожалуйста, поделитесь своими впечатлениями от пройденного материала. 
              Ваша обратная связь поможет нам сделать курс еще лучше.
            </p>
            
            <div className={styles.feedbackSection}>
              <h3 className={styles.feedbackSectionTitle}>Общая оценка уровня</h3>
              <div className={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    className={`${styles.ratingButton} ${rating === value ? styles.ratingActive : ''}`}
                    onClick={() => handleRatingChange(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className={styles.ratingLabels}>
                <span>Совсем не понравилось</span>
                <span>Очень понравилось</span>
              </div>
            </div>
            
            <div className={styles.feedbackSection}>
              <h3 className={styles.feedbackSectionTitle}>Какие концепции были наиболее сложными для понимания?</h3>
              <div className={styles.conceptsGrid}>
                {concepts.map(concept => (
                  <div key={concept.id} className={styles.conceptCheckbox}>
                    <input
                      type="checkbox"
                      id={`difficulty-${concept.id}`}
                      checked={difficultyConcepts.includes(concept.id)}
                      onChange={() => handleDifficultyConceptsChange(concept.id)}
                    />
                    <label htmlFor={`difficulty-${concept.id}`}>{concept.name}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.feedbackSection}>
              <h3 className={styles.feedbackSectionTitle}>Какие концепции были наиболее полезными для вас?</h3>
              <div className={styles.conceptsGrid}>
                {concepts.map(concept => (
                  <div key={concept.id} className={styles.conceptCheckbox}>
                    <input
                      type="checkbox"
                      id={`useful-${concept.id}`}
                      checked={usefulConcepts.includes(concept.id)}
                      onChange={() => handleUsefulConceptsChange(concept.id)}
                    />
                    <label htmlFor={`useful-${concept.id}`}>{concept.name}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.feedbackSection}>
              <h3 className={styles.feedbackSectionTitle}>Дополнительные комментарии (необязательно)</h3>
              <textarea
                className={styles.commentTextarea}
                placeholder="Расскажите нам подробнее о вашем опыте прохождения уровня. Что понравилось больше всего? Что можно улучшить?"
                value={comment}
                onChange={handleCommentChange}
                rows={5}
              />
            </div>
            
            <div className={styles.feedbackSection}>
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
        <div className={styles.thankYouContainer}>
          <section className={styles.section}>
            <div className={styles.thankYouContent}>
              <h2 className={styles.thankYouTitle}>Спасибо за ваш отзыв!</h2>
              <p className={styles.thankYouText}>
                Мы высоко ценим ваше мнение и используем обратную связь для постоянного улучшения нашего курса.
                Ваши комментарии помогут нам сделать обучение более эффективным и интересным для будущих учеников.
              </p>
              
              <div className={styles.completionMessage}>
                <h3 className={styles.completionMessageTitle}>Что дальше?</h3>
                <p className={styles.completionMessageText}>
                  Теперь вас ждет небольшой тест для проверки полученных знаний. 
                  После его прохождения вы завершите уровень и получите сертификат!
                </p>
              </div>
              
              <button
                className={styles.continueButton}
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