/**
 * Данные для UX-анализа процесса создания задач
 */

// Текущий процесс создания задачи (шаги)
export const taskCreationProcess = [
  {
    id: 1,
    name: 'Выбор проекта',
    description: 'Пользователь должен выбрать проект, в котором будет создана задача',
    duration: '10-15 секунд',
    dropoffRate: '5%'
  },
  {
    id: 2,
    name: 'Выбор раздела',
    description: 'Пользователь должен выбрать раздел проекта для задачи',
    duration: '8-12 секунд',
    dropoffRate: '7%'
  },
  {
    id: 3,
    name: 'Заполнение названия',
    description: 'Пользователь вводит название задачи',
    duration: '15-20 секунд',
    dropoffRate: '3%'
  },
  {
    id: 4,
    name: 'Выбор приоритета',
    description: 'Пользователь выбирает приоритет задачи из выпадающего меню',
    duration: '5-8 секунд',
    dropoffRate: '12%'
  },
  {
    id: 5,
    name: 'Выбор срока',
    description: 'Пользователь выбирает срок выполнения задачи через календарь',
    duration: '20-30 секунд',
    dropoffRate: '25%'
  },
  {
    id: 6,
    name: 'Выбор исполнителей',
    description: 'Пользователь выбирает исполнителей из списка участников проекта',
    duration: '15-25 секунд',
    dropoffRate: '18%'
  },
  {
    id: 7,
    name: 'Добавление описания',
    description: 'Пользователь заполняет описание задачи (опционально)',
    duration: '30-45 секунд',
    dropoffRate: '10%'
  },
  {
    id: 8,
    name: 'Добавление тегов',
    description: 'Пользователь добавляет теги для категоризации задачи',
    duration: '15-20 секунд',
    dropoffRate: '15%'
  },
  {
    id: 9,
    name: 'Сохранение задачи',
    description: 'Пользователь нажимает на кнопку "Создать задачу"',
    duration: '3-5 секунд',
    dropoffRate: '2%'
  }
];

// Метрики использования
export const usageMetrics = {
  averageTaskCreationTime: '2 минуты 15 секунд',
  taskCreationCompletionRate: '68%',
  userSatisfactionScore: '6.2/10',
  averageTasksCreatedPerUser: '4.8 задач в неделю',
  mobileVsDesktopUsage: {
    desktop: '65%',
    mobile: '30%',
    tablet: '5%'
  }
};

// Отзывы пользователей
export const userFeedback = [
  {
    id: 1,
    user: 'Иван К.',
    rating: 5,
    comment: 'Слишком много обязательных полей при создании простой задачи. Хочу иметь возможность создать базовую задачу в 1-2 клика.',
    date: '12.05.2023'
  },
  {
    id: 2,
    user: 'Екатерина М.',
    rating: 6,
    comment: 'Календарь для выбора срока очень неудобный, особенно на мобильном. Часто приходится делать несколько попыток, чтобы выбрать нужную дату.',
    date: '28.04.2023'
  },
  {
    id: 3,
    user: 'Алексей П.',
    rating: 4,
    comment: 'Процесс выбора исполнителей занимает слишком много времени, особенно если в проекте много участников.',
    date: '15.05.2023'
  },
  {
    id: 4,
    user: 'Ольга С.',
    rating: 7,
    comment: 'В целом неплохо, но хотелось бы иметь шаблоны для часто создаваемых типов задач.',
    date: '20.04.2023'
  },
  {
    id: 5,
    user: 'Сергей В.',
    rating: 3,
    comment: 'Постоянно теряется введенная информация, если случайно нажать кнопку "назад" в браузере. Очень раздражает!',
    date: '05.05.2023'
  }
];

// Данные A/B теста
export const abTestData = {
  testName: 'Упрощенная форма создания задачи',
  testPeriod: '01.04.2023 - 30.04.2023',
  participants: 5000,
  variants: [
    {
      id: 'A',
      description: 'Текущий интерфейс с 9 шагами',
      completionRate: '68%',
      averageTaskCreationTime: '2 минуты 15 секунд',
      userSatisfactionScore: '6.2/10'
    },
    {
      id: 'B',
      description: 'Упрощенный интерфейс с 4 обязательными полями и опциональным расширенным режимом',
      completionRate: '89%',
      averageTaskCreationTime: '45 секунд',
      userSatisfactionScore: '8.4/10'
    }
  ],
  insights: [
    'Пользователи варианта B создавали на 35% больше задач',
    'Пользователи варианта B чаще возвращались к приложению на следующий день',
    'Упрощенный интерфейс особенно повысил использование на мобильных устройствах',
    'Большинство пользователей (76%) не использовали расширенный режим при создании стандартных задач'
  ]
};

