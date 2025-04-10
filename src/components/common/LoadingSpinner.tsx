import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'indigo',
  className = '',
}) => {
  // Определение размеров для разных вариантов
  const sizeMap = {
    small: 'w-6 h-6 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-3',
  };

  // Карта цветов для разных вариантов
  const colorMap: Record<string, string> = {
    indigo: 'border-indigo-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    white: 'border-white',
    primary: 'border-primary-500',
  };

  // Выбираем размер и цвет из карты или используем переданные значения
  const spinnerSize = sizeMap[size] || sizeMap.medium;
  const spinnerColor = colorMap[color] || color;

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${spinnerSize} ${spinnerColor} border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner; 