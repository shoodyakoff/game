import React, { useState } from 'react';
import { styles } from '../common/styles';
import StepNavigation from '../../StepNavigation';
import MentorTip from '../../MentorTip';
import Image from 'next/image';
import { motion } from 'framer-motion';

type ProductMindsetTheoryProps = {
  onComplete: () => void;
};

// Компонент интерактивной карточки, которая анимируется при наведении
const InteractiveCard: React.FC<{title: string; description: string; icon?: string}> = ({title, description, icon}) => {
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

// Компонент для отображения прогресса в процентах
const ProgressBar: React.FC<{percent: number; label: string}> = ({percent, label}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="text-sm text-indigo-400 font-medium">{percent}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

// Интерактивный опрос 
const InteractivePoll: React.FC<{question: string; options: string[]}> = ({question, options}) => {
  const [selected, setSelected] = useState<number | null>(null);
  
  return (
    <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selected === index 
                ? 'bg-indigo-900/50 border-indigo-500' 
                : 'bg-slate-700 border-slate-600 hover:border-slate-500'
            }`}
            onClick={() => setSelected(index)}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                selected === index ? 'border-indigo-500 bg-indigo-500/30' : 'border-slate-500'
              }`}>
                {selected === index && <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>}
              </div>
              <span>{option}</span>
            </div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <div className="mt-4 p-3 bg-indigo-900/30 rounded-lg border border-indigo-800">
          <p className="text-indigo-300 text-sm">
            Спасибо за ваш ответ! Этот опрос помогает вам лучше понять аспекты продуктового мышления на практике.
          </p>
        </div>
      )}
    </div>
  );
};

