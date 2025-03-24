import React from 'react';
import MentorTip from '../../../levels/MentorTip';
import NotesSystem from '../../../levels/NotesSystem';
import styles from '../common/styles';
import StageNavigation from '../common/StageNavigation';
import LevelStage from '../common/LevelStages';

interface RequirementsPracticeProps {
  goToPreviousStage: () => void;
  goToNextStage: () => void;
  isLoading: boolean;
  notes: string[];
  setNotes: React.Dispatch<React.SetStateAction<string[]>>;
}

const RequirementsPractice: React.FC<RequirementsPracticeProps> = ({
  goToPreviousStage,
  goToNextStage,
  isLoading,
  notes,
  setNotes
}) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.levelTitle}>Сбор и анализ требований</h2>
      <p className={styles.levelSubtitle}>Практическое задание</p>
      
      <div className="mb-6">
        <div className={styles.contentBlock}>
          <h3 className={styles.h3}>Задание</h3>
          <p className={styles.paragraph}>
            Ваша задача — выявить требования к новому мобильному приложению для ведения задач 
            на основе интервью с ключевыми стейкхолдерами. Затем вам нужно провести их 
            приоритизацию и предложить минимальный жизнеспособный продукт (MVP).
          </p>
          
          <h4 className={styles.h4}>Цитаты из интервью:</h4>
          <div className={styles.grid2Cols}>
            <div className={styles.innerContentBlock}>
              <p className="text-sm text-slate-400 mb-1">CEO:</p>
              <p className="italic text-slate-300">"Нам нужно приложение, которое поможет пользователям организовать свои задачи. Оно должно быть простым, но функциональным, чтобы мы могли быстро выйти на рынок. Самое важное — быстро запуститься и получить первую обратную связь."</p>
            </div>
            <div className={styles.innerContentBlock}>
              <p className="text-sm text-slate-400 mb-1">Маркетинг-директор:</p>
              <p className="italic text-slate-300">"Приложение должно выделяться среди конкурентов. Было бы здорово добавить элементы геймификации — баллы, достижения, уровни — чтобы удержать пользователей. Также нужна возможность делиться прогрессом в соцсетях."</p>
            </div>
            <div className={styles.innerContentBlock}>
              <p className="text-sm text-slate-400 mb-1">Технический директор:</p>
              <p className="italic text-slate-300">"Приложение должно работать как онлайн, так и офлайн. Синхронизация с облаком — обязательна. Кроме того, нужно обеспечить высокую производительность и защиту данных пользователей."</p>
            </div>
            <div className={styles.innerContentBlock}>
              <p className="text-sm text-slate-400 mb-1">Дизайн-директор:</p>
              <p className="italic text-slate-300">"Интерфейс должен быть интуитивно понятным и минималистичным. Мы должны сделать акцент на удобство использования. Темная тема необходима. Я бы также добавила возможность персонализации интерфейса."</p>
            </div>
            <div className={styles.innerContentBlock}>
              <p className="text-sm text-slate-400 mb-1">Пользовательские интервью:</p>
              <p className="italic text-slate-300">"Для меня важно иметь возможность организовать задачи по проектам и категориям. Я также хочу видеть прогресс выполнения задач и иметь уведомления о сроках."</p>
            </div>
            <div className={styles.innerContentBlock}>
              <p className="text-sm text-slate-400 mb-1">Аналитика:</p>
              <p className="italic text-slate-300">"Согласно данным, многие пользователи испытывают трудности с завершением задач. 60% пользователей конкурентных приложений не возвращаются после первого использования."</p>
            </div>
          </div>
        </div>
        
        <div className={styles.contentBlock}>
          <h3 className={styles.h3}>Составьте список требований</h3>
          <p className={styles.paragraph}>
            На основе информации выше, составьте список функциональных и нефункциональных требований:
          </p>
          
          <h4 className={styles.h4}>Функциональные требования:</h4>
          <div className={styles.innerContentBlock + " mb-4"}>
            <ol className={styles.orderedList}>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Создание и редактирование задач..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Организация задач по категориям..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Напоминания о сроках..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Отслеживание прогресса..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Синхронизация с облаком..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Работа в офлайн-режиме..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Элементы геймификации..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Интеграция с соцсетями..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Персонализация интерфейса..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Добавьте свой вариант..." />
              </li>
            </ol>
          </div>
          
          <h4 className={styles.h4}>Нефункциональные требования:</h4>
          <div className={styles.innerContentBlock + " mb-4"}>
            <ol className={styles.orderedList}>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Интуитивно понятный интерфейс..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Высокая производительность..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Безопасность данных..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Поддержка темной темы..." />
              </li>
              <li className="mb-2">
                <input type="text" className={styles.input} placeholder="Добавьте свой вариант..." />
              </li>
            </ol>
          </div>
        </div>
        
        <div className={styles.contentBlock}>
          <h3 className={styles.h3}>Приоритизация требований и MVP</h3>
          <p className={styles.paragraph}>
            Используя метод MoSCoW, распределите требования по приоритетам.
            Обоснуйте выбор 5 наиболее приоритетных функций для MVP:
          </p>
          
          <div className={styles.grid2Cols}>
            <div className={styles.innerContentBlock}>
              <h4 className="font-semibold text-white mb-2">Must Have (необходимо)</h4>
              <textarea 
                className={styles.textarea + " h-32 mb-2"} 
                placeholder="Перечислите требования этой категории..."
              ></textarea>
            </div>
            <div className={styles.innerContentBlock}>
              <h4 className="font-semibold text-white mb-2">Should Have (следует иметь)</h4>
              <textarea 
                className={styles.textarea + " h-32 mb-2"} 
                placeholder="Перечислите требования этой категории..."
              ></textarea>
            </div>
            <div className={styles.innerContentBlock}>
              <h4 className="font-semibold text-white mb-2">Could Have (можно иметь)</h4>
              <textarea 
                className={styles.textarea + " h-32 mb-2"} 
                placeholder="Перечислите требования этой категории..."
              ></textarea>
            </div>
            <div className={styles.innerContentBlock}>
              <h4 className="font-semibold text-white mb-2">Won't Have (не будет)</h4>
              <textarea 
                className={styles.textarea + " h-32 mb-2"} 
                placeholder="Перечислите требования этой категории..."
              ></textarea>
            </div>
          </div>
          
          <h4 className={styles.h4 + " mt-6"}>Минимальный жизнеспособный продукт (MVP):</h4>
          <div className={styles.innerContentBlock}>
            <p className="text-slate-300 mb-2">
              Опишите, какие функции вы включите в MVP и почему:
            </p>
            <textarea 
              className={styles.textarea + " h-48"} 
              placeholder="Для MVP нашего приложения для управления задачами я предлагаю включить следующие 5 функций..."
            ></textarea>
          </div>
        </div>
        
        <div className={styles.contentBlock}>
          <h3 className={styles.h3}>Валидация требований</h3>
          <p className={styles.paragraph}>
            Как вы будете проверять, что выявленные требования соответствуют реальным потребностям пользователей?
          </p>
          <textarea 
            className={styles.textarea + " h-32"} 
            placeholder="Для валидации требований я предлагаю использовать следующие методы..."
          ></textarea>
        </div>
      </div>
      
      <MentorTip tip="Помните о важности баланса между желаниями стейкхолдеров и реальными возможностями проекта. MVP должен решать ключевую проблему пользователей, быть реализуемым в короткие сроки и при этом предоставлять достаточную ценность для получения обратной связи." />
      
      <NotesSystem
        notes={notes}
        setNotes={setNotes}
        placeholder="Запишите ключевые выводы из анализа требований..."
      />
      
      <StageNavigation
        currentStage={LevelStage.REQUIREMENTS_PRACTICE}
        goToPreviousStage={goToPreviousStage}
        goToNextStage={goToNextStage}
        isLoading={isLoading}
        nextButtonLabel="К исследованию пользователей"
      />
    </div>
  );
};

export default RequirementsPractice; 