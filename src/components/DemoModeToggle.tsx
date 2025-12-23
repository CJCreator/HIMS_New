import { useState } from 'react';
import { Card, Button, Badge } from '@/components';
import { useRealtimeSimulation } from '@/hooks/useRealtimeSimulation';
import { mockDataService } from '@/services/mockDataService';

export function DemoModeToggle() {
  const { isRunning, start, stop } = useRealtimeSimulation(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    if (confirm('Reset all data to initial state?')) {
      mockDataService.resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <Card className="w-80 p-4 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-body font-medium">Demo Controls</h3>
            <Button variant="tertiary" size="sm" onClick={() => setIsExpanded(false)}>✕</Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-small">
              <span className="text-body-sm">Real-time Simulation</span>
              <Badge status={isRunning ? 'delivered' : 'pending'}>
                {isRunning ? 'Running' : 'Stopped'}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button 
                variant={isRunning ? 'secondary' : 'primary'} 
                size="sm" 
                className="flex-1"
                onClick={isRunning ? stop : start}
              >
                {isRunning ? '⏸ Pause' : '▶ Start'}
              </Button>
              <Button variant="secondary" size="sm" className="flex-1" onClick={handleReset}>
                🔄 Reset Data
              </Button>
            </div>

            <div className="pt-2 border-t border-neutral-200">
              <p className="text-xs text-neutral-600">
                Simulation updates every 8 seconds
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Button 
          variant="primary" 
          className="shadow-lg"
          onClick={() => setIsExpanded(true)}
        >
          🎮 Demo Controls
        </Button>
      )}
    </div>
  );
}
