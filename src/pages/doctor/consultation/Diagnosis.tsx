import { useState } from 'react';
import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card, Input, Button } from '@/components';
import { DiagnosisSuggester } from '@/components/DiagnosisSuggester';
import { ICD10Search } from '@/components/ICD10Search';

interface DiagnosisProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}

export function Diagnosis({ onNext, onPrevious, onSave }: DiagnosisProps) {
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [secondaryDiagnoses, setSecondaryDiagnoses] = useState<string[]>(['']);
  const [icdCode, setIcdCode] = useState('');
  const [severity, setSeverity] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuggester, setShowSuggester] = useState(false);
  const [showICD10, setShowICD10] = useState(false);

  const addSecondaryDiagnosis = () => {
    setSecondaryDiagnoses([...secondaryDiagnoses, '']);
  };

  const updateSecondaryDiagnosis = (index: number, value: string) => {
    const updated = [...secondaryDiagnoses];
    updated[index] = value;
    setSecondaryDiagnoses(updated);
  };

  const removeSecondaryDiagnosis = (index: number) => {
    setSecondaryDiagnoses(secondaryDiagnoses.filter((_, i) => i !== index));
  };

  const isComplete = primaryDiagnosis.trim() !== '';

  return (
    <ConsultationLayout
      currentStep={7}
      totalSteps={14}
      title="Diagnosis Entry"
      onNext={onNext}
      onPrevious={onPrevious}
      onSave={onSave}
      onSkip={onNext}
      nextDisabled={!isComplete}
    >
      <Card>
        <h2 className="text-h4 text-neutral-900 mb-6">Enter Diagnosis</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex gap-2">
              <Input
                label="Primary Diagnosis *"
                placeholder="Enter primary diagnosis"
                value={primaryDiagnosis}
                onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                className="flex-1"
              />
              <div className="flex flex-col justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setShowSuggester(!showSuggester)}>
                  AI Suggest
                </Button>
              </div>
            </div>
            {showSuggester && (
              <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                <DiagnosisSuggester />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex gap-2">
                <Input
                  label="ICD-10 Code"
                  placeholder="e.g., I10"
                  value={icdCode}
                  onChange={(e) => setIcdCode(e.target.value)}
                  className="flex-1"
                />
                <div className="flex flex-col justify-end">
                  <Button variant="secondary" size="sm" onClick={() => setShowICD10(!showICD10)}>
                    Search
                  </Button>
                </div>
              </div>
              {showICD10 && (
                <div className="mt-2 p-3 border rounded-lg bg-gray-50 max-h-64 overflow-y-auto">
                  <ICD10Search />
                </div>
              )}
            </div>
            <div>
              <label className="block text-body font-medium text-neutral-700 mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select severity</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-body font-medium text-neutral-700">
                Secondary Diagnoses
              </label>
              <Button variant="tertiary" size="sm" onClick={addSecondaryDiagnosis}>
                + Add
              </Button>
            </div>
            <div className="space-y-3">
              {secondaryDiagnoses.map((diagnosis, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Secondary diagnosis ${index + 1}`}
                    value={diagnosis}
                    onChange={(e) => updateSecondaryDiagnosis(index, e.target.value)}
                  />
                  {secondaryDiagnoses.length > 1 && (
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={() => removeSecondaryDiagnosis(index)}
                      className="text-error"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">
              Clinical Notes
            </label>
            <textarea
              rows={4}
              placeholder="Additional clinical observations and notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="p-4 bg-info/10 rounded-small">
            <h4 className="text-body font-medium text-info mb-2">💡 Diagnosis Guidelines</h4>
            <ul className="text-body-sm text-neutral-600 space-y-1">
              <li>• Be specific and use standard medical terminology</li>
              <li>• Include ICD-10 codes when available</li>
              <li>• Consider differential diagnoses</li>
              <li>• Document severity and clinical significance</li>
            </ul>
          </div>
        </div>
      </Card>
    </ConsultationLayout>
  );
}