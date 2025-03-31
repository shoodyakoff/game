import React, { useState } from 'react';
import { styles } from '../common/styles';
import MentorTip from '../../shared/feedback/MentorTip';
import StepNavigation from '../../shared/navigation/StepNavigation';
import { motion } from 'framer-motion';

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
  
  const stepsContent = [
    // Шаг 1: Введение в практическое задание
    <div key="intro" className={styles.section}>
      <h1 className={styles.header}>Практика по метрикам</h1>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
        <h2 className={styles.subheader}>Анализ метрик продукта TaskMaster</h2>
        <p className={styles.text}>
          В этом практическом задании вы будете анализировать метрики мобильного приложения TaskMaster 
          и предлагать решения на основе данных.
        </p>
        
        <p className={styles.text + " mt-4"}>
          Вы — продуктовый менеджер TaskMaster, приложения для управления задачами с более чем 100,000 пользователей. 
          Недавно вы выпустили обновление, которое добавило новый интерфейс создания задач. 
          Ваша задача — проанализировать метрики, выявить проблемы и предложить решения.
        </p>
      </div>
      
      <MentorTip
        tip="В практических заданиях на анализ метрик важно не только интерпретировать данные, но и делать обоснованные выводы и предлагать конкретные действия на их основе."
        position="bottom-right"
      />
    </div>,
    
    // Шаг 2: Анализ дашборда метрик
    <div key="dashboard" className={styles.section}>
      <h2 className={styles.subheader}>Анализ дашборда метрик</h2>
      
      <p className={styles.text + " mb-6"}>
        Ниже представлен дашборд с ключевыми метриками TaskMaster после выпуска обновления.
        Изучите показатели и обратите внимание на динамику изменений.
      </p>
      
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
    </div>,
    
    // Шаг 3: Выявление проблем
    <div key="problems" className={styles.section}>
      <h2 className={styles.subheader}>Выявление проблем на основе метрик</h2>
      
      <p className={styles.text + " mb-6"}>
        Какие проблемы вы можете выявить на основе представленных метрик? 
        Выберите наиболее критичные проблемы, требующие вмешательства.
      </p>
      
      <div className="space-y-3 mb-8">
        {[
          {
            id: "retention_drop",
            title: "Падение показателя удержания пользователей",
            description: "Снижение D7 Retention на 1.5% указывает на проблемы с удержанием новых пользователей после обновления"
          },
          {
            id: "task_creation_drop",
            title: "Снижение частоты создания задач",
            description: "Падение использования основной функции на 12% может свидетельствовать о проблемах с новым интерфейсом"
          },
          {
            id: "acquisition_costs",
            title: "Высокие затраты на привлечение",
            description: "Стоимость привлечения новых пользователей может быть слишком высокой"
          },
          {
            id: "onboarding_issues",
            title: "Проблемы с онбордингом",
            description: "Новые пользователи могут не понимать, как использовать новый интерфейс, что ведет к оттоку"
          }
        ].map(problem => (
          <div
            key={problem.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedMetrics.includes(problem.id)
                ? 'bg-indigo-900/30 border-indigo-500'
                : 'bg-slate-800 border-slate-700 hover:border-slate-500'
            }`}
            onClick={() => handleMetricSelect(problem.id)}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded border mr-3 flex-shrink-0 ${
                selectedMetrics.includes(problem.id)
                  ? 'bg-indigo-500 border-indigo-600'
                  : 'border-slate-500'
              }`}>
                {selectedMetrics.includes(problem.id) && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">{problem.title}</h3>
                <p className="text-slate-300 text-sm">{problem.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Предложите улучшения</h3>
        <p className="text-slate-300 mb-4">
          На основе выбранных проблем предложите конкретные улучшения, которые могли бы исправить ситуацию.
        </p>
        <textarea
          className="w-full bg-slate-700 text-white p-4 rounded border border-slate-600 min-h-32"
          placeholder="Опишите ваши идеи по улучшению продукта..."
          value={improvements}
          onChange={(e) => setImprovements(e.target.value)}
        />
      </div>
      
      <MentorTip
        tip="Важно не только выявить проблемы, но и понять их первопричины. Например, падение частоты создания задач может быть вызвано не только плохим UX, но и изменением в поведении пользователей или сезонными факторами."
        position="bottom-right"
      />
    </div>,
    
    // Шаг 4: Планирование действий
    <div key="actions" className={styles.section}>
      <h2 className={styles.subheader}>Планирование действий</h2>
      
      <p className={styles.text + " mb-6"}>
        Какие действия вы бы предприняли, чтобы исправить выявленные проблемы?
        Выберите наиболее приоритетные и эффективные подходы.
      </p>
      
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
    </div>,
    
    // Шаг 5: Заключение и рефлексия
    <div key="conclusion" className={styles.section}>
      <h2 className={styles.subheader}>Заключение и рефлексия</h2>
      
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
      />
    </div>
  );
};

export default MetricsPractice; 