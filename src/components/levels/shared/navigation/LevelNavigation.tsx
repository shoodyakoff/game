import React from 'react';
import { LevelStage } from '../../../../../types/level';
import Link from 'next/link';

export interface LevelNavigationProps {
  currentStage: LevelStage;
  setCurrentStage: (stage: LevelStage) => void;
  stages: { 
    stage: LevelStage; 
    title: string;
    completed?: boolean;
  }[];
}

const LevelNavigation: React.FC<LevelNavigationProps> = ({ 
  currentStage, 
  setCurrentStage, 
  stages 
}) => {
  // Создаем ссылку с сохранением текущего этапа
  const levelsLinkWithStage = `/levels?returnTo=1&returnStage=${encodeURIComponent(currentStage)}`;
  
  return (
    <div className="bg-indigo-950/80 backdrop-blur-sm border-b border-indigo-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between w-full">
          <Link href={levelsLinkWithStage} className="text-slate-300 hover:text-white flex items-center mr-4 transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>К карте уровней</span>
          </Link>
          
          <div className="flex items-center flex-wrap gap-2 overflow-x-auto">
            {stages.map((item, index) => (
              <React.Fragment key={item.stage}>
                {index > 0 && (
                  <div className="text-slate-500 hidden md:block">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                
                <button
                  onClick={() => setCurrentStage(item.stage)}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center ${
                    currentStage === item.stage 
                      ? 'bg-indigo-700 text-white' 
                      : item.completed 
                        ? 'bg-indigo-900/50 text-slate-200 hover:bg-indigo-800/60' 
                        : 'bg-slate-800/50 text-slate-400 cursor-not-allowed'
                  }`}
                  title={!item.completed && currentStage !== item.stage ? 'Этот этап еще не доступен' : ''}
                  disabled={!item.completed && currentStage !== item.stage}
                >
                  {item.completed && (
                    <svg className="w-4 h-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span>{item.title}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelNavigation; 