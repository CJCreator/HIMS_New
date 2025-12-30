import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { InputType } from '@/types';

interface InputProps extends Omit<HTMLMotionProps<'input'>, 'type' | 'children'> {
  type?: InputType;
  label?: string;
  error?: string;
  helperText?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  label,
  error,
  helperText,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId, props['aria-describedby']].filter(Boolean).join(' ') || undefined;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-body font-medium text-neutral-700 mb-1">
          {label}
          {props.required && <span className="text-error ml-1" aria-label="required">*</span>}
        </label>
      )}
      <motion.input
        ref={ref}
        id={inputId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={clsx(
          'block w-full px-3 py-2 border rounded-minimal shadow-sm text-body min-h-[40px]',
          'placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:ring-opacity-50',
          'transition-all duration-200',
          error 
            ? 'border-error text-error focus:ring-error focus:border-error' 
            : 'border-neutral-300',
          className
        )}
        {...props}
      />
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-body-sm text-error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {helperText && !error && (
        <p id={helperId} className="mt-1 text-body-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
});