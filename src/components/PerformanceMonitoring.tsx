import { Card, Badge } from '@/components';

export function PerformanceMonitoring() {
  const metrics = {
    avgConsultationTime: 5.2,
    systemUptime: 99.8,
    userSatisfaction: 4.7,
    throughputIncrease: 42
  };

  const realtimeMetrics = [
    { metric: 'Active Users', value: '24', trend: 'up', change: '+3' },
    { metric: 'Avg Response Time', value: '0.8s', trend: 'down', change: '-0.2s' },
    { metric: 'Success Rate', value: '99.2%', trend: 'up', change: '+0.5%' },
    { metric: 'Queue Length', value: '3', trend: 'down', change: '-2' }
  ];

  const optimizations = [
    { area: 'Database Queries', status: 'optimized', improvement: '40% faster' },
    { area: 'API Response Time', status: 'optimized', improvement: '35% faster' },
    { area: 'UI Rendering', status: 'optimized', improvement: '50% faster' },
    { area: 'Cache Hit Rate', status: 'optimized', improvement: '85% hit rate' }
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-success/10">
        <h3 className="text-h4 text-neutral-900 mb-4">📊 System Performance</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 bg-white rounded-small">
            <p className="text-h2 text-success">{metrics.avgConsultationTime}m</p>
            <p className="text-body-sm text-neutral-600">Avg Consultation</p>
          </div>
          <div className="text-center p-3 bg-white rounded-small">
            <p className="text-h2 text-success">{metrics.systemUptime}%</p>
            <p className="text-body-sm text-neutral-600">System Uptime</p>
          </div>
          <div className="text-center p-3 bg-white rounded-small">
            <p className="text-h2 text-success">{metrics.userSatisfaction}/5</p>
            <p className="text-body-sm text-neutral-600">User Satisfaction</p>
          </div>
          <div className="text-center p-3 bg-white rounded-small">
            <p className="text-h2 text-success">+{metrics.throughputIncrease}%</p>
            <p className="text-body-sm text-neutral-600">Throughput</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-h4 text-neutral-900 mb-4">⚡ Real-Time Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          {realtimeMetrics.map((m, i) => (
            <div key={i} className="p-3 bg-neutral-50 rounded-small">
              <div className="flex items-center justify-between mb-1">
                <p className="text-body-sm text-neutral-600">{m.metric}</p>
                <span className={m.trend === 'up' ? 'text-success' : 'text-info'}>
                  {m.trend === 'up' ? '↑' : '↓'}
                </span>
              </div>
              <p className="text-h4">{m.value}</p>
              <p className="text-body-sm text-neutral-600">{m.change}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-primary-50">
        <h3 className="text-h4 text-neutral-900 mb-4">🚀 Performance Optimizations</h3>
        <div className="space-y-2">
          {optimizations.map((opt, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white rounded-small">
              <div>
                <p className="text-body font-medium">{opt.area}</p>
                <p className="text-body-sm text-success">{opt.improvement}</p>
              </div>
              <Badge status="delivered">{opt.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
