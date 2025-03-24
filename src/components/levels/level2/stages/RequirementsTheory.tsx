import React from 'react';
import MentorTip from '../../../levels/MentorTip';
import styles from '../common/styles';
import StageNavigation from '../common/StageNavigation';
import LevelStage from '../common/LevelStages';

interface RequirementsTheoryProps {
  goToPreviousStage: () => void;
  goToNextStage: () => void;
  isLoading: boolean;
}

const RequirementsTheory: React.FC<RequirementsTheoryProps> = ({
  goToPreviousStage,
  goToNextStage,
  isLoading
}) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.levelTitle}>Сбор и анализ требований</h2>
      <p className={styles.levelSubtitle}>Теоретический блок</p>
      
      <div className="mb-6 text-slate-300">
        <h3 className={styles.h3}>Что такое требования?</h3>
        <p className={styles.paragraph}>
          <strong>Требования</strong> — это описание того, что система должна делать, какими свойствами она должна обладать, и каким ограничениям должна соответствовать. Хорошо определенные требования критически важны для успеха продукта.
        </p>
        
        <h3 className={styles.h3}>Типы требований</h3>
        <div className={styles.grid2Cols}>
          <div className={styles.innerContentBlock}>
            <h4 className={styles.h4}>Функциональные требования</h4>
            <p className="mb-2">Описывают, что система должна делать:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Конкретные функции и возможности</li>
              <li>Бизнес-правила</li>
              <li>Взаимодействие с пользователями</li>
              <li>Взаимодействие с другими системами</li>
            </ul>
          </div>
          <div className={styles.innerContentBlock}>
            <h4 className={styles.h4}>Нефункциональные требования</h4>
            <p className="mb-2">Описывают, какими характеристиками должна обладать система:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Производительность</li>
              <li>Безопасность</li>
              <li>Удобство использования</li>
              <li>Масштабируемость</li>
              <li>Надежность</li>
            </ul>
          </div>
        </div>
        
        <h3 className={styles.h3}>Методы сбора требований</h3>
        <ul className={styles.list}>
          <li><strong>Интервью со стейкхолдерами</strong>: прямой диалог для выявления потребностей</li>
          <li><strong>Фокус-группы</strong>: групповые обсуждения с представителями целевой аудитории</li>
          <li><strong>Наблюдение за пользователями</strong>: анализ того, как пользователи взаимодействуют с продуктом</li>
          <li><strong>Анализ конкурентов</strong>: изучение аналогичных решений на рынке</li>
          <li><strong>Анкетирование</strong>: сбор информации от большого числа пользователей</li>
          <li><strong>Анализ документации</strong>: изучение существующих материалов о продукте или процессах</li>
        </ul>
        
        <h3 className={styles.h3}>Документирование требований</h3>
        <div className={styles.innerContentBlock + " mb-6"}>
          <h4 className={styles.h4}>User Stories</h4>
          <p className="mb-3">Формат: <span className="bg-slate-700 px-2 py-1 rounded">Как [роль], я хочу [действие], чтобы [польза]</span></p>
          <p className="mb-2">Примеры:</p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Как пользователь, я хочу создать команду, чтобы совместно работать над задачами</li>
            <li>Как менеджер, я хочу видеть прогресс по всем задачам команды, чтобы контролировать выполнение проекта</li>
          </ul>
          
          <h4 className={styles.h4}>Пользовательские сценарии (User Flow)</h4>
          <p className="mb-2">Описывают последовательность действий пользователя для выполнения задачи:</p>
          <ol className="list-decimal pl-5 space-y-1 mb-4">
            <li>Пользователь входит в систему</li>
            <li>Пользователь нажимает кнопку "Создать команду"</li>
            <li>Пользователь вводит название команды и описание</li>
            <li>Пользователь добавляет участников в команду</li>
            <li>Пользователь нажимает кнопку "Сохранить"</li>
          </ol>
          
          <h4 className={styles.h4}>Спецификации</h4>
          <p className="mb-2">Детальное описание каждого требования:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Описание функциональности</li>
            <li>Входные и выходные данные</li>
            <li>Ограничения и условия</li>
            <li>Критерии приемки</li>
          </ul>
        </div>
        
        <h3 className={styles.h3}>Приоритизация требований</h3>
        <div className={styles.grid2Cols}>
          <div className={styles.innerContentBlock}>
            <h4 className={styles.h4}>MoSCoW</h4>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>M</strong> - Must Have (необходимо)</li>
              <li><strong>S</strong> - Should Have (следует иметь)</li>
              <li><strong>C</strong> - Could Have (можно иметь)</li>
              <li><strong>W</strong> - Won't Have (не будет)</li>
            </ul>
          </div>
          <div className={styles.innerContentBlock}>
            <h4 className={styles.h4}>RICE</h4>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>R</strong> - Reach (охват)</li>
              <li><strong>I</strong> - Impact (влияние)</li>
              <li><strong>C</strong> - Confidence (уверенность)</li>
              <li><strong>E</strong> - Effort (усилия)</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.innerContentBlock + " mb-6 mt-6"}>
          <h4 className={styles.h4}>Матрица "Ценность-Усилия"</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-800 p-3 rounded-lg text-center">
              <h5 className="font-medium mb-2">Высокая ценность<br/>Низкие усилия</h5>
              <p className="text-sm">Быстрые победы</p>
              <p className="text-xs mt-2">Реализовать в первую очередь</p>
            </div>
            <div className="bg-yellow-700 p-3 rounded-lg text-center">
              <h5 className="font-medium mb-2">Высокая ценность<br/>Высокие усилия</h5>
              <p className="text-sm">Большие проекты</p>
              <p className="text-xs mt-2">Разбить на этапы</p>
            </div>
            <div className="bg-blue-700 p-3 rounded-lg text-center">
              <h5 className="font-medium mb-2">Низкая ценность<br/>Низкие усилия</h5>
              <p className="text-sm">Приятные мелочи</p>
              <p className="text-xs mt-2">Реализовать при наличии времени</p>
            </div>
            <div className="bg-red-800 p-3 rounded-lg text-center">
              <h5 className="font-medium mb-2">Низкая ценность<br/>Высокие усилия</h5>
              <p className="text-sm">Неэффективные задачи</p>
              <p className="text-xs mt-2">Отложить или отказаться</p>
            </div>
          </div>
        </div>
        
        <h3 className={styles.h3}>Валидация требований</h3>
        <p className="mb-3">
          После сбора требований необходимо проверить их на корректность, полноту и реализуемость:
        </p>
        <ul className={styles.list}>
          <li>Обсуждение требований со стейкхолдерами</li>
          <li>Проверка на соответствие бизнес-целям</li>
          <li>Оценка технической реализуемости</li>
          <li>Тестирование требований на прототипах</li>
          <li>Выявление противоречий и конфликтов</li>
        </ul>
        
        <h3 className={styles.h3}>Управление изменениями требований</h3>
        <p className="mb-3">
          Требования могут меняться в процессе работы над продуктом. Важно управлять этими изменениями:
        </p>
        <ul className={styles.list}>
          <li>Документирование всех изменений</li>
          <li>Оценка влияния изменений на сроки и ресурсы</li>
          <li>Согласование изменений со всеми стейкхолдерами</li>
          <li>Приоритизация новых требований</li>
          <li>Корректировка плана проекта</li>
        </ul>
      </div>
      
      <MentorTip tip="Помните, что сбор требований — это не одноразовое мероприятие, а непрерывный процесс. В ходе работы над продуктом требования будут уточняться и дополняться. Ключевая задача — создать систему, которая позволит эффективно управлять этими изменениями." />
      
      <StageNavigation
        currentStage={LevelStage.REQUIREMENTS_THEORY}
        goToPreviousStage={goToPreviousStage}
        goToNextStage={goToNextStage}
        isLoading={isLoading}
        nextButtonLabel="К практике сбора требований"
      />
    </div>
  );
};

export default RequirementsTheory; 