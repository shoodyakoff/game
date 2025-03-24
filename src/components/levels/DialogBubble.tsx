import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DialogBubbleProps = {
  avatar: string;
  name: string;
  role: string;
  messages: string[];
  side?: 'left' | 'right';
  onComplete?: () => void;
  autoPlay?: boolean;
  typingSpeed?: number;
  showSkipAll?: boolean;
};

const DialogBubble: React.FC<DialogBubbleProps> = ({
  avatar,
  name,
  role,
  messages,
  side = 'left',
  onComplete,
  autoPlay = true,
  typingSpeed = 30,
  showSkipAll = true
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  
  // Эффект для имитации печатания текста
  useEffect(() => {
    if (currentMessageIndex >= messages.length) {
      if (onComplete) onComplete();
      return;
    }
    
    const currentMessage = messages[currentMessageIndex];
    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText('');
    
    const typingInterval = setInterval(() => {
      if (charIndex <= currentMessage.length) {
        setDisplayedText(currentMessage.substring(0, charIndex));
        charIndex += speedMultiplier;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setShowNextButton(true);
      }
    }, typingSpeed / speedMultiplier);
    
    return () => clearInterval(typingInterval);
  }, [currentMessageIndex, messages, onComplete, typingSpeed, speedMultiplier]);
  
  // Авто-переход к следующему сообщению
  useEffect(() => {
    if (autoPlay && !isTyping && currentMessageIndex < messages.length - 1) {
      const timer = setTimeout(() => {
        handleNextMessage();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isTyping, currentMessageIndex, messages.length, autoPlay]);
  
  const handleNextMessage = () => {
    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(prevIndex => prevIndex + 1);
      setShowNextButton(false);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  const skipTyping = () => {
    setDisplayedText(messages[currentMessageIndex]);
    setIsTyping(false);
    setShowNextButton(true);
  };
  
  const skipAllDialogs = () => {
    if (onComplete) {
      onComplete();
    }
  };
  
  const increaseSpeed = () => {
    setSpeedMultiplier(prev => Math.min(prev + 1, 5));
  };
  
  const progressPercentage = ((currentMessageIndex + 1) / messages.length) * 100;
  
  return (
    <div className="relative max-w-3xl mx-auto my-4">
      <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
        <div 
          className="bg-indigo-500 h-1 rounded-full transition-all duration-300" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="flex justify-end mb-2 gap-2">
        <button 
          onClick={increaseSpeed} 
          className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition"
          disabled={!isTyping}
        >
          Ускорить x{speedMultiplier}
        </button>
        
        <button 
          onClick={skipTyping} 
          className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition"
          disabled={!isTyping}
        >
          Пропустить сообщение
        </button>
        
        {showSkipAll && (
          <button 
            onClick={skipAllDialogs} 
            className="text-xs bg-indigo-800 hover:bg-indigo-700 text-indigo-200 px-2 py-1 rounded transition"
          >
            Пропустить все диалоги
          </button>
        )}
      </div>
      
      <div className="text-xs text-slate-400 mb-2 text-right">
        Сообщение {currentMessageIndex + 1} из {messages.length}
      </div>
      
      <div className={`flex items-start mb-6 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
        <div className={`${side === 'right' ? 'ml-3' : 'mr-3'} flex-shrink-0`}>
          {avatar ? (
            <img 
              src={avatar} 
              alt={name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <span className="text-sm font-bold">{name.split(' ').map(part => part[0]).join('')}</span>
            </div>
          )}
        </div>
        
        <div className={`${side === 'right' ? 'items-end' : ''} flex-1 max-w-xl`}>
          <div className={`mb-2 ${side === 'right' ? 'text-right' : ''}`}>
            <p className="text-sm font-semibold text-slate-200">{name}</p>
            <p className="text-xs text-slate-400">{role}</p>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-lg shadow-sm ${
                side === 'right' 
                  ? 'bg-indigo-900 text-indigo-100 rounded-tr-none border border-indigo-700' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}
              onClick={isTyping ? skipTyping : undefined}
            >
              <p className="text-base leading-relaxed whitespace-pre-line">{displayedText}</p>
              {isTyping && (
                <span className="inline-block h-4 w-2 bg-current ml-1 animate-pulse" />
              )}
            </motion.div>
          </AnimatePresence>
          
          {showNextButton && currentMessageIndex < messages.length - 1 && (
            <button 
              onClick={handleNextMessage}
              className={`text-sm text-indigo-400 hover:text-indigo-300 mt-2 ${side === 'right' ? 'ml-auto' : ''} block font-medium`}
            >
              Далее →
            </button>
          )}
          
          {showNextButton && currentMessageIndex === messages.length - 1 && onComplete && (
            <button 
              onClick={onComplete}
              className={`text-sm text-indigo-400 hover:text-indigo-300 mt-2 ${side === 'right' ? 'ml-auto' : ''} block font-medium`}
            >
              Завершить диалог →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogBubble; 