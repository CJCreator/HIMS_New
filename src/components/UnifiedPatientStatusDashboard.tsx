import { Card, Badge } from '@/components';

interface PatientStatus {
  id: string;
  name: string;
  currentStage: string;
  status: 'ready' | 'in-progress' | 'waiting' | 'delayed';
  assignedDoctor: string;
  waitTime: number;
  priority: 'normal' | 'urgent' | 'critical';
  nextAction: string;
}

export function UnifiedPatientStatusDashboard() {
  const patients: PatientStatus[] = [
    {
      id: 'P001',
      name: 'John Smith',
      currentStage: 'Consultation',
      status: 'in-progress',
      assignedDoctor: 'Dr. Wilson',
      waitTime: 5,
      priority: 'normal',
      nextAction: 'Prescription pending'
    },
    {
      id: 'P002',
      name: 'Sarah Johnson',
      currentStage: 'Vitals Recording',
      status: 'in-progress',
      assignedDoctor: 'Dr. Brown',
      waitTime: 12,
      priority: 'urgent',
      nextAction: 'Waiting for nurse'
    },
    {
      id: 'P003',
      name: 'Mike Davis',
      currentStage: 'Pharmacy',
      status: 'waiting',
      assignedDoctor: 'Dr. Wilson',
      waitTime: 8,
      priority: 'normal',
      nextAction: 'Prescription processing'
    },
    {
      id: 'P004',
      name: 'Emily Chen',
      currentStage: 'Check-in',
      status: 'ready',
      assignedDoctor: 'Dr. Brown',
      waitTime: 2,
      priority: 'critical',
      nextAction: 'Ready for vitals'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-success';
      case 'in-progress': return 'bg-warning';
      case 'waiting': return 'bg-info';
      case 'delayed': return 'bg-error';
      default: return 'bg-neutral-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return '🟢';
      case 'in-progress': return '🟡';
      case 'waiting': return '🔴';
      case 'delayed': return '⚫';
      default: return '⚪';
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h3 text-neutral-900">Live Patient Journey Map</h2>
        <div className="flex gap-2 text-body-sm">
          <span>🟢 Ready</span>
          <span>🟡 In Progress</span>
          <span>🔴 Waiting</span>
          <span>⚫ Delayed</span>
        </div>
      </div>

      <div className="space-y-3">
        {patients.map(patient => (
          <div 
            key={patient.id}
            className={`p-4 rounded-small border-l-4 ${
              patient.priority === 'critical' ? 'border-error bg-error/5' :
              patient.priority === 'urgent' ? 'border-warning bg-warning/5' :
              'border-neutral-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getStatusIcon(patient.status)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-body font-medium">{patient.name}</h4>
                    <span className="text-body-sm text-neutral-600">({patient.id})</span>
                    {patient.priority !== 'normal' && (
                      <Badge status={patient.priority === 'critical' ? 'error' : 'pending'}>
                        {patient.priority.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-body-sm text-neutral-600">{patient.assignedDoctor}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-body-sm font-medium">{patient.currentStage}</p>
                <p className="text-body-sm text-neutral-600">Wait: {patient.waitTime} min</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200">
              <p className="text-body-sm text-neutral-700">Next: {patient.nextAction}</p>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(patient.status)} animate-pulse`} />
            </div>
          </div>
        ))}
      </div>

      {/* Queue Statistics */}
      <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-neutral-200">
        <div className="text-center">
          <p className="text-h4 text-success">1</p>
          <p className="text-body-sm text-neutral-600">Ready</p>
        </div>
        <div className="text-center">
          <p className="text-h4 text-warning">2</p>
          <p className="text-body-sm text-neutral-600">In Progress</p>
        </div>
        <div className="text-center">
          <p className="text-h4 text-info">1</p>
          <p className="text-body-sm text-neutral-600">Waiting</p>
        </div>
        <div className="text-center">
          <p className="text-h4 text-neutral-700">15 min</p>
          <p className="text-body-sm text-neutral-600">Avg Wait</p>
        </div>
      </div>
    </Card>
  );
}
