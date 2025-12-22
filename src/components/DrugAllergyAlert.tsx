import { Allergy } from '@/store/allergySlice';
import { Button } from './Button';

interface DrugAllergyAlertProps {
  conflicts: Array<{
    drug: string;
    allergy: Allergy;
    severity: 'mild' | 'moderate' | 'severe';
    message: string;
  }>;
  onOverride?: (reason: string) => void;
  onCancel?: () => void;
}

export function DrugAllergyAlert({ conflicts, onOverride, onCancel }: DrugAllergyAlertProps) {
  const [showOverride, setShowOverride] = React.useState(false);
  const [overrideReason, setOverrideReason] = React.useState('');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'bg-error-50 border-error-300';
      case 'moderate':
        return 'bg-warning-50 border-warning-300';
      default:
        return 'bg-yellow-50 border-yellow-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'severe':
        return '🚨';
      case 'moderate':
        return '⚠️';
      default:
        return '⚡';
    }
  };

  return (
    <div className="space-y-3">
      {conflicts.map((conflict, idx) => (
        <div key={idx} className={`p-4 border-2 rounded-lg ${getSeverityColor(conflict.severity)}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{getSeverityIcon(conflict.severity)}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-neutral-900 mb-1">
                Drug Allergy Alert - {conflict.severity.toUpperCase()}
              </p>
              <p className="text-sm text-neutral-800 mb-2">{conflict.message}</p>
              <div className="text-xs text-neutral-700 bg-white bg-opacity-50 p-2 rounded">
                <p><strong>Allergen:</strong> {conflict.allergy.allergen}</p>
                <p><strong>Reaction:</strong> {conflict.allergy.reaction}</p>
                {conflict.allergy.notes && <p><strong>Notes:</strong> {conflict.allergy.notes}</p>}
              </div>
            </div>
          </div>
        </div>
      ))}

      {onOverride && !showOverride && (
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Cancel Prescription
          </Button>
          <Button
            onClick={() => setShowOverride(true)}
            className="flex-1 bg-warning hover:bg-warning-600"
          >
            Override with Reason
          </Button>
        </div>
      )}

      {showOverride && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Override Reason (Required)
            </label>
            <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Explain why this medication is necessary despite the allergy..."
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowOverride(false)} className="flex-1">
              Back
            </Button>
            <Button
              onClick={() => onOverride?.(overrideReason)}
              disabled={!overrideReason.trim()}
              className="flex-1"
            >
              Confirm Override
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
