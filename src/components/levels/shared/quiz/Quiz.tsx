import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type QuizQuestion = {
  id: string | number;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
  type: 'single' | 'multiple';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
};

export type QuizProps = {
  questions: QuizQuestion[];
  onComplete?: (results: QuizResults) => void;
  timeLimit?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showProgress?: boolean;
  showTimer?: boolean;
};

export type QuizResults = {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  maxScore: number;
  timeSpent: number;
  answerDetails: {
    questionId: string | number;
    isCorrect: boolean;
    points: number;
    timeSpent: number;
  }[];
};

const Quiz: React.FC<QuizProps> = ({
  questions,
  onComplete,
  timeLimit,
  shuffleQuestions = true,
  shuffleOptions = true,
  showProgress = true,
  showTimer = true
}) => {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string | number, string[]>>({});
  const [showExplanation, setShowExplanation] = useState(false);
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
    
    if (shuffleOptions) {
      shuffledQuestions.forEach(question => {
        question.options = [...question.options].sort(() => Math.random() - 0.5);
      });
    }
    
    setQuizQuestions(shuffledQuestions);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  }, [questions, shuffleQuestions, shuffleOptions]);

  // Таймер
  useEffect(() => {
    if (!remainingTime || !showTimer) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          if (prev === 0 && !results) {
            finishQuiz();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remainingTime, results, showTimer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionSelect = (optionId: string) => {
    if (showExplanation) return;

    const currentId = currentQuestion.id;
    const currentSelections = selectedOptions[currentId] || [];

    if (currentQuestion.type === 'single') {
      setSelectedOptions({
        ...selectedOptions,
        [currentId]: [optionId]
      });
    } else {
      const newSelections = currentSelections.includes(optionId)
        ? currentSelections.filter(id => id !== optionId)
        : [...currentSelections, optionId];
      
      setSelectedOptions({
        ...selectedOptions,
        [currentId]: newSelections
      });
    }
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;

    const currentId = currentQuestion.id;
    const selectedIds = selectedOptions[currentId] || [];
    const correctOptions = currentQuestion.options
      .filter(option => option.isCorrect)
      .map(option => option.id);

    let isCorrect = false;
    if (currentQuestion.type === 'single') {
      isCorrect = selectedIds[0] === correctOptions[0];
    } else {
      isCorrect = 
        selectedIds.length === correctOptions.length &&
        selectedIds.every(id => correctOptions.includes(id));
    }

    const answerTime = Math.floor((Date.now() - questionStartTime) / 1000);
    const detail = {
      questionId: currentId,
      isCorrect,
      points: isCorrect ? currentQuestion.points : 0,
      timeSpent: answerTime
    };

    setAnswerDetails(prev => [...prev, detail]);
    setShowExplanation(true);
  };

  const goToNextQuestion = () => {
    setShowExplanation(false);
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      finishQuiz();
    }
  };

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

  const isOptionSelected = (optionId: string) => {
    const currentId = currentQuestion.id;
    return (selectedOptions[currentId] || []).includes(optionId);
  };

  const isAnswered = () => {
    const currentId = currentQuestion.id;
    return (selectedOptions[currentId] || []).length > 0;
  };

  if (!currentQuestion) return null;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-3xl mx-auto">
      {!results ? (
        <>
          {showProgress && (
            <div className="flex justify-between items-center mb-6">
              <div className="text-indigo-400 text-sm font-medium">
                Вопрос {currentQuestionIndex + 1} из {quizQuestions.length}
              </div>
              <div className="bg-slate-700 rounded-full h-2 flex-1 mx-4">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all" 
                  style={{ width: `${((currentQuestionIndex) / quizQuestions.length) * 100}%` }}
                />
              </div>
              <div className="text-white text-sm font-medium">
                {Math.round((currentQuestionIndex / quizQuestions.length) * 100)}%
              </div>
            </div>
          )}

          {showTimer && remainingTime !== null && (
            <div className="text-center mb-4">
              <span className="text-indigo-400 font-medium">
                Осталось времени: {formatTime(remainingTime)}
              </span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {showExplanation ? (
              <motion.div
                key="explanation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <h3 className="text-lg font-medium text-white mb-4">{currentQuestion.question}</h3>
                
                <div className="mb-6">
                  {currentQuestion.options.map((option) => {
                    const isSelected = isOptionSelected(option.id);
                    const bgColor = isSelected 
                      ? (option.isCorrect ? 'bg-green-600' : 'bg-red-600')
                      : option.isCorrect ? 'bg-green-600' : 'bg-slate-700';
                    
                    return (
                      <div 
                        key={option.id}
                        className={`${bgColor} p-4 rounded-lg mb-3 transition-colors`}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 border ${
                            isSelected ? 'bg-white border-white' : 'border-slate-500'
                          }`}>
                            {isSelected && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-800">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="text-white">{option.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {currentQuestion.explanation && (
                  <div className="bg-slate-700 rounded-lg p-4 mb-6">
                    <h4 className="text-indigo-300 font-medium mb-2">Объяснение:</h4>
                    <p className="text-white">{currentQuestion.explanation}</p>
                  </div>
                )}
                
                <button
                  onClick={goToNextQuestion}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="question"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-medium text-white mb-6">{currentQuestion.question}</h3>
                
                <div className="mb-6">
                  {currentQuestion.options.map((option) => (
                    <div 
                      key={option.id}
                      className={`${
                        isOptionSelected(option.id) ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                      } p-4 rounded-lg mb-3 cursor-pointer border transition-colors`}
                      onClick={() => handleOptionSelect(option.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 border ${
                          isOptionSelected(option.id) ? 'bg-white border-white' : 'border-slate-500'
                        }`}>
                          {isOptionSelected(option.id) && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-600">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-white">{option.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={checkAnswer}
                  disabled={!isAnswered()}
                  className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${
                    isAnswered() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-600 cursor-not-allowed'
                  }`}
                >
                  Ответить
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl font-bold text-white mb-2">
            {results.score}/{results.maxScore}
          </div>
          <p className="text-slate-300 mb-6">
            {results.score === results.maxScore ? 'Отлично! Вы ответили на все вопросы верно!' : 
             results.score >= results.maxScore * 0.7 ? 'Хороший результат! Вы хорошо понимаете материал.' : 
             results.score >= results.maxScore * 0.5 ? 'Неплохо, но есть над чем поработать.' : 
             'Попробуйте еще раз после повторения материала.'}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{results.correctAnswers}</div>
              <div className="text-slate-300">Правильных ответов</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-400">{results.incorrectAnswers}</div>
              <div className="text-slate-300">Неправильных ответов</div>
            </div>
          </div>
          {showTimer && (
            <div className="text-slate-300 mb-6">
              Затраченное время: {formatTime(results.timeSpent)}
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Попробовать снова
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz; 