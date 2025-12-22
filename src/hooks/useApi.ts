import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/notificationSlice';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  const dispatch = useDispatch();

  const execute = useCallback(async (
    apiCall: () => Promise<{ data: T; message?: string }>,
    options?: {
      showSuccessNotification?: boolean;
      showErrorNotification?: boolean;
      successMessage?: string;
    }
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      setState({ data: response.data, loading: false, error: null });

      if (options?.showSuccessNotification) {
        dispatch(addNotification({
          type: 'success',
          title: 'Success',
          message: options.successMessage || response.message || 'Operation completed successfully',
          priority: 'medium',
          category: 'system'
        }));
      }

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));

      if (options?.showErrorNotification !== false) {
        dispatch(addNotification({
          type: 'error',
          title: 'Error',
          message: errorMessage,
          priority: 'high',
          category: 'system'
        }));
      }

      throw error;
    }
  }, [dispatch]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}