import { useState } from 'react';
import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card, Input } from '@/components';

interface PhysicalExaminationProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onSkip: () => void;
}

function PhysicalExamination({ onNext, onPrevious, onSave, onSkip }: PhysicalExaminationProps) {
  const [examination, setExamination] = useState({
    general: '',
    head: '',
    chest: '',
    abdomen: '',
    extremities: '',
    neurological: '',
    skin: '',
    notes: ''
  });

  const updateExamination = (field: string, value: string) => {
    setExamination(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ConsultationLayout
      currentStep={6}
      totalSteps={14}
      title="Physical Examination"
      onNext={onNext}
      onPrevious={onPrevious}
      onSave={onSave}
      onSkip={onSkip}
    >
      <Card>
        <h2 className="text-h4 text-neutral-900 mb-6">Physical Examination Findings</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="General Appearance"
                value={examination.general}
                onChange={(e) => updateExamination('general', e.target.value)}
                placeholder="Alert, oriented, no acute distress"
              />
              
              <Input
                label="Head & Neck"
                value={examination.head}
                onChange={(e) => updateExamination('head', e.target.value)}
                placeholder="Normocephalic, atraumatic"
              />
              
              <Input
                label="Chest & Lungs"
                value={examination.chest}
                onChange={(e) => updateExamination('chest', e.target.value)}
                placeholder="Clear to auscultation bilaterally"
              />
              
              <Input
                label="Abdomen"
                value={examination.abdomen}
                onChange={(e) => updateExamination('abdomen', e.target.value)}
                placeholder="Soft, non-tender, non-distended"
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Extremities"
                value={examination.extremities}
                onChange={(e) => updateExamination('extremities', e.target.value)}
                placeholder="No edema, normal range of motion"
              />
              
              <Input
                label="Neurological"
                value={examination.neurological}
                onChange={(e) => updateExamination('neurological', e.target.value)}
                placeholder="Cranial nerves intact, normal reflexes"
              />
              
              <Input
                label="Skin"
                value={examination.skin}
                onChange={(e) => updateExamination('skin', e.target.value)}
                placeholder="Warm, dry, no rashes"
              />
            </div>
          </div>

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">
              Additional Examination Notes
            </label>
            <textarea
              rows={4}
              value={examination.notes}
              onChange={(e) => updateExamination('notes', e.target.value)}
              placeholder="Any additional physical examination findings..."
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="p-4 bg-info/10 rounded-small">
            <h4 className="text-body font-medium text-info mb-2">💡 Examination Tips</h4>
            <ul className="text-body-sm text-neutral-600 space-y-1">
              <li>• Document both normal and abnormal findings</li>
              <li>• Be specific about location and characteristics</li>
              <li>• Include relevant negative findings</li>
              <li>• Use standard medical terminology</li>
            </ul>
          </div>
        </div>
      </Card>
    </ConsultationLayout>
  );
}

export default PhysicalExamination;