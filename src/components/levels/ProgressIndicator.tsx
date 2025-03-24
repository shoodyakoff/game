import React from 'react';
import { motion } from 'framer-motion';

type Stage = {
  id: string;
  name: string;
  description?: string;
};

type ProgressIndicatorProps = {
  stages: Stage[];
  currentStage: string;
  progress: number; // 0-100
  showDetails?: boolean;
  className?: string; // Добавим свойство className для обратной совместимости
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  stages,
  currentStage,
  progress,
  showDetails = false,
  className
}) => {
  // Найти индекс текущего этапа
  const currentStageIndex = stages.findIndex(stage => stage.id === currentStage);
  
  // Вычислить стили для каждого этапа
  const getStageStatus = (index: number) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'upcoming';
  };
  
  return (
    <div className={`w-full ${className || ''}`}>
      {/* Индикатор прогресса */}
      <div className="flex items-center justify-between mb-4">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            {/* Круглый индикатор для этапа */}
            <div className="flex flex-col items-center relative">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: getStageStatus(index) === 'current' ? 1.1 : 1 }}
                className={`
                  rounded-full w-10 h-10 flex items-center justify-center relative z-10
                  ${getStageStatus(index) === 'completed' ? 'bg-green-500 text-white' : ''}
                  ${getStageStatus(index) === 'current' ? 'bg-blue-500 text-white ring-4 ring-blue-200' : ''}
                  ${getStageStatus(index) === 'upcoming' ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {getStageStatus(index) === 'completed' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </motion.div>
              
              {/* Название этапа */}
              {showDetails && (
                <div className="mt-2 text-center max-w-[120px]">
                  <span className={`text-xs font-medium
                    ${getStageStatus(index) === 'completed' ? 'text-green-600' : ''}
                    ${getStageStatus(index) === 'current' ? 'text-blue-600' : ''}
                    ${getStageStatus(index) === 'upcoming' ? 'text-gray-500' : ''}
                  `}>
                    {stage.name}
                  </span>
                </div>
              )}
            </div>
            
            {/* Соединительная линия между этапами */}
            {index < stages.length - 1 && (
              <div className="flex-1 h-1 mx-2 relative">
                <div className="absolute inset-0 bg-gray-200 rounded"></div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: index < currentStageIndex 
                      ? '100%' 
                      : (index === currentStageIndex ? `${progress}%` : '0%')
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-blue-500 rounded"
                ></motion.div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Детальное описание текущего этапа, если включены детали */}
      {showDetails && currentStageIndex !== -1 && stages[currentStageIndex].description && (
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
          <h4 className="text-sm font-medium text-blue-700 mb-1">
            Текущий этап: {stages[currentStageIndex].name}
          </h4>
          <p className="text-xs text-blue-600">
            {stages[currentStageIndex].description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator; 