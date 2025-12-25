import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { cache } from '@/utils/cache';

interface AutoSaveOptions {
  key: string;
  data: any;
  delay?: number;
  onSave?: (data: any) => void;
}

export function useAutoSave({ key, data, delay = 2000, onSave }: AutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<string>();

  useEffect(() => {
    const currentData = JSON.stringify(data);
    
    if (currentData === previousDataRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      cache.setLocal(key, data);
      onSave?.(data);
      previousDataRef.current = currentData;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, delay, onSave]);

  const clearSaved = () => {
    cache.removeLocal(key);
    previousDataRef.current = undefined;
  };

  const getSaved = () => {
    return cache.getLocal(key);
  };

  return { clearSaved, getSaved };
}
