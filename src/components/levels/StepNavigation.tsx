import React, { useState } from 'react';

interface StepNavigationProps {
  steps: React.ReactNode[];
  onComplete?: () => void;
  showBackButton?: boolean;
  continueButtonText?: string;
  completeButtonText?: string;
}

/**
 * Компонент для пошаговой навигации по контенту
 * 
 * @param steps Массив React-компонентов, представляющих каждый шаг
 * @param onComplete Функция, которая будет вызвана при завершении всех шагов
 * @param showBackButton Отображать ли кнопку "Назад"
 * @param continueButtonText Текст для кнопки продолжения (по умолчанию "Продолжить")
 * @param completeButtonText Текст для кнопки завершения (по умолчанию "Завершить")
 */
const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  onComplete,
  showBackButton = true,
  continueButtonText = 'Продолжить',
  completeButtonText = 'Далее'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Перейти к следующему шагу
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Прокручиваем к началу нового шага после небольшой задержки
      setTimeout(() => {
        const stepElement = document.getElementById(`step-content-${currentStep + 1}`);
        if (stepElement) {
          stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      onComplete?.();
    }
  };
  
  // Вернуться к предыдущему шагу
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Прокручиваем к началу предыдущего шага после небольшой задержки
      setTimeout(() => {
        const stepElement = document.getElementById(`step-content-${currentStep - 1}`);
        if (stepElement) {
          stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };
  
  // Прокрутка к определенному шагу
  const handleScrollToStep = (stepIndex: number) => {
    const stepElement = document.getElementById(`step-content-${stepIndex}`);
    if (stepElement) {
      stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  return (
    <div className="step-navigation">
      <div className="step-content mb-6">
        {/* Рендерим все шаги до текущего включительно */}
        {steps.slice(0, currentStep + 1).map((step, index) => (
          <div 
            key={index} 
            id={`step-content-${index}`} 
            className={`py-6 ${index !== 0 ? 'border-t border-gray-700 mt-8' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-indigo-950/80 backdrop-blur-sm p-4 border-t border-indigo-800 shadow-md z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            {showBackButton && currentStep > 0 && (
              <button 
                className="text-slate-300 hover:text-white py-2 px-4 rounded transition-colors"
                onClick={handleBack}
              >
                Назад
              </button>
            )}
          </div>
          
          {/* Индикатор прогресса */}
          <div className="flex items-center">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-6 mx-1 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-indigo-500' : 'bg-gray-600'
                } ${index === currentStep ? 'w-10' : 'w-4'}`}
                onClick={() => index <= currentStep && handleScrollToStep(index)}
                style={{ cursor: index <= currentStep ? 'pointer' : 'default' }}
              />
            ))}
            <span className="ml-3 text-white text-sm font-medium">
              {currentStep + 1} / {steps.length}
            </span>
          </div>
          
          <div>
            {currentStep < steps.length - 1 ? (
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded shadow-md transition-colors"
                onClick={handleNext}
              >
                {continueButtonText}
              </button>
            ) : (
              <button 
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow-md transition-colors"
                onClick={onComplete}
              >
                {completeButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Добавляем отступ внизу для фиксированной панели навигации */}
      <div className="h-20"></div>
    </div>
  );
};

export default StepNavigation; 