import React from 'react';
import LevelStage, { stageNames } from './LevelStages';
import styles from './styles';

interface StageNavigationProps {
  currentStage: LevelStage;
  goToPreviousStage: () => void;
  goToNextStage: () => void;
  isLoading: boolean;
  disableNext?: boolean;
  nextButtonLabel?: string;
}

const StageNavigation: React.FC<StageNavigationProps> = ({
  currentStage,
  goToPreviousStage,
  goToNextStage,
  isLoading,
  disableNext = false,
  nextButtonLabel
}) => {
  // Показываем кнопку "Назад" для всех этапов, кроме первого
  const showBackButton = currentStage !== LevelStage.STAKEHOLDERS_THEORY;
  
  // Текст кнопки "Далее" по умолчанию - название следующего этапа
  const defaultNextLabel = `К ${stageNames[currentStage]}`;
  
  return (
    <div className={styles.navContainer}>
      {showBackButton ? (
        <button
          className={styles.btnSecondary}
          onClick={goToPreviousStage}
          disabled={isLoading}
        >
          Назад
        </button>
      ) : (
        <div></div> // Пустой div для сохранения выравнивания
      )}
      
      <button
        className={styles.btnPrimary}
        onClick={goToNextStage}
        disabled={isLoading || disableNext}
      >
        {isLoading ? 'Загрузка...' : nextButtonLabel || defaultNextLabel}
      </button>
    </div>
  );
};

export default StageNavigation; 