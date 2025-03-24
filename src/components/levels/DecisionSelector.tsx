import { useState } from 'react';
import { motion } from 'framer-motion';

type Solution = {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  suitable_for: string[];
  outcome: string;
};

type DecisionSelectorProps = {
  solutions: Solution[];
  userCharacterType?: string;
  onSelectSolution: (solutionId: string) => void;
};

const DecisionSelector: React.FC<DecisionSelectorProps> = ({
  solutions,
  userCharacterType,
  onSelectSolution
}) => {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  
  const handleSelectSolution = (id: string) => {
    setSelectedSolution(id);
  };
  
  const handleConfirmSelection = () => {
    if (selectedSolution) {
      onSelectSolution(selectedSolution);
    }
  };
  
  const toggleDetails = (id: string) => {
    setShowDetails(showDetails === id ? null : id);
  };
  
  const isSuitableForCharacter = (solution: Solution) => {
    return userCharacterType && solution.suitable_for.includes(userCharacterType);
  };
  
  return (
    <div>
      <h3 className="level-subtitle">Выберите решение</h3>
      <p className="mb-6 text-slate-300">
        На основе анализа данных выберите наиболее подходящее решение для улучшения процесса создания задач.
      </p>
      
      <div className="space-y-4 mb-6">
        {solutions.map((solution) => (
          <div 
            key={solution.id} 
            className={`solution-card ${selectedSolution === solution.id ? 'solution-card-selected' : ''}`}
            onClick={() => handleSelectSolution(solution.id)}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 ${
                selectedSolution === solution.id 
                  ? 'border-indigo-500 bg-indigo-500' 
                  : 'border-slate-400'
              }`}>
                {selectedSolution === solution.id && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full rounded-full bg-indigo-500"
                  />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="solution-title">
                  {solution.title}
                  {isSuitableForCharacter(solution) && (
                    <span className="ml-2 text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded">
                      Подходит вашему персонажу
                    </span>
                  )}
                </h4>
                <p className="solution-description">{solution.description}</p>
              </div>
              
              <button 
                type="button"
                className="text-slate-400 hover:text-slate-200 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDetails(solution.id);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {showDetails === solution.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-slate-700"
              >
                <div className="pros-cons-container">
                  <div>
                    <h5 className="pros-cons-title text-green-400">Преимущества:</h5>
                    <ul className="pros-list">
                      {solution.pros.map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="pros-cons-title text-red-400">Недостатки:</h5>
                    <ul className="cons-list">
                      {solution.cons.map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
        <p className="text-sm text-slate-400">
          {selectedSolution 
            ? 'Вы выбрали решение. Готовы подтвердить?' 
            : 'Выберите одно из предложенных решений.'}
        </p>
        <button
          className={`btn-primary ${!selectedSolution ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!selectedSolution}
          onClick={handleConfirmSelection}
        >
          Подтвердить выбор
        </button>
      </div>
    </div>
  );
};

export default DecisionSelector; 