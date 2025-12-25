import { useState, useMemo } from 'react';
import { Card, Button, Badge } from '@/components';
import { NotificationDetailModal } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import type { Notification } from '@/types';

export function EnhancedPharmacyDashboard() {
  const navigate = useNavigate();
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const stats = useMemo(() => ({
    pending: prescriptions.filter(r => r.status === 'pending').length,
    processing: prescriptions.filter(r => r.status === 'processing').length,
    completed: prescriptions.filter(r => r.status === 'ready' || r.status === 'dispensed').length,
    avgTime: 12
  }), [prescriptions]);

  const recentPrescriptions = useMemo(() => 
    prescriptions.filter(p => p.status === 'pending' || p.status === 'processing').slice(0, 3),
    [prescriptions]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pharmacy Dashboard</h1>
          <p className="text-sm text-neutral-600 mt-1">Real-time prescription processing</p>
        </div>
        <Button onClick={() => navigate('/pharmacist/prescriptions')}>
          View Queue
        </Button>
      </div>

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
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-h3 text-neutral-900">Live Prescription Queue</h2>
            <Badge status="error">{stats.pending} New</Badge>
          </div>
          
          <div className="space-y-3">
            {recentPrescriptions.length === 0 ? (
              <p className="text-body-sm text-neutral-500 text-center py-8">No pending prescriptions</p>
            ) : (
              recentPrescriptions.map(rx => (
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
                        Prescribed by {rx.doctorName} • {rx.medications?.length || 0} medications
                      </p>
                    </div>
                    <Badge status={rx.status === 'pending' ? 'pending' : 'sent'}>{rx.status}</Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="primary" size="sm" onClick={() => navigate('/pharmacist/prescriptions')}>
                      Process Now
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => navigate('/pharmacist/prescriptions')}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-h4 text-neutral-900 mb-4">Recent Notifications</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.slice(0, 5).map(notif => (
              <div 
                key={notif.id} 
                className="p-3 bg-neutral-50 rounded-small cursor-pointer hover:bg-neutral-100"
                onClick={() => setSelectedNotification(notif)}
              >
                <p className="text-body-sm font-medium">{notif.title}</p>
                <p className="text-body-sm text-neutral-600">{notif.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

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

      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
}
