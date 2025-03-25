import React, { useState } from 'react';
import { motion } from 'framer-motion';

export type QuizQuestion = {
  id: string | number;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
};

type QuizComponentProps = {
  questions: QuizQuestion[];
  onComplete: (score: number, answers: Record<string | number, string>) => void;
};

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string | number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion.id]: optionId
    });
  };
  
  const handleNextQuestion = () => {
    // Calculate if answer was correct
    const selectedOption = currentQuestion.options.find(
      opt => opt.id === selectedOptions[currentQuestion.id]
    );
    
    if (selectedOption?.isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    if (currentQuestion.explanation) {
      setShowExplanation(true);
    } else {
      goToNextQuestion();
    }
  };
  
  const goToNextQuestion = () => {
    setShowExplanation(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizComplete(true);
      onComplete(score + (currentQuestion.options.find(opt => 
        opt.id === selectedOptions[currentQuestion.id])?.isCorrect ? 1 : 0), 
        selectedOptions
      );
    }
  };
  
  const isOptionSelected = (optionId: string) => {
    return selectedOptions[currentQuestion.id] === optionId;
  };
  
  const isAnswered = () => {
    return !!selectedOptions[currentQuestion.id];
  };
  
  if (!currentQuestion) return null;
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-3xl mx-auto">
      {!isQuizComplete ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="text-indigo-400 text-sm font-medium">
              Вопрос {currentQuestionIndex + 1} из {questions.length}
            </div>
            <div className="bg-slate-700 rounded-full h-2 flex-1 mx-4">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all" 
                style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-white text-sm font-medium">
              {Math.round((currentQuestionIndex / questions.length) * 100)}%
            </div>
          </div>
          
          {showExplanation ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
              
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <h4 className="text-indigo-300 font-medium mb-2">Объяснение:</h4>
                <p className="text-white">{currentQuestion.explanation}</p>
              </div>
              
              <button
                onClick={goToNextQuestion}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
                onClick={handleNextQuestion}
                disabled={!isAnswered()}
                className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${
                  isAnswered() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-600 cursor-not-allowed'
                }`}
              >
                Ответить
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl font-bold text-white mb-2">{score}/{questions.length}</div>
          <p className="text-slate-300 mb-6">
            {score === questions.length ? 'Отлично! Вы ответили на все вопросы верно!' : 
             score >= questions.length * 0.7 ? 'Хороший результат! Вы хорошо понимаете материал.' : 
             score >= questions.length * 0.5 ? 'Неплохо, но есть над чем поработать.' : 
             'Попробуйте еще раз после повторения материала.'}
          </p>
          
          <div className="bg-slate-700 rounded-full h-4 mb-6">
            <div 
              className={`h-4 rounded-full ${
                score === questions.length ? 'bg-green-500' : 
                score >= questions.length * 0.7 ? 'bg-green-500' : 
                score >= questions.length * 0.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(score / questions.length) * 100}%` }}
            ></div>
          </div>
          
          <button
            onClick={() => onComplete(score, selectedOptions)}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Завершить
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default QuizComponent; 