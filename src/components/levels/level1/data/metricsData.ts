/**
 * Данные метрик для анализа и принятия решений
 */

// Ключевые продуктовые метрики
export const productMetrics = {
  // Общие метрики продукта
  overallMetrics: {
    dau: {
      current: 12500,
      previousPeriod: 11000,
      growth: '+13.6%',
      description: 'Ежедневные активные пользователи'
    },
    wau: {
      current: 32000,
      previousPeriod: 28500,
      growth: '+12.3%',
      description: 'Еженедельные активные пользователи'
    },
    mau: {
      current: 85000,
      previousPeriod: 78000,
      growth: '+9.0%',
      description: 'Ежемесячные активные пользователи'
    },
    retention: {
      day1: '68%',
      day7: '42%',
      day30: '29%',
      description: 'Удержание пользователей по дням'
    },
    timeInApp: {
      current: '28 минут',
      previousPeriod: '24 минуты',
      growth: '+16.7%',
      description: 'Среднее время в приложении на пользователя в день'
    }
  },
  
  // Метрики, связанные с задачами
  taskMetrics: {
    tasksCreated: {
      daily: 8200,
      weekly: 46000,
      monthly: 185000,
      perUser: 4.8,
      description: 'Количество создаваемых задач'
    },
    taskCompletionRate: {
      overall: '72%',
      personal: '76%',
      team: '68%',
      description: 'Процент выполненных задач'
    },
    avgTaskCompletionTime: {
      overall: '3.2 дня',
      urgent: '1.1 дня',
      normal: '2.8 дня',
      low: '5.6 дня',
      description: 'Среднее время выполнения задач по приоритетам'
    }
  },
  
  // Бизнес-метрики и монетизация
  businessMetrics: {
    conversionToProPlan: {
      current: '8.2%',
      previousPeriod: '7.5%',
      growth: '+9.3%',
      description: 'Конверсия из бесплатного в платный тариф'
    },
    mrr: {
      current: '$215,000',
      previousPeriod: '$198,000',
      growth: '+8.6%',
      description: 'Ежемесячный повторяющийся доход'
    },
    arpu: {
      free: '$0',
      pro: '$12.50',
      business: '$32.75',
      enterprise: '$145.20',
      description: 'Средний доход на пользователя по тарифам'
    },
    churnRate: {
      current: '4.2%',
      previousPeriod: '4.8%',
      growth: '-12.5%',
      description: 'Процент оттока пользователей (месячный)'
    }
  }
};

// Метрики, связанные с процессом создания задач
export const taskCreationMetrics = {
  // Общая воронка создания задач
  funnel: {
    started: 12500,
    projectSelected: 11875, // 95%
    categorySelected: 11045, // 93% от предыдущего шага
    titleEntered: 10715, // 97% от предыдущего шага
    prioritySelected: 9430, // 88% от предыдущего шага
    deadlineSet: 7073, // 75% от предыдущего шага
    assigneesSelected: 5800, // 82% от предыдущего шага
    descriptionAdded: 5220, // 90% от предыдущего шага
    tagsAdded: 4438, // 85% от предыдущего шага
    taskCreated: 4350, // 98% от предыдущего шага
    overallConversion: '34.8%' // от начала до завершения
  },
  
  // Метрики производительности
  performance: {
    averageCompletionTime: '2 минуты 15 секунд',
    medianCompletionTime: '1 минута 55 секунд',
    desktopAvgTime: '1 минута 50 секунд',
    mobileAvgTime: '3 минуты 10 секунд',
    tabletAvgTime: '2 минуты 30 секунд'
  },
  
  // Пользовательское взаимодействие
  userInteraction: {
    errorRate: '14.2%',
    fieldRevisits: '22.7%',
    formCancelRate: '18.4%',
    helpBtnUsage: '8.6%',
    tooltipInteractions: '12.3%'
  },
  
  // Сегментация по типам пользователей
  userSegmentation: {
    newUsers: {
      completionRate: '29.3%',
      avgTime: '3 минуты 10 секунд',
      errorRate: '23.5%'
    },
    regularUsers: {
      completionRate: '41.6%',
      avgTime: '1 минута 45 секунд',
      errorRate: '9.8%'
    },
    powerUsers: {
      completionRate: '68.2%',
      avgTime: '55 секунд',
      errorRate: '4.2%'
    }
  },
  
  // Метрики по платформам
  platforms: {
    web: {
      usage: '62%',
      completionRate: '39.2%',
      avgTime: '1 минута 40 секунд'
    },
    ios: {
      usage: '24%',
      completionRate: '30.5%',
      avgTime: '2 минуты 50 секунд'
    },
    android: {
      usage: '14%',
      completionRate: '26.8%',
      avgTime: '3 минуты 15 секунд'
    }
  }
};

