import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LevelStage, getStageName, LEVEL_STAGE_SEQUENCE } from '../components/levels/shared/LevelStages';
import StageNavigation from '../components/levels/level1/common/StageNavigation';

// Импорт компонентов для каждого этапа
import Introduction from '../components/levels/level1/stages/Introduction';
import TeamMeeting from '../components/levels/level1/stages/TeamMeeting';
import MetricsPractice from '../components/levels/level1/stages/MetricsPractice';
import UxAnalysis from '../components/levels/level1/stages/UxAnalysis';
// Другие импорты будут добавлены по мере создания компонентов

// Описания для каждого этапа
const stageDescriptions: Record<LevelStage, string> = {
  [LevelStage.INTRODUCTION]: 'Введение в уровень про основы продуктового мышления',
  [LevelStage.TEAM_MEETING]: 'Встреча с командой проекта',
  [LevelStage.PRODUCT_MINDSET_THEORY]: 'Теория продуктового мышления',
  [LevelStage.PRODUCT_THINKING_PRACTICE]: 'Практика продуктового мышления',
  [LevelStage.UX_ANALYSIS_THEORY]: 'Теория UX-анализа',
  [LevelStage.UX_ANALYSIS_PRACTICE]: 'Практика UX-анализа',
  [LevelStage.METRICS_THEORY]: 'Теория метрик',
  [LevelStage.METRICS_PRACTICE]: 'Практика анализа метрик',
  [LevelStage.DECISION_MAKING_THEORY]: 'Теория принятия решений',
  [LevelStage.DECISION_MAKING_PRACTICE]: 'Практика принятия решений',
  [LevelStage.FEEDBACK]: 'Обратная связь по уровню',
  [LevelStage.QUIZ]: 'Тест на знание материала',
  [LevelStage.COMPLETE]: 'Завершение уровня',
  // Этапы второго уровня
  [LevelStage.STAKEHOLDERS_THEORY]: 'Теория стейкхолдеров',
  [LevelStage.STAKEHOLDER_BRIEFING]: 'Брифинг со стейкхолдерами',
  [LevelStage.REQUIREMENTS_THEORY]: 'Теория требований',
  [LevelStage.REQUIREMENTS_PRACTICE]: 'Практика по требованиям',
  [LevelStage.USERS_RESEARCH_THEORY]: 'Теория исследования пользователей',
  [LevelStage.USERS_RESEARCH_PRACTICE]: 'Практика исследования пользователей',
  [LevelStage.COMPETITORS_THEORY]: 'Теория анализа конкурентов',
  [LevelStage.COMPETITORS_PRACTICE]: 'Практика анализа конкурентов',
  [LevelStage.PLANNING_THEORY]: 'Теория планирования',
  [LevelStage.PLANNING_PRACTICE]: 'Практика планирования',
  [LevelStage.PRESENTATION_THEORY]: 'Теория презентации',
  [LevelStage.PRESENTATION_PRACTICE]: 'Практика презентации'
};

// Маппинг этапов на соответствующие компоненты
const stageComponents: Partial<Record<LevelStage, React.FC>> = {
  [LevelStage.INTRODUCTION]: Introduction,
  [LevelStage.TEAM_MEETING]: TeamMeeting,
  [LevelStage.METRICS_PRACTICE]: MetricsPractice,
  [LevelStage.UX_ANALYSIS_PRACTICE]: UxAnalysis,
  // Временные заглушки для остальных компонентов, которые будут созданы позже
  [LevelStage.PRODUCT_THINKING_PRACTICE]: () => <div>Практика продуктового мышления - компонент в разработке</div>,
  [LevelStage.DECISION_MAKING_PRACTICE]: () => <div>Практика принятия решений - компонент в разработке</div>,
  [LevelStage.FEEDBACK]: () => <div>Обратная связь - компонент в разработке</div>,
  [LevelStage.QUIZ]: () => <div>Итоговый тест - компонент в разработке</div>,
  [LevelStage.COMPLETE]: () => <div>Завершение уровня - компонент в разработке</div>
};

const Level1Page: React.FC = () => {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<LevelStage>(LevelStage.INTRODUCTION);
  
  // Эффект для получения текущего этапа из URL
  useEffect(() => {
    if (router.isReady) {
      const stageFromQuery = router.query.stage as LevelStage;
      if (stageFromQuery && Object.values(LevelStage).includes(stageFromQuery)) {
        setCurrentStage(stageFromQuery);
      }
    }
  }, [router.isReady, router.query.stage]);

  // Получение компонента для текущего этапа
  const CurrentStageComponent = stageComponents[currentStage] || (() => (
    <div className="text-center py-8">
      <h2 className="text-xl font-semibold text-gray-700">
        Этап "{getStageName(currentStage)}" находится в разработке
      </h2>
      <p className="mt-2 text-gray-500">
        Пожалуйста, вернитесь позже или выберите другой этап.
      </p>
    </div>
  ));
  
  return (
    <>
      <Head>
        <title>{`TaskMaster PM | ${getStageName(currentStage)}`}</title>
        <meta name="description" content={stageDescriptions[currentStage]} />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-indigo-800">
              TaskMaster: Оптимизация процесса создания задач
            </h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <CurrentStageComponent />
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <StageNavigation currentStage={currentStage} />
            </div>
          </div>
        </main>
        
        <footer className="bg-white shadow-sm mt-10">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
            © 2023 TaskMaster. Все права защищены. Обучающий симулятор для продакт-менеджеров.
          </div>
        </footer>
      </div>
    </>
  );
};

export default Level1Page; 