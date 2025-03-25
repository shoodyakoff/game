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
    setShowResults(true);
  };

  const isAllQuestionsAnswered = () => {
    return questions.every(question => userAnswers[question.id] !== undefined);
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
    
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const getFeedback = () => {
    const percentage = calculateScore();
    
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
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
          <p className={styles.text}>Этот тест проверит ваши знания по основным темам уровня:</p>
          <ul className={styles.list}>
            <li>Продуктовое мышление</li>
            <li>UX-анализ</li>
            <li>Работа с метриками</li>
            <li>Принятие решений</li>
          </ul>
          <p className={styles.text}>Выберите один правильный ответ для каждого вопроса и нажмите "Проверить результаты" после завершения теста.</p>
        </div>
        
        <div className="space-y-8 mb-8">
          {questions.map(question => (
            <div key={question.id} className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">
                {question.id}. {question.text}
              </h3>
              
              <div className="space-y-3">
                {question.options.map((option, optionIdx) => (
                  <div key={optionIdx} className="flex items-start">
                    <input
                      type="radio"
                      id={`q${question.id}-a${optionIdx}`}
                      name={`question-${question.id}`}
                      value={optionIdx}
                      checked={userAnswers[question.id] === optionIdx}
                      onChange={() => handleAnswerSelect(question.id, optionIdx)}
                      className="mt-1 mr-3"
                      disabled={showResults}
                    />
                    <label 
                      htmlFor={`q${question.id}-a${optionIdx}`}
                      className={`text-slate-300 cursor-pointer flex-1 ${
                        showResults && userAnswers[question.id] === optionIdx && optionIdx === question.correctAnswer
                          ? 'text-green-400 font-medium'
                          : showResults && userAnswers[question.id] === optionIdx && optionIdx !== question.correctAnswer
                            ? 'text-red-400 line-through'
                            : ''
                      }`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              
              {showResults && (
                <div className="mt-4 border-t border-slate-600 pt-3">
                  <div className="mb-2">
                    {userAnswers[question.id] === question.correctAnswer 
                      ? <span className="text-green-400 font-medium">Правильно!</span>
                      : <span className="text-red-400 font-medium">Неправильно</span>
                    }
                    <button
                      className="ml-3 text-sm text-indigo-400 hover:text-indigo-300"
                      onClick={() => toggleExplanation(question.id)}
                    >
                      {showExplanations[question.id] ? 'Скрыть объяснение' : 'Показать объяснение'}
                    </button>
                  </div>
                  
                  {showExplanations[question.id] && (
                    <div className="bg-slate-800 p-3 rounded text-slate-300 text-sm">
                      {question.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!showResults ? (
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={!isAllQuestionsAnswered()}
          >
            Проверить результаты
          </button>
        ) : (
          <div className="text-center p-6 bg-slate-700 rounded-lg border border-slate-600">
            <h2 className="text-xl font-bold text-indigo-400 mb-4">
              Ваш результат: {calculateScore()}%
            </h2>
            <p className="text-slate-300 mb-4">{getFeedback()}</p>
            
            <button
              className={styles.btnSecondary}
              onClick={resetQuiz}
            >
              Пройти тест заново
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Quiz; 