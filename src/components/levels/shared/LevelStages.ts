import { LevelStage } from '../../../types/level';

// Реэкспортируем LevelStage, чтобы его можно было импортировать из этого файла
export { LevelStage };

// Последовательность этапов уровня 1
export const LEVEL_STAGE_SEQUENCE: LevelStage[] = [
  LevelStage.INTRODUCTION,
  LevelStage.TEAM_MEETING,
  LevelStage.PRODUCT_MINDSET_THEORY,
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
  const stageNames: Record<LevelStage, string> = {
    // Этапы первого уровня
    [LevelStage.INTRODUCTION]: 'Введение',
    [LevelStage.TEAM_MEETING]: 'Встреча с командой',
    [LevelStage.PRODUCT_MINDSET_THEORY]: 'Теория продуктового мышления',
    [LevelStage.PRODUCT_THINKING_PRACTICE]: 'Практика продуктового мышления',
    [LevelStage.UX_ANALYSIS_THEORY]: 'Теория UX-анализа',
    [LevelStage.UX_ANALYSIS_PRACTICE]: 'Практика UX-анализа',
    [LevelStage.METRICS_THEORY]: 'Теория метрик',
    [LevelStage.METRICS_PRACTICE]: 'Практика по метрикам',
    [LevelStage.DECISION_MAKING_THEORY]: 'Теория принятия решений',
    [LevelStage.DECISION_MAKING_PRACTICE]: 'Практика принятия решений',
    [LevelStage.FEEDBACK]: 'Обратная связь',
    [LevelStage.QUIZ]: 'Тест',
    [LevelStage.COMPLETE]: 'Завершение уровня',

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
  return stageNames[stage];
}; 