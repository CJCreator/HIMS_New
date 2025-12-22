import { Card, Badge } from '@/components';

interface FlowPrediction {
  currentLoad: number;
  predictedWaitTime: number;
  bottlenecks: string[];
  recommendations: string[];
}

export function PredictivePatientFlow() {
  const predictions: FlowPrediction = {
    currentLoad: 75,
    predictedWaitTime: 18,
    bottlenecks: ['Doctor consultation', 'Lab processing'],
    recommendations: [
      'Activate additional consultation room',
      'Pre-order common lab tests',
      'Notify backup doctor for peak hours'
    ]
  };

  const upcomingPatients = [
    { id: 'P005', name: 'Alice Brown', eta: '5 min', complexity: 'low', predictedTime: '8 min' },
    { id: 'P006', name: 'Bob Wilson', eta: '12 min', complexity: 'high', predictedTime: '15 min' },
    { id: 'P007', name: 'Carol Davis', eta: '20 min', complexity: 'medium', predictedTime: '10 min' }
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h4 text-neutral-900">🔮 Predictive Patient Flow</h3>
        <Badge status={predictions.currentLoad > 80 ? 'error' : predictions.currentLoad > 60 ? 'pending' : 'delivered'}>
          {predictions.currentLoad}% Load
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-info/10 rounded-small">
          <p className="text-body-sm text-neutral-600">Predicted Wait Time</p>
          <p className="text-h3 text-info">{predictions.predictedWaitTime} min</p>
        </div>
        <div className="p-3 bg-warning/10 rounded-small">
          <p className="text-body-sm text-neutral-600">System Load</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-warning h-2 rounded-full"
                style={{ width: `${predictions.currentLoad}%` }}
              />
            </div>
            <span className="text-body-sm font-medium">{predictions.currentLoad}%</span>
          </div>
        </div>
      </div>

      {predictions.bottlenecks.length > 0 && (
        <div className="mb-4 p-3 bg-error/10 rounded-small">
          <p className="text-body-sm font-medium text-error mb-2">⚠️ Detected Bottlenecks:</p>
          <div className="flex flex-wrap gap-2">
            {predictions.bottlenecks.map((b, i) => (
              <Badge key={i} status="error">{b}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <p className="text-body-sm font-medium mb-2">AI Recommendations:</p>
        <ul className="space-y-1">
          {predictions.recommendations.map((r, i) => (
            <li key={i} className="text-body-sm flex items-start gap-2 p-2 bg-success/10 rounded-small">
              <span className="text-success">✓</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-body-sm font-medium mb-2">Upcoming Patients (Predicted):</p>
        <div className="space-y-2">
          {upcomingPatients.map(patient => (
            <div key={patient.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded-small">
              <div>
                <p className="text-body-sm font-medium">{patient.name}</p>
                <p className="text-body-sm text-neutral-600">ETA: {patient.eta}</p>
              </div>
              <div className="text-right">
                <Badge status={
                  patient.complexity === 'high' ? 'error' :
                  patient.complexity === 'medium' ? 'pending' : 'delivered'
                }>
                  {patient.complexity}
                </Badge>
                <p className="text-body-sm text-neutral-600 mt-1">~{patient.predictedTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
