import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { styles } from './common/styles';
import StageNavigation from './common/StageNavigation';
import { LevelStage, LEVEL_STAGE_SEQUENCE, getNextStage, getPreviousStage, getStageName } from './common/LevelStages';

// Импорт компонентов для разных этапов
import ProductMindsetTheory from './stages/ProductMindsetTheory';
import UXAnalysisTheory from './stages/UXAnalysisTheory';
import UXAnalysisPractice from './stages/UXAnalysisPractice';

// Временные заглушки для остальных этапов
const Introduction = ({ onComplete }) => (
  <div className={styles.container}>
    <h1 className={styles.header}>Введение</h1>
    <p className={styles.text}>Добро пожаловать в первый уровень обучения продуктовому мышлению и UX-анализу!</p>
    <button onClick={onComplete}>Начать</button>
  </div>
);

const TeamMeeting = ({ onComplete }) => (
  <div className={styles.container}>
    <h1 className={styles.header}>Встреча с командой</h1>
    <p className={styles.text}>Познакомьтесь с командой и узнайте детали задачи.</p>
    <button onClick={onComplete}>Начать</button>
  </div>
);

const MetricsTheory = ({ onComplete }) => (
  <div className={styles.container}>
    <h1 className={styles.header}>Теория метрик</h1>
    <p className={styles.text}>Изучите основы анализа продуктовых метрик.</p>
    <button onClick={onComplete}>Начать</button>
  </div>
);

const MetricsPractice = ({ onComplete }) => (
  <div className={styles.container}>
    <h1 className={styles.header}>Практика по метрикам</h1>
    <p className={styles.text}>Примените знания о метриках на практике.</p>
    <button onClick={onComplete}>Начать</button>
  </div>
);

const DecisionMakingTheory = ({ onComplete }) => (
  <div className={styles.container}>
    <h1 className={styles.header}>Теория принятия решений</h1>
    <p className={styles.text}>Изучите основы принятия решений на основе данных.</p>
    <button onClick={onComplete}>Начать</button>
  </div>
);

const DecisionMakingPractice = ({ onComplete }) => (
  <div className={styles.container}>
    <h1 className={styles.header}>Практика принятия решений</h1>
    <p className={styles.text}>Примените принципы принятия решений на практике.</p>
    <button onClick={onComplete}>Начать</button>
  </div>
);

const Feedback = ({ onComplete }) => (
  <div className={styles.container}>
    <h1 className={styles.header}>Обратная связь</h1>
    <p className={styles.text}>Получите обратную связь по вашему решению.</p>
    <button onClick={onComplete}>Начать</button>
  </div>
);

const Quiz = ({ onComplete }) => (
  <div className={styles.container}>
    <h1 className={styles.header}>Тест</h1>
    <p className={styles.text}>Проверьте свои знания, пройдя итоговый тест.</p>
    <button onClick={onComplete}>Начать</button>
  </div>
);

const Completion = ({ onComplete }) => (
  <div className={styles.container}>
    <h1 className={styles.header}>Завершение уровня</h1>
    <p className={styles.text}>Поздравляем! Вы успешно прошли первый уровень.</p>
    <button onClick={onComplete}>Начать следующий уровень</button>
  </div>
);

const Level1 = () => {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<LevelStage>(LevelStage.INTRODUCTION);
  const [completedStages, setCompletedStages] = useState<LevelStage[]>([]);

  useEffect(() => {
    // Если есть параметр stage в URL, устанавливаем соответствующий этап
    if (router.query.stage) {
      const stageFromUrl = router.query.stage as string;
      const stage = Object.values(LevelStage).find(s => s === stageFromUrl);
      if (stage) {
        setCurrentStage(stage as LevelStage);
      }
    }
  }, [router.query]);

  const handleStageChange = (stage: LevelStage) => {
    setCurrentStage(stage);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, stage },
    }, undefined, { shallow: true });
  };

  const handleNextStage = () => {
    const nextStage = getNextStage(currentStage);
    if (nextStage) {
      // Добавляем текущий этап в список завершенных, если его там еще нет
      if (!completedStages.includes(currentStage)) {
        setCompletedStages([...completedStages, currentStage]);
      }
      handleStageChange(nextStage);
    }
  };

  const handlePreviousStage = () => {
    const prevStage = getPreviousStage(currentStage);
    if (prevStage) {
      handleStageChange(prevStage);
    }
  };

  // Рендеринг компонента в зависимости от текущего этапа
  const renderStageContent = () => {
    switch (currentStage) {
      case LevelStage.INTRODUCTION:
        return <Introduction onComplete={handleNextStage} />;
      case LevelStage.TEAM_MEETING:
        return <TeamMeeting onComplete={handleNextStage} />;
      case LevelStage.PRODUCT_MINDSET_THEORY:
        return <ProductMindsetTheory onComplete={handleNextStage} />;
      case LevelStage.UX_ANALYSIS_THEORY:
        return <UXAnalysisTheory onComplete={handleNextStage} />;
      case LevelStage.UX_ANALYSIS_PRACTICE:
        return <UXAnalysisPractice onComplete={handleNextStage} />;
      case LevelStage.METRICS_THEORY:
        return <MetricsTheory onComplete={handleNextStage} />;
      case LevelStage.METRICS_PRACTICE:
        return <MetricsPractice onComplete={handleNextStage} />;
      case LevelStage.DECISION_MAKING_THEORY:
        return <DecisionMakingTheory onComplete={handleNextStage} />;
      case LevelStage.DECISION_MAKING_PRACTICE:
        return <DecisionMakingPractice onComplete={handleNextStage} />;
      case LevelStage.FEEDBACK:
        return <Feedback onComplete={handleNextStage} />;
      case LevelStage.QUIZ:
        return <Quiz onComplete={handleNextStage} />;
      case LevelStage.COMPLETION:
        return <Completion onComplete={handleNextStage} />;
      default:
        return <Introduction onComplete={handleNextStage} />;
    }
  };

  return (
    <div className={styles.levelContainer}>
      <StageNavigation
        currentStage={currentStage}
        completedStages={completedStages}
        onStageChange={handleStageChange}
        showBackButton={currentStage !== LevelStage.INTRODUCTION}
        goToPreviousStage={handlePreviousStage}
      />
      
      <div className={styles.stageContent}>
        {renderStageContent()}
      </div>
      
      <div className={styles.navigationButtons}>
        {currentStage !== LevelStage.INTRODUCTION && (
          <button 
            className={styles.navigationButton} 
            onClick={handlePreviousStage}
          >
            Назад
          </button>
        )}
        
        {currentStage !== LevelStage.COMPLETION && (
          <button 
            className={styles.navigationButton} 
            onClick={handleNextStage}
          >
            {currentStage === LevelStage.QUIZ ? 'Завершить' : 'Далее'}
          </button>
        )}
        
        {currentStage === LevelStage.COMPLETION && (
          <button 
            className={styles.navigationButton} 
            onClick={() => router.push('/pages/levels')}
          >
            К выбору уровней
          </button>
        )}
      </div>
    </div>
  );
};

export default Level1; 