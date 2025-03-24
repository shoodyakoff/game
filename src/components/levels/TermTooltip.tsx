import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TermTooltipProps = {
  term: string;
  definition: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  additionalInfo?: {
    title: string;
    content: string;
  }[];
};

const TermTooltip: React.FC<TermTooltipProps> = ({
  term,
  definition,
  children,
  placement = 'top',
  additionalInfo = [],
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Обработка клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVisible &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Задержка перед показом подсказки
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 300);
  };

  // Задержка перед скрытием подсказки
  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!isExpanded) {
        setIsVisible(false);
      }
    }, 300);
  };

  // Получение стилей в зависимости от размещения
  const getTooltipStyles = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  // Определяем анимацию в зависимости от размещения
  const getAnimationVariants = () => {
    const baseVariants = {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 }
    };

    return baseVariants;
  };

  return (
    <span className="relative inline" ref={triggerRef}>
      <span
        className="inline-flex items-center cursor-help text-blue-600 border-b border-dashed border-blue-400 hover:text-blue-800"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="ml-1 h-3.5 w-3.5 text-blue-500"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-.75 3a.75.75 0 100 1.5.75.75 0 000-1.5z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={`absolute z-50 ${getTooltipStyles()} min-w-max max-w-xs`}
            variants={getAnimationVariants()}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Заголовок с термином */}
              <div className="bg-blue-50 border-b border-blue-100 p-3">
                <h3 className="font-medium text-blue-900">{term}</h3>
              </div>

              {/* Определение */}
              <div className="p-3">
                <p className="text-sm text-gray-700">{definition}</p>

                {/* Дополнительная информация (если есть) */}
                {additionalInfo.length > 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {isExpanded ? 'Скрыть детали' : 'Узнать больше'}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 border-t border-gray-200 pt-2"
                        >
                          {additionalInfo.map((info, index) => (
                            <div key={index} className="mt-2 first:mt-0">
                              <h4 className="text-xs font-medium text-gray-700">{info.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{info.content}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

export default TermTooltip;