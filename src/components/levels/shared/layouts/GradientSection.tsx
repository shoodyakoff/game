import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface GradientSectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  colorScheme?: 'indigo' | 'purple' | 'blue' | 'emerald' | 'amber' | 'slate';
  bordered?: boolean;
  rounded?: boolean;
  withAnimation?: boolean;
  animationDelay?: number;
}

const colorSchemes = {
  indigo: {
    bg: 'from-indigo-900/30 to-indigo-950/50',
    border: 'border-indigo-700/40',
    title: 'text-indigo-300',
    subtitle: 'text-indigo-400',
    highlight: 'bg-indigo-500/10',
    shadow: 'shadow-indigo-900/20'
  },
  purple: {
    bg: 'from-purple-900/30 to-purple-950/50',
    border: 'border-purple-700/40',
    title: 'text-purple-300',
    subtitle: 'text-purple-400',
    highlight: 'bg-purple-500/10',
    shadow: 'shadow-purple-900/20'
  },
  blue: {
    bg: 'from-blue-900/30 to-blue-950/50',
    border: 'border-blue-700/40',
    title: 'text-blue-300',
    subtitle: 'text-blue-400',
    highlight: 'bg-blue-500/10',
    shadow: 'shadow-blue-900/20'
  },
  emerald: {
    bg: 'from-emerald-900/30 to-emerald-950/50',
    border: 'border-emerald-700/40',
    title: 'text-emerald-300',
    subtitle: 'text-emerald-400',
    highlight: 'bg-emerald-500/10',
    shadow: 'shadow-emerald-900/20'
  },
  amber: {
    bg: 'from-amber-900/30 to-amber-950/50',
    border: 'border-amber-700/40',
    title: 'text-amber-300',
    subtitle: 'text-amber-400',
    highlight: 'bg-amber-500/10',
    shadow: 'shadow-amber-900/20'
  },
  slate: {
    bg: 'from-slate-800/80 to-slate-900/90',
    border: 'border-slate-700/40',
    title: 'text-white',
    subtitle: 'text-slate-400',
    highlight: 'bg-slate-500/10',
    shadow: 'shadow-slate-900/20'
  }
};

const GradientSection: React.FC<GradientSectionProps> = ({
  title,
  subtitle,
  children,
  className = '',
  colorScheme = 'indigo',
  bordered = true,
  rounded = true,
  withAnimation = false,
  animationDelay = 0
}) => {
  const colors = colorSchemes[colorScheme];
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: animationDelay,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  const Component = withAnimation ? motion.div : 'div';
  const animationProps = withAnimation ? {
    initial: "hidden",
    animate: "visible",
    variants: containerVariants
  } : {};
  
  return (
    <Component 
      className={`
        bg-gradient-to-br ${colors.bg}
        ${bordered ? `border ${colors.border}` : ''}
        ${rounded ? 'rounded-lg' : ''}
        p-6 relative overflow-hidden shadow-xl ${colors.shadow}
        ${className}
      `}
      {...animationProps}
    >
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 -translate-y-16 translate-x-16 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 translate-y-12 -translate-x-12 bg-gradient-to-br from-white/3 to-white/0 rounded-full blur-2xl" />
      
      {/* Заголовки */}
      {(title || subtitle) && (
        <div className="mb-6 relative z-10">
          {title && (
            <motion.h2 
              className={`text-2xl font-bold ${colors.title} mb-2`}
              {...(withAnimation ? { variants: childVariants } : {})}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p 
              className={`${colors.subtitle}`}
              {...(withAnimation ? { variants: childVariants } : {})}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      
      {/* Основное содержимое */}
      <div className="relative z-10">
        {withAnimation ? (
          <motion.div variants={childVariants}>
            {children}
          </motion.div>
        ) : (
          children
        )}
      </div>
    </Component>
  );
};

export default GradientSection; 