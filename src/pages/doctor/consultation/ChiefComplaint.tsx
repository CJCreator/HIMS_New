import { useState } from 'react';
import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card, Input } from '@/components';

interface ChiefComplaintProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onSkip: () => void;
}

export function ChiefComplaint({ onNext, onPrevious, onSave, onSkip }: ChiefComplaintProps) {
  const [complaint, setComplaint] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(5);
  const [onset, setOnset] = useState('');

  return (
    <ConsultationLayout
      currentStep={4}
      totalSteps={14}
      title="Chief Complaint"
      onNext={onNext}
      onPrevious={onPrevious}
      onSave={onSave}
      onSkip={onSkip}
    >
      <Card>
        <h2 className="text-h4 text-neutral-900 mb-6">Chief Complaint</h2>
        
        <div className="space-y-6">
          <Input
            label="Primary Complaint *"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            placeholder="What brings you in today?"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="How long have you had this issue?"
            />
            <div>
              <label className="block text-body font-medium text-neutral-700 mb-1">Onset</label>
              <select
                value={onset}
                onChange={(e) => setOnset(e.target.value)}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select onset</option>
                <option value="sudden">Sudden</option>
                <option value="gradual">Gradual</option>
                <option value="intermittent">Intermittent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-2">
              Pain/Discomfort Severity: {severity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-body-sm text-neutral-500 mt-1">
              <span>1 - Mild</span>
              <span>5 - Moderate</span>
              <span>10 - Severe</span>
            </div>
          </div>

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">Additional Details</label>
            <textarea
              rows={4}
              placeholder="Any additional information about the complaint..."
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </Card>
    </ConsultationLayout>
  );
}