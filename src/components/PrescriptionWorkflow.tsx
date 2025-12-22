import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface PrescriptionWorkflowProps {
  patientId: string;
  onComplete?: () => void;
}

export function PrescriptionWorkflow({ patientId, onComplete }: PrescriptionWorkflowProps) {
  const dispatch = useDispatch();
  const prescriptionState = useSelector((state: RootState) => state.prescriptions);
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3>Step 1: Medication Selection</h3>
            <p>Select medications for the prescription</p>
          </div>
        );
      case 2:
        return (
          <div>
            <h3>Step 2: Dosage & Instructions</h3>
            <p>Set dosage and administration instructions</p>
          </div>
        );
      case 3:
        return (
          <div>
            <h3>Step 3: Drug Interactions Check</h3>
            <p>Review potential drug interactions</p>
          </div>
        );
      case 4:
        return (
          <div>
            <h3>Step 4: Review & Submit</h3>
            <p>Final review before submitting prescription</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2>Prescription Workflow</h2>
            <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          {renderStep()}
        </div>

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
          >
            {currentStep === 4 ? 'Submit Prescription' : 'Next'}
          </Button>
        </div>
      </div>
    </Card>
  );
}