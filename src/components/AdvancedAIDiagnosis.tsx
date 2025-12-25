import { Card, Badge } from '@/components';

interface PredictiveAnalytics {
  patientRisk: 'low' | 'medium' | 'high';
  readmissionRisk: number;
  complications: string[];
  recommendations: string[];
}

interface AdvancedAIDiagnosisProps {
  symptoms: string[];
  vitals: any;
  history: any;
}

export function AdvancedAIDiagnosis({ }: AdvancedAIDiagnosisProps) {
  const analytics: PredictiveAnalytics = {
    patientRisk: 'medium',
    readmissionRisk: 15,
    complications: ['Diabetes complications', 'Cardiovascular risk'],
    recommendations: [
      'Monitor HbA1c every 3 months',
      'Lifestyle modification program',
      'Regular BP monitoring',
      'Dietary consultation recommended'
    ]
  };

  const diagnoses = [
    {
      condition: 'Type 2 Diabetes - Uncontrolled',
      icd10: 'E11.65',
      confidence: 94,
      evidence: ['Elevated blood sugar', 'Patient history', 'Symptoms match'],
      treatment: 'Metformin 500mg + Lifestyle modification',
      prognosis: 'Good with adherence'
    },
    {
      condition: 'Hypertension',
      icd10: 'I10',
      confidence: 88,
      evidence: ['BP readings', 'Family history'],
      treatment: 'Lisinopril 10mg + Low sodium diet',
      prognosis: 'Excellent with medication'
    }
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-primary-50 border-primary-300">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">🤖</span>
          <div>
            <h3 className="text-h4 text-neutral-900">Advanced AI Diagnosis Assistant</h3>
            <p className="text-body-sm text-neutral-600">Powered by machine learning</p>
          </div>
        </div>

        {diagnoses.map((dx, idx) => (
          <div key={idx} className="mb-4 p-4 bg-white rounded-small border border-primary-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-body font-medium">{dx.condition}</h4>
                <p className="text-body-sm text-neutral-600">{dx.icd10}</p>
              </div>
              <Badge status={dx.confidence > 90 ? 'delivered' : 'pending'}>
                {dx.confidence}% confidence
              </Badge>
            </div>
            
            <div className="space-y-2 text-body-sm">
              <div>
                <span className="font-medium">Evidence:</span>
                <ul className="ml-4 mt-1">
                  {dx.evidence.map((e, i) => <li key={i}>• {e}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-medium">Recommended Treatment:</span>
                <p className="text-neutral-700">{dx.treatment}</p>
              </div>
              <div>
                <span className="font-medium">Prognosis:</span>
                <p className="text-success">{dx.prognosis}</p>
              </div>
            </div>
          </div>
        ))}
      </Card>

      <Card className={`border-2 ${
        analytics.patientRisk === 'high' ? 'bg-error/10 border-error' :
        analytics.patientRisk === 'medium' ? 'bg-warning/10 border-warning' :
        'bg-success/10 border-success'
      }`}>
        <h3 className="text-h4 text-neutral-900 mb-3">📊 Predictive Analytics</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-white rounded-small">
            <p className="text-body-sm text-neutral-600">Patient Risk Level</p>
            <p className="text-h4 capitalize">{analytics.patientRisk}</p>
          </div>
          <div className="p-3 bg-white rounded-small">
            <p className="text-body-sm text-neutral-600">30-Day Readmission Risk</p>
            <p className="text-h4">{analytics.readmissionRisk}%</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-body-sm font-medium mb-2">Potential Complications:</p>
            {analytics.complications.map((c, i) => (
              <Badge key={i} status="pending" className="mr-2">{c}</Badge>
            ))}
          </div>
          
          <div>
            <p className="text-body-sm font-medium mb-2">AI Recommendations:</p>
            <ul className="space-y-1">
              {analytics.recommendations.map((r, i) => (
                <li key={i} className="text-body-sm flex items-start gap-2">
                  <span className="text-primary-600">→</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
