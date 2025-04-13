import React from 'react';

export interface MentorTipProps {
  tip?: string;
  content?: React.ReactNode;
  avatar?: string;
  name?: string;
  showIcon?: boolean;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left' | 'right-bottom' | 'left';
  defaultOpen?: boolean;
  autoCloseDelay?: number;
  showHoverHint?: boolean;
  className?: string;
  iconPosition?: 'fixed' | 'absolute' | 'relative';
  variant?: 'compact' | 'full';
  alwaysVisible?: boolean;
  zIndex?: number;
}

// Временно отключен для решения проблемы с бесконечными обновлениями
const MentorTip: React.FC<MentorTipProps> = () => {
  // Возвращаем null, чтобы ничего не отображать
  return null;
};

export default MentorTip; 