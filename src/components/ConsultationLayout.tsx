import { ReactNode } from 'react';
import { Button } from './Button';

interface ConsultationLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onSave?: () => void;
  onSkip?: () => void;
  nextDisabled?: boolean;
}

export function ConsultationLayout({
  children,
  currentStep,
  totalSteps,
  title,
  onNext,
  onPrevious,
  onSave,
  onSkip,
  nextDisabled = false,
}: ConsultationLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h3 text-neutral-900">{title}</h1>
            <p className="text-body-sm text-neutral-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="tertiary" onClick={onSave}>
              Save Draft
            </Button>
            {onSkip && (
              <Button variant="tertiary" onClick={onSkip}>
                Skip Step
              </Button>
            )}
            <Button variant="secondary" onClick={() => window.history.back()}>
              Exit
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-doctor h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between">
          <Button
            variant="secondary"
            onClick={onPrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={nextDisabled}
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}