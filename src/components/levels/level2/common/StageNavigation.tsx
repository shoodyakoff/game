import React from 'react';
import { LevelStage } from '../../../../types/level';
import styles from './styles';

// Названия стадий для отображения в навигации
const stageNames = {
  [LevelStage.STAKEHOLDERS_THEORY]: 'Теория стейкхолдеров',
  [LevelStage.STAKEHOLDER_BRIEFING]: 'Брифинг стейкхолдеров',
  [LevelStage.REQUIREMENTS_THEORY]: 'Сбор требований: теория',
  [LevelStage.REQUIREMENTS_PRACTICE]: 'Сбор требований: практика',
  [LevelStage.USERS_RESEARCH_THEORY]: 'Исследование пользователей: теория',
  [LevelStage.USERS_RESEARCH_PRACTICE]: 'Исследование пользователей: практика',
  [LevelStage.COMPETITORS_THEORY]: 'Анализ конкурентов: теория',
  [LevelStage.COMPETITORS_PRACTICE]: 'Анализ конкурентов: практика',
  [LevelStage.PLANNING_THEORY]: 'Планирование: теория',
  [LevelStage.PLANNING_PRACTICE]: 'Планирование: практика',
  [LevelStage.PRESENTATION_THEORY]: 'Презентация: теория',
  [LevelStage.PRESENTATION_PRACTICE]: 'Презентация: практика',
  [LevelStage.COMPLETE]: 'Завершение'
};

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