// Исторические данные
export const historicalData = {
  taskCreationConversion: [
    { period: 'Янв 2023', conversion: '31.2%' },
    { period: 'Фев 2023', conversion: '31.8%' },
    { period: 'Мар 2023', conversion: '32.5%' },
    { period: 'Апр 2023', conversion: '33.1%' },
    { period: 'Май 2023', conversion: '34.8%' }
  ],
  avgTaskCreationTime: [
    { period: 'Янв 2023', time: '2:35' },
    { period: 'Фев 2023', time: '2:30' },
    { period: 'Мар 2023', time: '2:25' },
    { period: 'Апр 2023', time: '2:20' },
    { period: 'Май 2023', time: '2:15' }
  ],
  userSatisfaction: [
    { period: 'Янв 2023', score: '5.8/10' },
    { period: 'Фев 2023', score: '5.9/10' },
    { period: 'Мар 2023', score: '6.0/10' },
    { period: 'Апр 2023', score: '6.1/10' },
    { period: 'Май 2023', score: '6.2/10' }
  ]
};

// Прогнозы изменений при внедрении улучшений
export const improvementForecasts = [
  {
    name: 'Упрощение обязательных полей',
    conversionIncrease: '+20-25%',
    timeReduction: '-45-55%',
    satisfactionIncrease: '+20-30%',
    taskCreationIncrease: '+15-20%',
    retentionImpact: '+3-5%',
    revenueImpact: '+4-6%',
    implementationEffort: 'Средний',
    timeToImplement: '2-3 недели'
  },
  {
    name: 'Улучшение интерфейса календаря',
    conversionIncrease: '+8-12%',
    timeReduction: '-15-20%',
    satisfactionIncrease: '+5-10%',
    taskCreationIncrease: '+3-7%',
    retentionImpact: '+1-2%',
    revenueImpact: '+1-3%',
    implementationEffort: 'Средний',
    timeToImplement: '2-4 недели'
  },
  {
    name: 'Шаблоны задач',
    conversionIncrease: '+10-15%',
    timeReduction: '-30-40%',
    satisfactionIncrease: '+15-25%',
    taskCreationIncrease: '+10-15%',
    retentionImpact: '+2-5%',
    revenueImpact: '+3-5%',
    implementationEffort: 'Высокий',
    timeToImplement: '4-6 недель'
  },
  {
    name: 'Автоматическое сохранение черновиков',
    conversionIncrease: '+5-8%',
    timeReduction: '-5-10%',
    satisfactionIncrease: '+8-15%',
    taskCreationIncrease: '+2-4%',
    retentionImpact: '+1-3%',
    revenueImpact: '+1-2%',
    implementationEffort: 'Низкий',
    timeToImplement: '1-2 недели'
  }
];

// Данные бизнес-влияния
export const businessImpactData = {
  taskCreationRelationToRetention: 'Пользователи, создающие >5 задач в неделю, имеют на 68% выше показатель удержания через 30 дней',
  taskCompletionRelationToConversion: 'Пользователи с показателем выполнения задач >80% на 42% чаще переходят на платный тариф',
  revenueImpact: 'Увеличение конверсии создания задач на 1% приводит к росту MRR на ~$2,700',
  teamProductivity: 'Команды, использующие TaskMaster, сообщают о повышении продуктивности на 23% (по опросам)',
  customerLifetimeValue: {
    current: '$245',
    estimated: '$280-$310',
    improvedTaskCreation: '+14-26%'
  }
};

