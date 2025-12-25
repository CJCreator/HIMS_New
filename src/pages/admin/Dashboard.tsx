import { Card, Button } from '@/components';
import { MetricCard } from '@/components/MetricCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { patients } = useSelector((state: RootState) => state.patients);
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const { alerts } = useSelector((state: RootState) => state.inventory);
  const { requests } = useSelector((state: RootState) => state.medication);
  
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Real-time update timer
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);
  
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);
  const scheduledToday = todayAppointments.filter(a => a.status === 'scheduled').length;
  const completedToday = todayAppointments.filter(a => a.status === 'completed').length;
  const inProgressToday = todayAppointments.filter(a => a.status === 'in-progress').length;
  
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');
  const dispensedPrescriptions = prescriptions.filter(p => p.status === 'dispensed');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const pendingMedRequests = requests.filter(r => r.status === 'request' || r.status === 'pending');
  
  // Mock trend data for demonstration
  const trends = {
    appointments: { value: -12, label: 'vs yesterday' },
    patients: { value: 5, label: 'vs last week' },
    prescriptions: { value: 8, label: 'vs yesterday' },
    alerts: { value: -3, label: 'vs yesterday' }
  };
  
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };
  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, Admin!</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span>Last updated {formatTimeAgo(lastUpdated)}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Data
          </span>
        </div>
      </div>
      <div className="space-y-6">
        <Card>
          <p className="text-body text-neutral-600 mb-6">
            Here's a snapshot of today's hospital activity
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              icon="📅"
              value={scheduledToday}
              label="Scheduled Today"
              trend={`${completedToday} completed | ${inProgressToday} in progress`}
              trendUp={completedToday > scheduledToday * 0.8}
              trendIndicator={trends.appointments}
            />
            <MetricCard
              icon="👥"
              value={patients.length}
              label="Total Active Patients"
              trend="Currently registered"
              trendUp={true}
              trendIndicator={trends.patients}
            />
            <MetricCard
              icon="💊"
              value={pendingPrescriptions.length}
              label="Pending Prescriptions"
              trend={`${dispensedPrescriptions.length} dispensed | ${prescriptions.length} total`}
              trendUp={pendingPrescriptions.length < prescriptions.length * 0.3}
              trendIndicator={trends.prescriptions}
            />
            <MetricCard
              icon="⚠️"
              value={criticalAlerts.length}
              label="Critical Alerts"
              trend="Requires immediate attention"
              trendUp={criticalAlerts.length === 0}
              trendIndicator={trends.alerts}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <h3 className="text-h4 text-neutral-900 mb-4">System Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-success/10 rounded-small">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="text-body font-medium">Completed Today</div>
                  <div className="text-body-sm text-success">{completedToday} appointments</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {appointments.length > 0 ? Math.round((completedToday / appointments.length) * 100) : 0}% of total
                  </div>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-small">
                  <div className="text-2xl mb-2">⏳</div>
                  <div className="text-body font-medium">In Progress</div>
                  <div className="text-body-sm text-warning">{inProgressToday} appointments</div>
                  <div className="text-xs text-neutral-500 mt-1">Currently being served</div>
                </div>
                <div className="text-center p-4 bg-info/10 rounded-small">
                  <div className="text-2xl mb-2">💊</div>
                  <div className="text-body font-medium">Med Requests</div>
                  <div className="text-body-sm text-info">{pendingMedRequests.length} pending</div>
                  <div className="text-xs text-neutral-500 mt-1">Awaiting approval</div>
                </div>
              </div>
              
              {/* Additional Metrics Row */}
              <div className="mt-6 pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Key Performance Indicators</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Bed Occupancy Rate</span>
                    <span className="text-sm font-medium text-success">75% (18/24 beds)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Staff Efficiency</span>
                    <span className="text-sm font-medium text-primary-600">92% average</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Patient Satisfaction</span>
                    <span className="text-sm font-medium text-success">NPS 67 (Excellent)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">No-Show Rate</span>
                    <span className="text-sm font-medium text-warning">6.8% (below target)</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-h4 text-neutral-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="primary" className="w-full justify-start" onClick={() => navigate('/admin/users')}>
                  👥 Manage Users
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/admin/beds')}>
                  🛏️ Bed Management
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/admin/analytics')}>
                  📊 View Reports
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/admin/settings')}>
                  ⚙️ Settings
                </Button>
              </div>
              
              {/* Critical Alerts Summary */}
              <div className="mt-6 pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Critical Alerts</h4>
                <div className="space-y-2">
                  {criticalAlerts.length > 0 ? (
                    criticalAlerts.slice(0, 3).map((alert, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-error/10 rounded text-xs">
                        <div className="w-2 h-2 bg-error rounded-full"></div>
                        <span className="text-error-700 truncate">Critical Stock Alert</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-success/10 rounded text-xs">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-success-700">All systems operational</span>
                    </div>
                  )}
                  {criticalAlerts.length > 3 && (
                    <div className="text-xs text-neutral-500 text-center">
                      +{criticalAlerts.length - 3} more alerts
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
}