const ProductMindsetTheory = ({ onComplete }: ProductMindsetTheoryProps) => {
  // Состояние для активного таба в диаграмме
  const [activeTab, setActiveTab] = useState<string>('userValue');
  
  // Шаги для компонента StepNavigation
  const steps = [
    // Шаг 1: Введение в продуктовое мышление
    <div key="step1">
      <section className={styles.section}>
        <h2 className={styles.subheader}>Что такое продуктовое мышление?</h2>
        <p className={styles.text}>
          Продуктовое мышление — это подход к разработке и развитию продуктов, при котором основное внимание уделяется 
          созданию ценности для пользователя и достижению бизнес-целей. В отличие от проектного подхода, 
          ориентированного на выполнение заданий, продуктовое мышление фокусируется на конечных результатах 
          и удовлетворении потребностей клиентов.
        </p>
        
        <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-4 mt-6 mb-6">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Ключевые аспекты продуктового мышления:</h3>
          <ul className={styles.list}>
            <li>Фокус на <strong>проблемах</strong>, а не на решениях</li>
            <li>Понимание <strong>пользователей</strong> и их потребностей</li>
            <li>Ориентация на <strong>бизнес-цели</strong> и ценность для компании</li>
            <li>Принятие решений на основе <strong>данных</strong></li>
            <li>Итеративный подход и <strong>постоянное улучшение</strong></li>
          </ul>
        </div>
      </section>
      
      <h2 className={styles.subheader}>Сравнение продуктового и проектного подхода</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div className="bg-indigo-900/20 p-5 rounded-lg border border-indigo-800/50">
          <h3 className="text-xl font-semibold text-indigo-400 mb-4 text-center">Продуктовый подход</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>Фокусируется на <strong>результатах</strong> и <strong>ценности</strong></span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>Ориентирован на долгосрочную перспективу</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>Адаптируется к новым данным и обратной связи</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>Измеряет успех через ключевые метрики</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <span>Непрерывно улучшает продукт</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-slate-700 p-5 rounded-lg border border-slate-600">
          <h3 className="text-xl font-semibold text-slate-300 mb-4 text-center">Проектный подход</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-amber-500 mr-3">○</span>
              <span>Фокусируется на <strong>задачах</strong> и <strong>сроках</strong></span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-3">○</span>
              <span>Ориентирован на конкретные результаты проекта</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-3">○</span>
              <span>Следует предопределенному плану</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-3">○</span>
              <span>Измеряет успех через выполнение задач в срок</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-3">○</span>
              <span>Завершается с достижением цели проекта</span>
            </li>
          </ul>
        </div>
      </div>
      
      <InteractivePoll 
        question="С каким подходом вы больше сталкивались в своей практике?"
        options={[
          "В основном с продуктовым подходом", 
          "В основном с проектным подходом", 
          "С обоими подходами примерно поровну",
          "У нас смешанный подход с элементами обоих",
          "Не было опыта работы с этими подходами"
        ]}
      />
    </div>,

    // Шаг 2: Баланс интересов
    <div key="step2">
      <section className="mb-8">
        <h2 className={styles.subheader}>Баланс интересов в продуктовом мышлении</h2>
        <div className="bg-slate-800/50 rounded-lg p-6 mb-4">
          <p className="text-slate-300 mb-4">
            Успешный продукт - это результат баланса между потребностями пользователей, бизнес-целями и техническими возможностями.
          </p>
          <p className="text-slate-300">
            Рассмотрим, как эти три аспекта взаимодействуют между собой и почему важно учитывать их все при принятии продуктовых решений.
          </p>
        </div>
      </section>

      <h2 className={styles.subheader}>Баланс интересов в продуктовом мышлении</h2>
      
      <div className="bg-slate-800/50 rounded-lg p-6 mt-6 mb-2">
        <div className="flex flex-col items-center">
          <div className="text-center mb-8">
            <p className="text-lg text-slate-300">Успешный продукт находится на пересечении трех ключевых аспектов:</p>
          </div>
          
          <div className="relative w-full max-w-2xl aspect-square">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Три пересекающихся круга с градиентной заливкой */}
                <circle cx="200" cy="150" r="120" fill="url(#userGradient)" opacity="0.6" />
                <circle cx="120" cy="280" r="120" fill="url(#businessGradient)" opacity="0.6" />
                <circle cx="280" cy="280" r="120" fill="url(#techGradient)" opacity="0.6" />
                
                {/* Градиенты */}
                <defs>
                  <radialGradient id="userGradient">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#312e81" />
                  </radialGradient>
                  <radialGradient id="businessGradient">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#312e81" />
                  </radialGradient>
                  <radialGradient id="techGradient">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#312e81" />
                  </radialGradient>
                </defs>
                
                {/* Текст */}
                <text x="200" y="100" textAnchor="middle" fill="white" fontSize="16">Ценность для пользователя</text>
                <text x="80" y="320" textAnchor="middle" fill="white" fontSize="16">Бизнес-цели</text>
                <text x="320" y="320" textAnchor="middle" fill="white" fontSize="16">Технические возможности</text>
                
                {/* Центральная область */}
                <text x="200" y="220" textAnchor="middle" fill="white" fontSize="14">Успешный</text>
                <text x="200" y="240" textAnchor="middle" fill="white" fontSize="14">продукт</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>,
    
    // Шаг 3: Процесс продуктового мышления
    <div key="step3">
      <h2 className={styles.subheader}>Процесс продуктового мышления</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-6">
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-indigo-400">Выявление проблемы</h3>
          </div>
          <p className="text-slate-300">
            Определите и четко сформулируйте проблему, которую вы пытаетесь решить. Используйте данные и исследования для подтверждения и уточнения проблемы.
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-indigo-400">Анализ</h3>
          </div>
          <p className="text-slate-300">
            Проанализируйте имеющиеся данные, отзывы пользователей и метрики, чтобы глубже понять проблему и ее причины. Определите критерии успеха.
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-indigo-400">Генерация идей</h3>
          </div>
          <p className="text-slate-300">
            Разработайте различные варианты решения проблемы. Рассмотрите разные подходы и не ограничивайтесь очевидными решениями.
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
              <span className="text-2xl">4</span>
            </div>
            <h3 className="text-xl font-semibold text-indigo-400">Оценка и выбор решения</h3>
          </div>
          <p className="text-slate-300">
            Оцените предложенные решения по критериям. Учитывайте влияние на пользователей, техническую реализуемость и бизнес-цели.
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
              <span className="text-2xl">5</span>
            </div>
            <h3 className="text-xl font-semibold text-indigo-400">Тестирование и итерации</h3>
          </div>
          <p className="text-slate-300">
            Реализуйте выбранное решение, тестируйте его с пользователями и непрерывно улучшайте продукт на основе полученных данных и обратной связи.
          </p>
        </div>
      </div>
      
      <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4">Практическое задание</h3>
        <p className="text-slate-300 mb-4">
          В следующем разделе вы будете применять продуктовое мышление для решения реальной задачи. Вам предстоит:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/50 flex items-center justify-center mr-3">
                <span className="text-lg">1</span>
              </div>
              <h4 className="text-indigo-400 font-medium">Анализ данных</h4>
            </div>
            <p className="text-slate-300 text-sm">
              Изучить метрики использования продукта и отзывы пользователей
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/50 flex items-center justify-center mr-3">
                <span className="text-lg">2</span>
              </div>
              <h4 className="text-indigo-400 font-medium">UX-исследование</h4>
            </div>
            <p className="text-slate-300 text-sm">
              Выявить проблемные места в пользовательском опыте
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/50 flex items-center justify-center mr-3">
                <span className="text-lg">3</span>
              </div>
              <h4 className="text-indigo-400 font-medium">Разработка решений</h4>
            </div>
            <p className="text-slate-300 text-sm">
              Предложить и оценить варианты улучшения продукта
            </p>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/50 flex items-center justify-center mr-3">
                <span className="text-lg">4</span>
              </div>
              <h4 className="text-indigo-400 font-medium">План улучшений</h4>
            </div>
            <p className="text-slate-300 text-sm">
              Составить план внедрения и измерения результатов
            </p>
          </div>
        </div>
      </div>
    </div>
  ];

  return (
    <div className={styles.container}>
      <StepNavigation 
        steps={steps} 
        onComplete={onComplete}
        completeButtonText="Перейти к практике"
      />
    </div>
  );
};

export default ProductMindsetTheory; 