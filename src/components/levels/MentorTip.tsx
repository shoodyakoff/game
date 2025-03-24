import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MentorTipProps = {
  tip: string;
  avatar?: string;
  name?: string;
  showIcon?: boolean;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
};

const MentorTip: React.FC<MentorTipProps> = ({
  tip,
  avatar = '/characters/avatar_mentor.png',
  name = 'Ментор',
  showIcon = true,
  position = 'top-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Определяем позицию блока с подсказкой
  const positionClasses = {
    'top-right': 'bottom-full right-0 mb-2',
    'bottom-right': 'top-full right-0 mt-2',
    'bottom-left': 'top-full left-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2'
  };
  
  return (
    <div className="relative inline-block">
      {/* Иконка наставника */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-500/20 text-yellow-500 p-2 rounded-full hover:bg-yellow-500/30 transition-all cursor-pointer"
        title="Совет ментора"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      </button>
      
      {/* Всплывающая подсказка с анимацией */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`absolute z-50 w-72 bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded-r-md shadow-lg ${positionClasses[position]}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start">
              {avatar && (
                <div className="flex-shrink-0 mr-3">
                  <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-yellow-500 mb-1">{name}</h4>
                <p className="text-slate-300">{tip}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="ml-auto -mt-1 -mr-1 text-slate-400 hover:text-slate-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentorTip; 