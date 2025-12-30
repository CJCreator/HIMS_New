import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: (e?: React.MouseEvent) => void;
}

export function Card({ 
  children, 
  className, 
  padding = 'md',
  shadow = 'md',
  onClick
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={onClick ? { y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } : {}}
      className={clsx(
        'bg-white rounded-small border border-neutral-200',
        paddingClasses[padding],
        shadowClasses[shadow],
        onClick && 'cursor-pointer transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}