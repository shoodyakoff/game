export interface DailyMetric {
  date: string;
  tasksStarted: number;
  tasksCompleted: number;
  completionRate: number;
  avgTimeToComplete: number; // в секундах
  errorRate: number; // процент сессий с ошибками
}

export interface FunnelStep {
  step: string;
  users: number;
  dropoff: number;
  dropoffRate: string;
}

export interface UserSegment {
  segment: string;
  completionRate: number;
  avgTimeToComplete: number;
  errorRate: number;
  satisfactionScore: number;
}

export interface ABTest {
  variant: string;
  completionRate: number;
  avgTimeToComplete: number;
  errorRate: number;
  satisfactionScore: number;
}

export interface CompetitorData {
  competitor: string;
  completionRate: number;
  avgTimeToComplete: number;
  userSatisfaction: number;
}

export const metricsData = {
  // Ежедневные метрики за последние 14 дней
  dailyMetrics: [
    { date: '2023-03-01', tasksStarted: 1245, tasksCompleted: 742, completionRate: 59.6, avgTimeToComplete: 185, errorRate: 12.3 },
    { date: '2023-03-02', tasksStarted: 1312, tasksCompleted: 798, completionRate: 60.8, avgTimeToComplete: 178, errorRate: 11.8 },
    { date: '2023-03-03', tasksStarted: 1187, tasksCompleted: 724, completionRate: 61.0, avgTimeToComplete: 182, errorRate: 12.1 },
    { date: '2023-03-04', tasksStarted: 982, tasksCompleted: 591, completionRate: 60.2, avgTimeToComplete: 186, errorRate: 12.7 },
    { date: '2023-03-05', tasksStarted: 876, tasksCompleted: 523, completionRate: 59.7, avgTimeToComplete: 189, errorRate: 13.2 },
    { date: '2023-03-06', tasksStarted: 1421, tasksCompleted: 842, completionRate: 59.3, avgTimeToComplete: 184, errorRate: 12.5 },
    { date: '2023-03-07', tasksStarted: 1534, tasksCompleted: 912, completionRate: 59.5, avgTimeToComplete: 183, errorRate: 12.2 },
    { date: '2023-03-08', tasksStarted: 1489, tasksCompleted: 891, completionRate: 59.8, avgTimeToComplete: 181, errorRate: 12.0 },
    { date: '2023-03-09', tasksStarted: 1367, tasksCompleted: 820, completionRate: 60.0, avgTimeToComplete: 180, errorRate: 11.9 },
    { date: '2023-03-10', tasksStarted: 1298, tasksCompleted: 770, completionRate: 59.3, avgTimeToComplete: 183, errorRate: 12.4 },
    { date: '2023-03-11', tasksStarted: 1021, tasksCompleted: 612, completionRate: 59.9, avgTimeToComplete: 185, errorRate: 12.6 },
    { date: '2023-03-12', tasksStarted: 914, tasksCompleted: 540, completionRate: 59.1, avgTimeToComplete: 187, errorRate: 12.8 },
    { date: '2023-03-13', tasksStarted: 1476, tasksCompleted: 877, completionRate: 59.4, avgTimeToComplete: 184, errorRate: 12.3 },
    { date: '2023-03-14', tasksStarted: 1562, tasksCompleted: 923, completionRate: 59.1, avgTimeToComplete: 186, errorRate: 12.5 }
  ],

  // Анализ воронки создания задачи
  funnelSteps: [
    { step: 'Открытие формы', users: 10000, dropoff: 0, dropoffRate: '0.0%' },
    { step: 'Ввод названия задачи', users: 9750, dropoff: 250, dropoffRate: '2.5%' },
    { step: 'Выбор приоритета', users: 8950, dropoff: 800, dropoffRate: '8.2%' },
    { step: 'Добавление описания', users: 7800, dropoff: 1150, dropoffRate: '12.8%' },
    { step: 'Установка сроков', users: 7100, dropoff: 700, dropoffRate: '9.0%' },
    { step: 'Назначение исполнителей', users: 6550, dropoff: 550, dropoffRate: '7.7%' },
    { step: 'Добавление тегов', users: 6100, dropoff: 450, dropoffRate: '6.9%' },
    { step: 'Предпросмотр задачи', users: 5950, dropoff: 150, dropoffRate: '2.5%' },
    { step: 'Подтверждение создания', users: 5900, dropoff: 50, dropoffRate: '0.8%' }
  ],

  // Сегменты пользователей
  userSegments: [
    { 
      segment: 'Новые пользователи (менее 30 дней)', 
      completionRate: 42.3, 
      avgTimeToComplete: 237, 
      errorRate: 18.7, 
      satisfactionScore: 3.2 
    },
    { 
      segment: 'Регулярные пользователи', 
      completionRate: 68.5, 
      avgTimeToComplete: 162, 
      errorRate: 9.2, 
      satisfactionScore: 4.1 
    },
    { 
      segment: 'Продвинутые пользователи', 
      completionRate: 84.2, 
      avgTimeToComplete: 126, 
      errorRate: 5.1, 
      satisfactionScore: 4.4 
    },
    { 
      segment: 'Пользователи мобильной версии', 
      completionRate: 51.8, 
      avgTimeToComplete: 214, 
      errorRate: 15.3, 
      satisfactionScore: 3.5 
    },
    { 
      segment: 'Корпоративные пользователи', 
      completionRate: 76.3, 
      avgTimeToComplete: 159, 
      errorRate: 7.2, 
      satisfactionScore: 4.3 
    }
  ],

  // Результаты A/B тестирования
  abTests: [
    { 
      variant: 'Текущий вариант (A)', 
      completionRate: 59.6, 
      avgTimeToComplete: 183, 
      errorRate: 12.4, 
      satisfactionScore: 3.7 
    },
    { 
      variant: 'Пошаговый процесс (B)', 
      completionRate: 72.8, 
      avgTimeToComplete: 152, 
      errorRate: 8.6, 
      satisfactionScore: 4.2 
    },
    { 
      variant: 'Упрощенная форма (C)', 
      completionRate: 68.3, 
      avgTimeToComplete: 132, 
      errorRate: 7.9, 
      satisfactionScore: 4.0 
    }
  ],

  // Сравнение с конкурентами
  competitorData: [
    { competitor: 'TaskMaster (наш продукт)', completionRate: 59.6, avgTimeToComplete: 183, userSatisfaction: 3.7 },
    { competitor: 'Конкурент 1', completionRate: 72.1, avgTimeToComplete: 145, userSatisfaction: 4.2 },
    { competitor: 'Конкурент 2', completionRate: 68.4, avgTimeToComplete: 158, userSatisfaction: 4.0 },
    { competitor: 'Конкурент 3', completionRate: 64.2, avgTimeToComplete: 172, userSatisfaction: 3.9 },
    { competitor: 'Среднее по рынку', completionRate: 67.5, avgTimeToComplete: 162, userSatisfaction: 4.0 }
  ],

  // Ключевые выводы, которые должен заметить учащийся
  keyInsights: [
    'Воронка создания задач имеет большой отток на этапах выбора приоритета и добавления описания',
    'Новые пользователи и пользователи мобильной версии имеют значительно более низкие показатели завершения',
    'Варианты B и C в A/B тестировании показывают значительное улучшение по сравнению с текущим вариантом',
    'Конкуренты имеют более высокие показатели завершения и удовлетворенности пользователей',
    'Среднее время создания задачи (183 секунды) значительно выше, чем у конкурентов',
    'Высокая частота ошибок указывает на проблемы с валидацией формы',
    'Корпоративные и продвинутые пользователи имеют наилучшие показатели завершения'
  ]
};

export default metricsData; 