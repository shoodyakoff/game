import React, { useState } from 'react';
import { styles } from '../common/styles';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const Quiz = () => {
  const questions: Question[] = [
    {
      id: 1,
      text: "Что является основной целью продуктового мышления?",
      options: [
        "Максимизация прибыли компании",
        "Создание технически совершенного продукта",
        "Решение проблем пользователей с учетом бизнес-целей",
        "Разработка инновационных технологических решений"
      ],
      correctAnswer: 2,
      explanation: "Продуктовое мышление прежде всего направлено на решение реальных проблем пользователей таким образом, чтобы это соответствовало бизнес-целям компании. Это баланс между потребностями пользователей и бизнес-ценностью."
    },
    {
      id: 2,
      text: "Какой метод UX-анализа лучше всего подходит для выявления проблемных мест в пользовательском пути?",
      options: [
        "A/B тестирование",
        "Анализ воронки конверсии",
        "Мониторинг производительности",
        "Опросы пользователей"
      ],
      correctAnswer: 1,
      explanation: "Анализ воронки конверсии позволяет выявить, на каких этапах пользовательского пути происходит наибольший отток пользователей, что указывает на проблемные места, требующие оптимизации."
    },
    {
      id: 3,
      text: "Какие метрики относятся к категории пользовательской активности?",
      options: [
        "ROI, LTV, CAC",
        "Конверсия, время на задачу, частота использования",
        "Частота сбоев, время загрузки, доступность",
        "NPS, CSAT, CES"
      ],
      correctAnswer: 1,
      explanation: "Метрики пользовательской активности включают показатели, отражающие взаимодействие пользователей с продуктом: конверсию, время, затрачиваемое на выполнение задач, и частоту использования продукта."
    },
    {
      id: 4,
      text: "Что такое RICE-фреймворк в контексте принятия продуктовых решений?",
      options: [
        "Метод оценки пользовательского опыта",
        "Техника проведения интервью с пользователями",
        "Модель приоритизации задач на основе охвата, влияния, уверенности и усилий",
        "Процесс разработки минимально жизнеспособного продукта"
      ],
      correctAnswer: 2,
      explanation: "RICE — это фреймворк для приоритизации продуктовых решений, который учитывает четыре фактора: Reach (охват), Impact (влияние), Confidence (уверенность) и Effort (усилия)."
    },
    {
      id: 5,
      text: "Какая метрика лучше всего отражает удовлетворенность пользователей продуктом?",
      options: [
        "Количество активных пользователей",
        "NPS (Net Promoter Score)",
        "Конверсия",
        "Время, проведенное в приложении"
      ],
      correctAnswer: 1,
      explanation: "NPS (Net Promoter Score) напрямую измеряет готовность пользователей рекомендовать продукт другим, что является сильным индикатором удовлетворенности и лояльности."
    },
    {
      id: 6,
      text: "Какой основной недостаток A/B тестирования?",
      options: [
        "Требует большого количества пользователей для статистической значимости",
        "Не позволяет тестировать визуальные элементы",
        "Дает результаты только для текущих пользователей",
        "Слишком дорогостоящий метод"
      ],
      correctAnswer: 0,
      explanation: "Для получения статистически значимых результатов A/B тестирование требует достаточно большой выборки пользователей, что может быть проблематично для продуктов с небольшой аудиторией."
    },
    {
      id: 7,
      text: "Что является ключевым фактором для успешного внедрения изменений в продукт?",
      options: [
        "Быстрота разработки новых функций",
        "Инновационность предлагаемых решений",
        "Обоснованность решений данными и их связь с бизнес-целями",
        "Технологическая сложность реализации"
      ],
      correctAnswer: 2,
      explanation: "Успешные продуктовые решения основываются на данных и напрямую связаны с бизнес-целями. Это обеспечивает их обоснованность и повышает вероятность положительного влияния на продукт."
    },
    {
      id: 8,
      text: "Какой этап является самым важным в процессе принятия продуктовых решений?",
      options: [
        "Генерация идей",
        "Определение проблемы",
        "Выбор решения",
        "Внедрение решения"
      ],
      correctAnswer: 1,
      explanation: "Четкое определение проблемы является фундаментальным этапом, так как от правильного понимания проблемы зависит эффективность всех последующих шагов и, в конечном счете, качество найденного решения."
    },
    {
      id: 9,
      text: "Что является ключевым преимуществом качественных методов исследования по сравнению с количественными?",
      options: [
        "Они дешевле в реализации",
        "Они позволяют получить глубокое понимание мотивов и потребностей пользователей",
        "Они всегда дают более точные результаты",
        "Они требуют меньше времени на проведение"
      ],
      correctAnswer: 1,
      explanation: "Качественные методы исследования, такие как интервью и фокус-группы, позволяют глубже понять причины поведения пользователей, их мотивы, потребности и боли, что трудно достичь с помощью количественных методов."
    },
    {
      id: 10,
      text: "Какой подход к принятию решений наиболее эффективен в условиях неопределенности?",
      options: [
        "Откладывать решение до получения полной информации",
        "Принимать решение на основе интуиции",
        "Использовать итеративный подход с быстрыми циклами тестирования гипотез",
        "Полагаться исключительно на экспертное мнение"
      ],
      correctAnswer: 2,
      explanation: "В условиях неопределенности наиболее эффективен итеративный подход, при котором гипотезы быстро проверяются на практике, что позволяет получать обратную связь и корректировать решения."
    }
  ];

  const [userAnswers, setUserAnswers] = useState<{[key: number]: number | null}>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanations, setShowExplanations] = useState<{[key: number]: boolean}>({});

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    // Проверяем, что на все вопросы есть ответы
    const answeredQuestions = Object.keys(userAnswers).length;
    if (answeredQuestions < questions.length) {
      alert(`Пожалуйста, ответьте на все вопросы. Осталось ответить на ${questions.length - answeredQuestions} вопросов.`);
      return;
    }
    
    setShowResults(true);
  };

  const toggleExplanation = (questionId: number) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    
    questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    return {
      score: correctAnswers,
      percentage: (correctAnswers / questions.length) * 100
    };
  };

  const getFeedback = () => {
    const { percentage } = calculateScore();
    
    if (percentage >= 90) {
      return "Отлично! Вы продемонстрировали глубокое понимание продуктового мышления, UX-анализа, работы с метриками и принятия решений.";
    } else if (percentage >= 70) {
      return "Хорошо! У вас есть твердое понимание основных концепций, но есть области, которые можно улучшить.";
    } else if (percentage >= 50) {
      return "Удовлетворительно. Вы усвоили некоторые ключевые концепции, но рекомендуется повторить материал для лучшего понимания.";
    } else {
      return "Вам следует более внимательно изучить материал. Рекомендуется вернуться к теоретическим блокам и повторить ключевые концепции.";
    }
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setShowResults(false);
    setShowExplanations({});
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Тестирование знаний</h1>
      
      <section className={styles.section}>
        <div className={styles.quizInstructions}>
          <p>Этот тест проверит ваши знания по основным темам уровня:</p>
          <ul>
            <li>Продуктовое мышление</li>
            <li>UX-анализ</li>
            <li>Работа с метриками</li>
            <li>Принятие решений</li>
          </ul>
          <p>Выберите один правильный ответ для каждого вопроса и нажмите "Проверить результаты" после завершения теста.</p>
        </div>
        
        <div className={styles.quizContainer}>
          {questions.map((question, idx) => (
            <div key={question.id} className={styles.questionContainer}>
              <h3 className={styles.questionText}>
                {idx + 1}. {question.text}
              </h3>
              
              <div className={styles.optionsContainer}>
                {question.options.map((option, optionIdx) => (
                  <div key={optionIdx} className={styles.optionItem}>
                    <input
                      type="radio"
                      id={`q${question.id}-o${optionIdx}`}
                      name={`question-${question.id}`}
                      value={optionIdx}
                      checked={userAnswers[question.id] === optionIdx}
                      onChange={() => handleAnswerSelect(question.id, optionIdx)}
                      disabled={showResults}
                    />
                    <label 
                      htmlFor={`q${question.id}-o${optionIdx}`}
                      className={
                        showResults 
                          ? optionIdx === question.correctAnswer 
                            ? styles.correctOption 
                            : userAnswers[question.id] === optionIdx 
                              ? styles.incorrectOption 
                              : '' 
                          : ''
                      }
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              
              {showResults && (
                <div className={styles.resultFeedback}>
                  <div className={styles.answerStatus}>
                    {userAnswers[question.id] === question.correctAnswer 
                      ? <span className={styles.correctAnswer}>Правильно!</span> 
                      : <span className={styles.incorrectAnswer}>Неправильно</span>
                    }
                    <button 
                      className={styles.explanationToggle}
                      onClick={() => toggleExplanation(question.id)}
                    >
                      {showExplanations[question.id] ? 'Скрыть объяснение' : 'Показать объяснение'}
                    </button>
                  </div>
                  
                  {showExplanations[question.id] && (
                    <div className={styles.explanationText}>
                      {question.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {!showResults && (
            <button 
              className={styles.submitButton}
              onClick={handleSubmit}
            >
              Проверить результаты
            </button>
          )}
          
          {showResults && (
            <div className={styles.quizResults}>
              <h2 className={styles.resultsHeader}>
                Ваш результат: {calculateScore().score} из {questions.length} ({Math.round(calculateScore().percentage)}%)
              </h2>
              <p className={styles.resultsFeedback}>{getFeedback()}</p>
              
              <button 
                className={styles.resetButton}
                onClick={resetQuiz}
              >
                Пройти тест заново
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Quiz; 