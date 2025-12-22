import { useEffect, useState } from 'react';

interface QueueUpdate {
  patientId: string;
  position: number;
  estimatedWait: number;
  status: 'waiting' | 'called' | 'in-progress' | 'completed';
  timestamp: string;
}

export const useQueueWebSocket = (patientId: string) => {
  const [queueData, setQueueData] = useState<QueueUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true);

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setQueueData(prev => {
        if (!prev) {
          return {
            patientId,
            position: Math.floor(Math.random() * 10) + 1,
            estimatedWait: Math.floor(Math.random() * 30) + 10,
            status: 'waiting',
            timestamp: new Date().toISOString()
          };
        }

        // Simulate position decreasing
        const newPosition = Math.max(1, prev.position - 1);
        const newWait = Math.max(5, prev.estimatedWait - 5);

        return {
          ...prev,
          position: newPosition,
          estimatedWait: newWait,
          status: newPosition === 1 ? 'called' : 'waiting',
          timestamp: new Date().toISOString()
        };
      });
    }, 30000); // Update every 30 seconds

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [patientId]);

  return { queueData, isConnected };
};
