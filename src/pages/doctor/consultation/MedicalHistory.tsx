import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card } from '@/components';

interface MedicalHistoryProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}

function MedicalHistory({ onNext, onPrevious, onSave }: MedicalHistoryProps) {
  return (
    <ConsultationLayout
      currentStep={2}
      totalSteps={14}
      title="Medical History Review"
      onNext={onNext}
      onPrevious={onPrevious}
      onSave={onSave}
      onSkip={onNext}
    >
      <Card>
        <h2 className="text-h4 text-neutral-900 mb-6">Patient Medical History</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-small">
                <h3 className="text-body font-medium text-neutral-900 mb-2">Previous Visits</h3>
                <div className="space-y-2">
                  <div className="text-body-sm text-neutral-600">
                    <strong>Jan 10, 2024:</strong> Routine checkup - Normal
                  </div>
                  <div className="text-body-sm text-neutral-600">
                    <strong>Dec 15, 2023:</strong> Follow-up - Hypertension monitoring
                  </div>
                  <div className="text-body-sm text-neutral-600">
                    <strong>Nov 20, 2023:</strong> Initial consultation - Hypertension diagnosis
                  </div>
                </div>
              </div>

              <div className="p-4 bg-warning/10 rounded-small">
                <h3 className="text-body font-medium text-warning mb-2">⚠️ Known Allergies</h3>
                <div className="space-y-1">
                  <div className="text-body-sm text-neutral-700">• Penicillin - Severe reaction</div>
                  <div className="text-body-sm text-neutral-700">• Shellfish - Mild reaction</div>
                  <div className="text-body-sm text-neutral-700">• Latex - Contact dermatitis</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-info/10 rounded-small">
                <h3 className="text-body font-medium text-info mb-2">💊 Current Medications</h3>
                <div className="space-y-2">
                  <div className="text-body-sm text-neutral-700">
                    <strong>Lisinopril 10mg</strong> - Once daily, morning
                  </div>
                  <div className="text-body-sm text-neutral-700">
                    <strong>Metformin 500mg</strong> - Twice daily with meals
                  </div>
                  <div className="text-body-sm text-neutral-700">
                    <strong>Aspirin 81mg</strong> - Once daily, evening
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-small">
                <h3 className="text-body font-medium text-neutral-900 mb-2">🏥 Medical Conditions</h3>
                <div className="space-y-1">
                  <div className="text-body-sm text-neutral-700">• Hypertension (controlled)</div>
                  <div className="text-body-sm text-neutral-700">• Type 2 Diabetes (managed)</div>
                  <div className="text-body-sm text-neutral-700">• Family history of heart disease</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-success/10 rounded-small">
            <h3 className="text-body font-medium text-success mb-2">✅ Recent Lab Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-body font-medium">HbA1c</div>
                <div className="text-body-sm text-neutral-600">6.8% (Target: &lt;7%)</div>
              </div>
              <div className="text-center">
                <div className="text-body font-medium">Blood Pressure</div>
                <div className="text-body-sm text-neutral-600">130/85 mmHg</div>
              </div>
              <div className="text-center">
                <div className="text-body font-medium">Cholesterol</div>
                <div className="text-body-sm text-neutral-600">180 mg/dL</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ConsultationLayout>
  );
}

export default MedicalHistory;