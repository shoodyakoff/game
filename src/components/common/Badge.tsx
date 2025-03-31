import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  type: 'achievement' | 'reward' | 'special';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, className }) => {
  const badgeClass = `${styles.badge} ${styles[type]} ${className || ''}`;
  
  return (
    <div className={badgeClass}>
      {type === 'achievement' && '🏆'}
      {type === 'reward' && '🎁'}
      {type === 'special' && '⭐'}
      <span className={styles.text}>
        {type === 'achievement' && 'Достижение'}
        {type === 'reward' && 'Награда'}
        {type === 'special' && 'Особое'}
      </span>
    </div>
  );
}; 