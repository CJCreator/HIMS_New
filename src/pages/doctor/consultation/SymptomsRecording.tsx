import { useState } from 'react';
import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card } from '@/components';

interface SymptomsRecordingProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onSkip: () => void;
}

const commonSymptoms = [
  'Fever', 'Headache', 'Cough', 'Shortness of breath', 'Chest pain',
  'Nausea', 'Vomiting', 'Diarrhea', 'Fatigue', 'Dizziness',
  'Joint pain', 'Muscle aches', 'Rash', 'Swelling', 'Weight loss'
];

export function SymptomsRecording({ onNext, onPrevious, onSave, onSkip }: SymptomsRecordingProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalSymptoms, setAdditionalSymptoms] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <ConsultationLayout
      currentStep={5}
      totalSteps={14}
      title="Symptoms Recording"
      onNext={onNext}
      onPrevious={onPrevious}
      onSave={onSave}
      onSkip={onSkip}
    >
      <Card>
        <h2 className="text-h4 text-neutral-900 mb-6">Record Patient Symptoms</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-body font-medium text-neutral-900 mb-4">Common Symptoms</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-3 text-body-sm border rounded-small transition-colors ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-doctor text-white border-doctor'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-doctor'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">
              Additional Symptoms
            </label>
            <textarea
              rows={4}
              value={additionalSymptoms}
              onChange={(e) => setAdditionalSymptoms(e.target.value)}
              placeholder="Describe any other symptoms not listed above..."
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {selectedSymptoms.length > 0 && (
            <div className="p-4 bg-doctor/10 rounded-small">
              <h4 className="text-body font-medium text-doctor mb-2">Selected Symptoms:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="px-2 py-1 bg-doctor text-white text-body-sm rounded-minimal"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </ConsultationLayout>
  );
}