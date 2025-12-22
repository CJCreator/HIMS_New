import { Card, Button, Badge } from '@/components';
import { UnifiedPatientStatusDashboard } from '@/components/UnifiedPatientStatusDashboard';
import { SharedPatientContextPanel } from '@/components/SharedPatientContextPanel';
import { useNavigate } from 'react-router-dom';

export function EnhancedNurseDashboard() {
  const navigate = useNavigate();

  const todayStats = {
    total: 12,
    vitalsComplete: 8,
    pending: 4,
    readyForDoctor: 3
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Enhanced Nurse Dashboard</h1>
          <p className="text-sm text-neutral-600 mt-1">Real-time patient coordination</p>
        </div>
        <Button onClick={() => navigate('/nurse/vitals/new')}>
          Record Vitals
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-h2 text-nurse">{todayStats.total}</div>
          <div className="text-body text-neutral-600">Patients Today</div>
        </Card>
        <Card className="p-4">
          <div className="text-h2 text-success">{todayStats.vitalsComplete}</div>
          <div className="text-body text-neutral-600">Vitals Complete</div>
        </Card>
        <Card className="p-4">
          <div className="text-h2 text-warning">{todayStats.pending}</div>
          <div className="text-body text-neutral-600">Pending Vitals</div>
        </Card>
        <Card className="p-4 bg-success/10">
          <div className="text-h2 text-success">{todayStats.readyForDoctor}</div>
          <div className="text-body text-neutral-600">Ready for Doctor</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Status - 2 columns */}
        <div className="lg:col-span-2">
          <UnifiedPatientStatusDashboard />
        </div>

        {/* Shared Context Panel - 1 column */}
        <div>
          <SharedPatientContextPanel patientId="P001" currentRole="nurse" />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-h4 text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/nurse/vitals/new')}>
            📊 Record Vitals
          </Button>
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/nurse/patients')}>
            👥 Patient Records
          </Button>
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/nurse/medication-requests')}>
            💊 Medication Requests
          </Button>
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/nurse/wards')}>
            📋 Ward Management
          </Button>
        </div>
      </Card>
    </div>
  );
}
