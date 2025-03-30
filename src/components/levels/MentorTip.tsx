import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type MentorTipProps = {
  tip: string;
  avatar?: string;
  name?: string;
  showIcon?: boolean;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left' | 'right-bottom';
  defaultOpen?: boolean;
};

const MentorTip: React.FC<MentorTipProps> = ({
  tip,
  avatar = '/characters/avatar_mentor.png',
  name = 'Ментор',
  showIcon = true,
  position = 'right-bottom',
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [hasBeenOpened, setHasBeenOpened] = useState(defaultOpen);
  const iconRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Автоматически закрываем подсказку через 10 секунд, если она открыта по умолчанию
  useEffect(() => {
    if (defaultOpen) {
      setHasBeenOpened(true);
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [defaultOpen]);

  // Вычисление позиции подсказки относительно иконки при открытии
  useEffect(() => {
    if (isOpen && iconRef.current && tooltipRef.current) {
      const calculatePosition = () => {
        const iconRect = iconRef.current!.getBoundingClientRect();
        const tooltipRect = tooltipRef.current!.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let top = 0;
        let left = 0;
        
        // По умолчанию располагаем справа и снизу от иконки
        left = iconRect.right + 16;
        top = iconRect.top;
        
        // Проверяем, не выходит ли подсказка за пределы экрана
        if (left + tooltipRect.width > windowWidth) {
          // Если выходит за правую границу, располагаем слева от иконки
          left = Math.max(0, iconRect.left - tooltipRect.width - 16);
        }
        
        if (top + tooltipRect.height > windowHeight) {
          // Если выходит за нижнюю границу, поднимаем вверх так, чтобы поместилась
          top = Math.max(0, windowHeight - tooltipRect.height - 16);
        }
        
        setTooltipPosition({ top, left });
      };
      
      calculatePosition();
      
      // Пересчитываем позицию при изменении размеров окна
      window.addEventListener('resize', calculatePosition);
      
      return () => {
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isOpen, position]);
  
  // Определяем класс позиции для классического метода позиционирования
  const positionClasses = {
    'top-right': 'bottom-full right-0 mb-2',
    'bottom-right': 'top-full right-0 mt-2',
    'bottom-left': 'top-full left-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'right-bottom': '' // Пустой, так как используем кастомное позиционирование
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    setHasBeenOpened(true);
  };
  
  return (
    <div className="relative inline-block">
      {/* Иконка наставника */}
      <motion.div
        ref={iconRef}
        onClick={handleClick}
        className="rounded-full hover:ring-2 hover:ring-yellow-500 transition-all cursor-pointer overflow-hidden group relative"
        title="Совет ментора"
        animate={!isOpen && !hasBeenOpened ? { scale: [1, 1.05, 1] } : {}}
        transition={{ 
          repeat: Infinity, 
          duration: 2, 
          ease: "easeInOut" 
        }}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image 
            src={avatar} 
            alt={name} 
            width={48} 
            height={48} 
            className="object-cover transform scale-110"
          />
        </div>
        
        {/* Индикатор непрочитанной подсказки */}
        {!hasBeenOpened && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-indigo-950 flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
        
        {/* Текстовая подсказка при наведении */}
        <div className="absolute opacity-0 group-hover:opacity-100 -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-950/90 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity duration-200">
          Нажмите для подсказки ментора
        </div>
      </motion.div>
      
      {/* Всплывающая подсказка с анимацией */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            ref={tooltipRef}
            className="fixed z-50 w-80 bg-indigo-950/95 border-l-4 border-yellow-500 p-4 rounded-md shadow-xl"
            style={{ 
              top: `${tooltipPosition.top}px`, 
              left: `${tooltipPosition.left}px`
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image src={avatar} alt={name} width={40} height={40} className="object-cover" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-yellow-500 mb-1">{name}</h4>
                <p className="text-slate-100 text-sm leading-relaxed">{tip}</p>
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