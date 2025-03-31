import React from 'react';
import { LevelStage } from '../../../../../types/level';

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
  return (
    <div className="bg-indigo-950/80 backdrop-blur-sm border-b border-indigo-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center flex-wrap gap-2">
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
                disabled={!item.completed && currentStage !== item.stage}
                title={!item.completed && currentStage !== item.stage ? 'Этот этап еще не доступен' : ''}
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
  );
};

export default LevelNavigation; 