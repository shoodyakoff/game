import React, { useState } from 'react';
import { styles } from '../common/styles';
import StepNavigation from '../../shared/navigation/StepNavigation';
import MentorTip from '../../shared/feedback/MentorTip';

interface ProductThinkingPracticeProps {
  onComplete: () => void;
}

const ProductThinkingPractice: React.FC<ProductThinkingPracticeProps> = ({ onComplete }) => {
  // Используем отдельное состояние для каждого вопроса
  const [answers, setAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: ''
  });
  
  const handleAnswerChange = (question: keyof typeof answers, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };
  
  // Шаги практического задания
  const practiceSteps = [
    // Шаг 1: Введение в практическое задание
    <div key="practice-step-1">
      <h2 className={styles.header}>Практическое задание: Продуктовое мышление</h2>
      
      <p className={styles.text}>
        В этом практическом задании вы будете применять принципы продуктового мышления к реальному кейсу.
        Представьте, что вы работаете над улучшением мобильного приложения TaskMaster для управления задачами.
      </p>
      
      <p className={styles.text}>
        Ваша задача - проанализировать продукт с точки зрения добавочной ценности и ответить на ключевые вопросы, которые помогут вам лучше понять, как улучшить продукт.
      </p>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mt-6 mb-6">
        <h3 className="text-xl font-semibold text-indigo-400 mb-4">О продукте TaskMaster</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Описание продукта:</h4>
            <p className="text-slate-300">
              TaskMaster - мобильное приложение для управления задачами, помогающее пользователям организовывать и отслеживать свои ежедневные дела, проекты и обязанности.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-2">Целевая аудитория:</h4>
            <ul className="list-disc list-inside text-slate-300">
              <li>Менеджеры проектов</li>
              <li>Предприниматели</li>
              <li>HR-специалисты</li>
              <li>Студенты</li>
              <li>Активные пользователи: 25-45 лет</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-2">Ключевые метрики:</h4>
            <ul className="list-disc list-inside text-slate-300">
              <li>Время создания задачи: 3 мин 24 сек</li>
              <li>Отказы при создании: 55%</li>
              <li>Конверсия на Desktop: 58%</li>
              <li>Конверсия на мобильных: 32%</li>
              <li>Конверсия на планшетах: 45%</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-2">Основные проблемы пользователей:</h4>
            <ul className="list-disc list-inside text-slate-300">
              <li>Много обязательных полей при создании задачи</li>
              <li>Неудобно использовать на мобильных устройствах</li>
              <li>Сложный и неинтуитивный интерфейс</li>
              <li>Высокие временные затраты на создание простых задач</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-2">Текущий процесс создания задачи:</h4>
            <ol className="list-decimal list-inside text-slate-300">
              <li>Главный экран → кнопка "Новая задача"</li>
              <li>Обязательные поля: название, дата, проект, приоритет, исполнитель</li>
              <li>Дополнительные поля: описание, вложения, теги, связанные задачи</li>
              <li>Настройки: уведомления, повторение, видимость, доступ</li>
              <li>Предпросмотр и подтверждение</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <MentorTip
          tip="В практических заданиях вы будете применять полученные знания к реальным ситуациям. Это поможет закрепить теоретический материал и развить навыки продуктового мышления."
          position="bottom-right"
          avatar="/characters/avatar_mentor.png"
          name="Ментор"
          defaultOpen={false}
        />
      </div>
    </div>,
    
    // Шаг 2: Первый вопрос
    <div key="practice-step-2">
      <h2 className={styles.subheader}>Добавочная ценность — насколько один продукт эффективнее другого решает задачу</h2>
      
      <p className={styles.text}>
        Ответьте на следующий вопрос:
      </p>
      
      <div className="bg-indigo-950/30 p-4 rounded-md border-l-4 border-indigo-500 my-4">
        <h3 className="font-semibold text-lg text-white mb-2">Вопрос 1:</h3>
        <p className="text-slate-200">
          Как именно ваш продукт повышает эффективность решения задачи людей?
        </p>
      </div>
      
      <textarea
        className="w-full bg-slate-800 text-white p-4 rounded border border-slate-600 min-h-32 mt-4"
        placeholder="Введите ваш ответ здесь..."
        value={answers.question1}
        onChange={(e) => handleAnswerChange('question1', e.target.value)}
      />
      
      <p className="text-sm text-slate-400 mt-2">
        Ответ на этот вопрос не будет проверяться. Он необходим для рефлексии по обсуждаемой теме.
      </p>
    </div>,
    
    // Шаг 3: Второй вопрос
    <div key="practice-step-3">
      <h2 className={styles.subheader}>Анализ альтернативных решений</h2>
      
      <p className={styles.text}>
        Ответьте на следующий вопрос:
      </p>
      
      <div className="bg-indigo-950/30 p-4 rounded-md border-l-4 border-indigo-500 my-4">
        <h3 className="font-semibold text-lg text-white mb-2">Вопрос 2:</h3>
        <p className="text-slate-200">
          Относительно каких альтернативных способов и в каких обстоятельствах продукт создает максимальную добавочную ценность?
        </p>
      </div>
      
      <textarea
        className="w-full bg-slate-800 text-white p-4 rounded border border-slate-600 min-h-32 mt-4"
        placeholder="Введите ваш ответ здесь..."
        value={answers.question2}
        onChange={(e) => handleAnswerChange('question2', e.target.value)}
      />
      
      <p className="text-sm text-slate-400 mt-2">
        Ответ на этот вопрос не будет проверяться. Он необходим для рефлексии по обсуждаемой теме.
      </p>
    </div>,
    
    // Шаг 4: Третий вопрос
    <div key="practice-step-4">
      <h2 className={styles.subheader}>Измерение добавочной ценности</h2>
      
      <p className={styles.text}>
        Ответьте на следующий вопрос:
      </p>
      
      <div className="bg-indigo-950/30 p-4 rounded-md border-l-4 border-indigo-500 my-4">
        <h3 className="font-semibold text-lg text-white mb-2">Вопрос 3:</h3>
        <p className="text-slate-200">
          Как вы измеряете эту добавочную ценность? Измеряете ли?
        </p>
      </div>
      
      <textarea
        className="w-full bg-slate-800 text-white p-4 rounded border border-slate-600 min-h-32 mt-4"
        placeholder="Введите ваш ответ здесь..."
        value={answers.question3}
        onChange={(e) => handleAnswerChange('question3', e.target.value)}
      />
      
      <p className="text-sm text-slate-400 mt-2">
        Ответ на этот вопрос не будет проверяться. Он необходим для рефлексии по обсуждаемой теме.
      </p>
    </div>,
    
    // Шаг 5: Четвертый вопрос
    <div key="practice-step-5">
      <h2 className={styles.subheader}>Оценка эффективности</h2>
      
      <p className={styles.text}>
        Ответьте на следующий вопрос:
      </p>
      
      <div className="bg-indigo-950/30 p-4 rounded-md border-l-4 border-indigo-500 my-4">
        <h3 className="font-semibold text-lg text-white mb-2">Вопрос 4:</h3>
        <p className="text-slate-200">
          Насколько вы повысили эффективность решения задачи пользователей за прошлый год? Насколько вы увеличили отрыв от конкурентов в эффективности решения задачи за последнее время?
        </p>
      </div>
      
      <textarea
        className="w-full bg-slate-800 text-white p-4 rounded border border-slate-600 min-h-32 mt-4"
        placeholder="Введите ваш ответ здесь..."
        value={answers.question4}
        onChange={(e) => handleAnswerChange('question4', e.target.value)}
      />
      
      <p className="text-sm text-slate-400 mt-2">
        Ответ на этот вопрос не будет проверяться. Он необходим для рефлексии по обсуждаемой теме.
      </p>
      
      <div className="mt-6">
        <MentorTip
          tip="Ответы на эти вопросы помогут вам лучше понять, как ваш продукт создает ценность для пользователей и как эту ценность можно измерить и увеличить."
          position="right-bottom"
          avatar="/characters/avatar_mentor.png"
          name="Ментор"
          defaultOpen={false}
        />
      </div>
      
      <div className="bg-indigo-900/30 p-5 rounded-lg border border-indigo-700 mt-10">
        <h3 className="font-semibold text-lg text-white mb-3">Ваши ответы:</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-indigo-300">Вопрос 1:</h4>
            <p className="text-slate-200 bg-indigo-950/50 p-3 rounded border border-indigo-800/50 min-h-12">
              {answers.question1 || "Вы пока не ответили на этот вопрос"}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-300">Вопрос 2:</h4>
            <p className="text-slate-200 bg-indigo-950/50 p-3 rounded border border-indigo-800/50 min-h-12">
              {answers.question2 || "Вы пока не ответили на этот вопрос"}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-300">Вопрос 3:</h4>
            <p className="text-slate-200 bg-indigo-950/50 p-3 rounded border border-indigo-800/50 min-h-12">
              {answers.question3 || "Вы пока не ответили на этот вопрос"}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-300">Вопрос 4:</h4>
            <p className="text-slate-200 bg-indigo-950/50 p-3 rounded border border-indigo-800/50 min-h-12">
              {answers.question4 || "Вы пока не ответили на этот вопрос"}
            </p>
          </div>
        </div>
      </div>
    </div>
  ];
  
  return (
    <div className={styles.container}>
      <StepNavigation 
        steps={practiceSteps} 
        onComplete={onComplete}
        completeButtonText="Далее"
      />
    </div>
  );
};

export default ProductThinkingPractice; 