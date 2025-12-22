import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Card } from './';
import { AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';

interface InteractionHistoryProps {
  patientId: string;
}

export const InteractionHistory: React.FC<InteractionHistoryProps> = ({ patientId }) => {
  const { checks } = useSelector((state: RootState) => state.drugInteraction);
  
  const patientChecks = checks.filter(check => check.patientId === patientId);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'contraindicated':
      case 'major':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'moderate':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'contraindicated':
      case 'major':
        return 'bg-red-50 border-red-200';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (patientChecks.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No drug interaction history available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Drug Interaction History</h3>
      
      {patientChecks.map((check, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {new Date(check.timestamp).toLocaleString()}
              </span>
            </div>
            {check.overridden && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                Overridden
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Medications Checked:</p>
              <div className="flex flex-wrap gap-2">
                {check.medications.map((med, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                    {med}
                  </span>
                ))}
              </div>
            </div>

            {check.interactions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Interactions Found:</p>
                <div className="space-y-2">
                  {check.interactions.map((interaction) => (
                    <div
                      key={interaction.id}
                      className={`p-3 border rounded ${getSeverityColor(interaction.severity)}`}
                    >
                      <div className="flex items-start space-x-2">
                        {getSeverityIcon(interaction.severity)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {interaction.drug1} + {interaction.drug2}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            {interaction.description}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-white">
                            {interaction.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {check.warnings.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Allergy Warnings:</p>
                <div className="space-y-2">
                  {check.warnings.map((warning) => (
                    <div
                      key={warning.id}
                      className="p-3 border rounded bg-red-50 border-red-200"
                    >
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{warning.drug}</p>
                          <p className="text-sm text-gray-700">
                            Allergen: {warning.allergen} - {warning.reaction}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {check.overridden && check.overrideReason && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                <p className="text-sm font-medium text-orange-900 mb-1">Override Reason:</p>
                <p className="text-sm text-orange-800">{check.overrideReason}</p>
              </div>
            )}

            {check.interactions.length === 0 && check.warnings.length === 0 && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">No interactions or warnings detected</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};