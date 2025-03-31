import { User, CharacterType } from '../models/user';
import { LevelStage } from '../level';

export interface RootState {
  auth: AuthState;
  character: CharacterState;
  level: LevelState;
  ui: UIState;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface CharacterState {
  selectedCharacter: CharacterType | null;
  loading: boolean;
  error: string | null;
}

export interface LevelState {
  currentLevel: number;
  currentStage: LevelStage;
  progress: Record<number, LevelProgress>;
  loading: boolean;
  error: string | null;
}

export interface LevelProgress {
  completedStages: LevelStage[];
  score: number;
  notes: string[];
  lastUpdated: Date;
}

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  createdAt: Date;
} 