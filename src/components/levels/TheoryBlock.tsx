import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TheorySlide = {
  title: string;
  content: string;
  image?: string;
};

type TheoryBlockProps = {
  slides: TheorySlide[];
  onComplete: () => void;
};

const TheoryBlock: React.FC<TheoryBlockProps> = ({ slides, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  const skipAll = () => {
    onComplete();
  };
  
  // Индикатор прогресса
  const progressPercentage = ((currentSlide + 1) / slides.length) * 100;
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto my-8">
      {/* Заголовок */}
      <div className="bg-indigo-600 text-white p-4">
        <h2 className="text-xl font-bold">Основы продуктового мышления</h2>
        <p className="text-indigo-100">Краткое введение в концепцию</p>
      </div>
      
      {/* Прогресс бар */}
      <div className="w-full bg-gray-200 h-1">
        <div 
          className="bg-indigo-500 h-1 transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Кнопка пропуска всего */}
      <div className="flex justify-end p-2">
        <button 
          onClick={skipAll}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Пропустить введение
        </button>
      </div>
      
      {/* Контент слайда */}
      <div className="p-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row gap-6"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                {slides[currentSlide].title}
              </h3>
              <div className="prose max-w-none text-gray-600">
                {slides[currentSlide].content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            {slides[currentSlide].image && (
              <div className="md:w-1/3 flex-shrink-0">
                <img 
                  src={slides[currentSlide].image} 
                  alt={slides[currentSlide].title}
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Навигация */}
      <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Слайд {currentSlide + 1} из {slides.length}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className={`px-4 py-2 rounded text-sm ${
              currentSlide === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Назад
          </button>
          
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
          >
            {currentSlide === slides.length - 1 ? 'Завершить' : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheoryBlock; 