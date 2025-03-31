# GotoGrow - Project Documentation

## Project Overview
Образовательная платформа для обучения продуктовому мышлению и UX анализу.

## Tech Stack
- Next.js 14.1.4
- TypeScript 5.4.3
- Redux (@reduxjs/toolkit) для управления состоянием
- Tailwind CSS для стилей
- MongoDB + Mongoose для базы данных
- Docker для контейнеризации
- Framer Motion для анимаций
- NextAuth.js для аутентификации

## Project Structure
```
/src
  /components
    /levels/           # Компоненты для уровней игры
      LevelNavigation.tsx    # Навигация по этапам уровня
      StepNavigation.tsx     # Навигация по шагам внутри этапа
      MentorTip.tsx         # Подсказки ментора
      QuizComponent.tsx     # Компонент для тестов
      DialogBubble.tsx      # Диалоговые пузыри
      AnalysisMaterial.tsx  # Материалы для анализа
      /level1
        /stages/           # Компоненты этапов первого уровня
          ProductMindsetTheory.tsx
          UXAnalysisTheory.tsx
          MetricsTheory.tsx
          DecisionMakingTheory.tsx
          ProductThinkingPractice.tsx
          UXAnalysisPractice.tsx
          MetricsPractice.tsx
          DecisionMakingPractice.tsx
    /auth/             # Компоненты аутентификации
      ProtectedRoute.tsx    # HOC для защищенных маршрутов
    /common/           # Общие компоненты
    /layout/          # Компоненты лейаута
    /dashboard/       # Компоненты дашборда
  /pages
    /levels/          # Страницы уровней
      1.tsx           # Первый уровень
  /types             # TypeScript типы
    /components
      common.ts      # Общие типы компонентов
      level.ts       # Типы для компонентов уровней
    level.ts         # Типы для логики уровней
  /store            # Redux store
  /styles           # Стили
  /services         # Сервисы для работы с API
  /utils            # Утилиты
  /lib              # Библиотеки
  /server           # Серверный код

/public             # Статические файлы
  /icons            # Иконки
  /images           # Изображения
  /characters       # Изображения персонажей
```

## Component Dependencies

### Level Components
- `LevelNavigation.tsx`
  - Использует: `types/components/level.ts` (NavigationProps)
  - Зависит от: `types/level.ts` (LevelStage)

- `MentorTip.tsx`
  - Использует: `types/components/level.ts` (MentorTipProps)
  - Зависит от: framer-motion для анимаций

- `StepNavigation.tsx`
  - Использует: `types/components/level.ts` (StepNavigationProps)

- `QuizComponent.tsx`
  - Использует: `types/components/level.ts` (QuizProps)

### Pages
- `/pages/levels/1.tsx`
  - Использует все компоненты уровня
  - Зависит от Redux store для состояния
  - Использует типы из `types/level.ts`

## Type System

### LevelStage (types/level.ts)
```typescript
export enum LevelStage {
  INTRO = 'intro',
  PRODUCT_THINKING_THEORY = 'product-thinking-theory',
  PRODUCT_THINKING_PRACTICE = 'product-thinking-practice',
  UX_ANALYSIS_THEORY = 'ux-analysis-theory',
  UX_ANALYSIS_PRACTICE = 'ux-analysis-practice',
  METRICS_THEORY = 'metrics-theory',
  METRICS_PRACTICE = 'metrics-practice',
  DECISION_MAKING_THEORY = 'decision-making-theory',
  DECISION_MAKING_PRACTICE = 'decision-making-practice',
  QUIZ = 'quiz',
  COMPLETE = 'complete'
}
```

## Changelog

### 2024-03-30
- Исправлено использование position в MentorTip с "right-bottom" на "bottom-right"
- Обновлен тип MentorTipProps в types/components/level.ts:
  ```typescript
  export interface MentorTipProps extends BaseComponentProps {
    tip: string;
    avatar?: string;
    name?: string;
    showIcon?: boolean;
    position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left' | 'right-bottom';
    defaultOpen?: boolean;
  }
  ```
- Изменен тип LevelStage с union type на enum

### 2024-03-28
- Добавлены компоненты для первого уровня
- Реализована базовая навигация по этапам

## Development Guidelines

### Компоненты
1. Все компоненты должны быть типизированы
2. Используйте Tailwind CSS для стилей
3. Для анимаций используйте Framer Motion
4. Все компоненты уровней должны быть в `/components/levels`

### Типизация
1. Общие типы компонентов в `types/components/common.ts`
2. Типы для конкретных компонентов в соответствующих файлах в `types/components/`
3. Типы для логики уровней в `types/level.ts`

### State Management
1. Используйте Redux для глобального состояния
2. Локальное состояние через useState/useReducer
3. Кэширование и API запросы через RTK Query

## Known Issues
1. Типы в `types/level.ts` требуют обновления для поддержки новых этапов
2. Необходимо добавить тесты для компонентов уровней
3. Требуется оптимизация производительности для мобильных устройств

## Future Improvements
1. Добавить систему достижений
2. Улучшить анимации переходов между этапами
3. Добавить offline режим
4. Расширить систему подсказок ментора 