import React from 'react';
import MentorTip from '../../../levels/MentorTip';
import styles from '../common/styles';
import StageNavigation from '../common/StageNavigation';
import LevelStage from '../common/LevelStages';

interface StakeholdersTheoryProps {
  goToPreviousStage: () => void;
  goToNextStage: () => void;
  isLoading: boolean;
}

const StakeholdersTheory: React.FC<StakeholdersTheoryProps> = ({
  goToPreviousStage,
  goToNextStage,
  isLoading
}) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.levelTitle}>Заинтересованные стороны (стейкхолдеры)</h2>
      <p className={styles.levelSubtitle}>Теоретический блок</p>
      
      <div className="mb-6 text-slate-300">
        <h3 className={styles.h3}>Кто такие стейкхолдеры?</h3>
        <p className={styles.paragraph}>
          <strong>Стейкхолдеры</strong> — это заинтересованные стороны проекта, которые могут влиять на проект или на которых проект может оказывать влияние.
          Понимание стейкхолдеров и их потребностей критически важно для успеха любого продукта.
        </p>
        
        <h3 className={styles.h3}>Основные типы стейкхолдеров</h3>
        <div className={styles.grid2Cols}>
          <div className={styles.innerContentBlock}>
            <h4 className={styles.h4}>Внутренние стейкхолдеры</h4>
            <ul className={styles.list}>
              <li><strong>Команда разработки</strong>: разработчики, дизайнеры, тестировщики</li>
              <li><strong>Менеджмент</strong>: продактовые менеджеры, скрам-мастера, руководство</li>
              <li><strong>Отдел маркетинга</strong>: маркетологи, SMM-специалисты</li>
              <li><strong>Отдел продаж</strong>: менеджеры по продажам, аккаунт-менеджеры</li>
              <li><strong>Служба поддержки</strong>: специалисты по работе с клиентами</li>
            </ul>
          </div>
          <div className={styles.innerContentBlock}>
            <h4 className={styles.h4}>Внешние стейкхолдеры</h4>
            <ul className={styles.list}>
              <li><strong>Пользователи</strong>: конечные потребители продукта</li>
              <li><strong>Клиенты</strong>: те, кто платит за продукт</li>
              <li><strong>Инвесторы</strong>: вкладывают средства в продукт</li>
              <li><strong>Партнеры</strong>: сотрудничают для создания ценности</li>
              <li><strong>Регуляторы</strong>: устанавливают правила и требования</li>
              <li><strong>Конкуренты</strong>: предлагают альтернативные решения</li>
            </ul>
          </div>
        </div>
        
        <h3 className={styles.h3}>Анализ стейкхолдеров</h3>
        <p className={styles.paragraph}>
          Для эффективной работы со стейкхолдерами необходимо провести их анализ, который включает:
        </p>
        <ul className={styles.list}>
          <li><strong>Идентификация</strong>: выявление всех потенциальных стейкхолдеров</li>
          <li><strong>Приоритизация</strong>: определение их важности и влияния</li>
          <li><strong>Анализ потребностей</strong>: понимание их ожиданий и требований</li>
          <li><strong>Разработка стратегии</strong>: планирование коммуникаций и управление отношениями</li>
        </ul>
        
        <h3 className={styles.h3}>Матрица власть/интерес</h3>
        <p className={styles.paragraph}>
          Инструмент для классификации стейкхолдеров по двум параметрам: их уровень власти (влияния) и уровень интереса к проекту.
        </p>
        <div className={styles.grid2Cols}>
          <div className="bg-yellow-700 p-3 rounded-lg text-center">
            <h5 className="font-medium mb-2">Высокое влияние<br/>Высокий интерес</h5>
            <p className="text-sm">Ключевые игроки</p>
            <p className="text-xs mt-2">Тесное сотрудничество</p>
          </div>
          <div className="bg-red-700 p-3 rounded-lg text-center">
            <h5 className="font-medium mb-2">Высокое влияние<br/>Низкий интерес</h5>
            <p className="text-sm">Удовлетворять потребности</p>
            <p className="text-xs mt-2">Держать удовлетворенными</p>
          </div>
          <div className="bg-green-700 p-3 rounded-lg text-center">
            <h5 className="font-medium mb-2">Низкое влияние<br/>Высокий интерес</h5>
            <p className="text-sm">Информировать</p>
            <p className="text-xs mt-2">Держать в курсе</p>
          </div>
          <div className="bg-blue-700 p-3 rounded-lg text-center">
            <h5 className="font-medium mb-2">Низкое влияние<br/>Низкий интерес</h5>
            <p className="text-sm">Наблюдать</p>
            <p className="text-xs mt-2">Минимальные усилия</p>
          </div>
        </div>
        
        <h3 className={styles.h3}>Методы работы со стейкхолдерами</h3>
        <ul className={styles.list}>
          <li><strong>Интервью:</strong> прямое общение для выявления требований, ожиданий и ограничений</li>
          <li><strong>Опросы:</strong> сбор информации от большого количества стейкхолдеров</li>
          <li><strong>Наблюдения:</strong> анализ реального использования продукта</li>
          <li><strong>Воркшопы:</strong> совместная работа над продуктом с разными стейкхолдерами</li>
          <li><strong>Презентации:</strong> демонстрация результатов и получение обратной связи</li>
        </ul>
        
        <h3 className={styles.h3}>Работа с конфликтами между стейкхолдерами</h3>
        <p className={styles.paragraph}>
          Различные стейкхолдеры могут иметь противоречивые требования. Продуктовый менеджер должен уметь выявлять, анализировать и разрешать такие конфликты:
        </p>
        <ul className={styles.list}>
          <li>Выявление скрытых интересов каждой стороны</li>
          <li>Поиск компромиссных решений</li>
          <li>Приоритизация требований на основе бизнес-ценности и технической сложности</li>
          <li>Выстраивание этапности реализации для удовлетворения различных потребностей</li>
        </ul>
        
        <h3 className={styles.h3}>Примеры вопросов для интервью со стейкхолдерами</h3>
        <div className={styles.innerContentBlock + " mb-6"}>
          <h4 className={styles.h4}>Общие вопросы:</h4>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Какие цели вы хотите достичь с помощью этого продукта/функционала?</li>
            <li>Какие метрики успеха вы считаете ключевыми?</li>
            <li>Какие проблемы должно решить данное решение?</li>
          </ul>
          
          <h4 className={styles.h4}>Специфические вопросы:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Какие ограничения (бюджет, время, ресурсы) существуют для проекта?</li>
            <li>Какие технические/дизайн/бизнес требования необходимо учесть?</li>
            <li>Какие риски вы видите в проекте?</li>
            <li>Какие компромиссы вы готовы принять?</li>
          </ul>
        </div>
      </div>
      
      <MentorTip tip="Помните, что стейкхолдеры могут говорить не только о своих явных потребностях, но и иметь скрытые мотивы. Задавайте уточняющие вопросы и обращайте внимание на противоречия в требованиях разных заинтересованных сторон." />
      
      <StageNavigation
        currentStage={LevelStage.STAKEHOLDERS_THEORY}
        goToPreviousStage={goToPreviousStage}
        goToNextStage={goToNextStage}
        isLoading={isLoading}
        nextButtonLabel="К брифингу стейкхолдеров"
      />
    </div>
  );
};

export default StakeholdersTheory; 