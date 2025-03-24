import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ReflectionQuestion = {
  id: string;
  question: string;
  type: 'text' | 'choice' | 'rating';
  options?: string[]; // Для вопросов с выбором
  minRating?: number; // Минимальное значение для рейтинга
  maxRating?: number; // Максимальное значение для рейтинга
  required?: boolean;
  hint?: string;
};

type ReflectionAnswer = {
  questionId: string;
  type: 'text' | 'choice' | 'rating';
  textAnswer?: string;
  choiceAnswer?: string;
  ratingAnswer?: number;
};

type ReflectionExerciseProps = {
  title: string;
  description: string;
  questions: ReflectionQuestion[];
  onComplete: (answers: ReflectionAnswer[]) => void;
  onSave?: (answers: ReflectionAnswer[]) => void;
  previousAnswers?: ReflectionAnswer[];
};

const ReflectionExercise: React.FC<ReflectionExerciseProps> = ({
  title,
  description,
  questions,
  onComplete,
  onSave,
  previousAnswers = []
}) => {
  const [answers, setAnswers] = useState<ReflectionAnswer[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showError, setShowError] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Инициализация ответов из предыдущих, если есть
  useEffect(() => {
    if (previousAnswers.length > 0) {
      setAnswers(previousAnswers);
    } else {
      // Иначе создаем пустые ответы для каждого вопроса
      const initialAnswers = questions.map(q => ({
        questionId: q.id,
        type: q.type
      }));
      setAnswers(initialAnswers);
    }
  }, [questions, previousAnswers]);

  // Обработчики для разных типов ответов
  const handleTextAnswer = (questionId: string, value: string) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, textAnswer: value } 
          : a
      )
    );
    setShowError(false);
  };

  const handleChoiceAnswer = (questionId: string, value: string) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, choiceAnswer: value } 
          : a
      )
    );
    setShowError(false);
  };

  const handleRatingAnswer = (questionId: string, value: number) => {
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, ratingAnswer: value } 
          : a
      )
    );
    setShowError(false);
  };

  // Проверка заполнения обязательных полей
  const validateAnswers = () => {
    const requiredQuestions = questions.filter(q => q.required);
    
    for (const q of requiredQuestions) {
      const answer = answers.find(a => a.questionId === q.id);
      
      if (!answer) return false;
      
      if (q.type === 'text' && (!answer.textAnswer || answer.textAnswer.trim() === '')) {
        return false;
      } else if (q.type === 'choice' && !answer.choiceAnswer) {
        return false;
      } else if (q.type === 'rating' && answer.ratingAnswer === undefined) {
        return false;
      }
    }
    
    return true;
  };

  // Сохранение всех ответов
  const saveAnswers = () => {
    if (onSave) {
      onSave(answers);
    }
  };

  // Переход к следующему вопросу
  const goToNextQuestion = () => {
    const currentQuestion = questions[activeQuestionIndex];
    
    // Если текущий вопрос обязательный, проверяем наличие ответа
    if (currentQuestion.required) {
      const answer = answers.find(a => a.questionId === currentQuestion.id);
      let isAnswered = false;
      
      if (answer) {
        if (currentQuestion.type === 'text' && answer.textAnswer && answer.textAnswer.trim() !== '') {
          isAnswered = true;
        } else if (currentQuestion.type === 'choice' && answer.choiceAnswer) {
          isAnswered = true;
        } else if (currentQuestion.type === 'rating' && answer.ratingAnswer !== undefined) {
          isAnswered = true;
        }
      }
      
      if (!isAnswered) {
        setShowError(true);
        return;
      }
    }
    
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setShowError(false);
    } else {
      if (validateAnswers()) {
        setIsComplete(true);
        onComplete(answers);
      } else {
        setShowError(true);
      }
    }
  };

  // Переход к предыдущему вопросу
  const goToPreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
      setShowError(false);
    }
  };

  // Прокрутка к активному вопросу
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeQuestionIndex]);

  // Текущий вопрос
  const currentQuestion = questions[activeQuestionIndex];

  // Проверка заполнен ли текущий вопрос
  const isCurrentQuestionAnswered = () => {
    const answer = answers.find(a => a.questionId === currentQuestion.id);
    
    if (!answer) return false;
    
    if (currentQuestion.type === 'text') {
      return !!answer.textAnswer && answer.textAnswer.trim() !== '';
    } else if (currentQuestion.type === 'choice') {
      return !!answer.choiceAnswer;
    } else if (currentQuestion.type === 'rating') {
      return answer.ratingAnswer !== undefined;
    }
    
    return false;
  };
  
  // Рендер компонента завершения
  if (isComplete) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Рефлексия завершена</h2>
          <p>Спасибо за ваши ответы! Они помогут закрепить полученные знания.</p>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Вы успешно завершили упражнение по рефлексии. Ваши ответы сохранены и помогут вам лучше осмыслить изученный материал.
          </p>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Что дальше?</h3>
            <p className="text-green-700">
              Вы можете вернуться к этим ответам в любое время через свой профиль. Рекомендуем периодически просматривать свои записи для лучшего закрепления материала.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Заголовок */}
      <div className="bg-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p>{description}</p>
      </div>
      
      {/* Индикатор прогресса */}
      <div className="w-full h-2 bg-gray-200">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300" 
          style={{ width: `${((activeQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      {/* Содержимое */}
      <div ref={contentRef} className="p-6 max-h-[70vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Номер вопроса */}
            <div className="flex items-center mb-4">
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                Вопрос {activeQuestionIndex + 1} из {questions.length}
              </span>
              {currentQuestion.required && (
                <span className="ml-2 text-red-500 text-sm">*Обязательный</span>
              )}
            </div>
            
            {/* Вопрос */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>
            
            {/* Подсказка, если есть */}
            {currentQuestion.hint && (
              <div className="mb-4 bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-sm text-blue-700">{currentQuestion.hint}</p>
              </div>
            )}
            
            {/* Поле для ответа в зависимости от типа */}
            <div className="mb-6">
              {currentQuestion.type === 'text' && (
                <textarea
                  value={answers.find(a => a.questionId === currentQuestion.id)?.textAnswer || ''}
                  onChange={(e) => handleTextAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Введите ваш ответ здесь..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 min-h-[150px]"
                />
              )}
              
              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-start p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name={`question_${currentQuestion.id}`}
                        value={option}
                        checked={answers.find(a => a.questionId === currentQuestion.id)?.choiceAnswer === option}
                        onChange={() => handleChoiceAnswer(currentQuestion.id, option)}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {currentQuestion.type === 'rating' && (
                <div className="py-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      {currentQuestion.minRating || 1}
                    </span>
                    <span className="text-sm text-gray-600">
                      {currentQuestion.maxRating || 10}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    {Array.from({ length: (currentQuestion.maxRating || 10) - (currentQuestion.minRating || 1) + 1 }, (_, i) => i + (currentQuestion.minRating || 1)).map(rating => (
                      <button
                        key={rating}
                        onClick={() => handleRatingAnswer(currentQuestion.id, rating)}
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                          ${answers.find(a => a.questionId === currentQuestion.id)?.ratingAnswer === rating
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }
                        `}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Сообщение об ошибке */}
            <AnimatePresence>
              {showError && currentQuestion.required && !isCurrentQuestionAnswered() && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
                >
                  <p className="text-sm text-red-700">
                    Пожалуйста, ответьте на этот вопрос перед тем, как продолжить.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Кнопки навигации */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
        <button
          onClick={goToPreviousQuestion}
          disabled={activeQuestionIndex === 0}
          className={`
            py-2 px-4 rounded-md flex items-center
            ${activeQuestionIndex === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Назад
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={saveAnswers}
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Сохранить
          </button>
          
          <button
            onClick={goToNextQuestion}
            className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            {activeQuestionIndex < questions.length - 1 ? 'Далее' : 'Завершить'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionExercise; 