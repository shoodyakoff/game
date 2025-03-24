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
const Introduction = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>Введение</h1>
    <p className={styles.text}>Добро пожаловать в первый уровень обучения продуктовому мышлению и UX-анализу!</p>
  </div>
);

const TeamMeeting = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>Встреча с командой</h1>
    <p className={styles.text}>Познакомьтесь с командой и узнайте детали задачи.</p>
  </div>
);

const MetricsTheory = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>Теория метрик</h1>
    <p className={styles.text}>Изучите основы анализа продуктовых метрик.</p>
  </div>
);

const MetricsPractice = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>Практика по метрикам</h1>
    <p className={styles.text}>Примените знания о метриках на практике.</p>
  </div>
);

const DecisionMakingTheory = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>Теория принятия решений</h1>
    <p className={styles.text}>Изучите основы принятия решений на основе данных.</p>
  </div>
);

const DecisionMakingPractice = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>Практика принятия решений</h1>
    <p className={styles.text}>Примените принципы принятия решений на практике.</p>
  </div>
);

const Feedback = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>Обратная связь</h1>
    <p className={styles.text}>Получите обратную связь по вашему решению.</p>
  </div>
);

const Quiz = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>Тест</h1>
    <p className={styles.text}>Проверьте свои знания, пройдя итоговый тест.</p>
  </div>
);

const Completion = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>Завершение уровня</h1>
    <p className={styles.text}>Поздравляем! Вы успешно прошли первый уровень.</p>
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
        return <Introduction />;
      case LevelStage.TEAM_MEETING:
        return <TeamMeeting />;
      case LevelStage.PRODUCT_MINDSET_THEORY:
        return <ProductMindsetTheory />;
      case LevelStage.UX_ANALYSIS_THEORY:
        return <UXAnalysisTheory />;
      case LevelStage.UX_ANALYSIS_PRACTICE:
        return <UXAnalysisPractice />;
      case LevelStage.METRICS_THEORY:
        return <MetricsTheory />;
      case LevelStage.METRICS_PRACTICE:
        return <MetricsPractice />;
      case LevelStage.DECISION_MAKING_THEORY:
        return <DecisionMakingTheory />;
      case LevelStage.DECISION_MAKING_PRACTICE:
        return <DecisionMakingPractice />;
      case LevelStage.FEEDBACK:
        return <Feedback />;
      case LevelStage.QUIZ:
        return <Quiz />;
      case LevelStage.COMPLETION:
        return <Completion />;
      default:
        return <Introduction />;
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