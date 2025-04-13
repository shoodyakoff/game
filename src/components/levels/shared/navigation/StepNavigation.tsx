import React, { useState, useEffect } from 'react';

export interface StepNavigationProps {
  steps: React.ReactNode[];
  onComplete?: () => void;
  showBackButton?: boolean;
  continueButtonText?: string;
  completeButtonText?: string;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  persistStepKey?: string;
  showOnlyCurrentStep?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  onComplete,
  showBackButton = true,
  continueButtonText = 'Продолжить',
  completeButtonText = 'Далее',
  showProgress = true,
  showStepNumbers = true,
  currentStep: externalCurrentStep,
  onStepChange,
  persistStepKey,
  showOnlyCurrentStep = false
}) => {
  // Используем управляемый (controlled) или неуправляемый (uncontrolled) режим в зависимости от наличия props
  const [internalCurrentStep, setInternalCurrentStep] = useState(0);
  
  // Определяем, какой state используем
  const currentStep = externalCurrentStep !== undefined ? externalCurrentStep : internalCurrentStep;
  
  // Обработчик изменения шага для обоих режимов
  const handleStepChange = (newStep: number) => {
    if (onStepChange) {
      onStepChange(newStep);
    } else {
      setInternalCurrentStep(newStep);
    }
    
    // Сохраняем в localStorage, если указан ключ
    if (persistStepKey && typeof window !== 'undefined') {
      localStorage.setItem(persistStepKey, newStep.toString());
    }
  };
  
  // Загружаем сохраненное значение при инициализации
  useEffect(() => {
    if (persistStepKey && typeof window !== 'undefined' && externalCurrentStep === undefined) {
      const savedStep = localStorage.getItem(persistStepKey);
      if (savedStep) {
        const step = parseInt(savedStep, 10);
        setInternalCurrentStep(step);
      }
    }
  }, [persistStepKey, externalCurrentStep]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
      setTimeout(() => {
        const stepElement = document.getElementById(`step-content-${currentStep + 1}`);
        if (stepElement) {
          // Скролл с учетом высоты верхнего навбара (добавляем отступ около 100px)
          const navbarHeight = 80; // Примерная высота навбара
          const elementPosition = stepElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      onComplete?.();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
      setTimeout(() => {
        const stepElement = document.getElementById(`step-content-${currentStep - 1}`);
        if (stepElement) {
          // Скролл с учетом высоты верхнего навбара (добавляем отступ около 100px)
          const navbarHeight = 80; // Примерная высота навбара
          const elementPosition = stepElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };
  
  const handleScrollToStep = (stepIndex: number) => {
    const stepElement = document.getElementById(`step-content-${stepIndex}`);
    if (stepElement) {
      // Скролл с учетом высоты верхнего навбара
      const navbarHeight = 80; // Примерная высота навбара
      const elementPosition = stepElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="step-navigation">
      <div className="step-content mb-6">
        {(showOnlyCurrentStep ? steps.slice(currentStep, currentStep + 1) : steps.slice(0, currentStep + 1)).map((step, index) => (
          <div 
            key={showOnlyCurrentStep ? currentStep : index} 
            id={`step-content-${showOnlyCurrentStep ? currentStep : index}`} 
            className={`py-6 ${index !== 0 && !showOnlyCurrentStep ? 'border-t border-gray-700 mt-8' : 'mt-4'}`}
          >
            {showStepNumbers && (
              <div className="text-sm text-slate-400 mb-4">
                Шаг {showOnlyCurrentStep ? currentStep + 1 : index + 1} из {steps.length}
              </div>
            )}
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
          
          {showProgress && (
            <div className="flex items-center">
              {steps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 mx-1 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-indigo-500' : 'bg-gray-600'
                  } ${index === currentStep ? 'w-10' : 'w-4'}`}
                  onClick={() => index <= currentStep && handleScrollToStep(index)}
                  style={{ cursor: index <= currentStep ? 'pointer' : 'default' }}
                />
              ))}
              {showStepNumbers && (
                <span className="ml-3 text-white text-sm font-medium">
                  {currentStep + 1} / {steps.length}
                </span>
              )}
            </div>
          )}
          
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
      
      <div className="h-20"></div>
    </div>
  );
};

export default StepNavigation; 