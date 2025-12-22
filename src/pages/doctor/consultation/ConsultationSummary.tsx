import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card, Button, Badge } from '@/components';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateAppointmentStatus } from '@/store/appointmentSlice';
import { addRoleNotification } from '@/store/notificationSlice';
import { addPrescription } from '@/store/prescriptionSlice';

interface ConsultationSummaryProps {
  onPrevious: () => void;
  onComplete: () => void;
  onSave: () => void;
}

export function ConsultationSummary({ onPrevious, onComplete, onSave }: ConsultationSummaryProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const consultationData = {
    patient: { name: 'John Smith', age: 45, id: 'P001' },
    vitals: { bp: '120/80', hr: '72', temp: '98.6°F', o2: '98%' },
    diagnosis: { primary: 'Hypertension', secondary: ['Type 2 Diabetes'], icd: 'I10' },
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }
    ],
    followUp: { date: '2024-02-15', type: 'Regular check-up' }
  };

  const handleSendToPharmacy = () => {
    // Add prescription to Redux store for pharmacy queue
    dispatch(addPrescription({
      patientName: consultationData.patient.name,
      patientId: consultationData.patient.id,
      doctorName: 'Dr. Wilson',
      medications: consultationData.medications.map(med => ({
        name: med.name,
        dosage: med.dosage,
        quantity: 30,
        frequency: med.frequency,
        duration: med.duration,
        instructions: ''
      })),
      priority: 'medium',
      notes: `Diagnosis: ${consultationData.diagnosis.primary}`
    }));
    
    dispatch(addRoleNotification({
      role: 'pharmacy',
      type: 'info',
      title: 'New Prescription',
      message: `Prescription for ${consultationData.patient.name} - ${consultationData.medications.length} medications`,
      priority: 'high',
      category: 'medication'
    }));
  };

  const handleComplete = () => {
    dispatch(updateAppointmentStatus({ id: 'current-appointment', status: 'completed' }));
    
    // Send prescription to pharmacy
    handleSendToPharmacy();
    
    dispatch(addRoleNotification({
      role: 'receptionist',
      type: 'info',
      title: 'Consultation Complete',
      message: `${consultationData.patient.name} ready for billing`,
      priority: 'medium',
      category: 'patient'
    }));
    
    onComplete();
    navigate('/doctor');
  };

  return (
    <ConsultationLayout
      currentStep={14}
      totalSteps={14}
      title="Consultation Summary & Print"
      onPrevious={onPrevious}
      onNext={handleComplete}
      onSave={onSave}
    >
      <div className="space-y-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-h4 text-neutral-900">Consultation Summary</h2>
            <div className="flex space-x-3">
              <Button variant="secondary">
                📧 Email to Patient
              </Button>
              <Button variant="secondary">
                🖨️ Print Summary
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-body font-medium text-neutral-900 mb-2">Patient Information</h3>
                <div className="p-3 bg-neutral-50 rounded-small">
                  <p className="text-body font-medium">{consultationData.patient.name}</p>
                  <p className="text-body-sm text-neutral-600">
                    Age: {consultationData.patient.age} • ID: {consultationData.patient.id}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-body font-medium text-neutral-900 mb-2">Vital Signs</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-neutral-50 rounded-small text-center">
                    <div className="text-body-sm text-neutral-600">Blood Pressure</div>
                    <div className="text-body font-medium">{consultationData.vitals.bp}</div>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-small text-center">
                    <div className="text-body-sm text-neutral-600">Heart Rate</div>
                    <div className="text-body font-medium">{consultationData.vitals.hr}</div>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-small text-center">
                    <div className="text-body-sm text-neutral-600">Temperature</div>
                    <div className="text-body font-medium">{consultationData.vitals.temp}</div>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-small text-center">
                    <div className="text-body-sm text-neutral-600">O2 Saturation</div>
                    <div className="text-body font-medium">{consultationData.vitals.o2}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-body font-medium text-neutral-900 mb-2">Diagnosis</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge status="delivered">Primary</Badge>
                    <span className="text-body">{consultationData.diagnosis.primary}</span>
                    <span className="text-body-sm text-neutral-500">({consultationData.diagnosis.icd})</span>
                  </div>
                  {consultationData.diagnosis.secondary.map((diag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge status="pending">Secondary</Badge>
                      <span className="text-body">{diag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-body font-medium text-neutral-900 mb-2">Prescribed Medications</h3>
                <div className="space-y-3">
                  {consultationData.medications.map((med, index) => (
                    <div key={index} className="p-3 border border-neutral-200 rounded-small">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-body font-medium">{med.name}</span>
                        <span className="text-body-sm text-neutral-600">{med.dosage}</span>
                      </div>
                      <div className="text-body-sm text-neutral-600">
                        {med.frequency} • {med.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-body font-medium text-neutral-900 mb-2">Follow-up</h3>
                <div className="p-3 bg-doctor/10 rounded-small">
                  <div className="text-body font-medium text-doctor">{consultationData.followUp.date}</div>
                  <div className="text-body-sm text-neutral-600">{consultationData.followUp.type}</div>
                </div>
              </div>

              <div>
                <h3 className="text-body font-medium text-neutral-900 mb-2">Consultation Status</h3>
                <div className="flex items-center space-x-2">
                  <Badge status="delivered">Completed</Badge>
                  <span className="text-body-sm text-neutral-600">
                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-body font-medium text-neutral-900 mb-4">Next Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="secondary" className="justify-start">
              📋 Generate Report
            </Button>
            <Button variant="secondary" className="justify-start">
              📅 Schedule Follow-up
            </Button>
            <Button variant="secondary" className="justify-start">
              💊 Send to Pharmacy
            </Button>
          </div>
        </Card>
      </div>
    </ConsultationLayout>
  );
}