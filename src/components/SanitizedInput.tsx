import React from 'react';
import { Input } from './Input';
import { sanitizeInput } from '../utils/sanitize';

interface SanitizedInputProps extends React.ComponentProps<typeof Input> {
  onSanitizedChange?: (value: string) => void;
}

export const SanitizedInput: React.FC<SanitizedInputProps> = ({
  onChange,
  onSanitizedChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    
    // Create new event with sanitized value
    const sanitizedEvent = {
      ...e,
      target: {
        ...e.target,
        value: sanitized
      }
    };
    
    onChange?.(sanitizedEvent as React.ChangeEvent<HTMLInputElement>);
    onSanitizedChange?.(sanitized);
  };

  return <Input {...props} onChange={handleChange} />;
};