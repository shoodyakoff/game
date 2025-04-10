import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  color?: string;
  height?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  color = 'indigo',
  height = 8,
  className = '',
}) => {
  // Ограничиваем процент от 0 до 100
  const validPercentage = Math.min(Math.max(percentage, 0), 100);

  // Карта цветов для разных вариантов
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-600',
    primary: 'bg-primary-500',
  };

  // Выбираем цвет из карты или используем переданный цвет как есть
  const barColor = colorMap[color] || color;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {validPercentage}%
          </span>
        </div>
      )}
      <div
        className={`w-full bg-gray-200 rounded-full dark:bg-gray-700`}
        style={{ height: `${height}px` }}
      >
        <div
          className={`${barColor} rounded-full transition-all duration-300`}
          style={{
            width: `${validPercentage}%`,
            height: `${height}px`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar; 