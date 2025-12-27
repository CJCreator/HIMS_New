import React, { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { InteractiveChart } from './charts/InteractiveChart';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Bed,
  TrendingUp,
  Zap,
  Bell,
  BellOff
} from 'lucide-react';

interface Metric {
  id: string;
  label: string;
  value: number | string;
  previousValue?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
  icon: React.ReactNode;
  description?: string;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  source: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface RealTimeDashboardProps {
  role: 'doctor' | 'nurse' | 'admin' | 'receptionist';
  refreshInterval?: number; // in milliseconds
  showAlerts?: boolean;
  compact?: boolean;
}

export function RealTimeDashboard({
  role,
  refreshInterval = 30000, // 30 seconds
  showAlerts = true,
  compact = false
}: RealTimeDashboardProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // WebSocket connection for real-time updates
  const { sendMessage, lastMessage, readyState } = useWebSocket('/ws/dashboard', {
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
    onMessage: (message) => {
      handleWebSocketMessage(message);
    },
  });

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((message: MessageEvent) => {
    try {
      const data = JSON.parse(message.data);

      switch (data.type) {
        case 'metrics_update':
          setMetrics(data.metrics);
          setLastUpdate(new Date());
          break;
        case 'alert':
          const newAlert: Alert = {
            id: data.id,
            type: data.alertType,
            title: data.title,
            message: data.message,
            timestamp: new Date(data.timestamp),
            acknowledged: false,
            source: data.source,
            priority: data.priority,
          };
          setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts

          // Show browser notification if enabled
          if (notificationsEnabled && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification(newAlert.title, {
                body: newAlert.message,
                icon: '/favicon.ico',
                tag: newAlert.id,
              });
            }
          }
          break;
        case 'metric_update':
          setMetrics(prev => prev.map(metric =>
            metric.id === data.metricId
              ? { ...metric, value: data.value, previousValue: typeof metric.value === 'number' ? metric.value : undefined }
              : metric
          ));
          break;
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [notificationsEnabled]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Initialize metrics based on role
  useEffect(() => {
    const initialMetrics = getRoleMetrics(role);
    setMetrics(initialMetrics);
  }, [role]);

  // Periodic refresh fallback
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isConnected) {
        // Fallback to polling if WebSocket is disconnected
        fetchMetrics();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isConnected, refreshInterval]);

  const fetchMetrics = async () => {
    try {
      // Mock API call - replace with actual API
      const response = await fetch(`/api/dashboard/metrics?role=${role}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getStatusColor = (status: Metric['status']) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <div className="space-y-6">
      {/* Connection Status & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              notificationsEnabled
                ? 'text-blue-600 hover:bg-blue-50'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
            title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`p-4 rounded-lg border transition-all hover:shadow-md ${getStatusColor(metric.status)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white bg-opacity-50">
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                  <p className="text-2xl font-bold">
                    {metric.value}
                    {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                  </p>
                </div>
              </div>

              {metric.trend && (
                <div className={`flex items-center ${
                  metric.trend === 'up' ? 'text-green-600' :
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <TrendingUp
                    className={`w-4 h-4 ${
                      metric.trend === 'down' ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              )}
            </div>

            {metric.description && (
              <p className="text-xs text-gray-600 mt-2">{metric.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      {!compact && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InteractiveChart
            data={getChartData('patientVolume')}
            type="line"
            title="Patient Volume Trend"
            xAxisKey="time"
            yAxisKeys={['patients']}
            realTime={true}
            height={300}
          />
          <InteractiveChart
            data={getChartData('waitTimes')}
            type="bar"
            title="Average Wait Times"
            xAxisKey="department"
            yAxisKeys={['waitTime']}
            realTime={true}
            height={300}
          />
        </div>
      )}

      {/* Alerts Section */}
      {showAlerts && unacknowledgedAlerts.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Active Alerts ({unacknowledgedAlerts.length})
              </h3>
              <button
                onClick={() => setAlerts([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {unacknowledgedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border-b border-gray-100 ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{alert.title}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{alert.source}</span>
                      <span>{alert.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Acknowledge"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                      title="Dismiss"
                    >
                      <Activity className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getRoleMetrics(role: string): Metric[] {
  const baseMetrics: Metric[] = [
    {
      id: 'active-patients',
      label: 'Active Patients',
      value: 0,
      unit: '',
      status: 'normal',
      icon: <Users className="w-5 h-5" />,
      description: 'Currently admitted patients',
    },
    {
      id: 'bed-occupancy',
      label: 'Bed Occupancy',
      value: 0,
      unit: '%',
      status: 'normal',
      icon: <Bed className="w-5 h-5" />,
      description: 'Current bed utilization',
    },
  ];

  switch (role) {
    case 'doctor':
      return [
        ...baseMetrics,
        {
          id: 'waiting-patients',
          label: 'Waiting Patients',
          value: 0,
          status: 'normal',
          icon: <Clock className="w-5 h-5" />,
          description: 'Patients in queue',
        },
        {
          id: 'critical-alerts',
          label: 'Critical Alerts',
          value: 0,
          status: 'normal',
          icon: <AlertTriangle className="w-5 h-5" />,
          description: 'Urgent notifications',
        },
      ];

    case 'nurse':
      return [
        ...baseMetrics,
        {
          id: 'pending-vitals',
          label: 'Pending Vitals',
          value: 0,
          status: 'normal',
          icon: <Activity className="w-5 h-5" />,
          description: 'Vital signs to record',
        },
        {
          id: 'medication-due',
          label: 'Medications Due',
          value: 0,
          status: 'warning',
          icon: <Zap className="w-5 h-5" />,
          description: 'Medications ready for administration',
        },
      ];

    default:
      return baseMetrics;
  }
}

function getChartData(type: string) {
  // Mock data - replace with real data
  switch (type) {
    case 'patientVolume':
      return [
        { time: '00:00', patients: 12 },
        { time: '04:00', patients: 8 },
        { time: '08:00', patients: 25 },
        { time: '12:00', patients: 45 },
        { time: '16:00', patients: 38 },
        { time: '20:00', patients: 15 },
      ];
    case 'waitTimes':
      return [
        { department: 'ER', waitTime: 45 },
        { department: 'Cardiology', waitTime: 30 },
        { department: 'Orthopedics', waitTime: 60 },
        { department: 'Pediatrics', waitTime: 20 },
      ];
    default:
      return [];
  }
}