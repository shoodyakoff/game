import React from 'react';
import { useRouter } from 'next/router';
import { LevelStage, stageNames, stageOrder, getStageProgress } from './LevelStages';
import { styles } from './styles';

interface StageNavigationProps {
  currentStage: LevelStage;
  completedStages?: LevelStage[];
  onStageChange?: (stage: LevelStage) => void;
  showBackButton?: boolean;
  goToPreviousStage?: () => void;
}

const StageNavigation: React.FC<StageNavigationProps> = ({ 
  currentStage, 
  completedStages = [], 
  onStageChange, 
  showBackButton = false,
  goToPreviousStage 
}) => {
  const router = useRouter();
  
  const currentStageIndex = stageOrder.indexOf(currentStage);
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === stageOrder.length - 1;
  
  const progress = getStageProgress(currentStage);
  
  // Функция для перехода к конкретному этапу
  const navigateToStage = (stage: LevelStage) => {
    if (onStageChange) {
      onStageChange(stage);
    } else {
      router.push(`/level1?stage=${stage}`);
    }
  };
  
  // Функция для перехода к следующему этапу
  const navigateNext = () => {
    if (!isLastStage) {
      navigateToStage(stageOrder[currentStageIndex + 1]);
    }
  };
  
  // Функция для перехода к предыдущему этапу
  const navigatePrevious = () => {
    if (goToPreviousStage) {
      goToPreviousStage();
    } else if (!isFirstStage) {
      navigateToStage(stageOrder[currentStageIndex - 1]);
    }
  };

  return (
    <div className={styles.stageNavigation}>
      <div className={styles.stageInfo}>
        <h3 className={styles.stageName}>{stageNames[currentStage]}</h3>
        <span className={styles.stageCount}>
          Этап {currentStageIndex + 1} из {stageOrder.length}
        </span>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        ></div>
      </div>
      
      <div className={styles.navigationButtons}>
        <button
          className={`${styles.btnNavigation} ${!showBackButton || isFirstStage ? styles.btnDisabled : ''}`}
          onClick={navigatePrevious}
          disabled={!showBackButton || isFirstStage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Назад
        </button>
        
        <button
          className={`${styles.btnNavigation} ${isLastStage ? styles.btnDisabled : ''}`}
          onClick={navigateNext}
          disabled={isLastStage}
        >
          Далее
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StageNavigation; 