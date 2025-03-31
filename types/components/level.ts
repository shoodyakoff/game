import { LevelStage } from '../level';
import { BaseComponentProps } from './common';

export interface StageComponentProps extends BaseComponentProps {
  onComplete: () => void;
}

export interface NavigationProps extends BaseComponentProps {
  currentStage: LevelStage;
  setCurrentStage: (stage: LevelStage) => void;
  stages: Array<{
    stage: LevelStage;
    title: string;
    completed?: boolean;
  }>;
}

export interface StepNavigationProps extends BaseComponentProps {
  steps: React.ReactNode[];
  onComplete?: () => void;
  showBackButton?: boolean;
  continueButtonText?: string;
  completeButtonText?: string;
}

export interface MentorTipProps extends BaseComponentProps {
  tip: string;
  avatar?: string;
  name?: string;
  showIcon?: boolean;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left' | 'right-bottom';
  defaultOpen?: boolean;
}

export interface QuizProps extends BaseComponentProps {
  questions: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
    explanation?: string;
  }>;
  onComplete: (score: number) => void;
} 