import React from 'react';

const ProgressCard: React.FC = () => {
  // Фиктивные данные для прогресса
  const progressData = {
    completedLevels: 2,
    totalLevels: 10,
    currentExperience: 450,
    nextLevelExperience: 500
  };

  return (
    <div className="bg-slate-800 rounded-lg p-5">
      {/* Прогресс-бар уровней */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Уровни</span>
          <span className="text-sm text-white font-medium">
            {progressData.completedLevels} / {progressData.totalLevels}
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 rounded-full" 
            style={{
              width: `${(progressData.completedLevels / progressData.totalLevels) * 100}%`
            }}
          />
        </div>
      </div>
      
      {/* Прогресс-бар опыта */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Опыт</span>
          <span className="text-sm text-white font-medium">
            {progressData.currentExperience} / {progressData.nextLevelExperience}
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" 
            style={{
              width: `${(progressData.currentExperience / progressData.nextLevelExperience) * 100}%`
            }}
          />
        </div>
      </div>
      
      {/* Информация о прогрессе */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-sm uppercase text-gray-500 font-medium tracking-wider">
            Статистика
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="text-gray-400">Пройдено уровней:</span>
              <span className="text-white font-medium">{progressData.completedLevels}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Заработано опыта:</span>
              <span className="text-white font-medium">{progressData.currentExperience}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">До следующего уровня:</span>
              <span className="text-white font-medium">
                {progressData.nextLevelExperience - progressData.currentExperience}
              </span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm uppercase text-gray-500 font-medium tracking-wider">
            Следующая цель
          </h3>
          <div className="p-3 bg-slate-700 rounded-lg">
            <p className="text-white text-sm mb-2">Пройти уровень "Управление командой"</p>
            <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300">
              Перейти к уровню →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard; 