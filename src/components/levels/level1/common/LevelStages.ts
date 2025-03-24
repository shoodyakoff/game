/**
 * Перечисление всех этапов первого уровня
 */
export enum LevelStage {
  INTRODUCTION = 'introduction',
  TEAM_MEETING = 'team_meeting',
  PRODUCT_MINDSET_THEORY = 'product_mindset_theory',
  UX_ANALYSIS_THEORY = 'ux_analysis_theory',
  UX_ANALYSIS = 'ux_analysis',
  UX_ANALYSIS_PRACTICE = 'ux_analysis_practice',
  METRICS_THEORY = 'metrics_theory',
  METRICS_ANALYSIS = 'metrics_analysis',
  METRICS_PRACTICE = 'metrics_practice',
  DECISION_MAKING_THEORY = 'decision_making_theory',
  DECISION_MAKING_PRACTICE = 'decision_making_practice',
  USER_RESEARCH = 'user_research',
  SOLUTION_DESIGN = 'solution_design',
  IMPLEMENTATION_PLAN = 'implementation_plan',
  FEEDBACK = 'feedback',
  QUIZ = 'quiz',
  FINAL_TEST = 'final_test',
  COMPLETION = 'completion'
}

/**
 * Названия этапов для отображения пользователю
 */
export const stageNames: Record<LevelStage, string> = {
  [LevelStage.INTRODUCTION]: 'Введение',
  [LevelStage.TEAM_MEETING]: 'Командная встреча',
  [LevelStage.PRODUCT_MINDSET_THEORY]: 'Теория продуктового мышления',
  [LevelStage.UX_ANALYSIS_THEORY]: 'Теория UX-анализа',
  [LevelStage.UX_ANALYSIS]: 'UX анализ',
  [LevelStage.UX_ANALYSIS_PRACTICE]: 'Практика UX-анализа',
  [LevelStage.METRICS_THEORY]: 'Теория метрик',
  [LevelStage.METRICS_ANALYSIS]: 'Анализ метрик',
  [LevelStage.METRICS_PRACTICE]: 'Практика анализа метрик',
  [LevelStage.DECISION_MAKING_THEORY]: 'Теория принятия решений',
  [LevelStage.DECISION_MAKING_PRACTICE]: 'Практика принятия решений',
  [LevelStage.USER_RESEARCH]: 'Исследование пользователей',
  [LevelStage.SOLUTION_DESIGN]: 'Проектирование решения',
  [LevelStage.IMPLEMENTATION_PLAN]: 'План внедрения',
  [LevelStage.FEEDBACK]: 'Обратная связь',
  [LevelStage.QUIZ]: 'Тест',
  [LevelStage.FINAL_TEST]: 'Итоговый тест',
  [LevelStage.COMPLETION]: 'Завершение уровня'
};

/**
 * Описания этапов для отображения пользователю
 */
export const stageDescriptions: Record<LevelStage, string> = {
  [LevelStage.INTRODUCTION]: 'Знакомство с проектом и целями обучения',
  [LevelStage.TEAM_MEETING]: 'Встреча с командой TaskMaster для обсуждения проблем в процессе создания задач',
  [LevelStage.PRODUCT_MINDSET_THEORY]: 'Основы продуктового мышления и подхода',
  [LevelStage.UX_ANALYSIS_THEORY]: 'Теоретические основы UX-анализа и оценки пользовательского опыта',
  [LevelStage.UX_ANALYSIS]: 'Оценка пользовательского опыта и выявление проблем в текущем интерфейсе',
  [LevelStage.UX_ANALYSIS_PRACTICE]: 'Практическое применение методов UX-анализа',
  [LevelStage.METRICS_THEORY]: 'Теоретические основы работы с метриками продукта',
  [LevelStage.METRICS_ANALYSIS]: 'Анализ метрик производительности текущего процесса создания задач',
  [LevelStage.METRICS_PRACTICE]: 'Практическое применение анализа метрик',
  [LevelStage.DECISION_MAKING_THEORY]: 'Теоретические основы принятия продуктовых решений',
  [LevelStage.DECISION_MAKING_PRACTICE]: 'Практика принятия решений на основе данных',
  [LevelStage.USER_RESEARCH]: 'Анализ отзывов пользователей и проведение пользовательских интервью',
  [LevelStage.SOLUTION_DESIGN]: 'Разработка и обоснование решения для улучшения процесса создания задач',
  [LevelStage.IMPLEMENTATION_PLAN]: 'Создание плана внедрения и тестирования нового решения',
  [LevelStage.FEEDBACK]: 'Сбор обратной связи по обучающему модулю',
  [LevelStage.QUIZ]: 'Проверка знаний по изученному материалу',
  [LevelStage.FINAL_TEST]: 'Проверка полученных знаний и навыков',
  [LevelStage.COMPLETION]: 'Подведение итогов и следующие шаги'
};

/**
 * Порядок этапов для навигации
 */
export const stageOrder: LevelStage[] = [
  LevelStage.INTRODUCTION,
  LevelStage.TEAM_MEETING,
  LevelStage.PRODUCT_MINDSET_THEORY,
  LevelStage.UX_ANALYSIS_THEORY,
  LevelStage.UX_ANALYSIS,
  LevelStage.UX_ANALYSIS_PRACTICE,
  LevelStage.METRICS_THEORY,
  LevelStage.METRICS_ANALYSIS,
  LevelStage.METRICS_PRACTICE,
  LevelStage.DECISION_MAKING_THEORY,
  LevelStage.DECISION_MAKING_PRACTICE,
  LevelStage.USER_RESEARCH,
  LevelStage.SOLUTION_DESIGN,
  LevelStage.IMPLEMENTATION_PLAN,
  LevelStage.FEEDBACK,
  LevelStage.QUIZ,
  LevelStage.COMPLETION
];

/**
 * Функция для получения следующего этапа
 */
export const getNextStage = (currentStage: LevelStage): LevelStage | undefined => {
  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
    return undefined;
  }
  return stageOrder[currentIndex + 1];
};

/**
 * Функция для получения предыдущего этапа
 */
export const getPreviousStage = (currentStage: LevelStage): LevelStage | undefined => {
  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex <= 0) {
    return undefined;
  }
  return stageOrder[currentIndex - 1];
};

/**
 * Функция для получения прогресса прохождения уровня (в процентах)
 */
export const getStageProgress = (currentStage: LevelStage): number => {
  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex === -1) {
    return 0;
  }
  return Math.round(((currentIndex + 1) / stageOrder.length) * 100);
};

/**
 * Функция для получения названия этапа
 */
export const getStageName = (stage: LevelStage): string => {
  return stageNames[stage] || 'Неизвестный этап';
};

/**
 * Константа со всеми этапами в порядке следования
 */
export const LEVEL_STAGE_SEQUENCE = stageOrder; 