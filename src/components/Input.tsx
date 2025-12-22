import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { InputType } from '@/types';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: InputType;
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  label,
  error,
  helperText,
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-body font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={clsx(
          'block w-full px-3 py-2 border rounded-minimal shadow-sm text-body',
          'placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error 
            ? 'border-error text-error focus:ring-error focus:border-error' 
            : 'border-neutral-300',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-body-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-body-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
});