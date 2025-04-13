import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface InfoCardProps {
  title: string;
  description: ReactNode;
  icon?: string | ReactNode;
  variant?: 'default' | 'highlighted' | 'warning' | 'success' | 'info';
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animation?: 'none' | 'fade' | 'scale' | 'slide';
  children?: ReactNode;
}

const variantStyles = {
  default: {
    bg: 'bg-slate-800/70',
    border: 'border-slate-700',
    title: 'text-white',
    hover: 'hover:bg-slate-800 hover:border-slate-600',
    active: 'bg-slate-800 border-indigo-500',
    icon: 'text-indigo-400',
    gradient: 'from-slate-800/90 to-slate-900/90'
  },
  highlighted: {
    bg: 'bg-indigo-900/30',
    border: 'border-indigo-700/50',
    title: 'text-indigo-300',
    hover: 'hover:bg-indigo-900/40 hover:border-indigo-600',
    active: 'bg-indigo-900/50 border-indigo-500',
    icon: 'text-indigo-400',
    gradient: 'from-indigo-900/70 to-indigo-950/90'
  },
  warning: {
    bg: 'bg-amber-900/30',
    border: 'border-amber-700/50',
    title: 'text-amber-300',
    hover: 'hover:bg-amber-900/40 hover:border-amber-600',
    active: 'bg-amber-900/50 border-amber-500',
    icon: 'text-amber-400',
    gradient: 'from-amber-900/50 to-amber-950/80'
  },
  success: {
    bg: 'bg-emerald-900/30',
    border: 'border-emerald-700/50',
    title: 'text-emerald-300',
    hover: 'hover:bg-emerald-900/40 hover:border-emerald-600',
    active: 'bg-emerald-900/50 border-emerald-500',
    icon: 'text-emerald-400',
    gradient: 'from-emerald-900/50 to-emerald-950/80'
  },
  info: {
    bg: 'bg-blue-900/30',
    border: 'border-blue-700/50',
    title: 'text-blue-300',
    hover: 'hover:bg-blue-900/40 hover:border-blue-600',
    active: 'bg-blue-900/50 border-blue-500',
    icon: 'text-blue-400',
    gradient: 'from-blue-900/50 to-blue-950/80'
  }
};

const sizeStyles = {
  sm: {
    padding: 'p-3',
    title: 'text-base',
    desc: 'text-xs',
    icon: 'text-xl',
    iconContainer: 'w-8 h-8'
  },
  md: {
    padding: 'p-4',
    title: 'text-lg',
    desc: 'text-sm',
    icon: 'text-2xl',
    iconContainer: 'w-10 h-10'
  },
  lg: {
    padding: 'p-5',
    title: 'text-xl',
    desc: 'text-base',
    icon: 'text-3xl',
    iconContainer: 'w-12 h-12'
  }
};

const animationVariants = {
  none: {
    initial: {},
    animate: {},
    transition: {}
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  },
  slide: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  }
};

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon,
  variant = 'default',
  onClick,
  isActive = false,
  className = '',
  size = 'md',
  animation = 'none',
  children
}) => {
  const style = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const animVariant = animationVariants[animation];
  
  const isClickable = typeof onClick === 'function';
  
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-lg border 
        ${isActive ? style.active : style.bg}
        ${isActive ? style.border : style.border}
        ${isClickable ? style.hover + ' cursor-pointer' : ''}
        ${sizeStyle.padding}
        shadow-lg transition-all duration-300 ease-in-out
        bg-gradient-to-br ${style.gradient}
        ${className}
      `}
      onClick={onClick}
      initial={animVariant.initial}
      animate={animVariant.animate}
      transition={animVariant.transition}
      whileHover={isClickable ? { scale: 1.01 } : {}}
      whileTap={isClickable ? { scale: 0.99 } : {}}
    >
      {/* Декоративный элемент */}
      <div className="absolute top-0 right-0 w-20 h-20 -translate-y-10 translate-x-10 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-2xl" />
      
      <div className="flex items-start">
        {icon && (
          <div className={`flex-shrink-0 mr-3 ${sizeStyle.iconContainer} flex items-center justify-center`}>
            {typeof icon === 'string' ? (
              <span className={`${sizeStyle.icon} ${style.icon}`}>{icon}</span>
            ) : (
              <div className={style.icon}>{icon}</div>
            )}
          </div>
        )}
        
        <div className="flex-1">
          <h3 className={`${sizeStyle.title} font-semibold ${style.title} mb-2`}>{title}</h3>
          {description && (
            <div className={`${sizeStyle.desc} text-slate-300`}>
              {description}
            </div>
          )}
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default InfoCard; 