import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LevelStage, stageNames, stageDescriptions } from '../components/levels/level1/common/LevelStages';
import StageNavigation from '../components/levels/level1/common/StageNavigation';

// Импорт компонентов для каждого этапа
import Introduction from '../components/levels/level1/stages/Introduction';
import TeamMeeting from '../components/levels/level1/stages/TeamMeeting';
import MetricsPractice from '../components/levels/level1/stages/MetricsPractice';
import UxAnalysis from '../components/levels/level1/stages/UxAnalysis';
// Другие импорты будут добавлены по мере создания компонентов

// Маппинг этапов на соответствующие компоненты
const stageComponents: Record<LevelStage, React.FC> = {
  [LevelStage.INTRODUCTION]: Introduction,
  [LevelStage.TEAM_MEETING]: TeamMeeting,
  [LevelStage.METRICS_ANALYSIS]: MetricsPractice,
  [LevelStage.UX_ANALYSIS]: UxAnalysis,
  // Временные заглушки для остальных компонентов, которые будут созданы позже
  [LevelStage.USER_RESEARCH]: () => <div>Исследование пользователей - компонент в разработке</div>,
  [LevelStage.SOLUTION_DESIGN]: () => <div>Проектирование решения - компонент в разработке</div>,
  [LevelStage.IMPLEMENTATION_PLAN]: () => <div>План внедрения - компонент в разработке</div>,
  [LevelStage.FINAL_TEST]: () => <div>Итоговый тест - компонент в разработке</div>,
  [LevelStage.COMPLETION]: () => <div>Завершение уровня - компонент в разработке</div>
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
  const CurrentStageComponent = stageComponents[currentStage];
  
  return (
    <>
      <Head>
        <title>{`TaskMaster PM | ${stageNames[currentStage]}`}</title>
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