// Тепловая карта кликов
export const heatmapData = {
  description: 'Анализ тепловой карты показывает, что пользователи часто кликают на неактивные элементы интерфейса, пытаясь создать задачу быстрее. Особенно заметно это в мобильной версии.',
  painPoints: [
    'Высокая концентрация кликов вокруг заголовка раздела, что указывает на то, что пользователи ожидают создавать задачи напрямую в разделе',
    'Множественные клики по кнопке "Назад" в процессе создания задачи, указывающие на желание отменить или изменить предыдущий выбор',
    'Попытки перетаскивания элементов вместо заполнения формы, что говорит об ожидании более интерактивного интерфейса',
    'Низкая активность в нижней части формы, многие пользователи не доходят до этой секции'
  ],
  recommendedFocus: [
    'Оптимизировать верхнюю часть формы, сделав ее более интуитивной',
    'Добавить быстрые действия в наиболее часто используемые области интерфейса',
    'Улучшить навигацию между шагами создания задачи',
    'Предоставить визуальную индикацию прогресса при создании задачи'
  ]
};

// Сравнение с конкурентами
export const competitorsAnalysis = [
  {
    id: 1,
    name: 'TaskFlow',
    taskCreationSteps: 3,
    averageTaskCreationTime: '40 секунд',
    keyFeatures: [
      'Быстрое создание задач с минимумом обязательных полей',
      'Возможность добавления деталей после создания',
      'Шаблоны часто используемых задач',
      'Голосовой ввод для создания задач'
    ],
    userRating: '4.2/5'
  },
  {
    id: 2,
    name: 'ProjectPro',
    taskCreationSteps: 5,
    averageTaskCreationTime: '1 минута 20 секунд',
    keyFeatures: [
      'Создание задач с подзадачами в одном интерфейсе',
      'Умные подсказки на основе предыдущих задач',
      'Интерактивный выбор исполнителей',
      'Интеграция с календарем при выборе сроков'
    ],
    userRating: '4.0/5'
  },
  {
    id: 3,
    name: 'TeamTask',
    taskCreationSteps: 7,
    averageTaskCreationTime: '1 минута 50 секунд',
    keyFeatures: [
      'Подробная классификация задач по типам и категориям',
      'Автоматический выбор исполнителей на основе навыков',
      'Система приоритетов с учетом загрузки команды',
      'Оценка времени выполнения на основе исторических данных'
    ],
    userRating: '3.8/5'
  }
];

// Данные юзабилити-тестирования
export const usabilityTestingData = {
  participantsCount: 15,
  averageAge: '32 года',
  techExperience: 'Средний и выше среднего',
  industries: ['IT', 'Маркетинг', 'Образование', 'Консалтинг'],
  tasks: [
    'Создать задачу с названием "Подготовить презентацию" и сроком на конец недели',
    'Назначить задачу двум участникам команды',
    'Добавить детальное описание и теги к задаче',
    'Изменить приоритет созданной задачи'
  ],
  observations: [
    '80% участников сделали более 3 ошибок при создании задачи',
    '60% участников выразили замешательство при выборе приоритета задачи',
    '73% участников потратили значительное время на выбор даты в календаре',
    '93% участников отметили, что процесс требует слишком много действий для простой задачи'
  ],
  recommendations: [
    'Упростить процесс за счет разделения на обязательные и опциональные поля',
    'Улучшить интерфейс календаря для более быстрого выбора даты',
    'Сделать рекомендации по выбору приоритета более понятными',
    'Добавить возможность создания быстрых задач с минимальным набором информации'
  ]
};

export default {
  taskCreationProcess,
  usageMetrics,
  userFeedback,
  abTestData,
  heatmapData,
  competitorsAnalysis,
  usabilityTestingData
}; 