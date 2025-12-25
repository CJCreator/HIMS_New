import { HTMLAttributes, forwardRef } from 'react';
import { responsiveClasses } from '@/utils/responsive';

interface ResponsiveCardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
}

export const ResponsiveCard = forwardRef<HTMLDivElement, ResponsiveCardProps>(
  ({ padding = 'md', hoverable = false, clickable = false, className = '', children, ...props }, ref) => {
    const baseClasses = 'bg-white rounded-lg border border-neutral-200 shadow-sm';
    
    const paddingClasses = {
      none: '',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
    };

    const interactionClasses = hoverable ? 'hover:shadow-md transition-shadow' : '';
    const clickableClasses = clickable ? 'cursor-pointer active:scale-[0.98] transition-transform' : '';

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${paddingClasses[padding]} ${interactionClasses} ${clickableClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveCard.displayName = 'ResponsiveCard';
