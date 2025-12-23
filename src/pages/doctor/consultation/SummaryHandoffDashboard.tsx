import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components';
import { mockDataService } from '@/services/mockDataService';
import { useNavigate } from 'react-router-dom';

interface SummaryHandoffDashboardProps {
  onPrevious: () => void;
  data?: any;
}

export function SummaryHandoffDashboard({ onPrevious, data }: SummaryHandoffDashboardProps) {
  const navigate = useNavigate();
  const [handoffStatus, setHandoffStatus] = useState({
    pharmacy: 'pending',
    lab: 'pending',
    billing: 'pending',
    followUp: 'pending'
  });

  useEffect(() => {
    // Simulate handoff notifications
    const timer = setTimeout(() => {
      setHandoffStatus({
        pharmacy: 'sent',
        lab: 'sent',
        billing: 'sent',
        followUp: 'sent'
      });

      // Add notifications to mock service
      if (data?.treatmentPlan?.medications?.length > 0) {
        mockDataService.addNotification({
          type: 'info',
          fromRole: 'Doctor',
          toRole: 'Pharmacy',
          title: 'New Prescription',
          message: `Prescription ready for ${data?.patientOverview?.patientName || 'Patient'}`,
          patientId: data?.patientId || 'P001',
          patientName: data?.patientOverview?.patientName || 'Patient',
          priority: 'medium'
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [data]);

  const generateSummary = () => {
    const patient = data?.patientOverview || {};
    const assessment = data?.clinicalAssessment || {};
    const treatment = data?.treatmentPlan || {};

    return {
      patient: patient.patientName || 'Unknown',
      age: patient.age || 'N/A',
      complaint: assessment.chiefComplaint || 'Not recorded',
      diagnosis: assessment.diagnosis || 'Not recorded',
      medications: treatment.medications || [],
      duration: Math.floor((Date.now() - (data?.startTime || Date.now())) / 60000) || 10
    };
  };

  const summary = generateSummary();

  const handleComplete = () => {
    // Save completed consultation
    mockDataService.saveConsultation(data?.patientId || 'P001', {
      ...data,
      completedAt: Date.now(),
      duration: summary.duration
    });

    // Update patient status
    mockDataService.updatePatientStatus(data?.patientId || 'P001', 'waiting', 'Pharmacy');

    alert('Consultation completed successfully!');
    navigate('/doctor');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h3 text-neutral-900">Summary & Multi-Role Handoff</h2>
        <div className="flex gap-2">
          <Button variant="tertiary" size="sm" onClick={onPrevious}>← Back</Button>
          <Button variant="primary" onClick={handleComplete}>Complete Consultation</Button>
        </div>
      </div>

      {/* Auto-Generated Summary */}
      <Card className="bg-gradient-to-r from-primary-50 to-success-50">
        <h3 className="text-h4 text-neutral-900 mb-3">📋 AI-Generated Consultation Summary</h3>
        <div className="space-y-3 bg-white p-4 rounded-small">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-body-sm font-medium text-neutral-700">Patient</p>
              <p className="text-body">{summary.patient}, {summary.age} years</p>
            </div>
            <div>
              <p className="text-body-sm font-medium text-neutral-700">Consultation Duration</p>
              <p className="text-body text-success">{summary.duration} minutes</p>
            </div>
          </div>
          <div>
            <p className="text-body-sm font-medium text-neutral-700">Chief Complaint</p>
            <p className="text-body">{summary.complaint}</p>
          </div>
          <div>
            <p className="text-body-sm font-medium text-neutral-700">Diagnosis</p>
            <p className="text-body">{summary.diagnosis}</p>
          </div>
          <div>
            <p className="text-body-sm font-medium text-neutral-700">Treatment Plan</p>
            {summary.medications.length > 0 ? (
              <ul className="list-disc list-inside">
                {summary.medications.map((med: any, idx: number) => (
                  <li key={idx} className="text-body-sm">{med.name} - {med.dosage} {med.frequency}</li>
                ))}
              </ul>
            ) : (
              <p className="text-body-sm text-neutral-500">No medications prescribed</p>
            )}
          </div>
        </div>
      </Card>

      {/* Multi-Channel Handoff Status */}
      <Card>
        <h3 className="text-h4 text-neutral-900 mb-3">Multi-Channel Handoff Status</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-small">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💊</span>
              <span className="text-body">Pharmacy</span>
            </div>
            <Badge status={handoffStatus.pharmacy === 'sent' ? 'delivered' : 'pending'}>
              {handoffStatus.pharmacy === 'sent' ? 'Notified' : 'Pending'}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-small">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔬</span>
              <span className="text-body">Laboratory</span>
            </div>
            <Badge status={handoffStatus.lab === 'sent' ? 'delivered' : 'pending'}>
              {handoffStatus.lab === 'sent' ? 'Notified' : 'Pending'}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-small">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="text-body">Billing</span>
            </div>
            <Badge status={handoffStatus.billing === 'sent' ? 'delivered' : 'pending'}>
              {handoffStatus.billing === 'sent' ? 'Notified' : 'Pending'}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-small">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <span className="text-body">Follow-up</span>
            </div>
            <Badge status={handoffStatus.followUp === 'sent' ? 'delivered' : 'pending'}>
              {handoffStatus.followUp === 'sent' ? 'Scheduled' : 'Pending'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Real-time Status Updates */}
      <Card className="bg-info/10">
        <h3 className="text-h4 text-neutral-900 mb-3">Live Patient Journey Tracking</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 bg-white rounded-small">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-body-sm">Consultation completed</span>
            <span className="text-body-sm text-neutral-600 ml-auto">Just now</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white rounded-small">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-body-sm">Patient moved to pharmacy queue</span>
            <span className="text-body-sm text-neutral-600 ml-auto">Just now</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white rounded-small">
            <div className="w-2 h-2 rounded-full bg-info animate-pulse" />
            <span className="text-body-sm">Notifications sent to all departments</span>
            <span className="text-body-sm text-neutral-600 ml-auto">Just now</span>
          </div>
        </div>
      </Card>

      {/* Patient Education */}
      <Card>
        <h3 className="text-h4 text-neutral-900 mb-3">Automated Patient Instructions</h3>
        <div className="p-3 bg-neutral-50 rounded-small">
          <p className="text-body-sm mb-2">✅ Discharge instructions generated</p>
          <p className="text-body-sm mb-2">✅ Medication guide prepared</p>
          <p className="text-body-sm">✅ Follow-up reminder scheduled</p>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-success/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-h4 text-neutral-900 mb-1">Consultation Performance</h3>
            <p className="text-body-sm text-neutral-600">Time saved vs traditional flow</p>
          </div>
          <div className="text-right">
            <p className="text-h2 text-success">{summary.duration} min</p>
            <p className="text-body-sm text-success">↓ 44% faster</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
