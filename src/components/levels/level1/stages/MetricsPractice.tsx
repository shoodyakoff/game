import React, { useState, useEffect } from 'react';
import { styles } from '../common/styles';
import MentorTip from '../../shared/feedback/MentorTip';
import StepNavigation from '../../shared/navigation/StepNavigation';
import { motion } from 'framer-motion';
import InfoIcon from '../../shared/icons/InfoIcon';
import { isLevelReset } from '../../shared/utils/levelResetUtils';

interface MetricsPracticeProps {
  onComplete: () => void;
}

// Компонент карточки метрики
const MetricCard: React.FC<{
  title: string;
  description: string;
  value: string;
  change: string;
  isPositive: boolean;
}> = ({ title, description, value, change, isPositive }) => {
  return (
    <motion.div
      className="bg-slate-800 p-4 rounded-lg border border-slate-700"
      whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm mb-4">{description}</p>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {isPositive ? '↑' : '↓'} {change}
        </div>
      </div>
    </motion.div>
  );
};

const MetricsPractice: React.FC<MetricsPracticeProps> = ({ onComplete }) => {
  // Состояние для текущего шага
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // При монтировании компонента проверяем, был ли сброс уровня
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Проверяем, был ли сброс уровня
      const isReset = isLevelReset(1);
      
      if (isReset) {
        // Если был сброс, устанавливаем шаг на 0
        localStorage.setItem('metrics_practice_step', '0');
        setCurrentStep(0);
        // Сбрасываем состояние практики
        setSelectedMetrics([]);
        setImprovements('');
        setSelectedActions([]);
        setTaskInput({
          task1: '',
          task2: '',
          task3: ''
        });
        setSubmitted(false);
      } else {
        // Если не было сброса, пробуем загрузить сохраненный шаг
        const savedStep = localStorage.getItem('metrics_practice_step');
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10));
        }
      }
    }
  }, []);
  
  // Состояние для хранения ответов пользователя
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string>('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState<{[key: string]: string}>({
    task1: '',
    task2: '',
    task3: ''
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  // Обработчики событий
  const handleMetricSelect = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    );
  };
  
  const handleActionSelect = (action: string) => {
    setSelectedActions(prev => 
      prev.includes(action) 
        ? prev.filter(a => a !== action) 
        : [...prev, action]
    );
  };
  
  const handleTaskChange = (taskId: string, value: string) => {
    setTaskInput(prev => ({
      ...prev,
      [taskId]: value
    }));
  };
  
  const handleSubmit = () => {
    setSubmitted(true);
  };
  
  // Данные для анализа
  const dashboardMetrics = [
    {
      title: "DAU (Ежедневные активные пользователи)",
      description: "Количество уникальных пользователей, использующих приложение каждый день",
      value: "12,489",
      change: "3.2% за неделю",
      isPositive: true
    },
    {
      title: "Retention D7",
      description: "Процент пользователей, вернувшихся на 7 день после первого использования",
      value: "42%",
      change: "1.5% за месяц",
      isPositive: false
    },
    {
      title: "Время в приложении",
      description: "Среднее время, проведенное пользователем за одну сессию",
      value: "6:32",
      change: "0.8% за неделю",
      isPositive: true
    },
    {
      title: "Конверсия в покупку",
      description: "Процент пользователей, совершивших покупку PRO-версии",
      value: "5.7%",
      change: "2.1% за месяц",
      isPositive: true
    }
  ];
  
  // Introduction Section
  const renderIntroduction = () => {
    return (
      <div className="mb-10">
        <div className="flex mb-8">
          <div className="border-l-4 border-indigo-500 h-full min-h-full flex-shrink-0"></div>
          <div className="pl-6">
            <h1 className="text-3xl font-bold text-white mb-4">
              Анализ метрик продукта
            </h1>
            <p className="text-slate-300">
              В этом практическом упражнении вы проанализируете ключевые метрики 
              для TaskMaster и определите, какие действия следует предпринять на основе имеющихся данных.
            </p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center mb-4">
            <InfoIcon className="h-6 w-6 text-indigo-400 mr-2" />
            <h3 className="text-xl font-semibold text-indigo-400">О задании</h3>
          </div>
          <p className="text-slate-300 mb-4">
            TaskMaster собирает различные метрики об использовании продукта. Ваша задача:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4 mb-4">
            <li>Изучить ключевые метрики и их динамику</li>
            <li>Выявить проблемные места в продукте</li>
            <li>Предложить рекомендации по улучшению</li>
            <li>Выбрать наиболее важные метрики для дальнейшего мониторинга</li>
          </ul>
        </div>
      </div>
    );
  };

  // Metrics Overview Section
  const renderMetricsOverview = () => {
    return (
      <div className="mt-8" id="metrics-overview">
        <div className="flex mb-8">
          <div className="border-l-4 border-indigo-500 h-full min-h-full flex-shrink-0"></div>
          <div className="pl-6">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">
              Обзор ключевых метрик
            </h2>
            <p className="text-slate-300 mb-4">
              Ниже представлены основные метрики, собранные за последние 6 месяцев работы TaskMaster.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {dashboardMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              description={metric.description}
              value={metric.value}
              change={metric.change}
              isPositive={metric.isPositive}
            />
          ))}
        </div>
      </div>
    );
  };

  // Metrics Analysis Section
  const renderMetricsAnalysis = () => {
    return (
      <div className="mt-16" id="metrics-analysis">
        <div className="flex mb-8">
          <div className="border-l-4 border-indigo-500 h-full min-h-full flex-shrink-0"></div>
          <div className="pl-6">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">
              Анализ метрик
            </h2>
            <p className="text-slate-300 mb-4">
              Основываясь на представленных метриках, проанализируйте ситуацию с TaskMaster
              и предложите действия для улучшения показателей.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Аномалии в пользовательском поведении</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <span>Падение показателя удержания (D7 Retention) на 1.5% за последний месяц</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Увеличение среднего времени, проведенного в приложении</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">⚠️</span>
              <span>После обновления интерфейса создания задач частота использования этой функции снизилась на 12%</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Повышение показателя конверсии в PRO-версию, особенно среди новых пользователей</span>
            </li>
          </ul>
        </div>
        
        <MentorTip
          tip="При анализе метрик важно выявлять не только проблемы, но и положительные тренды. Это поможет понять, какие аспекты обновления сработали хорошо, а какие требуют доработки."
          position="bottom-left"
        />
      </div>
    );
  };

  // Metrics Conclusion Section
  const renderMetricsConclusion = () => {
    return (
      <div className="mt-16" id="metrics-conclusion">
        <div className="flex mb-8">
          <div className="border-l-4 border-indigo-500 h-full min-h-full flex-shrink-0"></div>
          <div className="pl-6">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">
              Формулирование выводов и рекомендаций
            </h2>
            <p className="text-slate-300 mb-4">
              На основе проведенного анализа метрик, сформулируйте ключевые выводы и рекомендации
              для команды TaskMaster:
            </p>
          </div>
        </div>

        <div className="bg-indigo-900/30 p-6 rounded-lg border border-indigo-800 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Ключевые выводы</h3>
          
          <p className={styles.text + " mb-4"}>
            В этом практическом задании вы применили знания о продуктовых метриках для анализа реальной ситуации.
            Вы выявили проблемы, предложили улучшения и определили метрики для отслеживания результатов.
          </p>
          
          <div className="bg-slate-800/70 p-5 rounded-lg mb-4">
            <h4 className="text-lg font-medium text-indigo-400 mb-3">Что вы научились делать:</h4>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              <li>Анализировать продуктовые метрики и выявлять аномалии</li>
              <li>Определять причины проблем на основе данных</li>
              <li>Предлагать обоснованные решения для улучшения продукта</li>
              <li>Планировать конкретные действия и определять метрики успеха</li>
            </ul>
          </div>
          
          <p className={styles.text}>
            Помните, что работа с метриками — это непрерывный процесс. После внедрения изменений необходимо постоянно мониторить
            их эффективность и корректировать стратегию при необходимости.
          </p>
        </div>
      </div>
    );
  };

  // Metrics Action Plan Section
  const renderMetricsActionPlan = () => {
    return (
      <div className="mt-16" id="metrics-action-plan">
        <div className="flex mb-8">
          <div className="border-l-4 border-indigo-500 h-full min-h-full flex-shrink-0"></div>
          <div className="pl-6">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">
              План действий по улучшению метрик
            </h2>
            <p className="text-slate-300 mb-4">
              Основываясь на проведенном анализе, выберите наиболее важные действия
              для улучшения ключевых метрик:
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {[
            {
              id: "a/b_testing",
              title: "Провести A/B тестирование интерфейса создания задач",
              description: "Сравнить новый интерфейс со старым и выявить причины снижения использования"
            },
            {
              id: "user_interviews",
              title: "Провести интервью с пользователями",
              description: "Узнать причины снижения удержания непосредственно от пользователей"
            },
            {
              id: "onboarding_improvement",
              title: "Улучшить онбординг для новых пользователей",
              description: "Добавить интерактивные подсказки для ключевых функций"
            },
            {
              id: "rollback",
              title: "Откатить обновление интерфейса",
              description: "Вернуться к предыдущей версии, которая имела лучшие показатели"
            },
            {
              id: "notification_strategy",
              title: "Пересмотреть стратегию уведомлений",
              description: "Улучшить систему напоминаний для повышения возвращаемости"
            }
          ].map(action => (
            <div
              key={action.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedActions.includes(action.id)
                  ? 'bg-indigo-900/30 border-indigo-500'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-500'
              }`}
              onClick={() => handleActionSelect(action.id)}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded border mr-3 flex-shrink-0 ${
                  selectedActions.includes(action.id)
                    ? 'bg-indigo-500 border-indigo-600'
                    : 'border-slate-500'
                }`}>
                  {selectedActions.includes(action.id) && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-white">{action.title}</h3>
                  <p className="text-slate-300 text-sm">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Определите метрики для отслеживания результатов</h3>
          <p className="text-slate-300 mb-4">
            Какие метрики вы будете отслеживать, чтобы понять, работают ли ваши улучшения?
            Опишите конкретные показатели и целевые значения.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Метрика 1:</label>
              <input
                type="text"
                className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600"
                placeholder="Например: 7-дневное удержание пользователей"
                value={taskInput.task1}
                onChange={(e) => handleTaskChange('task1', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-slate-300 mb-2">Метрика 2:</label>
              <input
                type="text"
                className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600"
                placeholder="Например: Частота использования функции создания задач"
                value={taskInput.task2}
                onChange={(e) => handleTaskChange('task2', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-slate-300 mb-2">Метрика 3:</label>
              <input
                type="text"
                className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600"
                placeholder="Например: Оценка удовлетворенности пользователей (NPS)"
                value={taskInput.task3}
                onChange={(e) => handleTaskChange('task3', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <MentorTip
          tip="Составляя план действий, соблюдайте баланс между быстрыми победами и долгосрочными улучшениями. Некоторые метрики могут показать улучшения сразу, другие будут изменяться медленнее."
          position="top-right"
        />
      </div>
    );
  };

  const stepsContent = [
    // Шаг 1: Введение в практическое задание
    <div key="intro" className={styles.section}>
      {renderIntroduction()}
    </div>,
    
    // Шаг 2: Анализ дашборда метрик
    <div key="dashboard" className={styles.section}>
      {renderMetricsOverview()}
    </div>,
    
    // Шаг 3: Выявление проблем
    <div key="problems" className={styles.section}>
      {renderMetricsAnalysis()}
    </div>,
    
    // Шаг 4: Планирование действий
    <div key="actions" className={styles.section}>
      {renderMetricsActionPlan()}
    </div>,
    
    // Шаг 5: Заключение и рефлексия
    <div key="conclusion" className={styles.section}>
      {renderMetricsConclusion()}
      
      {submitted ? (
        <div className="bg-green-900/30 p-6 rounded-lg border border-green-800">
          <h3 className="text-xl font-semibold text-green-400 mb-4">Задание выполнено!</h3>
          <p className="text-slate-300">
            Отличная работа! Вы успешно проанализировали метрики и предложили решения для улучшения продукта.
            Нажмите "К следующему этапу" для продолжения.
          </p>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors"
            onClick={handleSubmit}
          >
            Завершить анализ
          </button>
        </div>
      )}
      
      <MentorTip
        tip="Анализ метрик — важный навык продуктового менеджера. Он позволяет принимать обоснованные решения, но помните, что за цифрами всегда стоят реальные пользователи и их потребности."
        position="bottom-right"
      />
    </div>
  ];

  return (
    <div className={styles.container}>
      <StepNavigation
        steps={stepsContent}
        onComplete={onComplete}
        showBackButton={true}
        continueButtonText="Далее"
        completeButtonText="Завершить"
        showProgress={true}
        showStepNumbers={true}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        persistStepKey="metrics_practice_step"
      />
    </div>
  );
};

export default MetricsPractice; 