import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components';
import { mockDataService } from '@/services/mockDataService';
import { useNavigate } from 'react-router-dom';
import { Pill, TestTube, DollarSign, Calendar, Clock, RefreshCw } from 'lucide-react';

interface SummaryHandoffDashboardProps {
  onPrevious: () => void;
  data?: any;
}

export function SummaryHandoffDashboard({ onPrevious, data }: SummaryHandoffDashboardProps) {
  const navigate = useNavigate();
  const [handoffStatus, setHandoffStatus] = useState({
    pharmacy: { status: 'pending', timestamp: null as string | null, attempts: 0 },
    lab: { status: 'pending', timestamp: null as string | null, attempts: 0 },
    billing: { status: 'pending', timestamp: null as string | null, attempts: 0 },
    followUp: { status: 'pending', timestamp: null as string | null, attempts: 0 }
  });
  const [retrying, setRetrying] = useState<string | null>(null);

  useEffect(() => {
    // Simulate handoff notifications
    const timer = setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      setHandoffStatus({
        pharmacy: { status: 'sent', timestamp: now, attempts: 1 },
        lab: { status: 'sent', timestamp: now, attempts: 1 },
        billing: { status: 'sent', timestamp: now, attempts: 1 },
        followUp: { status: 'sent', timestamp: now, attempts: 1 }
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

  const handleRetry = async (department: keyof typeof handoffStatus) => {
    setRetrying(department);
    // Simulate retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    const now = new Date().toLocaleTimeString();
    setHandoffStatus(prev => ({
      ...prev,
      [department]: {
        status: 'sent',
        timestamp: now,
        attempts: prev[department].attempts + 1
      }
    }));
    setRetrying(null);
  };

  const handleRefresh = async (department: keyof typeof handoffStatus) => {
    setRetrying(department);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    setRetrying(null);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Pharmacy */}
          <div className="p-4 bg-neutral-50 rounded-lg border-2 border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Pill className="w-6 h-6 text-blue-600" />
                <span className="text-body font-medium">Pharmacy</span>
              </div>
              <Badge status={handoffStatus.pharmacy.status === 'sent' ? 'delivered' : 'pending'}>
                {handoffStatus.pharmacy.status === 'sent' ? 'Notified' : 'Pending'}
              </Badge>
            </div>
            {handoffStatus.pharmacy.timestamp && (
              <p className="text-xs text-neutral-600 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Sent at {handoffStatus.pharmacy.timestamp}
              </p>
            )}
            {handoffStatus.pharmacy.attempts > 0 && (
              <p className="text-xs text-neutral-600 mb-2">
                Attempts: {handoffStatus.pharmacy.attempts}
              </p>
            )}
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleRefresh('pharmacy')}
                disabled={retrying === 'pharmacy'}
              >
                {retrying === 'pharmacy' ? (
                  <><Clock className="w-4 h-4 mr-1" /> Refreshing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-1" /> Refresh</>
                )}
              </Button>
              {handoffStatus.pharmacy.status !== 'sent' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleRetry('pharmacy')}
                  disabled={retrying === 'pharmacy'}
                >
                  {retrying === 'pharmacy' ? 'Retrying...' : 'Retry'}
                </Button>
              )}
            </div>
          </div>

          {/* Lab */}
          <div className="p-4 bg-neutral-50 rounded-lg border-2 border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TestTube className="w-6 h-6 text-purple-600" />
                <span className="text-body font-medium">Laboratory</span>
              </div>
              <Badge status={handoffStatus.lab.status === 'sent' ? 'delivered' : 'pending'}>
                {handoffStatus.lab.status === 'sent' ? 'Notified' : 'Pending'}
              </Badge>
            </div>
            {handoffStatus.lab.timestamp && (
              <p className="text-xs text-neutral-600 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Sent at {handoffStatus.lab.timestamp}
              </p>
            )}
            {handoffStatus.lab.attempts > 0 && (
              <p className="text-xs text-neutral-600 mb-2">
                Attempts: {handoffStatus.lab.attempts}
              </p>
            )}
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleRefresh('lab')}
                disabled={retrying === 'lab'}
              >
                {retrying === 'lab' ? (
                  <><Clock className="w-4 h-4 mr-1" /> Refreshing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-1" /> Refresh</>
                )}
              </Button>
              {handoffStatus.lab.status !== 'sent' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleRetry('lab')}
                  disabled={retrying === 'lab'}
                >
                  {retrying === 'lab' ? 'Retrying...' : 'Retry'}
                </Button>
              )}
            </div>
          </div>

          {/* Billing */}
          <div className="p-4 bg-neutral-50 rounded-lg border-2 border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="text-body font-medium">Billing</span>
              </div>
              <Badge status={handoffStatus.billing.status === 'sent' ? 'delivered' : 'pending'}>
                {handoffStatus.billing.status === 'sent' ? 'Notified' : 'Pending'}
              </Badge>
            </div>
            {handoffStatus.billing.timestamp && (
              <p className="text-xs text-neutral-600 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Sent at {handoffStatus.billing.timestamp}
              </p>
            )}
            {handoffStatus.billing.attempts > 0 && (
              <p className="text-xs text-neutral-600 mb-2">
                Attempts: {handoffStatus.billing.attempts}
              </p>
            )}
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleRefresh('billing')}
                disabled={retrying === 'billing'}
              >
                {retrying === 'billing' ? (
                  <><Clock className="w-4 h-4 mr-1" /> Refreshing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-1" /> Refresh</>
                )}
              </Button>
              {handoffStatus.billing.status !== 'sent' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleRetry('billing')}
                  disabled={retrying === 'billing'}
                >
                  {retrying === 'billing' ? 'Retrying...' : 'Retry'}
                </Button>
              )}
            </div>
          </div>

          {/* Follow-up */}
          <div className="p-4 bg-neutral-50 rounded-lg border-2 border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-600" />
                <span className="text-body font-medium">Follow-up</span>
              </div>
              <Badge status={handoffStatus.followUp.status === 'sent' ? 'delivered' : 'pending'}>
                {handoffStatus.followUp.status === 'sent' ? 'Scheduled' : 'Pending'}
              </Badge>
            </div>
            {handoffStatus.followUp.timestamp && (
              <p className="text-xs text-neutral-600 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Sent at {handoffStatus.followUp.timestamp}
              </p>
            )}
            {handoffStatus.followUp.attempts > 0 && (
              <p className="text-xs text-neutral-600 mb-2">
                Attempts: {handoffStatus.followUp.attempts}
              </p>
            )}
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleRefresh('followUp')}
                disabled={retrying === 'followUp'}
              >
                {retrying === 'followUp' ? (
                  <><Clock className="w-4 h-4 mr-1" /> Refreshing...</>
                ) : (
                  <><RefreshCw className="w-4 h-4 mr-1" /> Refresh</>
                )}
              </Button>
              {handoffStatus.followUp.status !== 'sent' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleRetry('followUp')}
                  disabled={retrying === 'followUp'}
                >
                  {retrying === 'followUp' ? 'Retrying...' : 'Retry'}
                </Button>
              )}
            </div>
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
