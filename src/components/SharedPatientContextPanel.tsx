import { Card, Badge, Button } from '@/components';

interface SharedPatientContextPanelProps {
  patientId: string;
  currentRole: 'doctor' | 'nurse' | 'pharmacy' | 'receptionist';
}

export function SharedPatientContextPanel({ patientId, currentRole }: SharedPatientContextPanelProps) {
  const patientData = {
    id: 'P001',
    name: 'John Smith',
    age: 45,
    status: 'in-consultation',
    location: 'Consultation Room 2',
    waitTime: 15,
    priority: 'normal',
    allergies: ['Penicillin', 'Sulfa drugs'],
    currentMedications: ['Metformin 500mg', 'Lisinopril 10mg']
  };

  const recentActivities = [
    { time: '10:15 AM', role: 'Doctor', action: 'Started consultation', status: 'in-progress' },
    { time: '10:05 AM', role: 'Nurse', action: 'Completed vitals recording', status: 'complete' },
    { time: '09:50 AM', role: 'Receptionist', action: 'Patient checked in', status: 'complete' }
  ];

  const roleSpecificActions = {
    doctor: [
      { label: 'Start Consultation', icon: '👨‍⚕️' },
      { label: 'View History', icon: '📋' },
      { label: 'Order Tests', icon: '🔬' }
    ],
    nurse: [
      { label: 'Record Vitals', icon: '📊' },
      { label: 'Update Status', icon: '✏️' },
      { label: 'View Orders', icon: '📝' }
    ],
    pharmacy: [
      { label: 'View Prescriptions', icon: '💊' },
      { label: 'Check Interactions', icon: '⚠️' },
      { label: 'Dispense Medication', icon: '✅' }
    ],
    receptionist: [
      { label: 'Check In', icon: '✓' },
      { label: 'Schedule Follow-up', icon: '📅' },
      { label: 'Process Billing', icon: '💰' }
    ]
  };

  return (
    <Card className="sticky top-4">
      <h3 className="text-h4 text-neutral-900 mb-3">Patient Context</h3>
      
      {/* Current Status Summary */}
      <div className="p-3 bg-primary-50 rounded-small mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-body font-medium">{patientData.name}</h4>
          <Badge status="pending">{patientData.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-body-sm">
          <div>
            <span className="text-neutral-600">Location:</span>
            <p className="font-medium">{patientData.location}</p>
          </div>
          <div>
            <span className="text-neutral-600">Wait Time:</span>
            <p className="font-medium">{patientData.waitTime} min</p>
          </div>
        </div>
      </div>

      {/* Critical Information */}
      <div className="mb-3">
        <p className="text-body-sm font-medium text-neutral-700 mb-1">⚠️ Critical Info</p>
        <div className="space-y-1">
          <div className="p-2 bg-error/10 rounded-small">
            <p className="text-body-sm font-medium text-error">Allergies</p>
            <p className="text-body-sm">{patientData.allergies.join(', ')}</p>
          </div>
          <div className="p-2 bg-info/10 rounded-small">
            <p className="text-body-sm font-medium text-info">Current Medications</p>
            <p className="text-body-sm">{patientData.currentMedications.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Recent Activities Timeline */}
      <div className="mb-3">
        <p className="text-body-sm font-medium text-neutral-700 mb-2">Recent Activities</p>
        <div className="space-y-2">
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 bg-neutral-50 rounded-small">
              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                activity.status === 'complete' ? 'bg-success' : 'bg-warning'
              }`} />
              <div className="flex-1">
                <p className="text-body-sm font-medium">{activity.action}</p>
                <p className="text-body-sm text-neutral-600">{activity.role} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role-Specific Quick Actions */}
      <div>
        <p className="text-body-sm font-medium text-neutral-700 mb-2">Quick Actions</p>
        <div className="space-y-2">
          {roleSpecificActions[currentRole].map((action, idx) => (
            <Button 
              key={idx}
              variant="secondary" 
              size="sm"
              className="w-full justify-start"
            >
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Collaboration Notes */}
      <div className="mt-3 pt-3 border-t border-neutral-200">
        <p className="text-body-sm font-medium text-neutral-700 mb-2">Collaboration Notes</p>
        <textarea 
          className="w-full p-2 text-body-sm border border-neutral-300 rounded-small"
          placeholder="Add notes for other roles..."
          rows={3}
        />
        <Button variant="primary" size="sm" className="w-full mt-2">
          Share Note
        </Button>
      </div>
    </Card>
  );
}
