import { Card, Button, Badge } from '@/components';
import { PatientOverviewHub } from './PatientOverviewHub';
import { ClinicalAssessmentCenter } from './ClinicalAssessmentCenter';
import { TreatmentPlanHub } from './TreatmentPlanHub';
import { FinalReviewStation } from './FinalReviewStation';
import { SummaryHandoffDashboard } from './SummaryHandoffDashboard';
import { useConsultationState } from '@/hooks/useConsultationState';

export function UnifiedConsultationFlow() {
  const { state, currentStep, updateStep, saveData, resetConsultation } = useConsultationState('P001', 'phase1');

  const steps = [
    { id: 1, name: 'Patient Overview', component: PatientOverviewHub },
    { id: 2, name: 'Clinical Assessment', component: ClinicalAssessmentCenter },
    { id: 3, name: 'Treatment Plan', component: TreatmentPlanHub },
    { id: 4, name: 'Final Review', component: FinalReviewStation },
    { id: 5, name: 'Summary & Handoff', component: SummaryHandoffDashboard }
  ];

  const handleNext = () => {
    if (currentStep < 5) updateStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) updateStep(currentStep - 1);
  };

  const handleSave = () => {
    alert('Draft saved successfully!');
  };

  const CurrentComponent = steps[currentStep - 1].component;

  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-neutral-900">Unified Consultation Flow (Phase 1)</h2>
          <Badge status="pending">Step {currentStep} of 5</Badge>
        </div>
        <div className="flex gap-2">
          {steps.map((step) => (
            <div key={step.id} className="flex-1">
              <div className={`h-2 rounded-full ${
                step.id < currentStep ? 'bg-success' :
                step.id === currentStep ? 'bg-primary' :
                'bg-neutral-200'
              }`} />
              <p className={`text-xs mt-1 ${
                step.id === currentStep ? 'text-primary font-medium' : 'text-neutral-600'
              }`}>
                {step.name}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Current Step Component */}
      <CurrentComponent
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSave={handleSave}
        data={state}
        setData={(data: any) => saveData('', data)}
      />
    </div>
  );
}
