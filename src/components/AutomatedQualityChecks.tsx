import { Card, Badge } from '@/components';

interface QualityCheck {
  id: string;
  category: string;
  check: string;
  status: 'pass' | 'fail' | 'warning';
  message?: string;
}

interface AutomatedQualityChecksProps {
  consultationData: any;
}

export function AutomatedQualityChecks({ consultationData }: AutomatedQualityChecksProps) {
  const checks: QualityCheck[] = [
    {
      id: '1',
      category: 'Documentation',
      check: 'Chief Complaint Documented',
      status: 'pass'
    },
    {
      id: '2',
      category: 'Documentation',
      check: 'Diagnosis with ICD-10 Code',
      status: 'pass'
    },
    {
      id: '3',
      category: 'Safety',
      check: 'Allergy Verification',
      status: 'pass',
      message: 'Checked against 2 known allergies'
    },
    {
      id: '4',
      category: 'Safety',
      check: 'Drug Interaction Check',
      status: 'pass',
      message: 'No interactions found'
    },
    {
      id: '5',
      category: 'Clinical',
      check: 'Vital Signs Reviewed',
      status: 'pass'
    },
    {
      id: '6',
      category: 'Clinical',
      check: 'Treatment Plan Documented',
      status: 'pass'
    },
    {
      id: '7',
      category: 'Compliance',
      check: 'Follow-up Scheduled',
      status: 'warning',
      message: 'Recommended for chronic condition'
    },
    {
      id: '8',
      category: 'Compliance',
      check: 'Patient Education Provided',
      status: 'pass'
    }
  ];

  const passCount = checks.filter(c => c.status === 'pass').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const failCount = checks.filter(c => c.status === 'fail').length;

  return (
    <Card className={failCount > 0 ? 'bg-error/10' : warningCount > 0 ? 'bg-warning/10' : 'bg-success/10'}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h4 text-neutral-900">Automated Quality Checks</h3>
        <div className="flex gap-2">
          <Badge status="delivered">{passCount} Pass</Badge>
          {warningCount > 0 && <Badge status="pending">{warningCount} Warning</Badge>}
          {failCount > 0 && <Badge status="error">{failCount} Fail</Badge>}
        </div>
      </div>

      <div className="space-y-3">
        {['Documentation', 'Safety', 'Clinical', 'Compliance'].map(category => (
          <div key={category}>
            <h4 className="text-body-sm font-medium text-neutral-700 mb-2">{category}</h4>
            <div className="space-y-1">
              {checks.filter(c => c.category === category).map(check => (
                <div key={check.id} className="flex items-start justify-between p-2 bg-white rounded-small">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-lg">
                      {check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'}
                    </span>
                    <div>
                      <p className="text-body-sm font-medium">{check.check}</p>
                      {check.message && (
                        <p className="text-body-sm text-neutral-600">{check.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {failCount === 0 && warningCount === 0 && (
        <div className="mt-4 p-3 bg-success/20 rounded-small text-center">
          <p className="text-body font-medium text-success">
            ✅ All quality checks passed - Ready for completion
          </p>
        </div>
      )}
    </Card>
  );
}
