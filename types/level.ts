export enum LevelStage {
  INTRO = 'intro',
  QUIZ = 'quiz',
  COMPLETE = 'complete',
  PRODUCT_THINKING_THEORY = 'product-thinking-theory',
  PRODUCT_THINKING_PRACTICE = 'product-thinking-practice',
  UX_ANALYSIS_THEORY = 'ux-analysis-theory',
  UX_ANALYSIS_PRACTICE = 'ux-analysis-practice',
  METRICS_THEORY = 'metrics-theory',
  METRICS_PRACTICE = 'metrics-practice',
  DECISION_MAKING_THEORY = 'decision-making-theory',
  DECISION_MAKING_PRACTICE = 'decision-making-practice',
  STAKEHOLDERS_THEORY = 'stakeholders-theory',
  STAKEHOLDER_BRIEFING = 'stakeholder-briefing',
  REQUIREMENTS_THEORY = 'requirements-theory',
  REQUIREMENTS_PRACTICE = 'requirements-practice',
  USERS_RESEARCH_THEORY = 'users-research-theory',
  USERS_RESEARCH_PRACTICE = 'users-research-practice',
  COMPETITORS_THEORY = 'competitors-theory',
  COMPETITORS_PRACTICE = 'competitors-practice',
  PLANNING_THEORY = 'planning-theory',
  PLANNING_PRACTICE = 'planning-practice',
  PRESENTATION_THEORY = 'presentation-theory',
  PRESENTATION_PRACTICE = 'presentation-practice'
}

export interface Level {
  id: number;
  title: string;
  description: string;
  stages: LevelStage[];
  currentStage?: LevelStage;
  progress?: LevelStage[];
}

export interface LevelProgress {
  currentStage: LevelStage;
  completedStages: LevelStage[];
  progress: LevelStage[];
} 