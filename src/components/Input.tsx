import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { InputType } from '@/types';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
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
      <input
        ref={ref}
        id={inputId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={clsx(
          'block w-full px-3 py-2 border rounded-minimal shadow-sm text-body min-h-[40px]',
          'placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:ring-opacity-50',
          error 
            ? 'border-error text-error focus:ring-error focus:border-error' 
            : 'border-neutral-300',
          className
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-body-sm text-error" role="alert" aria-live="polite">{error}</p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1 text-body-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
});