import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type QuizQuestion = {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string; // Объяснение после ответа
  type: 'single' | 'multiple'; // Один или несколько правильных ответов
  difficulty: 'easy' | 'medium' | 'hard';
  points: number; // Количество очков за правильный ответ
};

type QuizProps = {
  questions: QuizQuestion[];
  onComplete?: (results: QuizResults) => void;
  timeLimit?: number; // Время в секундах на всю викторину, если указано
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
};

export type QuizResults = {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  maxScore: number;
  timeSpent: number; // в секундах
  answerDetails: {
    questionId: string;
    isCorrect: boolean;
    points: number;
    timeSpent: number; // в секундах
  }[];
};

const Quiz: React.FC<QuizProps> = ({
  questions,
  onComplete,
  timeLimit,
  shuffleQuestions = true,
  shuffleOptions = true
}) => {
  // Перемешиваем вопросы, если нужно
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(timeLimit || null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [answerDetails, setAnswerDetails] = useState<QuizResults['answerDetails']>([]);
  
  // Инициализация викторины
  useEffect(() => {
    const shuffledQuestions = shuffleQuestions 
      ? [...questions].sort(() => Math.random() - 0.5) 
      : [...questions];
    
    // Если нужно перемешать варианты ответов
    if (shuffleOptions) {
      shuffledQuestions.forEach(question => {
        question.options = [...question.options].sort(() => Math.random() - 0.5);
      });
    }
    
    setQuizQuestions(shuffledQuestions);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  }, [questions, shuffleQuestions, shuffleOptions]);
  
  // Таймер для ограничения времени
  useEffect(() => {
    if (!remainingTime) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          // Если время вышло, завершаем викторину
          if (prev === 0 && !results) {
            finishQuiz();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remainingTime, results]);
  
  // Форматирование времени в мм:сс
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Текущий вопрос
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  // Обработка выбора ответа
  const handleOptionSelect = (optionId: string) => {
    if (hasAnswered) return;
    
    if (currentQuestion.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      // Для множественного выбора добавляем/удаляем опцию
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }
  };
  
  // Проверка ответа
  const checkAnswer = () => {
    if (!currentQuestion || selectedOptions.length === 0) return;
    
    const correctOptions = currentQuestion.options
      .filter(option => option.isCorrect)
      .map(option => option.id);
    
    let isCorrect = false;
    
    if (currentQuestion.type === 'single') {
      // Для одиночного выбора
      isCorrect = selectedOptions[0] === correctOptions[0];
    } else {
      // Для множественного выбора - все правильные должны быть выбраны и ничего лишнего
      isCorrect = 
        selectedOptions.length === correctOptions.length &&
        selectedOptions.every(id => correctOptions.includes(id));
    }
    
    // Записываем детали ответа
    const answerTime = Math.floor((Date.now() - questionStartTime) / 1000);
    const detail = {
      questionId: currentQuestion.id,
      isCorrect,
      points: isCorrect ? currentQuestion.points : 0,
      timeSpent: answerTime
    };
    
    setAnswerDetails(prev => [...prev, detail]);
    setHasAnswered(true);
  };
  
  // Переход к следующему вопросу
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptions([]);
      setHasAnswered(false);
      setQuestionStartTime(Date.now());
    } else {
      finishQuiz();
    }
  };
  
  // Завершение викторины
  const finishQuiz = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    const correctAnswers = answerDetails.filter(detail => detail.isCorrect).length;
    const score = answerDetails.reduce((sum, detail) => sum + detail.points, 0);
    const maxScore = quizQuestions.reduce((sum, q) => sum + q.points, 0);
    
    const quizResults: QuizResults = {
      totalQuestions: quizQuestions.length,
      correctAnswers,
      incorrectAnswers: quizQuestions.length - correctAnswers,
      score,
      maxScore,
      timeSpent,
      answerDetails
    };
    
    setResults(quizResults);
    
    if (onComplete) {
      onComplete(quizResults);
    }
  };
  
  // Перезапуск викторины
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions([]);
    setHasAnswered(false);
    setResults(null);
    setRemainingTime(timeLimit || null);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setAnswerDetails([]);
    
    // Перемешиваем заново, если нужно
    const shuffledQuestions = shuffleQuestions 
      ? [...questions].sort(() => Math.random() - 0.5) 
      : [...questions];
    
    if (shuffleOptions) {
      shuffledQuestions.forEach(question => {
        question.options = [...question.options].sort(() => Math.random() - 0.5);
      });
    }
    
    setQuizQuestions(shuffledQuestions);
  };
  
  // Если вопросов нет
  if (quizQuestions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Загрузка вопросов...</p>
      </div>
    );
  }
  
  // Если викторина завершена
  if (results) {
    const percentage = Math.round((results.score / results.maxScore) * 100);
    let performance = 'удовлетворительно';
    let performanceColor = 'text-yellow-600';
    
    if (percentage >= 80) {
      performance = 'отлично';
      performanceColor = 'text-green-600';
    } else if (percentage >= 60) {
      performance = 'хорошо';
      performanceColor = 'text-blue-600';
    } else if (percentage < 40) {
      performance = 'требует улучшения';
      performanceColor = 'text-red-600';
    }
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Результаты викторины</h2>
        
        <div className="mb-6 text-center">
          <div className="relative inline-block w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                className="stroke-current text-gray-200"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`stroke-current ${
                  percentage >= 80 ? 'text-green-500' : 
                  percentage >= 60 ? 'text-blue-500' : 
                  percentage >= 40 ? 'text-yellow-500' : 'text-red-500'
                }`}
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.5" className="text-3xl font-bold" textAnchor="middle">
                {percentage}%
              </text>
            </svg>
          </div>
          <p className="mt-2 text-lg">
            Ваш результат: <span className={performanceColor}>{performance}</span>
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Правильных ответов</p>
            <p className="text-xl font-bold text-green-600">{results.correctAnswers} из {results.totalQuestions}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Набранные баллы</p>
            <p className="text-xl font-bold text-blue-600">{results.score} из {results.maxScore}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center col-span-2">
            <p className="text-sm text-gray-600">Затраченное время</p>
            <p className="text-xl font-bold text-indigo-600">{formatTime(results.timeSpent)}</p>
          </div>
        </div>
        
        <button
          onClick={restartQuiz}
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Пройти еще раз
        </button>
      </motion.div>
    );
  }
  
  // Индикатор прогресса
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Шапка с таймером и прогрессом */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-gray-600">
          Вопрос {currentQuestionIndex + 1} из {quizQuestions.length}
        </div>
        {remainingTime !== null && (
          <div className={`text-sm font-medium ${
            remainingTime < 30 ? 'text-red-600' : 'text-gray-600'
          }`}>
            Осталось: {formatTime(remainingTime)}
          </div>
        )}
      </div>
      
      {/* Индикатор прогресса */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-full bg-indigo-600 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Вопрос */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{currentQuestion?.question}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            currentQuestion?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            currentQuestion?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentQuestion?.difficulty === 'easy' ? 'Легкий' : 
             currentQuestion?.difficulty === 'medium' ? 'Средний' : 'Сложный'}
          </span>
        </div>
        
        {currentQuestion?.type === 'multiple' && (
          <p className="text-sm text-gray-600 mb-4">
            (Выберите все правильные ответы)
          </p>
        )}
      </motion.div>
      
      {/* Варианты ответов */}
      <div className="space-y-3 mb-6">
        {currentQuestion?.options.map(option => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={hasAnswered}
            className={`w-full text-left p-3 rounded-md border transition-colors ${
              selectedOptions.includes(option.id)
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${
              hasAnswered
                ? option.isCorrect
                  ? 'bg-green-100 border-green-500'
                  : selectedOptions.includes(option.id)
                    ? 'bg-red-100 border-red-500'
                    : ''
                : ''
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 flex items-center justify-center border rounded-md mr-3 ${
                currentQuestion.type === 'multiple'
                  ? 'rounded-md'
                  : 'rounded-full'
              } ${
                selectedOptions.includes(option.id)
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : 'border-gray-400'
              } ${
                hasAnswered && option.isCorrect
                  ? 'border-green-500 bg-green-500 text-white'
                  : ''
              }`}>
                {selectedOptions.includes(option.id) && !hasAnswered && (
                  currentQuestion.type === 'multiple' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )
                )}
                {hasAnswered && option.isCorrect && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span>{option.text}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Объяснение после ответа */}
      <AnimatePresence>
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md"
          >
            <h4 className="font-medium text-blue-800 mb-1">Объяснение:</h4>
            <p className="text-sm text-blue-700">{currentQuestion?.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Кнопки */}
      <div className="flex justify-end">
        {!hasAnswered ? (
          <button
            onClick={checkAnswer}
            disabled={selectedOptions.length === 0}
            className={`py-2 px-6 rounded-md ${
              selectedOptions.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Проверить
          </button>
        ) : (
          <button
            onClick={goToNextQuestion}
            className="py-2 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {currentQuestionIndex < quizQuestions.length - 1 ? 'Следующий вопрос' : 'Завершить'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;