import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { styles } from './common/styles';
import StageNavigation from './common/StageNavigation';
import { LevelStage, LEVEL_STAGE_SEQUENCE, getNextStage, getPreviousStage, getStageName } from '../shared/LevelStages';

// Импорт компонентов для разных этапов
import Introduction from './stages/Introduction';
import ProductThinkingTheory from './stages/ProductThinkingTheory';
import ProductThinkingPractice from './stages/ProductThinkingPractice';
import UXAnalysisTheory from './stages/UXAnalysisTheory';
import UXAnalysisPractice from './stages/UXAnalysisPractice';
import MetricsTheory from './stages/MetricsTheory';
import MetricsPractice from './stages/MetricsPractice';
import DecisionMakingTheory from './stages/DecisionMakingTheory';
import DecisionMakingPractice from './stages/DecisionMakingPractice';
import Feedback from './stages/Feedback';
import Quiz from './stages/Quiz';
import { Completion } from './stages/Completion';

// Обертки для компонентов, которые не принимают проп onComplete
const IntroductionWrapper = ({ onComplete }) => {
  const router = useRouter();
  const handleContinue = () => {
    onComplete();
  };
  
  return <Introduction />;
};

const ProductThinkingTheoryWrapper = ({ onComplete }) => {
  return (
    <div>
      <ProductThinkingTheory />
      <div className="flex justify-center mt-6">
        <button 
          className={styles.btnPrimary}
          onClick={onComplete}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

const FeedbackWrapper = ({ onComplete }) => {
  return (
    <div>
      <Feedback />
      <div className="flex justify-center mt-6">
        <button 
          className={styles.btnPrimary}
          onClick={onComplete}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

const Level1 = () => {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<LevelStage>(LevelStage.INTRO);
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
      case LevelStage.INTRO:
        return <IntroductionWrapper onComplete={handleNextStage} />;
      case LevelStage.PRODUCT_THINKING_THEORY:
        return <ProductThinkingTheoryWrapper onComplete={handleNextStage} />;
      case LevelStage.PRODUCT_THINKING_PRACTICE:
        return <ProductThinkingPractice onComplete={handleNextStage} />;
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
        return <FeedbackWrapper onComplete={handleNextStage} />;
      case LevelStage.QUIZ:
        return <Quiz onComplete={handleNextStage} />;
      case LevelStage.COMPLETE:
        return <Completion onComplete={handleNextStage} />;
      default:
        return <IntroductionWrapper onComplete={handleNextStage} />;
    }
  };

  return (
    <div className={styles.levelContainer}>
      <StageNavigation
        currentStage={currentStage}
        completedStages={completedStages}
        onStageChange={handleStageChange}
        showBackButton={currentStage !== LevelStage.INTRO}
        goToPreviousStage={handlePreviousStage}
      />
      
      <div className={styles.stageContent}>
        {renderStageContent()}
      </div>
      
      <div className={styles.navigationButtons}>
        {currentStage !== LevelStage.INTRO && (
          <button 
            className={styles.navigationButton} 
            onClick={handlePreviousStage}
          >
            Назад
          </button>
        )}
        
        {currentStage !== LevelStage.COMPLETE && (
          <button 
            className={styles.navigationButton} 
            onClick={handleNextStage}
          >
            {currentStage === LevelStage.QUIZ ? 'Завершить' : 'Далее'}
          </button>
        )}
        
        {currentStage === LevelStage.COMPLETE && (
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