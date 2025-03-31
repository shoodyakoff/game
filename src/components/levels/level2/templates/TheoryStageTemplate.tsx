import React, { useState } from 'react';
import MentorTip from '../../shared/feedback/MentorTip';
import StepNavigation from '../../shared/navigation/StepNavigation';
import { styles } from '../common/styles';

interface TheoryStageProps {
  goToNextStage: () => void;
  goToPreviousStage: () => void;
  isLoading: boolean;
}

const TheoryStageTemplate: React.FC<TheoryStageProps> = ({
  goToNextStage,
  goToPreviousStage,
  isLoading
}) => {
  // Состояния для компонента, если необходимо
  const [exampleState, setExampleState] = useState<string>('');

  // Шаги для StepNavigation
  const steps = [
    // Шаг 1: Введение в тему
    <div key="intro" className={styles.contentBlock}>
      <h2 className={styles.h3}>Введение в тему</h2>
      <p className={styles.paragraph}>
        Здесь можно разместить вводный текст, объясняющий тему и ее важность в контексте продуктовой разработки.
      </p>
      
      <MentorTip
        tip="Это подсказка ментора для первого шага. Тут можно дать дополнительный контекст или рекомендации."
        position="bottom-right"
      />
    </div>,

    // Шаг 2: Основные концепции
    <div key="concepts" className={styles.contentBlock}>
      <h2 className={styles.h3}>Основные концепции</h2>
      <p className={styles.paragraph}>
        В этом разделе можно описать ключевые концепции и термины, связанные с темой.
      </p>
      
      <div className={styles.grid2Cols}>
        <div className={styles.innerContentBlock}>
          <h3 className={styles.h4}>Раздел 1</h3>
          <ul className={styles.list}>
            <li>Пункт 1</li>
            <li>Пункт 2</li>
            <li>Пункт 3</li>
          </ul>
        </div>
        <div className={styles.innerContentBlock}>
          <h3 className={styles.h4}>Раздел 2</h3>
          <ul className={styles.list}>
            <li>Пункт 1</li>
            <li>Пункт 2</li>
            <li>Пункт 3</li>
          </ul>
        </div>
      </div>
      
      <MentorTip
        tip="Это подсказка ментора для второго шага. Тут можно акцентировать внимание на важных аспектах."
        position="bottom-left"
      />
    </div>,

    // Шаг 3: Практические примеры
    <div key="examples" className={styles.contentBlock}>
      <h2 className={styles.h3}>Практические примеры</h2>
      <p className={styles.paragraph}>
        Здесь можно привести практические примеры, иллюстрирующие применение теоретических концепций.
      </p>
      
      <div className={styles.innerContentBlock}>
        <h3 className={styles.h4}>Пример 1</h3>
        <p className={styles.paragraph}>
          Описание первого примера...
        </p>
      </div>
      
      <div className={styles.innerContentBlock}>
        <h3 className={styles.h4}>Пример 2</h3>
        <p className={styles.paragraph}>
          Описание второго примера...
        </p>
      </div>
      
      <MentorTip
        tip="Это подсказка ментора для третьего шага. Здесь можно дать рекомендации по применению знаний на практике."
        position="top-right"
      />
    </div>,

    // Шаг 4: Заключение
    <div key="conclusion" className={styles.contentBlock}>
      <h2 className={styles.h3}>Заключение</h2>
      <p className={styles.paragraph}>
        Краткое резюме изученного материала и связь с последующими этапами.
      </p>
      
      <div className={styles.innerContentBlock}>
        <h3 className={styles.h4}>Ключевые выводы:</h3>
        <ul className={styles.list}>
          <li>Вывод 1</li>
          <li>Вывод 2</li>
          <li>Вывод 3</li>
        </ul>
      </div>
      
      <MentorTip
        tip="Это заключительная подсказка ментора. Здесь можно дать общие рекомендации или наставления для следующего этапа."
        position="bottom-right"
      />
    </div>
  ];

  return (
    <div className={styles.card}>
      <h1 className={styles.levelTitle}>Название теоретического блока</h1>
      <p className={styles.levelSubtitle}>Теоретический материал</p>
      
      <StepNavigation
        steps={steps}
        onComplete={goToNextStage}
        showBackButton={true}
        continueButtonText="Далее"
        completeButtonText="К практике"
        showProgress={true}
        showStepNumbers={true}
      />
    </div>
  );
};

export default TheoryStageTemplate; 