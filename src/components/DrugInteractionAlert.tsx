import React from 'react';
import { useSelector } from 'react-redux';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { RootState } from '../store';

interface DrugInteractionAlertProps {
  onViewDetails?: () => void;
}

const DrugInteractionAlert: React.FC<DrugInteractionAlertProps> = ({
  onViewDetails
}) => {
  const { currentCheck } = useSelector((state: RootState) => state.drugInteraction);
  
  if (!currentCheck || (currentCheck.interactions.length === 0 && currentCheck.warnings.length === 0)) {
    return null;
  }
  
  const { interactions, warnings } = currentCheck;

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'contraindicated':
      case 'major':
      case 'severe':
        return 'border-red-200 bg-red-50';
      case 'moderate':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const highestSeverity = [...interactions, ...warnings].reduce((max, item) => {
    const severity = item.severity;
    const severityOrder = { minor: 1, mild: 1, moderate: 2, major: 3, severe: 3, contraindicated: 4 };
    return severityOrder[severity as keyof typeof severityOrder] > severityOrder[max as keyof typeof severityOrder] ? severity : max;
  }, 'minor');

  return (
    <div className={`border rounded-lg p-4 ${getSeverityColor(highestSeverity)}`}>
      <div className="flex items-start space-x-3">
        {getSeverityIcon(highestSeverity)}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">
            Drug Safety Alert
          </h4>
          
          {interactions.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-700 font-medium">Drug Interactions:</p>
              <ul className="mt-1 space-y-1">
                {interactions.map((interaction) => (
                  <li key={interaction.id} className="text-sm text-gray-600">
                    {interaction.drug1} + {interaction.drug2}: {interaction.description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-700 font-medium">Allergy Warnings:</p>
              <ul className="mt-1 space-y-1">
                {warnings.map((warning) => (
                  <li key={warning.id} className="text-sm text-gray-600">
                    {warning.drug}: {warning.reaction}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Details & Management
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrugInteractionAlert;