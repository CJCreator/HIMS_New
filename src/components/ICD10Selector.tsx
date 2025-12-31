import React, { useState } from 'react';
import { ICD10SearchAutocomplete } from './ICD10SearchAutocomplete';
import { Button } from './Button';
import { Badge } from './Badge';
import { Edit2, X } from 'lucide-react';
import type { ICD10Code, PatientDiagnosis } from '@/types/icd10.types';

interface ICD10SelectorProps {
  selectedCodes: PatientDiagnosis[];
  onAdd: (diagnosis: Partial<PatientDiagnosis>) => void;
  onRemove: (diagnosisId: string) => void;
  onUpdate: (diagnosisId: string, updates: Partial<PatientDiagnosis>) => void;
  maxCodes?: number;
  requirePrimary?: boolean;
  billableOnly?: boolean;
  className?: string;
}

export const ICD10Selector: React.FC<ICD10SelectorProps> = ({
  selectedCodes,
  onAdd,
  onRemove,
  onUpdate,
  maxCodes = 10,
  requirePrimary = true,
  billableOnly = false,
  className = ''
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const hasPrimary = selectedCodes.some(d => d.diagnosisType === 'primary');
  const canAddMore = selectedCodes.length < maxCodes;

  const handleSelect = (code: ICD10Code) => {
    const diagnosisType = !hasPrimary && requirePrimary ? 'primary' : 'secondary';
    
    onAdd({
      icd10Code: code.code,
      icd10Details: code,
      diagnosisType,
      status: 'active',
      diagnosedAt: new Date().toISOString(),
      confidenceLevel: 'definitive'
    });
    
    setShowSearch(false);
  };

  const handleTypeChange = (diagnosisId: string, type: PatientDiagnosis['diagnosisType']) => {
    // If changing to primary, demote current primary to secondary
    if (type === 'primary') {
      const currentPrimary = selectedCodes.find(d => d.diagnosisType === 'primary');
      if (currentPrimary && currentPrimary.id !== diagnosisId) {
        onUpdate(currentPrimary.id, { diagnosisType: 'secondary' });
      }
    }
    onUpdate(diagnosisId, { diagnosisType: type });
  };

  const getDiagnosisTypeColor = (type: string): 'success' | 'info' | 'warning' | 'secondary' => {
    switch (type) {
      case 'primary': return 'success';
      case 'secondary': return 'info';
      case 'differential': return 'warning';
      case 'ruled_out': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Diagnoses ({selectedCodes.length}/{maxCodes})
        </h3>
        {canAddMore && !showSearch && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSearch(true)}
          >
            + Add Diagnosis
          </Button>
        )}
      </div>

      {requirePrimary && !hasPrimary && selectedCodes.length > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Please select a primary diagnosis
          </p>
        </div>
      )}

      {showSearch && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <ICD10SearchAutocomplete
                onSelect={handleSelect}
                billableOnly={billableOnly}
                autoFocus
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSearch(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {selectedCodes.map((diagnosis) => (
          <div
            key={diagnosis.id}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono font-semibold text-primary-600">
                    {diagnosis.icd10Code}
                  </span>
                  <Badge status={getDiagnosisTypeColor(diagnosis.diagnosisType)}>
                    {diagnosis.diagnosisType}
                  </Badge>
                  {diagnosis.icd10Details?.isBillable && (
                    <Badge status="success" size="sm">Billable</Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-900 mb-2">
                  {diagnosis.icd10Details?.description || 'Loading...'}
                </p>

                {editingId === diagnosis.id ? (
                  <div className="space-y-2 mt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={diagnosis.diagnosisType}
                        onChange={(e) => handleTypeChange(diagnosis.id, e.target.value as any)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="differential">Differential</option>
                        <option value="ruled_out">Ruled Out</option>
                      </select>
                      
                      <select
                        value={diagnosis.status}
                        onChange={(e) => onUpdate(diagnosis.id, { status: e.target.value as any })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="active">Active</option>
                        <option value="resolved">Resolved</option>
                        <option value="chronic">Chronic</option>
                        <option value="recurrent">Recurrent</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={diagnosis.severity || ''}
                        onChange={(e) => onUpdate(diagnosis.id, { severity: e.target.value as any })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="">Severity</option>
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                        <option value="critical">Critical</option>
                      </select>
                      
                      <select
                        value={diagnosis.confidenceLevel || ''}
                        onChange={(e) => onUpdate(diagnosis.id, { confidenceLevel: e.target.value as any })}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="">Confidence</option>
                        <option value="definitive">Definitive</option>
                        <option value="probable">Probable</option>
                        <option value="possible">Possible</option>
                        <option value="suspected">Suspected</option>
                      </select>
                    </div>

                    <textarea
                      value={diagnosis.notes || ''}
                      onChange={(e) => onUpdate(diagnosis.id, { notes: e.target.value })}
                      placeholder="Clinical notes..."
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      rows={2}
                    />

                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => setEditingId(null)}>
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {diagnosis.severity && (
                      <span className="capitalize">{diagnosis.severity}</span>
                    )}
                    {diagnosis.confidenceLevel && (
                      <span className="capitalize">• {diagnosis.confidenceLevel}</span>
                    )}
                    {diagnosis.status && (
                      <span className="capitalize">• {diagnosis.status}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-1">
                {editingId !== diagnosis.id && (
                  <button
                    onClick={() => setEditingId(diagnosis.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onRemove(diagnosis.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCodes.length === 0 && !showSearch && (
        <div className="p-8 text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-2">No diagnoses added</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSearch(true)}
          >
            Add First Diagnosis
          </Button>
        </div>
      )}
    </div>
  );
};
