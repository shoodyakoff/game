import React, { ReactNode } from 'react';
import { default as UnifiedMentorTip, MentorTipProps as UnifiedMentorTipProps } from '../levels/shared/feedback/MentorTip';

// Определяем интерфейс с исходным API для обратной совместимости
export interface MentorTipProps {
  content: ReactNode; // Содержимое подсказки
  position?: 'left' | 'right' | 'top' | 'bottom' | 'auto'; // Предпочтительное расположение блока
  iconPosition?: 'fixed' | 'absolute' | 'relative'; // Способ позиционирования иконки
  className?: string; // Дополнительные классы для стилизации
}

// Переходник для обратной совместимости
const MentorTip: React.FC<MentorTipProps> = ({
  content,
  position = 'auto',
  iconPosition = 'relative',
  className = '',
  ...props
}) => {
  // Преобразуем старые значения position в новые
  let newPosition: UnifiedMentorTipProps['position'] = 'right-bottom';
  
  switch (position) {
    case 'left':
      newPosition = 'left';
      break;
    case 'right':
      newPosition = 'right-bottom';
      break;
    case 'top':
      newPosition = 'top-right';
      break;
    case 'bottom':
      newPosition = 'bottom-right';
      break;
    case 'auto':
      newPosition = 'right-bottom';
      break;
  }

  return (
    <UnifiedMentorTip 
      content={content}
      position={newPosition}
      iconPosition={iconPosition}
      className={className}
      {...props}
    />
  );
};

export default MentorTip; 