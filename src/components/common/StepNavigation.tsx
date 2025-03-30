import React, { useState } from 'react';

interface StepNavigationProps {
  steps: React.ReactNode[];
  onComplete: () => void;
  completeButtonText?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  steps, 
  onComplete,
  completeButtonText = 'Завершить'
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Прогресс */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <div className="h-2 bg-slate-700 rounded-full">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        <span className="ml-4 text-slate-400">
          Шаг {currentStep + 1} из {steps.length}
        </span>
      </div>

      {/* Контент текущего шага */}
      <div className="min-h-[400px]">
        {steps[currentStep]}
      </div>

      {/* Навигация */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-700">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`
            px-6 py-2 rounded-lg font-medium
            ${currentStep === 0 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-slate-700 text-white hover:bg-slate-600'}
          `}
        >
          Назад
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-500"
        >
          {currentStep === steps.length - 1 ? completeButtonText : 'Далее'}
        </button>
      </div>
    </div>
  );
};

export default StepNavigation; 