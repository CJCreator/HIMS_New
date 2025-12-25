import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components';
import { SmartNotificationSystem } from '@/components/SmartNotificationSystem';
import { useNavigate } from 'react-router-dom';
import { mockDataService } from '@/services/mockDataService';
import { useRealtimeSimulation } from '@/hooks/useRealtimeSimulation';

export function EnhancedPharmacyDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pending: 0, processing: 0, completed: 0, avgTime: 12 });
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const { updateCount } = useRealtimeSimulation();

  useEffect(() => {
    const rxs = mockDataService.getPrescriptions();
    setPrescriptions(rxs.slice(0, 3));
    setStats({
      pending: rxs.filter((r: any) => r.status === 'pending').length,
      processing: rxs.filter((r: any) => r.status === 'processing').length,
      completed: rxs.filter((r: any) => r.status === 'completed').length,
      avgTime: 12
    });
  }, [updateCount]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Enhanced Pharmacy Dashboard</h1>
          <p className="text-sm text-neutral-600 mt-1">Real-time prescription processing</p>
        </div>
        <Button onClick={() => navigate('/pharmacist/prescriptions')}>
          View Queue
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-h2 text-warning">{stats.pending}</div>
          <div className="text-body text-neutral-600">Pending</div>
        </Card>
        <Card className="p-4">
          <div className="text-h2 text-info">{stats.processing}</div>
          <div className="text-body text-neutral-600">Processing</div>
        </Card>
        <Card className="p-4">
          <div className="text-h2 text-success">{stats.completed}</div>
          <div className="text-body text-neutral-600">Completed Today</div>
        </Card>
        <Card className="p-4 bg-success/10">
          <div className="text-h2 text-success">{stats.avgTime}m</div>
          <div className="text-body text-neutral-600">Avg Processing</div>
          <p className="text-xs text-success">↓ 40% faster</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Prescriptions - 2 columns */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-h3 text-neutral-900">Live Prescription Queue</h2>
            <Badge status="error">{stats.pending} New</Badge>
          </div>
          
          <div className="space-y-3">
            {prescriptions.map(rx => (
              <div 
                key={rx.id}
                className={`p-4 rounded-small border-l-4 ${
                  rx.priority === 'high' ? 'border-error bg-error/5' : 'border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-body font-medium">{rx.patientName}</h4>
                      {rx.priority === 'high' && <Badge status="error">HIGH PRIORITY</Badge>}
                    </div>
                    <p className="text-body-sm text-neutral-600">
                      Prescribed by {rx.doctor} • {rx.medications?.length || 0} medications
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm text-neutral-600">{Math.floor((Date.now() - rx.timestamp) / 60000)} min ago</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="primary" size="sm" onClick={() => navigate(`/pharmacist/prescriptions`)}>
                    Process Now
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/pharmacist/prescriptions/${rx.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Smart Notifications - 1 column */}
        <div>
          <SmartNotificationSystem />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-h4 text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/pharmacist/prescriptions')}>
            💊 Prescription Queue
          </Button>
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/pharmacist/inventory')}>
            📦 Inventory
          </Button>
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/pharmacist/medication-requests')}>
            📋 Med Requests
          </Button>
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/pharmacist/expiry-alerts')}>
            ⚠️ Expiry Alerts
          </Button>
        </div>
      </Card>
    </div>
  );
}
