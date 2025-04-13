import React, { useState, useEffect } from 'react';
import { styles } from '../common/styles';
import StepNavigation from '../../shared/navigation/StepNavigation';
import MentorTip from '../../shared/feedback/MentorTip';
import { isLevelReset } from '../../shared/utils/levelResetUtils';

type DecisionMakingTheoryProps = {
  onComplete: () => void;
};

const DecisionMakingTheory = ({ onComplete }: DecisionMakingTheoryProps) => {
  // Состояние для текущего шага
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // При монтировании компонента проверяем, был ли сброс уровня
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Проверяем, был ли сброс уровня
      const isReset = isLevelReset(1);
      
      if (isReset) {
        // Если был сброс, устанавливаем шаг на 0
        localStorage.setItem('decision_making_theory_step', '0');
        setCurrentStep(0);
      } else {
        // Если не было сброса, пробуем загрузить сохраненный шаг
        const savedStep = localStorage.getItem('decision_making_theory_step');
        if (savedStep) {
          setCurrentStep(parseInt(savedStep, 10));
        }
      }
    }
  }, []);
  
  const steps = [
    // Шаг 1: Введение в принятие решений
    <div key="intro" className={styles.section}>
      <h1 className={styles.header}>Принятие решений в продуктовой разработке</h1>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
        <h2 className={styles.subheader}>Роль принятия решений в работе продакт-менеджера</h2>
        <p className={styles.text}>
          Продакт-менеджер ежедневно принимает десятки решений, которые влияют на успех продукта,
          удовлетворенность пользователей и достижение бизнес-целей. Умение принимать обоснованные и 
          взвешенные решения — ключевой навык успешного продакт-менеджера.
        </p>
        
        <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Почему качество решений имеет критическое значение?</h3>
          <ul className={styles.list}>
            <li>Ресурсы команды ограничены, и каждое решение определяет, на что они будут потрачены</li>
            <li>Неверные решения могут привести к потере пользователей и доходов</li>
            <li>Качественные решения создают конкурентное преимущество и ускоряют развитие продукта</li>
            <li>Каждое решение имеет долгосрочные последствия для продукта и бизнеса</li>
            <li>Решения продакт-менеджера влияют на работу многих команд и стейкхолдеров</li>
          </ul>
        </div>
      </div>
      
      <MentorTip
        tip="Помните, что принятие решений в продуктовой разработке — это не гадание и не интуиция. Это структурированный процесс, основанный на анализе данных и глубоком понимании пользователей и бизнеса."
        position="bottom-right"
      />
    </div>,

    // Шаг 2: Типы решений в продуктовой разработке
    <div key="decision-types" className={styles.section}>
      <h2 className={styles.subheader}>Типы решений в продуктовой разработке</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={styles.decisionCard}>
          <h3 className={styles.decisionTitle}>Стратегические решения</h3>
          <p className={styles.text}>
            Определяют долгосрочное направление развития продукта, влияют на бизнес-модель, 
            позиционирование и основную ценность для пользователей.
          </p>
          <div className="bg-slate-800 p-3 rounded mt-3">
            <p className="font-medium text-indigo-400 mb-2">Примеры:</p>
            <ul className={styles.list}>
              <li>На какие сегменты пользователей сфокусироваться</li>
              <li>Какую бизнес-модель выбрать</li>
              <li>Какую проблему решать с помощью продукта</li>
              <li>Как позиционировать продукт на рынке</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.decisionCard}>
          <h3 className={styles.decisionTitle}>Тактические решения</h3>
          <p className={styles.text}>
            Определяют, как реализовать стратегию в краткосрочной перспективе, какие функции 
            разрабатывать, какие проблемы пользователей решать в первую очередь.
          </p>
          <div className="bg-slate-800 p-3 rounded mt-3">
            <p className="font-medium text-indigo-400 mb-2">Примеры:</p>
            <ul className={styles.list}>
              <li>Какие функции включить в следующий релиз</li>
              <li>Какие проблемы пользователей решать в приоритете</li>
              <li>Какие метрики улучшать в первую очередь</li>
              <li>Как распределить ресурсы между проектами</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.decisionCard}>
          <h3 className={styles.decisionTitle}>Операционные решения</h3>
          <p className={styles.text}>
            Касаются ежедневных действий команды, деталей реализации функций, дизайна интерфейса 
            и взаимодействия с пользователями.
          </p>
          <div className="bg-slate-800 p-3 rounded mt-3">
            <p className="font-medium text-indigo-400 mb-2">Примеры:</p>
            <ul className={styles.list}>
              <li>Какой дизайн выбрать для конкретного элемента интерфейса</li>
              <li>Как реагировать на отзывы пользователей</li>
              <li>Как оптимизировать конкретный процесс в продукте</li>
              <li>Какую технологию использовать для решения конкретной задачи</li>
            </ul>
          </div>
        </div>
      </div>
      
      <MentorTip
        tip="Разные типы решений требуют разного подхода. Для стратегических решений важно глубокое исследование и вовлечение ключевых стейкхолдеров, в то время как для операционных решений часто достаточно быстрого анализа и обсуждения с командой."
        position="bottom-left"
      />
    </div>,
    
    // Шаг 3: Процесс принятия решений
    <div key="decision-process" className={styles.section}>
      <h2 className={styles.subheader}>Процесс принятия решений</h2>
      
      <div className="space-y-6 mb-8">
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-semibold mb-2">1</div>
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Определение проблемы</h3>
          <p className={styles.text}>
            Четко сформулируйте проблему, которую нужно решить, и убедитесь, что она действительно
            важна для пользователей и бизнеса. Определите критерии успешного решения.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-semibold mb-2">2</div>
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Сбор данных и анализ</h3>
          <p className={styles.text}>
            Соберите все доступные данные, которые могут помочь в принятии решения: метрики,
            отзывы пользователей, экспертные мнения, результаты исследований и тестирований.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-semibold mb-2">3</div>
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Генерация альтернатив</h3>
          <p className={styles.text}>
            Разработайте несколько альтернативных решений проблемы. Стремитесь к разнообразию
            подходов, чтобы охватить различные аспекты проблемы.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-semibold mb-2">4</div>
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Оценка альтернатив</h3>
          <p className={styles.text}>
            Оцените каждую альтернативу по заранее определенным критериям, учитывая потенциальное
            влияние на пользователей, бизнес, технические аспекты и ресурсы.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-semibold mb-2">5</div>
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Выбор решения</h3>
          <p className={styles.text}>
            Выберите оптимальное решение на основе анализа и оценки. Учитывайте не только
            краткосрочные выгоды, но и долгосрочные последствия решения.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-semibold mb-2">6</div>
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Реализация и мониторинг</h3>
          <p className={styles.text}>
            Реализуйте выбранное решение и внимательно отслеживайте его эффективность. Будьте
            готовы корректировать курс, если результаты не соответствуют ожиданиям.
          </p>
        </div>
      </div>
      
      <MentorTip
        tip="Успешное принятие решений — это не только выбор правильного решения, но и эффективная реализация. Даже лучшее решение может провалиться из-за плохой реализации, недостаточного мониторинга или нежелания корректировать курс."
        position="top-right"
      />
    </div>,
    
    // Шаг 4: Ключевые принципы принятия решений
    <div key="decision-principles" className={styles.section}>
      <h2 className={styles.subheader}>Ключевые принципы принятия решений</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Принцип 1: Опирайтесь на данные</h3>
          <p className={styles.text}>
            Используйте количественные и качественные данные для обоснования решений. Данные
            помогают сделать решения объективными и снижают риск ошибок, основанных на интуиции.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Принцип 2: Учитывайте долгосрочную перспективу</h3>
          <p className={styles.text}>
            Оценивайте не только краткосрочные результаты, но и долгосрочные последствия решений.
            Избегайте решений, которые дают быстрый результат, но создают проблемы в будущем.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Принцип 3: Привлекайте различные точки зрения</h3>
          <p className={styles.text}>
            Консультируйтесь с различными стейкхолдерами и экспертами перед принятием решений.
            Многообразие точек зрения помогает выявить потенциальные проблемы и найти лучшие решения.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Принцип 4: Балансируйте потребности пользователей и бизнеса</h3>
          <p className={styles.text}>
            Стремитесь найти решения, которые удовлетворяют потребности пользователей и одновременно
            способствуют достижению бизнес-целей. Избегайте решений, которые жертвуют одним ради другого.
          </p>
        </div>
      </div>
      
      <MentorTip
        tip="Хорошие решения обычно учитывают как данные, так и контекст. Научитесь балансировать между аналитическим подходом и пониманием конкретной ситуации, в которой принимается решение."
        position="bottom-right"
      />
    </div>,
    
    // Шаг 5: Инструменты для принятия решений
    <div key="decision-tools" className={styles.section}>
      <h2 className={styles.subheader}>Инструменты для принятия решений</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Матрица принятия решений</h3>
          <p className={styles.text}>
            Инструмент для сравнения нескольких альтернатив по различным критериям с использованием
            весовых коэффициентов для определения важности каждого критерия.
          </p>
          <p className={styles.text}>
            <strong>Когда использовать:</strong> При наличии нескольких альтернатив и многих критериев
            оценки, особенно если некоторые критерии важнее других.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">ICE Scoring (Impact, Confidence, Ease)</h3>
          <p className={styles.text}>
            Метод оценки идей по трем параметрам: воздействие (Impact), уверенность (Confidence)
            и простота реализации (Ease). Каждый параметр оценивается от 1 до 10.
          </p>
          <p className={styles.text}>
            <strong>Когда использовать:</strong> Для быстрой приоритизации идей или задач, особенно
            когда нужно выбрать из большого числа альтернатив.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">RICE Framework (Reach, Impact, Confidence, Effort)</h3>
          <p className={styles.text}>
            Расширенная версия ICE с добавлением параметра охвата (Reach). Позволяет учесть, сколько
            пользователей затронет потенциальное решение.
          </p>
          <p className={styles.text}>
            <strong>Когда использовать:</strong> Для приоритизации функций и улучшений продукта,
            особенно когда важно учитывать масштаб воздействия на пользователей.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Cost-Benefit Analysis (Анализ затрат и выгод)</h3>
          <p className={styles.text}>
            Метод оценки альтернатив путем сравнения ожидаемых затрат (ресурсов, времени, денег)
            и потенциальных выгод (финансовых и нефинансовых).
          </p>
          <p className={styles.text}>
            <strong>Когда использовать:</strong> Для оценки крупных инвестиций или стратегических
            решений, особенно когда важно понимать ROI (возврат на инвестиции).
          </p>
        </div>
      </div>
      
      <MentorTip
        tip="Инструменты принятия решений — это не волшебные формулы, а помощники для структурирования мышления. Выбирайте инструмент в зависимости от типа решения и доступных данных."
        position="bottom-right"
      />
    </div>,
  ];

  return (
    <div className={styles.container}>
      <StepNavigation 
        steps={steps} 
        onComplete={onComplete}
        completeButtonText="Перейти к практике"
        showBackButton={true}
        continueButtonText="Далее"
        showProgress={true}
        showStepNumbers={true}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        persistStepKey="decision_making_theory_step"
      />
    </div>
  );
};

export default DecisionMakingTheory;