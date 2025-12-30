import { Card, Button } from '@/components';
import { MetricCard } from '@/components/MetricCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaPills, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaUsersCog,
  FaBed,
  FaChartBar,
  FaCog
} from 'react-icons/fa';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { patients } = useSelector((state: RootState) => state.patients);
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const { alerts } = useSelector((state: RootState) => state.inventory);
  const { requests } = useSelector((state: RootState) => state.medication);
  
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
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
              icon={<FaCalendarAlt size={24} className="text-blue-600" />}
              value={scheduledToday}
              label="Scheduled Today"
              trend={`${completedToday} completed | ${inProgressToday} in progress`}
              trendUp={completedToday > scheduledToday * 0.8}
              trendIndicator={trends.appointments}
            />
            <MetricCard
              icon={<FaUsers size={24} className="text-green-600" />}
              value={patients.length}
              label="Total Active Patients"
              trend="Currently registered"
              trendUp={true}
              trendIndicator={trends.patients}
            />
            <MetricCard
              icon={<FaPills size={24} className="text-orange-600" />}
              value={pendingPrescriptions.length}
              label="Pending Prescriptions"
              trend={`${dispensedPrescriptions.length} dispensed | ${prescriptions.length} total`}
              trendUp={pendingPrescriptions.length < prescriptions.length * 0.3}
              trendIndicator={trends.prescriptions}
            />
            <MetricCard
              icon={<FaExclamationTriangle size={24} className="text-red-600" />}
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
                  <FaCheckCircle className="text-success mx-auto mb-2" size={32} />
                  <div className="text-body font-medium">Completed Today</div>
                  <div className="text-body-sm text-success">{completedToday} appointments</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {appointments.length > 0 ? Math.round((completedToday / appointments.length) * 100) : 0}% of total
                  </div>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-small">
                  <FaClock className="text-warning mx-auto mb-2" size={32} />
                  <div className="text-body font-medium">In Progress</div>
                  <div className="text-body-sm text-warning">{inProgressToday} appointments</div>
                  <div className="text-xs text-neutral-500 mt-1">Currently being served</div>
                </div>
                <div className="text-center p-4 bg-info/10 rounded-small">
                  <FaPills className="text-info mx-auto mb-2" size={32} />
                  <div className="text-body font-medium">Med Requests</div>
                  <div className="text-body-sm text-info">{pendingMedRequests.length} pending</div>
                  <div className="text-xs text-neutral-500 mt-1">Awaiting approval</div>
                </div>
              </div>
              
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
                  <FaUsersCog className="mr-2" size={16} />
                  Manage Users
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/admin/beds')}>
                  <FaBed className="mr-2" size={16} />
                  Bed Management
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/admin/analytics')}>
                  <FaChartBar className="mr-2" size={16} />
                  View Reports
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/admin/settings')}>
                  <FaCog className="mr-2" size={16} />
                  Settings
                </Button>
              </div>
              
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
