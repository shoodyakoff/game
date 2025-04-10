import React, { useState } from 'react';
import { styles } from '../common/styles';
import MentorTip from '../../shared/feedback/MentorTip';
import StepNavigation from '../../shared/navigation/StepNavigation';

interface UXAnalysisTheoryProps {
  onComplete: () => void;
}

const UXAnalysisTheory: React.FC<UXAnalysisTheoryProps> = ({ onComplete }) => {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);

  const handlePrincipleSelect = (principle: string) => {
    setSelectedPrinciples(prev => {
      if (prev.includes(principle)) {
        return prev.filter(p => p !== principle);
      }
      return [...prev, principle];
    });
  };

  const steps = [
    // Шаг 1: Введение в UX
    <div key="intro" className={styles.section}>
      <h1 className={styles.header}>UX-анализ: теория</h1>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
        <h2 className={styles.subheader}>Что такое UX?</h2>
        <p className={styles.text}>
          UX (User Experience, пользовательский опыт) — это совокупность впечатлений и эмоций, 
          которые пользователь получает при взаимодействии с продуктом. Хороший UX делает продукт 
          удобным, понятным и эффективным в использовании.
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-900/30 p-4 rounded-lg">
            <h3 className="text-indigo-400 font-semibold mb-2">Хороший UX приводит к:</h3>
            <ul className="list-disc list-inside text-slate-300">
              <li>Повышению удовлетворенности пользователей</li>
              <li>Увеличению конверсии</li>
              <li>Снижению количества отказов</li>
              <li>Росту лояльности к продукту</li>
            </ul>
          </div>
          
          <div className="bg-red-900/30 p-4 rounded-lg">
            <h3 className="text-red-400 font-semibold mb-2">Плохой UX приводит к:</h3>
            <ul className="list-disc list-inside text-slate-300">
              <li>Разочарованию пользователей</li>
              <li>Потере клиентов</li>
              <li>Негативным отзывам</li>
              <li>Снижению доверия к продукту</li>
            </ul>
          </div>
        </div>
      </div>

      <MentorTip
        tip="Помните, что UX — это не только про красивый дизайн. Это про то, насколько легко и приятно пользователям достигать своих целей с помощью вашего продукта."
        position="top-right"
      />
    </div>,

    // Шаг 2: Принципы UX-дизайна
    <div key="principles" className={styles.section}>
      <h2 className={styles.subheader}>Основные принципы UX-дизайна</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          {
            title: "Понимание пользователя",
            description: "Исследование потребностей и поведения целевой аудитории",
            icon: "🎯"
          },
          {
            title: "Простота и удобство",
            description: "Минимизация когнитивной нагрузки на пользователя",
            icon: "✨"
          },
          {
            title: "Последовательность",
            description: "Единообразие интерфейсов и логики взаимодействия",
            icon: "🔄"
          },
          {
            title: "Обратная связь",
            description: "Информирование пользователя о результатах действий",
            icon: "💬"
          }
        ].map(principle => (
          <div
            key={principle.title}
            className={`bg-slate-800 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedPrinciples.includes(principle.title)
                ? 'border-indigo-500 bg-indigo-900/30'
                : 'border-slate-700 hover:border-slate-500'
            }`}
            onClick={() => handlePrincipleSelect(principle.title)}
          >
            <div className="text-3xl mb-2">{principle.icon}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{principle.title}</h3>
            <p className="text-slate-300">{principle.description}</p>
          </div>
        ))}
      </div>

      <MentorTip
        tip="Попробуйте выбрать принципы, которые, по вашему мнению, наиболее критичны для TaskMaster. Подумайте, как они могут помочь в решении текущих проблем."
        position="bottom-left"
      />
    </div>,

    // Шаг 3: Методы UX-исследований
    <div key="research" className={styles.section}>
      <h2 className={styles.subheader}>Методы UX-исследований</h2>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">Качественные исследования</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">👥</span>
                <div>
                  <strong className="text-white">Интервью</strong>
                  <p className="text-slate-300">Глубинные беседы с пользователями</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">👀</span>
                <div>
                  <strong className="text-white">Наблюдение</strong>
                  <p className="text-slate-300">Анализ поведения пользователей</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">🧪</span>
                <div>
                  <strong className="text-white">Юзабилити-тестирование</strong>
                  <p className="text-slate-300">Тестирование удобства использования</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">Количественные исследования</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">📊</span>
                <div>
                  <strong className="text-white">Анализ метрик</strong>
                  <p className="text-slate-300">Изучение поведенческих данных</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">🔄</span>
                <div>
                  <strong className="text-white">A/B-тестирование</strong>
                  <p className="text-slate-300">Сравнение вариантов решений</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">📝</span>
                <div>
                  <strong className="text-white">Опросы</strong>
                  <p className="text-slate-300">Сбор мнений пользователей</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-indigo-900/30 p-6 rounded-lg border border-indigo-800">
        <h3 className="text-xl font-semibold text-indigo-400 mb-4">Customer Journey Map</h3>
        <p className="text-slate-300 mb-4">
          Визуализация пути пользователя от первого взаимодействия до достижения цели. 
          Помогает выявить:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="bg-slate-800/50 p-3 rounded">
            <span className="text-white">🎯 Точки контакта</span>
          </li>
          <li className="bg-slate-800/50 p-3 rounded">
            <span className="text-white">😤 Болевые точки</span>
          </li>
          <li className="bg-slate-800/50 p-3 rounded">
            <span className="text-white">💡 Возможности улучшения</span>
          </li>
          <li className="bg-slate-800/50 p-3 rounded">
            <span className="text-white">🎉 Моменты радости</span>
          </li>
        </ul>
      </div>

      <MentorTip
        tip="Комбинируйте разные методы исследований для получения полной картины. Качественные методы помогают понять 'почему', а количественные - 'что' и 'сколько'."
        position="bottom-right"
      />
    </div>,

    // Шаг 4: Метрики UX
    <div key="metrics" className={styles.section}>
      <h2 className={styles.subheader}>Ключевые метрики UX</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          {
            id: "conversion",
            title: "Конверсия",
            description: "Процент пользователей, достигающих целевого действия",
            metrics: ["Регистрация", "Активация", "Удержание"]
          },
          {
            id: "engagement",
            title: "Вовлеченность",
            description: "Как активно пользователи взаимодействуют с продуктом",
            metrics: ["Время на сайте", "Глубина просмотра", "Частота возврата"]
          },
          {
            id: "satisfaction",
            title: "Удовлетворенность",
            description: "Насколько пользователи довольны продуктом",
            metrics: ["NPS", "CSAT", "Отзывы пользователей"]
          }
        ].map(metric => (
          <div
            key={metric.id}
            className={`bg-slate-800 p-4 rounded-lg cursor-pointer transition-all ${
              activeMetric === metric.id ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setActiveMetric(metric.id)}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{metric.title}</h3>
            <p className="text-slate-300 mb-4">{metric.description}</p>
            <ul className="text-slate-400">
              {metric.metrics.map(m => (
                <li key={m} className="mb-1">• {m}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <MentorTip
        tip="Отслеживайте эти метрики регулярно, чтобы вовремя заметить проблемы и оценить эффективность внесенных улучшений."
        position="bottom-right"
      />
    </div>,

    // Шаг 5: UX-инструменты
    <div key="tools" className={styles.section}>
      {/* ... existing code ... */}
    </div>
  ];

  return (
    <div className={styles.container}>
      <StepNavigation
        steps={steps}
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

export default UXAnalysisTheory; 