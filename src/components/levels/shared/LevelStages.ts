import { LevelStage } from '../../../types/level';

// Реэкспортируем LevelStage, чтобы его можно было импортировать из этого файла
export { LevelStage };

// Последовательность этапов уровня 1
export const LEVEL_STAGE_SEQUENCE: LevelStage[] = [
  LevelStage.INTRO,
  LevelStage.PRODUCT_THINKING_THEORY,
  LevelStage.PRODUCT_THINKING_PRACTICE,
  LevelStage.UX_ANALYSIS_THEORY,
  LevelStage.UX_ANALYSIS_PRACTICE,
  LevelStage.METRICS_THEORY,
  LevelStage.METRICS_PRACTICE,
  LevelStage.DECISION_MAKING_THEORY,
  LevelStage.DECISION_MAKING_PRACTICE,
  LevelStage.FEEDBACK,
  LevelStage.QUIZ,
  LevelStage.COMPLETE
];

// Получение следующего этапа
export const getNextStage = (currentStage: LevelStage): LevelStage | null => {
  const currentIndex = LEVEL_STAGE_SEQUENCE.indexOf(currentStage);
  return currentIndex < LEVEL_STAGE_SEQUENCE.length - 1 ? LEVEL_STAGE_SEQUENCE[currentIndex + 1] : null;
};

// Получение предыдущего этапа
export const getPreviousStage = (currentStage: LevelStage): LevelStage | null => {
  const currentIndex = LEVEL_STAGE_SEQUENCE.indexOf(currentStage);
  return currentIndex > 0 ? LEVEL_STAGE_SEQUENCE[currentIndex - 1] : null;
};

// Получение названия этапа
export const getStageName = (stage: LevelStage): string => {
  const stageNames = {
    // Этапы первого уровня
    [LevelStage.INTRO]: 'Введение',
    [LevelStage.PRODUCT_THINKING_THEORY]: 'Продуктовое мышление: теория',
    [LevelStage.PRODUCT_THINKING_PRACTICE]: 'Продуктовое мышление: практика',
    [LevelStage.UX_ANALYSIS_THEORY]: 'UX анализ: теория',
    [LevelStage.UX_ANALYSIS_PRACTICE]: 'UX анализ: практика',
    [LevelStage.METRICS_THEORY]: 'Метрики: теория',
    [LevelStage.METRICS_PRACTICE]: 'Метрики: практика',
    [LevelStage.DECISION_MAKING_THEORY]: 'Принятие решений: теория',
    [LevelStage.DECISION_MAKING_PRACTICE]: 'Принятие решений: практика',
    [LevelStage.FEEDBACK]: 'Обратная связь',
    [LevelStage.QUIZ]: 'Финальный тест',
    [LevelStage.COMPLETE]: 'Завершение',

    // Этапы второго уровня
    [LevelStage.STAKEHOLDERS_THEORY]: 'Теория стейкхолдеров',
    [LevelStage.STAKEHOLDER_BRIEFING]: 'Брифинг со стейкхолдерами',
    [LevelStage.REQUIREMENTS_THEORY]: 'Теория требований',
    [LevelStage.REQUIREMENTS_PRACTICE]: 'Практика по требованиям',
    [LevelStage.USERS_RESEARCH_THEORY]: 'Теория исследования пользователей',
    [LevelStage.USERS_RESEARCH_PRACTICE]: 'Практика исследования пользователей',
    [LevelStage.COMPETITORS_THEORY]: 'Теория анализа конкурентов',
    [LevelStage.COMPETITORS_PRACTICE]: 'Практика анализа конкурентов',
    [LevelStage.PLANNING_THEORY]: 'Теория планирования',
    [LevelStage.PLANNING_PRACTICE]: 'Практика планирования',
    [LevelStage.PRESENTATION_THEORY]: 'Теория презентации',
    [LevelStage.PRESENTATION_PRACTICE]: 'Практика презентации'
  };
  return stageNames[stage] || 'Неизвестный этап';
}; 