import { useState, useEffect } from 'react';
import { Card, Button } from '@/components';
import { UnifiedPatientStatusDashboard } from '@/components/UnifiedPatientStatusDashboard';
import { SharedPatientContextPanel } from '@/components/SharedPatientContextPanel';
import { useNavigate } from 'react-router-dom';
import { mockDataService } from '@/services/mockDataService';
import { useRealtimeSimulation } from '@/hooks/useRealtimeSimulation';

export function EnhancedNurseDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, vitalsComplete: 0, pending: 0, readyForDoctor: 0 });
  const { updateCount } = useRealtimeSimulation();

  useEffect(() => {
    const patients = mockDataService.getPatients();
    setStats({
      total: patients.length,
      vitalsComplete: patients.filter((p: any) => p.currentStage !== 'Check-in' && p.currentStage !== 'Waiting Room').length,
      pending: patients.filter((p: any) => p.currentStage === 'Vitals Recording').length,
      readyForDoctor: patients.filter((p: any) => p.status === 'ready').length
    });
  }, [updateCount]);

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
          <div className="text-h2 text-nurse">{stats.total}</div>
          <div className="text-body text-neutral-600">Patients Today</div>
        </Card>
        <Card className="p-4">
          <div className="text-h2 text-success">{stats.vitalsComplete}</div>
          <div className="text-body text-neutral-600">Vitals Complete</div>
        </Card>
        <Card className="p-4">
          <div className="text-h2 text-warning">{stats.pending}</div>
          <div className="text-body text-neutral-600">Pending Vitals</div>
        </Card>
        <Card className="p-4 bg-success/10">
          <div className="text-h2 text-success">{stats.readyForDoctor}</div>
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
