import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { RootState } from '../store';
import { overrideInteraction } from '../store/drugInteractionSlice';

interface DrugInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed?: () => void;
  allowOverride?: boolean;
}

const DrugInteractionModal: React.FC<DrugInteractionModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  allowOverride = true
}) => {
  const dispatch = useDispatch();
  const { currentCheck } = useSelector((state: RootState) => state.drugInteraction);
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideForm, setShowOverrideForm] = useState(false);



  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'contraindicated':
      case 'major':
      case 'severe':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'moderate':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      contraindicated: 'bg-red-100 text-red-800',
      major: 'bg-red-100 text-red-800',
      severe: 'bg-red-100 text-red-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      minor: 'bg-blue-100 text-blue-800',
      mild: 'bg-blue-100 text-blue-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleOverride = () => {
    if (overrideReason.trim() && currentCheck) {
      dispatch(overrideInteraction({ checkId: currentCheck.patientId, reason: overrideReason }));
      if (onProceed) onProceed();
      onClose();
    }
  };

  if (!isOpen || !currentCheck) return null;
  
  const { interactions, warnings } = currentCheck;
  
  const hasHighSeverity = [...interactions, ...warnings].some(item => {
    return ['contraindicated', 'major', 'severe'].includes(item.severity);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Drug Safety Alert</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {interactions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Drug Interactions</h3>
              <div className="space-y-4">
                {interactions.map((interaction) => (
                  <div key={interaction.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {getSeverityIcon(interaction.severity)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {interaction.drug1} + {interaction.drug2}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityBadge(interaction.severity)}`}>
                            {interaction.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{interaction.description}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Mechanism:</strong> {interaction.mechanism}</p>
                          <p><strong>Clinical Effect:</strong> {interaction.clinicalEffect}</p>
                          <p><strong>Management:</strong> {interaction.management}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {warnings.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Allergy Warnings</h3>
              <div className="space-y-4">
                {warnings.map((warning) => (
                  <div key={warning.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {getSeverityIcon(warning.severity)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{warning.drug}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityBadge(warning.severity)}`}>
                            {warning.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          <strong>Allergen:</strong> {warning.allergen}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Reaction:</strong> {warning.reaction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allowOverride && !showOverrideForm && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowOverrideForm(true)}
                className={`px-4 py-2 text-white rounded-md ${
                  hasHighSeverity 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                Override Warning
              </button>
            </div>
          )}

          {showOverrideForm && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Override Justification</h4>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Please provide a clinical justification for overriding this warning..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowOverrideForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOverride}
                  disabled={!overrideReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Override
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrugInteractionModal;