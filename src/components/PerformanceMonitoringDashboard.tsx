import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Input } from '@/components';
import { InteractiveChart } from './charts/InteractiveChart';
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Server,
  Database,
  Globe,
  Monitor,
  Smartphone,
  RefreshCw,
  Settings,
  Download
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface PerformanceAlert {
  id: string;
  type: 'system' | 'application' | 'network' | 'database';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  metric?: string;
  value?: number;
}

interface PerformanceMonitoringDashboardProps {
  realTime?: boolean;
  showAlerts?: boolean;
  refreshInterval?: number;
}

export function PerformanceMonitoringDashboard({
  realTime = true,
  showAlerts = true,
  refreshInterval = 10000
}: PerformanceMonitoringDashboardProps) {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize metrics
  useEffect(() => {
    const initialMetrics: SystemMetric[] = [
      {
        id: 'cpu-usage',
        name: 'CPU Usage',
        value: 45,
        unit: '%',
        status: 'normal',
        threshold: { warning: 70, critical: 90 },
        trend: 'stable',
        description: 'Average CPU utilization across all servers'
      },
      {
        id: 'memory-usage',
        name: 'Memory Usage',
        value: 68,
        unit: '%',
        status: 'warning',
        threshold: { warning: 75, critical: 90 },
        trend: 'up',
        description: 'RAM utilization across application servers'
      },
      {
        id: 'disk-usage',
        name: 'Disk Usage',
        value: 72,
        unit: '%',
        status: 'warning',
        threshold: { warning: 80, critical: 95 },
        trend: 'up',
        description: 'Storage utilization on database servers'
      },
      {
        id: 'network-latency',
        name: 'Network Latency',
        value: 23,
        unit: 'ms',
        status: 'normal',
        threshold: { warning: 50, critical: 100 },
        trend: 'stable',
        description: 'Average response time for API calls'
      },
      {
        id: 'active-users',
        name: 'Active Users',
        value: 1247,
        unit: 'users',
        status: 'normal',
        threshold: { warning: 1500, critical: 2000 },
        trend: 'up',
        description: 'Currently active users in the system'
      },
      {
        id: 'response-time',
        name: 'Avg Response Time',
        value: 245,
        unit: 'ms',
        status: 'normal',
        threshold: { warning: 500, critical: 1000 },
        trend: 'stable',
        description: 'Average page load time'
      },
      {
        id: 'error-rate',
        name: 'Error Rate',
        value: 0.8,
        unit: '%',
        status: 'normal',
        threshold: { warning: 2, critical: 5 },
        trend: 'down',
        description: 'Percentage of failed requests'
      },
      {
        id: 'database-connections',
        name: 'DB Connections',
        value: 45,
        unit: '/100',
        status: 'normal',
        threshold: { warning: 80, critical: 95 },
        trend: 'stable',
        description: 'Active database connections'
      }
    ];

    setMetrics(initialMetrics);
  }, []);

  // Initialize alerts
  useEffect(() => {
    const initialAlerts: PerformanceAlert[] = [
      {
        id: 'alert-1',
        type: 'system',
        severity: 'medium',
        title: 'High Memory Usage',
        message: 'Memory usage on APP-SERVER-01 exceeded 75%',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        resolved: false,
        metric: 'memory-usage',
        value: 78
      },
      {
        id: 'alert-2',
        type: 'application',
        severity: 'low',
        title: 'Slow API Response',
        message: 'Patient search API response time > 500ms',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        resolved: true,
        metric: 'response-time',
        value: 520
      }
    ];

    setAlerts(initialAlerts);
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      // Simulate real-time metric updates
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(
          metric.unit === '%' ? 100 : metric.unit === 'ms' ? 2000 : 10000,
          metric.value + (Math.random() - 0.5) * 10
        )),
        trend: Math.random() > 0.7 ? 'up' : Math.random() > 0.4 ? 'down' : 'stable'
      })));

      setLastUpdated(new Date());

      // Simulate occasional alerts
      if (Math.random() < 0.1) {
        const newAlert: PerformanceAlert = {
          id: `alert-${Date.now()}`,
          type: ['system', 'application', 'network', 'database'][Math.floor(Math.random() * 4)] as any,
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          title: 'Performance Alert',
          message: 'System performance metric exceeded threshold',
          timestamp: new Date(),
          resolved: false
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [realTime, refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getMetricStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getMetricStatusIcon = (status: SystemMetric['status']) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertSeverityColor = (severity: PerformanceAlert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getTrendIcon = (trend: SystemMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-red-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-green-500" />;
      case 'stable': return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const systemHealth = useMemo(() => {
    const criticalCount = metrics.filter(m => m.status === 'critical').length;
    const warningCount = metrics.filter(m => m.status === 'warning').length;

    if (criticalCount > 0) return 'critical';
    if (warningCount > 2) return 'warning';
    return 'healthy';
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance Monitoring</h1>
            <p className="text-gray-600 mt-1">
              Real-time system performance and infrastructure monitoring
            </p>
          </div>

          {/* System Health Indicator */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            systemHealth === 'healthy' ? 'bg-green-100 text-green-800' :
            systemHealth === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {systemHealth === 'healthy' ? 'All Systems Operational' :
             systemHealth === 'warning' ? 'Minor Issues Detected' :
             'Critical Issues Detected'}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {realTime && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm">Live Monitoring</span>
            </div>
          )}

          <span className="text-sm text-gray-500">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(metric => (
          <Card key={metric.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  metric.id.includes('cpu') ? 'bg-blue-100' :
                  metric.id.includes('memory') ? 'bg-purple-100' :
                  metric.id.includes('disk') ? 'bg-orange-100' :
                  metric.id.includes('network') ? 'bg-green-100' :
                  metric.id.includes('users') ? 'bg-indigo-100' :
                  metric.id.includes('response') ? 'bg-cyan-100' :
                  metric.id.includes('error') ? 'bg-red-100' :
                  'bg-gray-100'
                }`}>
                  {metric.id.includes('cpu') ? <Cpu className="w-5 h-5" /> :
                   metric.id.includes('memory') ? <Server className="w-5 h-5" /> :
                   metric.id.includes('disk') ? <HardDrive className="w-5 h-5" /> :
                   metric.id.includes('network') ? <Wifi className="w-5 h-5" /> :
                   metric.id.includes('users') ? <Users className="w-5 h-5" /> :
                   metric.id.includes('response') ? <Clock className="w-5 h-5" /> :
                   metric.id.includes('error') ? <AlertTriangle className="w-5 h-5" /> :
                   <Activity className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{metric.name}</h3>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getTrendIcon(metric.trend)}
                <Badge className={getMetricStatusColor(metric.status)} size="sm">
                  {getMetricStatusIcon(metric.status)}
                  <span className="ml-1">{metric.status}</span>
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}
                <span className="text-lg text-gray-600 ml-1">{metric.unit}</span>
              </div>

              {/* Threshold indicators */}
              <div className="mt-2 flex justify-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  metric.value >= metric.threshold.critical ? 'bg-red-500' :
                  metric.value >= metric.threshold.warning ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <span className="text-xs text-gray-500">
                  Warning: {metric.threshold.warning}{metric.unit}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InteractiveChart
          data={getPerformanceTrendData(metrics)}
          type="line"
          title="Performance Trends (Last Hour)"
          xAxisKey="time"
          yAxisKeys={['cpu', 'memory', 'response-time']}
          realTime={realTime}
          height={300}
        />

        <InteractiveChart
          data={getSystemLoadData()}
          type="area"
          title="System Load Distribution"
          xAxisKey="component"
          yAxisKeys={['load']}
          height={300}
        />
      </div>

      {/* Infrastructure Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5" />
            Server Status
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Web Server 1', status: 'healthy', load: 45 },
              { name: 'Web Server 2', status: 'healthy', load: 52 },
              { name: 'Database Server', status: 'warning', load: 78 },
              { name: 'Cache Server', status: 'healthy', load: 23 }
            ].map(server => (
              <div key={server.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{server.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{server.load}%</span>
                  <div className={`w-2 h-2 rounded-full ${
                    server.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Network Status
          </h3>
          <div className="space-y-3">
            {[
              { name: 'API Gateway', latency: 23, status: 'healthy' },
              { name: 'Database Connection', latency: 45, status: 'healthy' },
              { name: 'External APIs', latency: 120, status: 'warning' },
              { name: 'CDN', latency: 15, status: 'healthy' }
            ].map(service => (
              <div key={service.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{service.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{service.latency}ms</span>
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Application Health
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Patient Portal', uptime: 99.9, status: 'healthy' },
              { name: 'Doctor Dashboard', uptime: 99.8, status: 'healthy' },
              { name: 'Admin Console', uptime: 99.5, status: 'warning' },
              { name: 'API Services', uptime: 99.7, status: 'healthy' }
            ].map(app => (
              <div key={app.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{app.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{app.uptime}%</span>
                  <div className={`w-2 h-2 rounded-full ${
                    app.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Alerts */}
      {showAlerts && activeAlerts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Active Alerts ({activeAlerts.length})
          </h3>

          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <Badge className={getAlertSeverityColor(alert.severity)} size="sm">
                      {alert.severity}
                    </Badge>
                    <Badge status="secondary" size="sm">
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-2">{alert.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{alert.timestamp.toLocaleString()}</span>
                    {alert.metric && (
                      <span>Metric: {alert.metric} ({alert.value})</span>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Resolve
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Export Options */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Metrics
        </Button>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Configure Alerts
        </Button>
      </div>
    </div>
  );
}

// Mock data functions
function getPerformanceTrendData(metrics: SystemMetric[]) {
  const now = new Date();
  return Array.from({ length: 60 }, (_, i) => {
    const time = new Date(now.getTime() - (59 - i) * 60 * 1000);
    return {
      time: time.toLocaleTimeString(),
      cpu: 40 + Math.random() * 30,
      memory: 60 + Math.random() * 25,
      'response-time': 200 + Math.random() * 200
    };
  });
}

function getSystemLoadData() {
  return [
    { component: 'Web Servers', load: 45 },
    { component: 'Database', load: 78 },
    { component: 'Cache', load: 23 },
    { component: 'API Gateway', load: 34 },
    { component: 'Load Balancer', load: 56 },
    { component: 'CDN', load: 12 }
  ];
}