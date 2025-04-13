import React, { useState, useEffect } from 'react';
import { styles } from '../common/styles';
import MentorTip from '../../shared/feedback/MentorTip';
import StepNavigation from '../../shared/navigation/StepNavigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { isLevelReset } from '../../shared/utils/levelResetUtils';

interface MetricsTheoryProps {
  onComplete: () => void;
}

// Компонент для отображения метрической карточки
const MetricCard: React.FC<{title: string; description: string; icon?: string}> = ({title, description, icon}) => {
  return (
    <motion.div 
      className="bg-slate-700 p-5 rounded-lg border border-slate-600"
      whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start">
        {icon && (
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-4 flex-shrink-0">
            <span className="text-white text-lg">{icon}</span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-indigo-400 mb-3">{title}</h3>
          <p className={styles.text}>{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Компонент для отображения графика метрик
const MetricChart: React.FC<{title: string; data: Array<{label: string; value: number}>}> = ({title, data}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="flex flex-col space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-slate-300">{item.label}</span>
              <span className="text-sm text-indigo-400">{item.value}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <motion.div 
                className="bg-indigo-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент для отображения интерактивного графика удержания
const RetentionChart: React.FC<{data: Array<{day: number; value: number}>}> = ({data}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  // Настройки графика
  const chartHeight = 300;
  const chartWidth = '100%';
  const paddingX = 40;
  const paddingY = 40;
  const graphHeight = chartHeight - 2 * paddingY;
  const maxValue = 100; // Максимальное значение для оси Y (проценты)
  
  // Создаем дополнительные точки для плавной кривой
  const interpolatedData = [];
  
  // Добавляем все оригинальные точки
  for (let i = 0; i < data.length; i++) {
    interpolatedData.push(data[i]);
    
    // Добавляем промежуточные точки между текущей и следующей точкой
    if (i < data.length - 1) {
      const curr = data[i];
      const next = data[i + 1];
      const dayDiff = next.day - curr.day;
      const valueDiff = next.value - curr.value;
      
      // Добавляем больше промежуточных точек для более плавной кривой
      const steps = dayDiff * 2; // Количество промежуточных точек
      
      for (let step = 1; step < steps; step++) {
        // Для более реалистичной кривой удержания используем нелинейную интерполяцию
        // Более быстрое падение в начале
        const t = step / steps;
        const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        const interpolatedDay = curr.day + dayDiff * (step / steps);
        // Используем экспоненциальную кривую для более реалистичного снижения удержания
        const interpolatedValue = curr.value - Math.pow(1 - easedT, 0.7) * Math.abs(valueDiff);
        
        interpolatedData.push({
          day: interpolatedDay,
          value: interpolatedValue
        });
      }
    }
  }
  
  // Сортируем по дням для правильного порядка
  interpolatedData.sort((a, b) => a.day - b.day);
  
  // Вычисление координат
  const getX = (day: number) => {
    const minDay = 0; // Начинаем с дня 0
    const maxDay = data[data.length - 1].day;
    const dayRange = maxDay - minDay;
    
    const availableWidth = 100 - 2 * (paddingX / 10);
    return paddingX / 10 + ((day - minDay) / dayRange) * availableWidth + '%';
  };
  
  const getY = (value: number) => {
    return paddingY + graphHeight - (value / maxValue) * graphHeight;
  };
  
  // Формирование линии графика для интерполированных данных
  const linePath = interpolatedData.map((point, index) => {
    return `${index === 0 ? 'M' : 'L'} ${getX(point.day)} ${getY(point.value)}`;
  }).join(' ');
  
  // Основные метки для оси X (дни из оригинальных данных)
  const xLabels = [0, ...data.map(item => item.day)];
  
  return (
    <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">График удержания пользователей</h3>
      
      <div className="relative" style={{ height: chartHeight, width: chartWidth }}>
        {/* Ось Y и метки */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400">
          {[100, 75, 50, 25, 0].map((tick) => (
            <div key={tick} style={{ top: `${getY(tick)}px` }} className="absolute -left-8 transform -translate-y-1/2">
              {tick}%
            </div>
          ))}
        </div>
        
        {/* Горизонтальные линии сетки */}
        {[100, 75, 50, 25, 0].map((tick) => (
          <div 
            key={tick} 
            className="absolute left-10 right-0 border-t border-slate-700" 
            style={{ top: `${getY(tick)}px` }}
          />
        ))}
        
        {/* Ось X и метки */}
        <div className="absolute bottom-0 left-10 right-0 flex justify-between text-xs text-slate-400">
          {xLabels.map((day, index) => (
            <div key={index} className="text-center">
              {day}
            </div>
          ))}
        </div>
        
        {/* Линия графика */}
        <svg className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Область под графиком */}
          <motion.path
            d={`${linePath} L ${getX(data[data.length - 1].day)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          
          {/* Линия графика */}
          <motion.path
            d={linePath}
            stroke="url(#lineGradient)"
            strokeWidth={3}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Точки данных (только для оригинальных точек, не для интерполированных) */}
          {data.map((point, index) => (
            <motion.circle
              key={index}
              cx={getX(point.day)}
              cy={getY(point.value)}
              r={hoveredPoint === index ? 8 : 5}
              fill={hoveredPoint === index ? "#a855f7" : "#8b5cf6"}
              stroke="#1e293b"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          
          {/* Начальная точка (100%, день 0) */}
          <motion.circle
            cx={getX(0)}
            cy={getY(100)}
            r={hoveredPoint === -1 ? 8 : 5}
            fill={hoveredPoint === -1 ? "#a855f7" : "#8b5cf6"}
            stroke="#1e293b"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            onMouseEnter={() => setHoveredPoint(-1)}
            onMouseLeave={() => setHoveredPoint(null)}
            style={{ cursor: 'pointer' }}
          />
          
          {/* Подписи для точек при наведении */}
          {hoveredPoint !== null && (
            <g>
              <rect
                x={parseFloat(hoveredPoint === -1 ? getX(0) : getX(data[hoveredPoint].day).replace('%', '')) - 3 + '%'}
                y={hoveredPoint === -1 ? getY(100) - 35 : getY(data[hoveredPoint].value) - 35}
                width="60"
                height="25"
                rx="4"
                fill="#1e293b"
                fillOpacity={0.9}
              />
              <text
                x={parseFloat(hoveredPoint === -1 ? getX(0) : getX(data[hoveredPoint].day).replace('%', '')) + 1 + '%'}
                y={hoveredPoint === -1 ? getY(100) - 18 : getY(data[hoveredPoint].value) - 18}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
              >
                {hoveredPoint === -1 ? "День 0: 100%" : `День ${data[hoveredPoint].day}: ${data[hoveredPoint].value}%`}
              </text>
            </g>
          )}
        </svg>
      </div>
      
      <p className="text-sm text-slate-400 text-center mt-4">
        Процент удержания пользователей с течением времени (в днях)
      </p>
    </div>
  );
};

// Компонент для отображения воронки
const FunnelChart: React.FC<{steps: Array<{name: string; value: number; color: string}>}> = ({steps}) => {
  const maxValue = steps[0].value;

  return (
    <div className="relative h-80 py-6 my-8">
      {steps.map((step, index) => {
        const widthPercent = (step.value / maxValue) * 100;
        const topOffset = index * 60;
        
        return (
          <motion.div 
            key={index}
            className="absolute mx-auto left-0 right-0"
            style={{
              top: `${topOffset}px`,
              width: `${widthPercent}%`,
              height: '50px',
              backgroundColor: step.color
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: `${widthPercent}%`, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.3 }}
          >
            <div className="flex justify-between px-4 items-center h-full">
              <span className="font-medium text-white">{step.name}</span>
              <span className="text-white">{step.value}%</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const MetricsTheory: React.FC<MetricsTheoryProps> = ({ onComplete }) => {
  // Состояние для текущего шага
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // При монтировании компонента проверяем, был ли сброс уровня
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Проверяем, был ли сброс уровня
      const isReset = isLevelReset(1);
      
      if (isReset) {
        // Если был сброс, устанавливаем шаг на 0
        localStorage.setItem('metrics_theory_step', '0');
        setCurrentStep(0);
      } else {
        // Если не было сброса, пробуем загрузить сохраненный шаг
        const savedStep = localStorage.getItem('metrics_theory_step');
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10));
        }
      }
    }
  }, []);
  
  // Данные для графиков и воронок
  const retentionData = [
    { label: "День 1", value: 100 },
    { label: "День 3", value: 76 },
    { label: "День 7", value: 55 },
    { label: "День 14", value: 42 },
    { label: "День 30", value: 31 }
  ];
  
  // Данные для графика удержания
  const retentionChartData = [
    { day: 0, value: 100 },
    { day: 1, value: 85 },
    { day: 2, value: 68 },
    { day: 3, value: 57 },
    { day: 5, value: 45 },
    { day: 7, value: 38 },
    { day: 10, value: 33 },
    { day: 14, value: 28 },
    { day: 20, value: 22 },
    { day: 25, value: 18 },
    { day: 30, value: 15 }
  ];
  
  const conversionFunnel = [
    { name: "Посещение", value: 100, color: "#6366f1" },
    { name: "Регистрация", value: 48, color: "#7c3aed" },
    { name: "Активация", value: 32, color: "#8b5cf6" },
    { name: "Покупка", value: 18, color: "#9333ea" },
    { name: "Повторная покупка", value: 11, color: "#a855f7" }
  ];
  
  const steps = [
    // Шаг 1: Введение в метрики
    <div key="intro" className={styles.section}>
      <h1 className={styles.header}>Продуктовые метрики</h1>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
        <h2 className={styles.subheader}>Что такое продуктовые метрики?</h2>
        <p className={styles.text}>
          Продуктовые метрики — это количественные показатели, которые помогают оценить эффективность продукта,
          понять поведение пользователей и принимать обоснованные решения по развитию продукта.
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-900/30 p-4 rounded-lg">
            <h3 className="text-indigo-400 font-semibold mb-2">Зачем нужны метрики?</h3>
            <ul className={styles.list}>
              <li>Объективная оценка успешности продукта</li>
              <li>Выявление проблемных мест и возможностей</li>
              <li>Обоснование продуктовых решений</li>
              <li>Отслеживание прогресса и результатов изменений</li>
            </ul>
          </div>
          
          <div className="bg-indigo-900/30 p-4 rounded-lg">
            <h3 className="text-indigo-400 font-semibold mb-2">Ключевые области метрик</h3>
            <ul className={styles.list}>
              <li>Привлечение пользователей</li>
              <li>Вовлечение и удержание</li>
              <li>Монетизация</li>
              <li>Качество продукта</li>
              <li>Бизнес-показатели</li>
            </ul>
          </div>
        </div>
      </div>
      
      <MentorTip
        tip="Метрики — это ваш компас в мире продуктовой разработки. Они помогают превратить субъективные ощущения в объективные данные и принимать решения на их основе."
        position="bottom-right"
      />
    </div>,

    // Шаг 2: Основные типы метрик
    <div key="metric-types" className={styles.section}>
      <h2 className={styles.subheader}>Основные типы продуктовых метрик</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MetricCard
          title="AARRR (Пиратские метрики)"
          description="Фреймворк для анализа всего пути пользователя: Acquisition (привлечение), Activation (активация), Retention (удержание), Referral (рекомендации), Revenue (доход)."
          icon="🏴‍☠️"
        />
        
        <MetricCard
          title="Метрики Северной Звезды"
          description="Ключевой показатель, который наилучшим образом отражает ценность, которую продукт предоставляет пользователям. Например, для Spotify — количество проигранных минут."
          icon="⭐"
        />
        
        <MetricCard
          title="Счетчики активности"
          description="Метрики, показывающие активность пользователей: DAU (ежедневная активная аудитория), MAU (месячная активная аудитория), WAU (недельная активная аудитория)."
          icon="📈"
        />
        
        <MetricCard
          title="Поведенческие метрики"
          description="Показатели взаимодействия пользователей с продуктом: глубина просмотра, время на сайте, частота возвращения, коэффициент конверсии."
          icon="🔍"
        />
      </div>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6">
        <h3 className="text-xl font-semibold text-indigo-400 mb-4">Пример воронки конверсии</h3>
        <FunnelChart steps={conversionFunnel} />
        <p className="text-sm text-slate-400 text-center mt-4">
          Пример воронки конверсии: от посещения сайта до повторной покупки
        </p>
      </div>
      
      <MentorTip
        tip="Определите, какие метрики действительно важны для вашего продукта на текущем этапе. Разные стадии развития требуют фокуса на разных показателях."
        position="bottom-left"
      />
    </div>,
    
    // Шаг 3: Ключевые метрики продукта
    <div key="key-metrics" className={styles.section}>
      <h2 className={styles.subheader}>Ключевые метрики продукта</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-indigo-400 mb-3">Метрики роста</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">↗️</span>
              <div>
                <strong className="text-white">Темп роста пользователей</strong>
                <p className="text-slate-300 text-sm">Процентное изменение числа пользователей за период</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">📱</span>
              <div>
                <strong className="text-white">Стоимость привлечения (CAC)</strong>
                <p className="text-slate-300 text-sm">Затраты на привлечение одного пользователя</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">♻️</span>
              <div>
                <strong className="text-white">Вирусность (K-фактор)</strong>
                <p className="text-slate-300 text-sm">Количество новых пользователей, привлеченных одним существующим</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-indigo-400 mb-3">Метрики вовлеченности</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">⏱️</span>
              <div>
                <strong className="text-white">Время в приложении</strong>
                <p className="text-slate-300 text-sm">Среднее время, проведенное пользователем в продукте</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">🔄</span>
              <div>
                <strong className="text-white">Частота использования</strong>
                <p className="text-slate-300 text-sm">Как часто пользователи возвращаются к продукту</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">📊</span>
              <div>
                <strong className="text-white">Глубина взаимодействия</strong>
                <p className="text-slate-300 text-sm">Количество действий, совершаемых за сессию</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <RetentionChart data={retentionChartData} />
      
      <MentorTip
        tip="Фокусируйтесь не только на абсолютных значениях метрик, но и на их динамике. Даже небольшие стабильные улучшения могут привести к значительным результатам в долгосрочной перспективе."
        position="top-right"
      />
    </div>,
    
    // Шаг 4: Сбор и анализ метрик
    <div key="analysis" className={styles.section}>
      <h2 className={styles.subheader}>Сбор и анализ метрик</h2>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4">Процесс работы с метриками</h3>
        
        <div className="relative">
          <div className="absolute left-6 inset-y-0 w-0.5 bg-indigo-800"></div>
          
          <div className="relative mb-8 pl-10">
            <div className="absolute left-0 w-12 h-12 rounded-full bg-indigo-900 border-4 border-indigo-600 flex items-center justify-center">
              <span className="text-xl">1</span>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Определение целей</h4>
            <p className="text-slate-300">Какие бизнес-цели и пользовательские потребности вы пытаетесь удовлетворить</p>
          </div>
          
          <div className="relative mb-8 pl-10">
            <div className="absolute left-0 w-12 h-12 rounded-full bg-indigo-900 border-4 border-indigo-600 flex items-center justify-center">
              <span className="text-xl">2</span>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Выбор метрик</h4>
            <p className="text-slate-300">Определение ключевых показателей, которые лучше всего измеряют прогресс</p>
          </div>
          
          <div className="relative mb-8 pl-10">
            <div className="absolute left-0 w-12 h-12 rounded-full bg-indigo-900 border-4 border-indigo-600 flex items-center justify-center">
              <span className="text-xl">3</span>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Настройка сбора данных</h4>
            <p className="text-slate-300">Интеграция аналитических инструментов и настройка трекеров событий</p>
          </div>
          
          <div className="relative mb-8 pl-10">
            <div className="absolute left-0 w-12 h-12 rounded-full bg-indigo-900 border-4 border-indigo-600 flex items-center justify-center">
              <span className="text-xl">4</span>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Анализ данных</h4>
            <p className="text-slate-300">Мониторинг, визуализация и выявление паттернов в данных</p>
          </div>
          
          <div className="relative pl-10">
            <div className="absolute left-0 w-12 h-12 rounded-full bg-indigo-900 border-4 border-indigo-600 flex items-center justify-center">
              <span className="text-xl">5</span>
            </div>
            <h4 className="text-lg font-medium text-white mb-2">Принятие решений</h4>
            <p className="text-slate-300">Использование инсайтов для оптимизации продукта и стратегии</p>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-900/30 p-5 rounded-lg border border-indigo-800">
        <h3 className="text-lg font-semibold text-white mb-3">Популярные инструменты для сбора метрик</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 p-3 rounded-lg text-center">
            <div className="text-2xl mb-2">📊</div>
            <p className="font-medium">Google Analytics</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg text-center">
            <div className="text-2xl mb-2">📱</div>
            <p className="font-medium">Mixpanel</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg text-center">
            <div className="text-2xl mb-2">🔍</div>
            <p className="font-medium">Amplitude</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg text-center">
            <div className="text-2xl mb-2">🔥</div>
            <p className="font-medium">Hotjar</p>
          </div>
        </div>
      </div>
      
      <MentorTip
        tip="Инструменты аналитики мощны, но важнее всего правильно настроить события для отслеживания. Убедитесь, что вы собираете данные о всех критических действиях пользователей в вашем продукте."
        position="bottom-right"
      />
    </div>,
    
    // Шаг 5: Применение метрик в продуктовой разработке
    <div key="application" className={styles.section}>
      <h2 className={styles.subheader}>Применение метрик в продуктовой разработке</h2>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4">Когда использовать метрики</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2">Приоритизация задач</h4>
            <p className="text-slate-300 text-sm">
              Используйте метрики для определения, какие функции или улучшения принесут наибольшую ценность. 
              Сравнивайте потенциальное влияние на ключевые показатели.
            </p>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2">A/B тестирование</h4>
            <p className="text-slate-300 text-sm">
              Проверяйте гипотезы, сравнивая метрики контрольной и экспериментальной группы. 
              Это помогает принимать решения на основе данных, а не интуиции.
            </p>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2">Оценка результатов</h4>
            <p className="text-slate-300 text-sm">
              После внедрения изменений анализируйте, как они повлияли на метрики. 
              Это помогает оценить эффективность изменений и учиться на своих решениях.
            </p>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-2">Определение проблем</h4>
            <p className="text-slate-300 text-sm">
              Мониторинг метрик помогает выявить проблемные места в пользовательском пути, 
              например, высокий процент отказов на определенном шаге.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-900/30 p-5 rounded-lg border border-indigo-800 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Типичные ошибки при работе с метриками</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">⚠️</span>
            <div>
              <strong className="text-white">Оптимизация неправильных метрик</strong>
              <p className="text-slate-300 text-sm">Фокус на легко измеримых, но не значимых для бизнеса показателях</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">⚠️</span>
            <div>
              <strong className="text-white">Игнорирование контекста</strong>
              <p className="text-slate-300 text-sm">Метрики без понимания контекста могут привести к неверным выводам</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">⚠️</span>
            <div>
              <strong className="text-white">Анализ в изоляции</strong>
              <p className="text-slate-300 text-sm">Рассмотрение метрик по отдельности, без учета их взаимосвязи</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">⚠️</span>
            <div>
              <strong className="text-white">Пренебрежение качественными данными</strong>
              <p className="text-slate-300 text-sm">Количественные показатели должны дополняться качественными исследованиями</p>
            </div>
          </li>
        </ul>
      </div>
      
      <MentorTip
        tip="Помните, что метрики — это инструмент, а не самоцель. Сильная продуктовая стратегия сочетает количественные данные с качественным пониманием пользователей и бизнес-контекстом."
        position="bottom-right"
      />
    </div>
  ];

  return (
    <div className={styles.container}>
      <StepNavigation
        steps={steps}
        onComplete={onComplete}
        showBackButton={true}
        continueButtonText="Далее"
        completeButtonText="К практике"
        showProgress={true}
        showStepNumbers={true}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        persistStepKey="metrics_theory_step"
      />
    </div>
  );
};

export default MetricsTheory; 