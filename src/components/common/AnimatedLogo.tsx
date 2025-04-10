import React, { useEffect, useState } from 'react';

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'medium',
  className = '',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Определение размеров для разных вариантов
  const sizeMap = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  // Устанавливаем размер
  const logoSize = sizeMap[size] || sizeMap.medium;

  // Эффект для анимации при монтировании
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`${logoSize} relative ${isAnimating ? 'animate-pulse' : ''} transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-indigo-600 rounded-full opacity-20 animate-ping"></div>
        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full p-3 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl select-none">
            GO
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedLogo; 