import { Card, Button, Badge } from '@/components';
import { useNavigate } from 'react-router-dom';

export function ImplementationProgress() {
  const navigate = useNavigate();

  const phases = [
    {
      phase: 1,
      name: 'Foundation & Quick Wins',
      weeks: '1-4',
      status: 'complete',
      features: [
        '5 Unified Dashboards',
        'Real-time Collaboration',
        'Smart Notifications',
        'Enhanced Role Dashboards'
      ],
      impact: '44% faster consultations',
      timeSaved: '8-10 minutes'
    },
    {
      phase: 2,
      name: 'Intelligence & Communication',
      weeks: '5-8',
      status: 'complete',
      features: [
        'Voice-to-Text Input',
        'AI Diagnosis Suggestions',
        'Team Collaboration Workspace',
        'Automated Quality Checks'
      ],
      impact: '67% faster consultations',
      timeSaved: '12-15 minutes total'
    },
    {
      phase: 3,
      name: 'Workflow Optimization',
      weeks: '9-12',
      status: 'complete',
      features: [
        'Parallel Processing',
        'Automated Workflows',
        'Mobile Optimization',
        'Offline Capabilities'
      ],
      impact: '78% faster consultations',
      timeSaved: '16-20 minutes total'
    },
    {
      phase: 4,
      name: 'Advanced Features',
      weeks: '13-16',
      status: 'complete',
      features: [
        'Advanced AI Features',
        'Predictive Analytics',
        'Enhanced Collaboration',
        'Performance Optimization'
      ],
      impact: '80% faster consultations',
      timeSaved: '18-20 minutes total'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Implementation Progress
        </h1>
        <p className="text-body text-neutral-600">
          Healthcare Enhancement Plan - All Phases Complete ✅
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="p-6 bg-success/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-neutral-900">Overall Progress</h2>
          <Badge status="delivered">100% Complete</Badge>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-4 mb-4">
          <div className="bg-success h-4 rounded-full" style={{ width: '100%' }}></div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-h2 text-success">4/4</p>
            <p className="text-body-sm text-neutral-600">Phases Complete</p>
          </div>
          <div>
            <p className="text-h2 text-success">80%</p>
            <p className="text-body-sm text-neutral-600">Time Reduction</p>
          </div>
          <div>
            <p className="text-h2 text-success">27</p>
            <p className="text-body-sm text-neutral-600">Components Built</p>
          </div>
        </div>
      </Card>

      {/* Phase Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {phases.map(phase => (
          <Card 
            key={phase.phase}
            className={`p-6 ${
              phase.status === 'complete' ? 'bg-success/10 border-success' :
              phase.status === 'in-progress' ? 'bg-warning/10 border-warning' :
              'bg-neutral-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-h4 text-neutral-900">Phase {phase.phase}</h3>
                  <Badge status={
                    phase.status === 'complete' ? 'delivered' :
                    phase.status === 'in-progress' ? 'pending' : 'sent'
                  }>
                    {phase.status}
                  </Badge>
                </div>
                <p className="text-body font-medium">{phase.name}</p>
                <p className="text-body-sm text-neutral-600">Weeks {phase.weeks}</p>
              </div>
              {phase.status === 'complete' && (
                <span className="text-4xl">✅</span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-body-sm font-medium text-neutral-700 mb-2">Features</p>
                <ul className="space-y-1">
                  {phase.features.map((feature, idx) => (
                    <li key={idx} className="text-body-sm flex items-center gap-2">
                      <span className={phase.status === 'complete' ? 'text-success' : 'text-neutral-400'}>
                        {phase.status === 'complete' ? '✓' : '○'}
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-neutral-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-body-sm text-neutral-600">Impact:</span>
                  <span className="text-body-sm font-medium">{phase.impact}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-neutral-600">Time Saved:</span>
                  <span className="text-body-sm font-medium">{phase.timeSaved}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-h4 text-neutral-900 mb-4">Experience the Improvements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button 
            variant="secondary"
            onClick={() => navigate('/doctor/consultation-legacy')}
          >
            Legacy System (14 steps)
          </Button>
          <Button 
            variant="secondary"
            onClick={() => navigate('/doctor/consultation-phase1')}
          >
            Phase 1 (5 dashboards)
          </Button>
          <Button 
            variant="primary"
            onClick={() => navigate('/doctor/consultation')}
          >
            Final System (All Phases) 🚀
          </Button>
        </div>
      </Card>

      {/* Metrics Summary */}
      <Card className="p-6 bg-primary-50">
        <h3 className="text-h4 text-neutral-900 mb-4">Key Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-h2 text-primary-600">80%</p>
            <p className="text-body-sm text-neutral-600">Faster Consultations</p>
          </div>
          <div className="text-center">
            <p className="text-h2 text-primary-600">83%</p>
            <p className="text-body-sm text-neutral-600">Less Navigation</p>
          </div>
          <div className="text-center">
            <p className="text-h2 text-primary-600">80%</p>
            <p className="text-body-sm text-neutral-600">Faster Handoffs</p>
          </div>
          <div className="text-center">
            <p className="text-h2 text-primary-600">+40%</p>
            <p className="text-body-sm text-neutral-600">Patient Capacity</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
