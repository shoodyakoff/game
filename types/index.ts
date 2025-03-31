// Реэкспорт типов компонентов
export * from './components/common';
export * from './components/level';

// Реэкспорт типов API
export * from './api';

// Реэкспорт типов моделей
export * from './models/user';

// Реэкспорт типов состояния
export * from './store';

// Реэкспорт базовых типов, исключая конфликтующие типы
import type { LevelStage, Level } from './level';
export type { LevelStage, Level };

// Утилитарные типы
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
}; 