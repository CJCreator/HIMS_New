import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ICD10Selector } from './ICD10Selector';
import { Button } from './Button';
import { Card } from './Card';
import { AlertCircle } from 'lucide-react';
import { addDiagnosis, updateDiagnosis, deleteDiagnosis } from '@/store/icd10Slice';
import { validatePrimaryDiagnosis } from '@/utils/icd10Validator';
import type { PatientDiagnosis } from '@/types/icd10.types';
import type { AppDispatch } from '@/store';
import { toast } from 'sonner';

interface DiagnosisFormProps {
  patientId: string;
  consultationId?: string;
  initialDiagnoses?: PatientDiagnosis[];
  onSave?: (diagnoses: PatientDiagnosis[]) => void;
  onCancel?: () => void;
  billableOnly?: boolean;
  className?: string;
}

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({
  patientId,
  consultationId,
  initialDiagnoses = [],
  onSave,
  onCancel,
  billableOnly = false,
  className = ''
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [diagnoses, setDiagnoses] = useState<PatientDiagnosis[]>(initialDiagnoses);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleAdd = async (diagnosis: Partial<PatientDiagnosis>) => {
    try {
      const newDiagnosis: Partial<PatientDiagnosis> = {
        ...diagnosis,
        patientId,
        consultationId,
        diagnosedBy: 'current-user-id', // Get from auth context
        diagnosedAt: new Date().toISOString()
      };

      const result = await dispatch(addDiagnosis({ 
        patientId, 
        diagnosis: newDiagnosis 
      })).unwrap();

      setDiagnoses(prev => [...prev, result]);
      toast.success('Diagnosis added successfully');
    } catch (error) {
      toast.error('Failed to add diagnosis');
      console.error(error);
    }
  };

  const handleUpdate = async (diagnosisId: string, updates: Partial<PatientDiagnosis>) => {
    try {
      const result = await dispatch(updateDiagnosis({ 
        diagnosisId, 
        updates 
      })).unwrap();

      setDiagnoses(prev => 
        prev.map(d => d.id === diagnosisId ? result : d)
      );
      toast.success('Diagnosis updated');
    } catch (error) {
      toast.error('Failed to update diagnosis');
      console.error(error);
    }
  };

  const handleRemove = async (diagnosisId: string) => {
    try {
      await dispatch(deleteDiagnosis(diagnosisId)).unwrap();
      setDiagnoses(prev => prev.filter(d => d.id !== diagnosisId));
      toast.success('Diagnosis removed');
    } catch (error) {
      toast.error('Failed to remove diagnosis');
      console.error(error);
    }
  };

  const handleSave = async () => {
    // Validate
    const validationErrors: string[] = [];

    if (diagnoses.length === 0) {
      validationErrors.push('At least one diagnosis is required');
    }

    if (!validatePrimaryDiagnosis(diagnoses)) {
      validationErrors.push('A primary diagnosis is required');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix validation errors');
      return;
    }

    setSaving(true);
    setErrors([]);

    try {
      if (onSave) {
        await onSave(diagnoses);
      }
      toast.success('Diagnoses saved successfully');
    } catch (error) {
      toast.error('Failed to save diagnoses');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Patient Diagnoses
          </h2>
          <p className="text-sm text-gray-600">
            Add and manage ICD-10 coded diagnoses for this patient
          </p>
        </div>

        {errors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Validation Errors:
            </h4>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <ICD10Selector
          selectedCodes={diagnoses}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onUpdate={handleUpdate}
          billableOnly={billableOnly}
          requirePrimary={true}
          maxCodes={10}
        />

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {diagnoses.length} diagnosis(es) • 
            {diagnoses.filter(d => d.diagnosisType === 'primary').length} primary
          </div>
          
          <div className="flex gap-3">
            {onCancel && (
              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={saving}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={diagnoses.length === 0}
            >
              Save Diagnoses
            </Button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Tips for Accurate Coding
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use the most specific code available</li>
            <li>• Ensure at least one primary diagnosis</li>
            <li>• Verify codes are billable for insurance claims</li>
            <li>• Check for code exclusions and conflicts</li>
            <li>• Document clinical justification in notes</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
