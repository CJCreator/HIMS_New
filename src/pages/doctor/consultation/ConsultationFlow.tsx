import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PatientSelection } from './PatientSelection';
import { MedicalHistory } from './MedicalHistory';
// import { VitalSigns } from './VitalSigns';
import { ChiefComplaint } from './ChiefComplaint';
import { SymptomsRecording } from './SymptomsRecording';
import { PhysicalExamination } from './PhysicalExamination';
import { Diagnosis } from './Diagnosis';
import { TreatmentPlan } from './TreatmentPlan';
import { Prescription } from './Prescription';
import { LabTestOrders } from './LabTestOrders';
import { FollowUpScheduling } from './FollowUpScheduling';
import { ConsultationNotes } from './ConsultationNotes';
import { ReviewConfirm } from './ReviewConfirm';
import { ConsultationSummary } from './ConsultationSummary';
import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card, Input } from '@/components';

export function ConsultationFlow() {
  const { patientId } = useParams<{ patientId: string }>();
  const [currentStep, setCurrentStep] = useState(4); // Start from Chief Complaint
  const [selectedPatient, setSelectedPatient] = useState<string>(patientId || 'P001'); // Use URL param or default
  const navigate = useNavigate();

  const handleNext = (patientId?: string) => {
    if (patientId) setSelectedPatient(patientId);
    setCurrentStep(prev => Math.min(prev + 1, 14));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSkip = () => {
    setCurrentStep(prev => Math.min(prev + 1, 14));
  };

  const handleSave = () => {
    console.log('Saving consultation draft...');
  };

  const handleComplete = () => {
    console.log('Consultation completed');
    navigate('/doctor');
  };

  const renderStep = () => {
    const stepTitles = {
      1: 'Patient Selection',
      2: 'Medical History Review',
      3: 'Vital Signs Entry',
      4: 'Chief Complaint',
      5: 'Symptoms Recording',
      6: 'Physical Examination',
      7: 'Diagnosis Entry',
      8: 'Treatment Plan',
      9: 'Prescription Creation',
      10: 'Lab Test Orders',
      11: 'Follow-up Scheduling',
      12: 'Consultation Notes',
      13: 'Review & Confirm',
      14: 'Summary & Print'
    };

    switch (currentStep) {
      case 1:
        return <PatientSelection onNext={handleNext} onSave={handleSave} />;
      case 2:
        return <MedicalHistory onNext={() => handleNext()} onPrevious={handlePrevious} onSave={handleSave} />;
      case 3:
        return (
          <ConsultationLayout
            currentStep={3}
            totalSteps={14}
            title="Vital Signs Review"
            onNext={() => handleNext()}
            onPrevious={handlePrevious}
            onSave={handleSave}
            onSkip={handleNext}
          >
            <Card>
              <h2 className="text-h4 text-neutral-900 mb-6">Vital Signs (Recorded by Nurse)</h2>
              <div className="p-4 bg-success/10 rounded-small mb-4">
                <p className="text-body text-success mb-2">✅ Vitals completed by Nurse Sarah at 9:45 AM</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-small border">
                  <div className="text-body font-medium">Blood Pressure</div>
                  <div className="text-h4 text-neutral-900">120/80</div>
                  <div className="text-body-sm text-neutral-600">mmHg</div>
                </div>
                <div className="text-center p-3 bg-white rounded-small border">
                  <div className="text-body font-medium">Heart Rate</div>
                  <div className="text-h4 text-neutral-900">72</div>
                  <div className="text-body-sm text-neutral-600">bpm</div>
                </div>
                <div className="text-center p-3 bg-white rounded-small border">
                  <div className="text-body font-medium">Temperature</div>
                  <div className="text-h4 text-neutral-900">98.6</div>
                  <div className="text-body-sm text-neutral-600">°F</div>
                </div>
                <div className="text-center p-3 bg-white rounded-small border">
                  <div className="text-body font-medium">O2 Saturation</div>
                  <div className="text-h4 text-neutral-900">98</div>
                  <div className="text-body-sm text-neutral-600">%</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-neutral-50 rounded-small">
                <h4 className="text-body font-medium mb-2">Nursing Notes:</h4>
                <p className="text-body-sm text-neutral-600">Patient reports mild discomfort. No acute distress observed. Cooperative during vital signs collection.</p>
              </div>
            </Card>
          </ConsultationLayout>
        );
      case 4:
        return <ChiefComplaint onNext={() => handleNext()} onPrevious={handlePrevious} onSave={handleSave} onSkip={handleSkip} />;
      case 5:
        return <SymptomsRecording onNext={() => handleNext()} onPrevious={handlePrevious} onSave={handleSave} onSkip={handleSkip} />;
      case 6:
        return <PhysicalExamination onNext={() => handleNext()} onPrevious={handlePrevious} onSave={handleSave} onSkip={handleSkip} />;
      case 7:
        return <Diagnosis onNext={() => handleNext()} onPrevious={handlePrevious} onSave={handleSave} />;
      case 8:
        return <TreatmentPlan onNext={() => handleNext()} onPrevious={handlePrevious} onSave={handleSave} onSkip={handleSkip} />;
      case 9:
        return <Prescription onNext={() => handleNext()} onPrevious={handlePrevious} onSave={handleSave} />;
      case 10:
        return <LabTestOrders patientName="John Smith" patientId={selectedPatient} onNext={() => handleNext()} onPrevious={handlePrevious} />;
      case 11:
        return <FollowUpScheduling patientName="John Smith" patientId={selectedPatient} onNext={() => handleNext()} onPrevious={handlePrevious} />;
      case 12:
        return <ConsultationNotes patientName="John Smith" patientId={selectedPatient} onNext={() => handleNext()} onPrevious={handlePrevious} />;
      case 13:
        return <ReviewConfirm patientName="John Smith" patientId={selectedPatient} onNext={() => handleNext()} onPrevious={handlePrevious} />;
      case 14:
        return <ConsultationSummary onPrevious={handlePrevious} onComplete={handleComplete} onSave={handleSave} />;
      default:
        return (
          <ConsultationLayout
            currentStep={currentStep}
            totalSteps={14}
            title={stepTitles[currentStep as keyof typeof stepTitles] || `Step ${currentStep}`}
            onNext={() => handleNext()}
            onPrevious={handlePrevious}
            onSave={handleSave}
            onSkip={handleSkip}
          >
            <Card>
              <h2 className="text-h4 text-neutral-900 mb-6">{stepTitles[currentStep as keyof typeof stepTitles]}</h2>
              <div className="space-y-4">
                <p className="text-body text-neutral-600">This consultation step is ready for data entry.</p>
                <div className="p-4 bg-neutral-50 rounded-small">
                  <h3 className="text-body font-medium mb-2">Step {currentStep} Content</h3>
                  <p className="text-body-sm text-neutral-600">Complete the required information for this step or skip to continue.</p>
                </div>
                <Input placeholder={`Enter ${stepTitles[currentStep as keyof typeof stepTitles]?.toLowerCase()} information...`} />
              </div>
            </Card>
          </ConsultationLayout>
        );
    }
  };

  return <>{renderStep()}</>;
}