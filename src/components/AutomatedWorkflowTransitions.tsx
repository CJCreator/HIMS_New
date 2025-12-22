import { Card, Badge, Button } from '@/components';

interface WorkflowStage {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'active' | 'complete' | 'blocked';
  estimatedTime: string;
  actualTime?: string;
  dependencies: string[];
  autoTransition: boolean;
}

interface AutomatedWorkflowTransitionsProps {
  patientId: string;
  onStageComplete: (stageId: string) => void;
}

export function AutomatedWorkflowTransitions({ patientId, onStageComplete }: AutomatedWorkflowTransitionsProps) {
  const stages: WorkflowStage[] = [
    {
      id: 'checkin',
      name: 'Patient Check-in',
      role: 'Receptionist',
      status: 'complete',
      estimatedTime: '2 min',
      actualTime: '1.5 min',
      dependencies: [],
      autoTransition: true
    },
    {
      id: 'vitals',
      name: 'Vitals Recording',
      role: 'Nurse',
      status: 'complete',
      estimatedTime: '5 min',
      actualTime: '4 min',
      dependencies: ['checkin'],
      autoTransition: true
    },
    {
      id: 'consultation',
      name: 'Doctor Consultation',
      role: 'Doctor',
      status: 'active',
      estimatedTime: '8 min',
      dependencies: ['vitals'],
      autoTransition: true
    },
    {
      id: 'pharmacy',
      name: 'Prescription Processing',
      role: 'Pharmacist',
      status: 'pending',
      estimatedTime: '10 min',
      dependencies: ['consultation'],
      autoTransition: true
    },
    {
      id: 'lab',
      name: 'Lab Sample Collection',
      role: 'Lab Tech',
      status: 'pending',
      estimatedTime: '5 min',
      dependencies: ['consultation'],
      autoTransition: true
    },
    {
      id: 'billing',
      name: 'Payment Processing',
      role: 'Receptionist',
      status: 'pending',
      estimatedTime: '3 min',
      dependencies: ['pharmacy', 'lab'],
      autoTransition: true
    }
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h4 text-neutral-900">🔄 Automated Workflow</h3>
        <Badge status="pending">Auto-Transition Enabled</Badge>
      </div>

      <div className="space-y-3">
        {stages.map((stage, idx) => (
          <div key={stage.id}>
            <div className={`p-3 rounded-small border-l-4 ${
              stage.status === 'complete' ? 'bg-success/10 border-success' :
              stage.status === 'active' ? 'bg-warning/10 border-warning' :
              stage.status === 'blocked' ? 'bg-error/10 border-error' :
              'bg-neutral-50 border-neutral-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {stage.status === 'complete' ? '✅' :
                     stage.status === 'active' ? '🔄' :
                     stage.status === 'blocked' ? '🚫' : '⏳'}
                  </span>
                  <div>
                    <p className="text-body font-medium">{stage.name}</p>
                    <p className="text-body-sm text-neutral-600">{stage.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge status={
                    stage.status === 'complete' ? 'delivered' :
                    stage.status === 'active' ? 'pending' : 'sent'
                  }>
                    {stage.status}
                  </Badge>
                  <p className="text-body-sm text-neutral-600 mt-1">
                    {stage.actualTime || stage.estimatedTime}
                  </p>
                </div>
              </div>
              
              {stage.autoTransition && stage.status === 'active' && (
                <div className="mt-2 pt-2 border-t border-neutral-200">
                  <p className="text-body-sm text-info">
                    ⚡ Will auto-transition to next stage on completion
                  </p>
                </div>
              )}
            </div>
            
            {idx < stages.length - 1 && (
              <div className="flex justify-center py-1">
                <div className={`w-0.5 h-4 ${
                  stages[idx + 1].status !== 'pending' ? 'bg-success' : 'bg-neutral-300'
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-primary-50 rounded-small">
        <p className="text-body-sm font-medium mb-1">Escalation Rules Active</p>
        <ul className="text-body-sm text-neutral-600 space-y-1">
          <li>• Auto-escalate if stage exceeds estimated time by 50%</li>
          <li>• Notify supervisor if blocked for &gt;5 minutes</li>
          <li>• Priority patients bypass standard queue</li>
        </ul>
      </div>
    </Card>
  );
}
