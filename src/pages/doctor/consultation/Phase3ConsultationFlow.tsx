import { useState } from 'react';
import { Card, Button, Badge } from '@/components';
import { PatientOverviewHub } from './PatientOverviewHub';
import { ClinicalAssessmentCenter } from './ClinicalAssessmentCenter';
import { TreatmentPlanHub } from './TreatmentPlanHub';
import { FinalReviewStation } from './FinalReviewStation';
import { SummaryHandoffDashboard } from './SummaryHandoffDashboard';
import { CollaborationWorkspace } from '@/components/CollaborationWorkspace';
import { AutomatedQualityChecks } from '@/components/AutomatedQualityChecks';
import { ParallelProcessingOrchestrator } from '@/components/ParallelProcessingOrchestrator';
import { AutomatedWorkflowTransitions } from '@/components/AutomatedWorkflowTransitions';

export function Phase3ConsultationFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(true);
  const [consultationData, setConsultationData] = useState(() => {
    const saved = localStorage.getItem('consultation-draft-phase3');
    return saved ? JSON.parse(saved) : {};
  });

  const steps = [
    { id: 1, name: 'Patient Overview', component: PatientOverviewHub },
    { id: 2, name: 'Clinical Assessment', component: ClinicalAssessmentCenter },
    { id: 3, name: 'Treatment Plan', component: TreatmentPlanHub },
    { id: 4, name: 'Final Review', component: FinalReviewStation },
    { id: 5, name: 'Summary & Handoff', component: SummaryHandoffDashboard }
  ];

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    localStorage.setItem('consultation-draft-phase3', JSON.stringify(consultationData));
    alert('Draft saved successfully!');
  };

  const CurrentComponent = steps[currentStep - 1].component;

  return (
    <div className="space-y-4">
      {/* Progress Indicator */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-neutral-900">Phase 3: Workflow Optimization</h2>
          <div className="flex gap-2">
            <Badge status="pending">Step {currentStep} of 5</Badge>
            <Button size="sm" variant="secondary" onClick={() => setShowWorkflow(!showWorkflow)}>
              {showWorkflow ? 'Hide' : 'Show'} Workflow
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowCollaboration(!showCollaboration)}>
              {showCollaboration ? 'Hide' : 'Show'} Collaboration
            </Button>
          </div>
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

      {/* Workflow Automation Panel - Temporarily disabled due to prop mismatches */}
      {/* {showWorkflow && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AutomatedWorkflowTransitions currentStep={currentStep} />
          <ParallelProcessingOrchestrator consultationData={consultationData} />
        </div>
      )} */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Consultation Flow */}
        <div className={showCollaboration ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <CurrentComponent
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSave={handleSave}
            data={consultationData}
            setData={setConsultationData}
          />
        </div>

        {/* Collaboration Panel - Temporarily disabled due to prop mismatches */}
        {/* {showCollaboration && (
          <div>
            <CollaborationWorkspace patientId="P001" />
            <div className="mt-4">
              <AutomatedQualityChecks consultationData={consultationData} />
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
