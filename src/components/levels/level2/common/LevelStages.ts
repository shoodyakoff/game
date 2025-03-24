// Этапы уровня 2
export enum LevelStage {
  // Теоретические блоки
  STAKEHOLDERS_THEORY = 'stakeholders_theory',
  REQUIREMENTS_THEORY = 'requirements_theory',
  USERS_RESEARCH_THEORY = 'users_research_theory',
  COMPETITORS_THEORY = 'competitors_theory', 
  PLANNING_THEORY = 'planning_theory',
  PRESENTATION_THEORY = 'presentation_theory',
  
  // Практические блоки
  STAKEHOLDER_BRIEFING = 'stakeholder_briefing',
  REQUIREMENTS_PRACTICE = 'requirements_practice',
  USERS_RESEARCH_PRACTICE = 'users_research_practice',
  COMPETITORS_PRACTICE = 'competitors_practice',
  PLANNING_PRACTICE = 'planning_practice',
  PRESENTATION_PRACTICE = 'presentation_practice',
  
  // Заключительные блоки
  QUIZ = 'quiz',
  COMPLETE = 'complete'
}

// Определение маршрутов перехода между этапами
export const nextStageMap: Record<LevelStage, LevelStage> = {
  [LevelStage.STAKEHOLDERS_THEORY]: LevelStage.STAKEHOLDER_BRIEFING,
  [LevelStage.STAKEHOLDER_BRIEFING]: LevelStage.REQUIREMENTS_THEORY,
  [LevelStage.REQUIREMENTS_THEORY]: LevelStage.REQUIREMENTS_PRACTICE,
  [LevelStage.REQUIREMENTS_PRACTICE]: LevelStage.USERS_RESEARCH_THEORY,
  [LevelStage.USERS_RESEARCH_THEORY]: LevelStage.USERS_RESEARCH_PRACTICE,
  [LevelStage.USERS_RESEARCH_PRACTICE]: LevelStage.COMPETITORS_THEORY,
  [LevelStage.COMPETITORS_THEORY]: LevelStage.COMPETITORS_PRACTICE,
  [LevelStage.COMPETITORS_PRACTICE]: LevelStage.PLANNING_THEORY,
  [LevelStage.PLANNING_THEORY]: LevelStage.PLANNING_PRACTICE,
  [LevelStage.PLANNING_PRACTICE]: LevelStage.PRESENTATION_THEORY,
  [LevelStage.PRESENTATION_THEORY]: LevelStage.PRESENTATION_PRACTICE,
  [LevelStage.PRESENTATION_PRACTICE]: LevelStage.QUIZ,
  [LevelStage.QUIZ]: LevelStage.COMPLETE,
  [LevelStage.COMPLETE]: LevelStage.COMPLETE
};

export const previousStageMap: Record<LevelStage, LevelStage> = {
  [LevelStage.STAKEHOLDERS_THEORY]: LevelStage.STAKEHOLDERS_THEORY,
  [LevelStage.STAKEHOLDER_BRIEFING]: LevelStage.STAKEHOLDERS_THEORY,
  [LevelStage.REQUIREMENTS_THEORY]: LevelStage.STAKEHOLDER_BRIEFING,
  [LevelStage.REQUIREMENTS_PRACTICE]: LevelStage.REQUIREMENTS_THEORY,
  [LevelStage.USERS_RESEARCH_THEORY]: LevelStage.REQUIREMENTS_PRACTICE,
  [LevelStage.USERS_RESEARCH_PRACTICE]: LevelStage.USERS_RESEARCH_THEORY,
  [LevelStage.COMPETITORS_THEORY]: LevelStage.USERS_RESEARCH_PRACTICE,
  [LevelStage.COMPETITORS_PRACTICE]: LevelStage.COMPETITORS_THEORY,
  [LevelStage.PLANNING_THEORY]: LevelStage.COMPETITORS_PRACTICE,
  [LevelStage.PLANNING_PRACTICE]: LevelStage.PLANNING_THEORY,
  [LevelStage.PRESENTATION_THEORY]: LevelStage.PLANNING_PRACTICE,
  [LevelStage.PRESENTATION_PRACTICE]: LevelStage.PRESENTATION_THEORY,
  [LevelStage.QUIZ]: LevelStage.PRESENTATION_PRACTICE,
  [LevelStage.COMPLETE]: LevelStage.QUIZ
};

// Названия этапов для отображения
export const stageNames: Record<LevelStage, string> = {
  [LevelStage.STAKEHOLDERS_THEORY]: 'Теория о стейкхолдерах',
  [LevelStage.STAKEHOLDER_BRIEFING]: 'Брифинг стейкхолдеров',
  [LevelStage.REQUIREMENTS_THEORY]: 'Теория о требованиях',
  [LevelStage.REQUIREMENTS_PRACTICE]: 'Практика сбора требований',
  [LevelStage.USERS_RESEARCH_THEORY]: 'Теория исследования пользователей',
  [LevelStage.USERS_RESEARCH_PRACTICE]: 'Практика исследования пользователей',
  [LevelStage.COMPETITORS_THEORY]: 'Теория анализа конкурентов',
  [LevelStage.COMPETITORS_PRACTICE]: 'Практика анализа конкурентов',
  [LevelStage.PLANNING_THEORY]: 'Теория планирования',
  [LevelStage.PLANNING_PRACTICE]: 'Практика планирования',
  [LevelStage.PRESENTATION_THEORY]: 'Теория презентации',
  [LevelStage.PRESENTATION_PRACTICE]: 'Практика презентации',
  [LevelStage.QUIZ]: 'Проверка знаний',
  [LevelStage.COMPLETE]: 'Завершение уровня'
};

export default LevelStage; 