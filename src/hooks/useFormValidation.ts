import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  custom?: (value: any) => string | null;
}

export interface FieldState {
  value: any;
  error: string | null;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, ValidationRule>
) {
  const [fields, setFields] = useState<Record<keyof T, FieldState>>(() =>
    Object.keys(initialValues).reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: initialValues[key],
        error: null,
        isValid: true,
        isDirty: false,
        isTouched: false,
      },
    }), {} as Record<keyof T, FieldState>)
  );

  const validateField = useCallback((name: keyof T, value: any): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;

    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'This field is required';
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return `Minimum ${rules.minLength} characters required`;
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      return `Maximum ${rules.maxLength} characters allowed`;
    }

    if (rules.min !== undefined && value < rules.min) {
      return `Minimum value is ${rules.min}`;
    }

    if (rules.max !== undefined && value > rules.max) {
      return `Maximum value is ${rules.max}`;
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [validationRules]);

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    const error = validateField(name, value);
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error,
        isValid: !error,
        isDirty: true,
      },
    }));
  }, [validateField]);

  const setFieldTouched = useCallback((name: keyof T) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        isTouched: true,
      },
    }));
  }, []);

  const validateAll = useCallback((): boolean => {
    let isFormValid = true;
    const newFields = { ...fields };

    Object.keys(fields).forEach((key) => {
      const error = validateField(key as keyof T, fields[key as keyof T].value);
      newFields[key as keyof T] = {
        ...newFields[key as keyof T],
        error,
        isValid: !error,
        isTouched: true,
      };
      if (error) isFormValid = false;
    });

    setFields(newFields);
    return isFormValid;
  }, [fields, validateField]);

  const reset = useCallback(() => {
    setFields(
      Object.keys(initialValues).reduce((acc, key) => ({
        ...acc,
        [key]: {
          value: initialValues[key],
          error: null,
          isValid: true,
          isDirty: false,
          isTouched: false,
        },
      }), {} as Record<keyof T, FieldState>)
    );
  }, [initialValues]);

  const getValues = useCallback((): T => {
    return Object.keys(fields).reduce((acc, key) => ({
      ...acc,
      [key]: fields[key as keyof T].value,
    }), {} as T);
  }, [fields]);

  return {
    fields,
    setFieldValue,
    setFieldTouched,
    validateAll,
    reset,
    getValues,
    isValid: Object.values(fields).every((f: any) => f.isValid),
    isDirty: Object.values(fields).some((f: any) => f.isDirty),
  };
}
