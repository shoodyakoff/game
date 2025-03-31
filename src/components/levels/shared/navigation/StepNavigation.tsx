import React, { useState } from 'react';

export interface StepNavigationProps {
  steps: React.ReactNode[];
  onComplete?: () => void;
  showBackButton?: boolean;
  continueButtonText?: string;
  completeButtonText?: string;
  showProgress?: boolean;
  showStepNumbers?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  onComplete,
  showBackButton = true,
  continueButtonText = 'Продолжить',
  completeButtonText = 'Далее',
  showProgress = true,
  showStepNumbers = true
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        const stepElement = document.getElementById(`step-content-${currentStep - 1}`);
        if (stepElement) {
          stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };
  
  const handleScrollToStep = (stepIndex: number) => {
    const stepElement = document.getElementById(`step-content-${stepIndex}`);
    if (stepElement) {
      stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  return (
    <div className="step-navigation">
      <div className="step-content mb-6">
        {steps.slice(0, currentStep + 1).map((step, index) => (
          <div 
            key={index} 
            id={`step-content-${index}`} 
            className={`py-6 ${index !== 0 ? 'border-t border-gray-700 mt-8' : ''}`}
          >
            {showStepNumbers && (
              <div className="text-sm text-slate-400 mb-4">
                Шаг {index + 1} из {steps.length}
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