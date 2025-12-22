import { Card, Button, Badge } from '@/components';
import { useNavigate } from 'react-router-dom';

interface SummaryHandoffDashboardProps {
  onPrevious: () => void;
  onComplete: () => void;
}

export function SummaryHandoffDashboard({ onPrevious, onComplete }: SummaryHandoffDashboardProps) {
  const navigate = useNavigate();

  const handoffStatus = [
    { role: 'Pharmacy', status: 'notified', time: 'Just now', action: 'Process prescription' },
    { role: 'Laboratory', status: 'notified', time: 'Just now', action: 'Prepare test orders' },
    { role: 'Receptionist', status: 'notified', time: 'Just now', action: 'Schedule follow-up' },
    { role: 'Billing', status: 'pending', time: 'Waiting', action: 'Process payment' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h3 text-neutral-900">Consultation Complete</h2>
        <div className="flex gap-2">
          <Button variant="tertiary" size="sm" onClick={onPrevious}>← Back</Button>
          <Button onClick={onComplete}>Return to Dashboard</Button>
        </div>
      </div>

      {/* Success Message */}
      <Card className="bg-success/10 border-success text-center py-6">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-h3 text-success mb-2">Consultation Completed Successfully</h3>
        <p className="text-body text-neutral-700">Patient: John Smith • Duration: 8 minutes</p>
      </Card>

      {/* Auto-Generated Summary */}
      <Card>
        <h3 className="text-h4 text-neutral-900 mb-3">AI-Generated Summary</h3>
        <div className="space-y-3 p-4 bg-neutral-50 rounded-small">
          <div>
            <p className="text-body-sm font-medium text-neutral-700">Chief Complaint</p>
            <p className="text-body">Elevated blood sugar levels, fatigue</p>
          </div>
          <div>
            <p className="text-body-sm font-medium text-neutral-700">Diagnosis</p>
            <p className="text-body">Type 2 Diabetes - Uncontrolled (E11.65)</p>
          </div>
          <div>
            <p className="text-body-sm font-medium text-neutral-700">Treatment Plan</p>
            <p className="text-body">Metformin 500mg daily, Glipizide 5mg daily</p>
          </div>
          <div>
            <p className="text-body-sm font-medium text-neutral-700">Follow-up</p>
            <p className="text-body">2 weeks for HbA1c review</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="secondary" size="sm">📄 Download PDF</Button>
          <Button variant="secondary" size="sm">📧 Email to Patient</Button>
          <Button variant="secondary" size="sm">🖨️ Print</Button>
        </div>
      </Card>

      {/* Multi-Channel Handoff Status */}
      <Card>
        <h3 className="text-h4 text-neutral-900 mb-3">Real-Time Handoff Status</h3>
        <div className="space-y-2">
          {handoffStatus.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-small">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  item.status === 'notified' ? 'bg-success animate-pulse' : 'bg-warning'
                }`} />
                <div>
                  <p className="text-body font-medium">{item.role}</p>
                  <p className="text-body-sm text-neutral-600">{item.action}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge status={item.status === 'notified' ? 'delivered' : 'pending'}>
                  {item.status}
                </Badge>
                <p className="text-body-sm text-neutral-600 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Patient Journey Tracking */}
      <Card className="bg-info/10">
        <h3 className="text-h4 text-neutral-900 mb-3">Patient Journey - Next Steps</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2">
            <span className="text-2xl">1️⃣</span>
            <div>
              <p className="text-body font-medium">Pharmacy - Prescription Processing</p>
              <p className="text-body-sm text-neutral-600">Estimated: 15 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <span className="text-2xl">2️⃣</span>
            <div>
              <p className="text-body font-medium">Laboratory - Sample Collection</p>
              <p className="text-body-sm text-neutral-600">Estimated: 20 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <span className="text-2xl">3️⃣</span>
            <div>
              <p className="text-body font-medium">Billing - Payment Processing</p>
              <p className="text-body-sm text-neutral-600">At reception desk</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button variant="secondary" onClick={() => navigate('/doctor/queue')}>
          View Next Patient
        </Button>
        <Button variant="secondary" onClick={() => navigate('/doctor/appointments')}>
          View Schedule
        </Button>
        <Button variant="secondary" onClick={() => navigate('/doctor')}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
