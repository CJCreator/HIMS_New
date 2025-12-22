import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  setTouched: <K extends keyof T>(field: K, touched?: boolean) => void;
  reset: (newValues?: Partial<T>) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  validateField: <K extends keyof T>(field: K) => string | undefined;
  validateForm: () => boolean;
}

/**
 * Custom hook for form state management with validation
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState(prev => ({ ...prev, [field]: value }));

    // Clear error when field changes
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setTouched = useCallback(<K extends keyof T>(field: K, touchedValue = true) => {
    setTouchedState(prev => ({ ...prev, [field]: touchedValue }));
  }, []);

  const reset = useCallback((newValues?: Partial<T>) => {
    setValuesState({ ...initialValues, ...newValues });
    setErrors({});
    setTouchedState({});
    setIsSubmitting(false);
  }, [initialValues]);

  const validateField = useCallback(<K extends keyof T>(field: K): string | undefined => {
    if (!validate) return undefined;

    const fieldErrors = validate(values);
    return fieldErrors[field];
  }, [validate, values]);

  const validateForm = useCallback((): boolean => {
    if (!validate) return true;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    // Mark all fields as touched to show errors
    const touchedFields = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);

    setTouchedState(touchedFields);

    return Object.keys(validationErrors).length === 0;
  }, [validate, values]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, values]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setValues,
    setError,
    setTouched,
    reset,
    handleSubmit,
    validateField,
    validateForm
  };
}