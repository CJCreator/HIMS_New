import { useState } from 'react';
import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card, Input, Button } from '@/components';

interface TreatmentPlanProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onSkip: () => void;
}

function TreatmentPlan({ onNext, onPrevious, onSave, onSkip }: TreatmentPlanProps) {
  const [treatments, setTreatments] = useState(['']);
  const [goals, setGoals] = useState('');
  const [timeline, setTimeline] = useState('');
  const [instructions, setInstructions] = useState('');

  const addTreatment = () => {
    setTreatments([...treatments, '']);
  };

  const updateTreatment = (index: number, value: string) => {
    const updated = [...treatments];
    updated[index] = value;
    setTreatments(updated);
  };

  const removeTreatment = (index: number) => {
    setTreatments(treatments.filter((_, i) => i !== index));
  };

  return (
    <ConsultationLayout
      currentStep={8}
      totalSteps={14}
      title="Treatment Plan"
      onNext={onNext}
      onPrevious={onPrevious}
      onSave={onSave}
      onSkip={onSkip}
    >
      <Card>
        <h2 className="text-h4 text-neutral-900 mb-6">Treatment Plan</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-body font-medium text-neutral-900">Treatment Interventions</h3>
              <Button variant="secondary" size="sm" onClick={addTreatment}>
                + Add Treatment
              </Button>
            </div>
            
            <div className="space-y-3">
              {treatments.map((treatment, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Treatment ${index + 1}`}
                    value={treatment}
                    onChange={(e) => updateTreatment(index, e.target.value)}
                  />
                  {treatments.length > 1 && (
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={() => removeTreatment(index)}
                      className="text-error"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Treatment Goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Primary treatment objectives"
            />
            <Input
              label="Expected Timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g., 2-4 weeks"
            />
          </div>

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">
              Patient Instructions
            </label>
            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Detailed instructions for the patient..."
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 rounded-small text-center">
              <div className="text-body font-medium text-success">✅ Immediate</div>
              <div className="text-body-sm text-neutral-600">Start today</div>
            </div>
            <div className="p-4 bg-warning/10 rounded-small text-center">
              <div className="text-body font-medium text-warning">⏳ Short-term</div>
              <div className="text-body-sm text-neutral-600">1-2 weeks</div>
            </div>
            <div className="p-4 bg-info/10 rounded-small text-center">
              <div className="text-body font-medium text-info">🎯 Long-term</div>
              <div className="text-body-sm text-neutral-600">1+ months</div>
            </div>
          </div>
        </div>
      </Card>
    </ConsultationLayout>
  );
}

export default TreatmentPlan;