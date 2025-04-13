import React, { useState, useEffect } from 'react';
import { styles } from '../common/styles';
import StepNavigation from '../../shared/navigation/StepNavigation';
import MentorTip from '../../../common/MentorTip';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { isLevelReset } from '../../shared/utils/levelResetUtils';

interface ProductThinkingTheoryProps {
  onComplete?: () => void;
}

// Интерактивная карточка с информацией
const InfoCard: React.FC<{title: string; description: string; icon?: React.ReactNode}> = ({title, description, icon}) => {
  return (
    <motion.div 
      className="bg-slate-800/70 p-5 rounded-lg border border-slate-700 shadow-lg"
      whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start">
        {icon && (
          <div className="w-12 h-12 rounded-full bg-indigo-600/80 flex items-center justify-center mr-4 flex-shrink-0 shadow-lg shadow-indigo-900/40">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-indigo-400 mb-3">{title}</h3>
          <p className="text-slate-300">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Интерактивный опрос
const InteractivePoll: React.FC<{question: string; options: string[]}> = ({question, options}) => {
  const [selected, setSelected] = useState<number | null>(null);
  
  return (
    <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700 mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">{question}</h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <div 
            key={index}
            onClick={() => setSelected(index)}
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${selected === index ? 'bg-indigo-900/50 border-indigo-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border mr-3 flex-shrink-0 ${selected === index ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'}`}>
                {selected === index && <span className="flex items-center justify-center h-full text-white text-xs">✓</span>}
              </div>
              <span className="text-slate-200">{option}</span>
            </div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-800 rounded">
          <p className="text-indigo-300 text-sm">
            {selected === 0 ? 'Хороший выбор! Пользователи — основа любого продукта, но успешный PM всегда учитывает и интересы бизнеса.' : 
            selected === 1 ? 'Отлично! Без достижения бизнес-целей продукт не будет устойчивым, но помните, что пользователи — ключ к долгосрочному успеху.' : 
            selected === 2 ? 'Великолепно! Именно баланс всех факторов — это суть эффективного продуктового мышления. Вы на правильном пути!' : 
            'Интересный выбор! Тренды действительно важны, но главное — найти баланс между потребностями пользователей и целями бизнеса.'}
          </p>
        </div>
      )}
    </div>
  );
};

const ProductThinkingTheory: React.FC<ProductThinkingTheoryProps> = ({ onComplete }) => {
  // Инициализируем состояние с нуля
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // При монтировании компонента проверяем, был ли сброс уровня
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Проверяем, был ли сброс уровня
      const isReset = isLevelReset(1);
      
      if (isReset) {
        // Если был сброс, устанавливаем шаг на 0
        localStorage.setItem('product_thinking_theory_step', '0');
        setCurrentStep(0);
      } else {
        // Если не было сброса, пробуем загрузить сохраненный шаг
        const savedStep = localStorage.getItem('product_thinking_theory_step');
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10));
        }
      }
    }
  }, []);

  // Содержимое шагов
  const stepsData = [
    {
      id: "intro",
      title: "Что такое продуктовое мышление?",
      content: (
        <>
          <div className="flex mb-8">
            <div className="pl-0">
              <p className={styles.text + " mb-8"}>
                Продуктовое мышление — это мощный подход к созданию востребованных продуктов через призму ценности 
                для пользователя и бизнеса одновременно. Это фундаментальный навык современного продакт-менеджера, 
                который трансформирует идеи в успешные решения, учитывая все ключевые факторы экосистемы продукта.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 mb-8">
            <MentorTip
              content={
                <>
                  <h3 className="text-lg font-bold mb-2">Совет ментора:</h3>
                  <p>
                    Продуктовое мышление выходит далеко за рамки обычного навыка — это трансформирующий 
                    образ мышления, который создает продукты-чемпионы. Развивайте способность видеть 
                    целостную картину: объединяйте глубокую эмпатию к пользователям, стратегическое 
                    видение бизнес-целей и понимание технических возможностей. Лучшие продуктовые 
                    решения рождаются именно на пересечении этих перспектив.
                  </p>
                </>
              }
              position="left"
              className="z-10"
            />
          </div>
          
          <h3 className="text-xl font-bold text-indigo-400 mb-4">Продуктовое мышление позволяет:</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InfoCard 
              title="Выявлять критические проблемы" 
              description="Точно определять, какие задачи пользователей требуют немедленного решения, преобразуя боли в точки роста продукта."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <InfoCard 
              title="Принимать data-driven решения" 
              description="Трансформировать данные и аналитику в конкретные стратегические решения, минимизируя риски и усиливая воздействие."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <InfoCard 
              title="Балансировать противоречивые приоритеты" 
              description="Мастерски находить золотую середину между амбициозными желаниями пользователей, стратегическими бизнес-целями и технологическими ограничениями."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              }
            />
            <InfoCard 
              title="Прогнозировать каскадный эффект изменений" 
              description="Предвидеть, как даже небольшие изменения в продукте могут качественно трансформировать пользовательский опыт и ключевые метрики бизнеса."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
          </div>
          
          <InteractivePoll 
            question="Что, на ваш взгляд, важнее всего при принятии продуктовых решений?"
            options={[
              "Удовлетворение потребностей пользователей",
              "Достижение бизнес-целей компании",
              "Баланс между потребностями пользователей, бизнес-целями и техническими возможностями",
              "Следование рыночным трендам и лучшим практикам"
            ]}
          />
        </>
      )
    },
    {
      id: "principles",
      title: "Основные принципы продуктового мышления",
      content: (
        <>
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
              <div className="flex">
                <div className="text-indigo-400 mr-3 text-lg font-bold">1.</div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Фокус на решении проблем пользователей</h3>
              </div>
              <p className={styles.text}>
                Успешные продукты решают реальные проблемы пользователей. Продуктовый менеджер должен постоянно
                искать и анализировать эти проблемы, а затем разрабатывать решения, которые действительно помогут пользователям.
              </p>
              <div className="bg-slate-700/60 p-4 rounded mt-3">
                <p className={styles.text}>
                  <strong>Пример:</strong> Вместо добавления новой функции "потому что конкурент её добавил", 
                  продуктовый менеджер сначала определяет, решает ли эта функция реальную проблему пользователей.
                </p>
              </div>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
              <div className="flex">
                <div className="text-indigo-400 mr-3 text-lg font-bold">2.</div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Принятие решений на основе данных</h3>
              </div>
              <p className={styles.text}>
                Продуктовый менеджер анализирует метрики, обратную связь пользователей и результаты тестирования
                для принятия обоснованных решений, а не полагается только на мнения и интуицию.
              </p>
              <div className="bg-slate-700/60 p-4 rounded mt-3">
                <p className={styles.text}>
                  <strong>Пример:</strong> При редизайне интерфейса, команда проводит A/B-тестирование и
                  анализирует, как изменения влияют на конверсию и удержание пользователей.
                </p>
              </div>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
              <div className="flex">
                <div className="text-indigo-400 mr-3 text-lg font-bold">3.</div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Итеративный подход</h3>
              </div>
              <p className={styles.text}>
                Продуктовое мышление предполагает постепенное улучшение продукта на основе обратной связи и
                данных, а не стремление к идеальному решению с первой попытки.
              </p>
              <div className="bg-slate-700/60 p-4 rounded mt-3">
                <p className={styles.text}>
                  <strong>Пример:</strong> Вместо запуска полностью нового функционала, команда выпускает
                  минимально жизнеспособный продукт (MVP), собирает обратную связь и итеративно улучшает его.
                </p>
              </div>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-lg border border-slate-700">
              <div className="flex">
                <div className="text-indigo-400 mr-3 text-lg font-bold">4.</div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Системное мышление</h3>
              </div>
              <p className={styles.text}>
                Продуктовый менеджер должен понимать, как различные части продукта взаимодействуют друг с другом
                и как изменения в одной области могут повлиять на другие.
              </p>
              <div className="bg-slate-700/60 p-4 rounded mt-3">
                <p className={styles.text}>
                  <strong>Пример:</strong> При добавлении новых фильтров поиска, продуктовый менеджер анализирует,
                  как это повлияет на производительность, мобильный интерфейс и общий пользовательский опыт.
                </p>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      id: "process",
      title: "Процесс продуктового мышления",
      content: (
        <>
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
                Оцените предложенные решения по заранее определенным критериям, учитывая влияние на пользователей, техническую реализуемость и бизнес-цели.
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
          
          <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-700/60 rounded-lg p-6 mt-8">
            <div className="flex items-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-xl font-bold text-indigo-400">Пример из практики: Spotify Discover Weekly</h3>
            </div>
            
            <div className="flex items-start">
              <div className="hidden md:block flex-shrink-0 mr-6">
                <div className="w-28 h-28 bg-indigo-800/40 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 24 24" className="w-16 h-16 text-green-500" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-slate-200 mb-4">
                  Один из самых успешных примеров применения продуктового мышления — это создание функции <span className="text-green-400 font-semibold">Discover Weekly</span> компанией Spotify. Эта функция еженедельно предлагает пользователям персонализированный плейлист из 30 треков, которые им могут понравиться.
                </p>
                
                <div className="rounded-lg bg-slate-800/70 p-4 mb-4 border border-slate-700">
                  <h4 className="text-indigo-300 font-semibold mb-2">Как Spotify применили продуктовое мышление:</h4>
                  <ul className="space-y-2 ml-4">
                    <li className="flex">
                      <div className="w-6 h-6 rounded-full bg-indigo-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">1</span>
                      </div>
                      <p className="text-slate-300 text-sm"><span className="text-indigo-400 font-medium">Выявление проблемы пользователей:</span> Spotify определили, что пользователи тратят много времени на поиск новой музыки, которая соответствовала бы их вкусам.</p>
                    </li>
                    <li className="flex">
                      <div className="w-6 h-6 rounded-full bg-indigo-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">2</span>
                      </div>
                      <p className="text-slate-300 text-sm"><span className="text-indigo-400 font-medium">Баланс интересов:</span> Решение привлекало новых пользователей, увеличивало вовлеченность существующих и помогало малоизвестным артистам — выигрывали все стороны.</p>
                    </li>
                    <li className="flex">
                      <div className="w-6 h-6 rounded-full bg-indigo-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">3</span>
                      </div>
                      <p className="text-slate-300 text-sm"><span className="text-indigo-400 font-medium">Data-driven подход:</span> Алгоритмы использовали данные о музыкальных предпочтениях и поведении миллионов пользователей, а не просто предлагали популярные треки.</p>
                    </li>
                    <li className="flex">
                      <div className="w-6 h-6 rounded-full bg-indigo-700/60 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <span className="text-white font-medium text-xs">4</span>
                      </div>
                      <p className="text-slate-300 text-sm"><span className="text-indigo-400 font-medium">Постоянные итерации:</span> Spotify постоянно улучшали алгоритмы, анализируя, какие рекомендации пользователи добавляют в свои плейлисты.</p>
                    </li>
                  </ul>
                </div>
                
                <p className="text-slate-300">
                  <span className="text-indigo-300 font-semibold">Результат:</span> Discover Weekly стал одной из самых популярных функций Spotify. Более 40 миллионов пользователей прослушали более 5 миллиардов треков из своих персонализированных плейлистов за первый год. Этот пример показывает, как правильное применение продуктового мышления может создать функцию, которая значительно улучшает пользовательский опыт и одновременно достигает бизнес-целей.
                </p>
              </div>
            </div>
          </div>
        </>
      )
    }
  ];

  // Создаем массив шагов для использования с StepNavigation
  const steps = stepsData.map((step, index) => (
    <div key={step.id}>
      <h2 className="text-2xl font-bold mb-6 text-indigo-400">
        {index + 1}. {step.title}
      </h2>
      
      <div className="border-l-4 border-indigo-500 pl-6">
        {step.content}
      </div>
    </div>
  ));

  return (
    <div className={styles.container}>
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-4">Продуктовое мышление: теория</h1>
        <p className="text-slate-400 italic max-w-3xl">
          Изучите основы продуктового мышления и научитесь применять их для создания успешных продуктов.
        </p>
      </motion.div>

      <StepNavigation 
        steps={steps} 
        onComplete={onComplete}
        completeButtonText="Перейти к практике"
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        persistStepKey="product_thinking_theory_step"
      />
    </div>
  );
};

export default ProductThinkingTheory; 