export const metricsData = {
  daily: [
    {
      date: '01.06.2023',
      totalAttempts: 3250,
      successfulCreations: 1950,
      conversionRate: 60,
      avgCreationTime: 145,
      step1DropOff: 5,
      step2DropOff: 28,
      step3DropOff: 7
    },
    {
      date: '02.06.2023',
      totalAttempts: 3125,
      successfulCreations: 1875,
      conversionRate: 60,
      avgCreationTime: 142,
      step1DropOff: 6,
      step2DropOff: 27,
      step3DropOff: 7
    },
    {
      date: '03.06.2023',
      totalAttempts: 2980,
      successfulCreations: 1788,
      conversionRate: 60,
      avgCreationTime: 143,
      step1DropOff: 5,
      step2DropOff: 29,
      step3DropOff: 6
    },
    {
      date: '04.06.2023',
      totalAttempts: 3356,
      successfulCreations: 2014,
      conversionRate: 60,
      avgCreationTime: 144,
      step1DropOff: 4,
      step2DropOff: 28,
      step3DropOff: 8
    },
    {
      date: '05.06.2023',
      totalAttempts: 3422,
      successfulCreations: 2053,
      conversionRate: 60,
      avgCreationTime: 146,
      step1DropOff: 5,
      step2DropOff: 27,
      step3DropOff: 8
    },
    {
      date: '06.06.2023',
      totalAttempts: 3185,
      successfulCreations: 1911,
      conversionRate: 60,
      avgCreationTime: 147,
      step1DropOff: 6,
      step2DropOff: 26,
      step3DropOff: 8
    },
    {
      date: '07.06.2023',
      totalAttempts: 3310,
      successfulCreations: 1986,
      conversionRate: 60,
      avgCreationTime: 145,
      step1DropOff: 5,
      step2DropOff: 27,
      step3DropOff: 8
    }
  ],
  
  funnel: [
    {
      stepName: 'Начало создания задачи',
      conversionRate: 100,
      dropOffRate: 0,
      avgTimeSpent: 0,
      details: 'Пользователь нажимает кнопку "Создать задачу"'
    },
    {
      stepName: 'Шаг 1: Базовая информация',
      conversionRate: 95,
      dropOffRate: 5,
      avgTimeSpent: 35,
      details: 'Ввод названия, приоритета и типа задачи'
    },
    {
      stepName: 'Шаг 2: Расширенные параметры',
      conversionRate: 68,
      dropOffRate: 27,
      avgTimeSpent: 75,
      details: 'Настройка сроков, назначение исполнителей, тегов, связанных задач'
    },
    {
      stepName: 'Шаг 3: Подтверждение',
      conversionRate: 60,
      dropOffRate: 8,
      avgTimeSpent: 35,
      details: 'Проверка введенных данных и сохранение задачи'
    }
  ],
  
  segments: [
    {
      segmentName: 'Новые пользователи',
      description: 'Пользователи, зарегистрированные менее 30 дней назад',
      conversionRate: 45,
      avgCreationTime: 198,
      dropOffRate: 55,
      mainIssues: [
        'Высокий отток на шаге настройки расширенных параметров (42%)',
        'Сложность с пониманием поля "Зависимости" и "Теги"',
        'Длительное время заполнения формы (на 37% больше, чем у регулярных пользователей)'
      ]
    },
    {
      segmentName: 'Регулярные пользователи',
      description: 'Активные пользователи с опытом от 1 до 6 месяцев',
      conversionRate: 65,
      avgCreationTime: 132,
      dropOffRate: 35,
      mainIssues: [
        'Средний отток на шаге настройки расширенных параметров (23%)',
        'Трудности с назначением нескольких исполнителей',
        'Задержки при работе с большим количеством тегов'
      ]
    },
    {
      segmentName: 'Опытные пользователи',
      description: 'Пользователи с опытом более 6 месяцев',
      conversionRate: 78,
      avgCreationTime: 118,
      dropOffRate: 22,
      mainIssues: [
        'Отсутствие возможности создавать шаблоны задач',
        'Ограничения в настройке повторяющихся задач',
        'Необходимость повторного ввода данных для однотипных задач'
      ]
    },
    {
      segmentName: 'Мобильные пользователи',
      description: 'Пользователи, использующие мобильное приложение',
      conversionRate: 52,
      avgCreationTime: 163,
      dropOffRate: 48,
      mainIssues: [
        'Высокий отток на шаге расширенных параметров (38%)',
        'Сложности с выбором нескольких исполнителей на малом экране',
        'Плохая адаптация календаря для выбора срока задачи',
        'Отсутствие возможности прикреплять файлы из облачных хранилищ'
      ]
    }
  ],
  
  abTests: [
    {
      testName: 'Упрощение формы расширенных параметров',
      controlDescription: 'Стандартная форма с 12 полями на одном экране',
      testDescription: 'Упрощенная форма с 6 обязательными полями и расширяемыми разделами',
      controlConversion: 68,
      testConversion: 82,
      controlAvgTime: 75,
      testAvgTime: 48,
      controlDropOff: 32,
      testDropOff: 18,
      conclusion: 'Тестовая версия показала значительное улучшение конверсии и снижение времени заполнения',
      significance: 'Результаты статистически значимы (p < 0.01)'
    },
    {
      testName: 'Мастер создания задач пошагово',
      controlDescription: 'Единая форма для всех параметров задачи',
      testDescription: 'Пошаговый мастер с разделением на 3 простых шага',
      controlConversion: 68,
      testConversion: 76,
      controlAvgTime: 75,
      testAvgTime: 83,
      controlDropOff: 32,
      testDropOff: 24,
      conclusion: 'Тестовая версия улучшила конверсию, но увеличила общее время создания',
      significance: 'Результаты статистически значимы (p < 0.05)'
    },
    {
      testName: 'Автоматические подсказки и рекомендации',
      controlDescription: 'Стандартная форма без подсказок',
      testDescription: 'Форма с автоматическими подсказками по заполнению и рекомендациями',
      controlConversion: 68,
      testConversion: 73,
      controlAvgTime: 75,
      testAvgTime: 68,
      controlDropOff: 32,
      testDropOff: 27,
      conclusion: 'Тестовая версия умеренно улучшила конверсию и снизила время заполнения',
      significance: 'Результаты статистически значимы (p < 0.05)'
    }
  ],
  
  benchmarking: [
    {
      metric: 'Среднее время создания задачи (сек)',
      taskMasterValue: 145,
      competitorA: 95,
      competitorB: 120,
      competitorC: 135,
      industryAverage: 115,
      unit: '',
      lowerIsBetter: true
    },
    {
      metric: 'Конверсия процесса создания задачи (%)',
      taskMasterValue: 60,
      competitorA: 78,
      competitorB: 72,
      competitorC: 65,
      industryAverage: 72,
      unit: '%',
      lowerIsBetter: false
    },
    {
      metric: 'Количество полей для заполнения',
      taskMasterValue: 14,
      competitorA: 8,
      competitorB: 10,
      competitorC: 12,
      industryAverage: 10,
      unit: '',
      lowerIsBetter: true
    },
    {
      metric: 'Количество обязательных полей',
      taskMasterValue: 9,
      competitorA: 4,
      competitorB: 5,
      competitorC: 6,
      industryAverage: 5,
      unit: '',
      lowerIsBetter: true
    },
    {
      metric: 'Удовлетворенность процессом создания (1-10)',
      taskMasterValue: 6.2,
      competitorA: 8.1,
      competitorB: 7.5,
      competitorC: 6.8,
      industryAverage: 7.5,
      unit: '',
      lowerIsBetter: false
    }
  ],
  
  benchmarkingNotes: [
    'TaskMaster требует значительно больше времени на создание задачи, чем конкуренты',
    'Количество полей для заполнения в TaskMaster на 40% больше среднего по отрасли',
    'Конверсия процесса создания задачи на 12% ниже, чем в среднем по отрасли',
    'Конкурент A предлагает самый быстрый и простой процесс создания задачи с минимальным количеством обязательных полей',
    'Удовлетворенность пользователей процессом создания задачи в TaskMaster значительно ниже, чем у конкурентов'
  ]
};

export default {
  productMetrics,
  taskCreationMetrics,
  historicalData,
  improvementForecasts,
  businessImpactData,
  metricsData
}; 