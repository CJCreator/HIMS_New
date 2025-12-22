import { useState } from 'react';
import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card, Input } from '@/components';

interface VitalSignsProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}

export function VitalSigns({ onNext, onPrevious, onSave }: VitalSignsProps) {
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
  });

  const handleChange = (field: string, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const isComplete = Object.values(vitals).some(value => value.trim() !== '');

  return (
    <ConsultationLayout
      currentStep={3}
      totalSteps={14}
      title="Vital Signs Entry"
      onNext={onNext}
      onPrevious={onPrevious}
      onSave={onSave}
      onSkip={onNext}
      nextDisabled={!isComplete}
    >
      <Card>
        <h2 className="text-h4 text-neutral-900 mb-6">Record Patient Vital Signs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-body font-medium text-neutral-900 mb-4">Primary Vitals</h3>
            <div className="space-y-4">
              <Input
                label="Blood Pressure (mmHg)"
                placeholder="120/80"
                value={vitals.bloodPressure}
                onChange={(e) => handleChange('bloodPressure', e.target.value)}
              />
              <Input
                label="Heart Rate (bpm)"
                placeholder="72"
                type="number"
                value={vitals.heartRate}
                onChange={(e) => handleChange('heartRate', e.target.value)}
              />
              <Input
                label="Temperature (°F)"
                placeholder="98.6"
                type="number"
                step="0.1"
                value={vitals.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
              />
              <Input
                label="Respiratory Rate (breaths/min)"
                placeholder="16"
                type="number"
                value={vitals.respiratoryRate}
                onChange={(e) => handleChange('respiratoryRate', e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-body font-medium text-neutral-900 mb-4">Additional Measurements</h3>
            <div className="space-y-4">
              <Input
                label="Oxygen Saturation (%)"
                placeholder="98"
                type="number"
                value={vitals.oxygenSaturation}
                onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
              />
              <Input
                label="Weight (kg)"
                placeholder="70"
                type="number"
                step="0.1"
                value={vitals.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
              <Input
                label="Height (cm)"
                placeholder="175"
                type="number"
                value={vitals.height}
                onChange={(e) => handleChange('height', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-neutral-50 rounded-small">
          <h4 className="text-body font-medium text-neutral-900 mb-2">Quick Reference</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-body-sm text-neutral-600">
            <div>
              <strong>Normal BP:</strong> 120/80 mmHg
            </div>
            <div>
              <strong>Normal HR:</strong> 60-100 bpm
            </div>
            <div>
              <strong>Normal Temp:</strong> 98.6°F
            </div>
            <div>
              <strong>Normal O2:</strong> 95-100%
            </div>
          </div>
        </div>
      </Card>
    </ConsultationLayout>
  );
}