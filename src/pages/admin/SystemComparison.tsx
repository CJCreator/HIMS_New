import { Card, Button } from '@/components';
import { useNavigate } from 'react-router-dom';

export function SystemComparisonDashboard() {
  const navigate = useNavigate();

  const metrics = [
    {
      name: 'Consultation Steps',
      old: '14 separate screens',
      new: '5 integrated dashboards',
      improvement: '64% reduction',
      icon: '📊'
    },
    {
      name: 'Average Time',
      old: '18+ minutes',
      new: '8-10 minutes',
      improvement: '44% faster',
      icon: '⏱️'
    },
    {
      name: 'Navigation Clicks',
      old: '~40 clicks',
      new: '~10 clicks',
      improvement: '75% reduction',
      icon: '🖱️'
    },
    {
      name: 'Data Entry',
      old: '~8 minutes',
      new: '~3 minutes',
      improvement: '62% faster',
      icon: '⌨️'
    },
    {
      name: 'Role Handoff',
      old: '5-10 minutes',
      new: '<2 minutes',
      improvement: '60% faster',
      icon: '🤝'
    },
    {
      name: 'Patient Throughput',
      old: 'Baseline',
      new: '+40% capacity',
      improvement: '40% increase',
      icon: '📈'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Healthcare System Enhancement
        </h1>
        <p className="text-body text-neutral-600">
          Comparing Legacy vs Enhanced System Performance
        </p>
      </div>

      {/* Key Metrics Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="p-6">
            <div className="text-4xl mb-3">{metric.icon}</div>
            <h3 className="text-h4 text-neutral-900 mb-3">{metric.name}</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-error/10 rounded-small">
                <span className="text-body-sm text-neutral-600">Legacy:</span>
                <span className="text-body-sm font-medium text-error">{metric.old}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-success/10 rounded-small">
                <span className="text-body-sm text-neutral-600">Enhanced:</span>
                <span className="text-body-sm font-medium text-success">{metric.new}</span>
              </div>
              <div className="text-center pt-2">
                <span className="text-body font-semibold text-primary-600">
                  {metric.improvement}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Card className="p-6">
        <h2 className="text-h3 text-neutral-900 mb-6">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neutral-200">
                <th className="text-left p-3 text-body font-semibold">Feature</th>
                <th className="text-center p-3 text-body font-semibold">Legacy System</th>
                <th className="text-center p-3 text-body font-semibold">Enhanced System</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-200">
                <td className="p-3 text-body">Consultation Flow</td>
                <td className="p-3 text-center">
                  <span className="text-error">❌ 14 separate screens</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-success">✅ 5 unified dashboards</span>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="p-3 text-body">Real-time Collaboration</td>
                <td className="p-3 text-center">
                  <span className="text-error">❌ Manual coordination</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-success">✅ Live status updates</span>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="p-3 text-body">Smart Notifications</td>
                <td className="p-3 text-center">
                  <span className="text-error">❌ Basic alerts</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-success">✅ Contextual with quick actions</span>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="p-3 text-body">Data Entry</td>
                <td className="p-3 text-center">
                  <span className="text-error">❌ Repetitive manual entry</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-success">✅ Smart templates & auto-fill</span>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="p-3 text-body">AI Assistance</td>
                <td className="p-3 text-center">
                  <span className="text-error">❌ None</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-success">✅ Diagnosis suggestions</span>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="p-3 text-body">Parallel Processing</td>
                <td className="p-3 text-center">
                  <span className="text-error">❌ Sequential workflow</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-success">✅ Simultaneous role activation</span>
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="p-3 text-body">Patient Context Sharing</td>
                <td className="p-3 text-center">
                  <span className="text-error">❌ Fragmented views</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-success">✅ Unified across all roles</span>
                </td>
              </tr>
              <tr>
                <td className="p-3 text-body">Validation Checks</td>
                <td className="p-3 text-center">
                  <span className="text-error">❌ Manual review</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-success">✅ Automated multi-role checks</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Try Both Systems */}
      <Card className="p-6 bg-primary-50">
        <h2 className="text-h3 text-neutral-900 mb-4">Experience the Difference</h2>
        <p className="text-body text-neutral-700 mb-6">
          Compare the legacy 14-step consultation flow with the new 5-dashboard unified system
        </p>
        <div className="flex gap-4">
          <Button 
            variant="secondary"
            onClick={() => navigate('/doctor/consultation-legacy')}
          >
            Try Legacy System (14 steps)
          </Button>
          <Button 
            variant="primary"
            onClick={() => navigate('/doctor/consultation')}
          >
            Try Enhanced System (5 dashboards) ⚡
          </Button>
        </div>
      </Card>

      {/* ROI Summary */}
      <Card className="p-6 bg-success/10">
        <h2 className="text-h3 text-neutral-900 mb-4">💰 Return on Investment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-body-sm text-neutral-600 mb-1">Time Savings per Consultation</p>
            <p className="text-h2 text-success">8-10 min</p>
            <p className="text-body-sm text-neutral-600">44% reduction</p>
          </div>
          <div>
            <p className="text-body-sm text-neutral-600 mb-1">Additional Patients per Day</p>
            <p className="text-h2 text-success">+40%</p>
            <p className="text-body-sm text-neutral-600">Increased capacity</p>
          </div>
          <div>
            <p className="text-body-sm text-neutral-600 mb-1">Staff Efficiency Gain</p>
            <p className="text-h2 text-success">60%</p>
            <p className="text-body-sm text-neutral-600">Faster handoffs</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
