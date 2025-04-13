import React from 'react';
import { default as UnifiedMentorTip, MentorTipProps as UnifiedMentorTipProps } from '../levels/shared/feedback/MentorTip';

// Проксируем интерфейс с возможностью добавления новых свойств
export interface MentorTipProps extends UnifiedMentorTipProps {
  // Дополнительные свойства для этого варианта MentorTip могут быть добавлены здесь
}

// Временно отключен для решения проблемы с бесконечными обновлениями
const MentorTip: React.FC<MentorTipProps> = () => {
  // Возвращаем null, чтобы ничего не отображать
  return null;
};

export default MentorTip; 