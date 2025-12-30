import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedIconProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  spin?: boolean;
  bounce?: boolean;
  pulse?: boolean;
}

export const AnimatedIcon = ({ 
  children, 
  className, 
  onClick, 
  spin, 
  bounce, 
  pulse 
}: AnimatedIconProps) => {
  const getAnimation = () => {
    if (spin) return { rotate: 360 };
    if (bounce) return { y: [0, -5, 0] };
    if (pulse) return { scale: [1, 1.1, 1] };
    return {};
  };

  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={spin || bounce || pulse ? getAnimation() : undefined}
      transition={
        spin ? { duration: 1, repeat: Infinity, ease: 'linear' } :
        bounce ? { duration: 0.5, repeat: Infinity } :
        pulse ? { duration: 2, repeat: Infinity } :
        { duration: 0.2 }
      }
    >
      {children}
    </motion.div>
  );
};
