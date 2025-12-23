import { useEffect, useState } from 'react';
import { realtimeSimulator } from '@/utils/realtimeSimulator';

export const useRealtimeSimulation = (autoStart: boolean = true) => {
  const [isRunning, setIsRunning] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    if (autoStart) {
      realtimeSimulator.start();
      setIsRunning(true);
    }

    const unsubscribe = realtimeSimulator.subscribe(() => {
      setUpdateCount(prev => prev + 1);
    });

    return () => {
      unsubscribe();
      if (autoStart) {
        realtimeSimulator.stop();
      }
    };
  }, [autoStart]);

  const start = () => {
    realtimeSimulator.start();
    setIsRunning(true);
  };

  const stop = () => {
    realtimeSimulator.stop();
    setIsRunning(false);
  };

  return { isRunning, start, stop, updateCount };
};
