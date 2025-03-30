export type LevelStage = 
  | 'intro'
  | 'product-thinking-theory'
  | 'product-thinking-practice'
  | 'ux-analysis-theory'
  | 'ux-analysis-practice'
  | 'metrics-theory'
  | 'metrics-practice'
  | 'decision-making-theory'
  | 'decision-making-practice'
  | 'quiz'
  | 'complete';

export interface Level {
  id: number;
  title: string;
  description: string;
  stages: LevelStage[];
  isCompleted: boolean;
  currentStage: LevelStage;
}

export interface LevelProgress {
  levelId: number;
  completedStages: LevelStage[];
  currentStage: LevelStage;
  score: number;
} 