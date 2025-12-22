import { useEffect, useState } from 'react';
import { Card, Badge } from '@/components';

interface RoleTask {
  role: string;
  task: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  startTime?: string;
  completionTime?: string;
  priority: 'low' | 'medium' | 'high';
}

interface ParallelProcessingOrchestratorProps {
  patientId: string;
  consultationData: any;
  onAllComplete: () => void;
}

export function ParallelProcessingOrchestrator({ 
  patientId, 
  consultationData, 
  onAllComplete 
}: ParallelProcessingOrchestratorProps) {
  const [tasks, setTasks] = useState<RoleTask[]>([
    { role: 'Pharmacy', task: 'Process prescription', status: 'pending', priority: 'high' },
    { role: 'Laboratory', task: 'Prepare test orders', status: 'pending', priority: 'high' },
    { role: 'Billing', task: 'Generate invoice', status: 'pending', priority: 'medium' },
    { role: 'Receptionist', task: 'Schedule follow-up', status: 'pending', priority: 'medium' }
  ]);

  useEffect(() => {
    // Simulate parallel processing
    const timer = setTimeout(() => {
      setTasks(prev => prev.map(task => ({
        ...task,
        status: 'processing',
        startTime: new Date().toLocaleTimeString()
      })));

      // Simulate completion at different times
      setTimeout(() => {
        setTasks(prev => prev.map((task, idx) => 
          idx < 2 ? { ...task, status: 'complete', completionTime: new Date().toLocaleTimeString() } : task
        ));
      }, 2000);

      setTimeout(() => {
        setTasks(prev => prev.map(task => ({
          ...task,
          status: 'complete',
          completionTime: new Date().toLocaleTimeString()
        })));
        onAllComplete();
      }, 4000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [onAllComplete]);

  const completedCount = tasks.filter(t => t.status === 'complete').length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <Card className="bg-info/10 border-info">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-h4 text-neutral-900">⚡ Parallel Processing Active</h3>
          <p className="text-body-sm text-neutral-600">
            {completedCount}/{tasks.length} tasks complete
          </p>
        </div>
        <Badge status={progress === 100 ? 'delivered' : 'pending'}>
          {Math.round(progress)}%
        </Badge>
      </div>

      <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
        <div 
          className="bg-info h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-small">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                task.status === 'complete' ? 'bg-success' :
                task.status === 'processing' ? 'bg-warning animate-pulse' :
                task.status === 'failed' ? 'bg-error' : 'bg-neutral-300'
              }`} />
              <div>
                <p className="text-body-sm font-medium">{task.role}</p>
                <p className="text-body-sm text-neutral-600">{task.task}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge status={
                task.status === 'complete' ? 'delivered' :
                task.status === 'processing' ? 'pending' : 'sent'
              }>
                {task.status}
              </Badge>
              {task.completionTime && (
                <p className="text-body-sm text-neutral-600 mt-1">{task.completionTime}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
