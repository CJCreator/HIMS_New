import React from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import { Button } from './';

interface CriticalValue {
  testName: string;
  value: string;
  normalRange: string;
  severity: 'high' | 'critical';
}

interface CriticalValueAlertProps {
  values: CriticalValue[];
  patientName: string;
  onNotifyDoctor: () => void;
  onAcknowledge: () => void;
}

export const CriticalValueAlert: React.FC<CriticalValueAlertProps> = ({
  values,
  patientName,
  onNotifyDoctor,
  onAcknowledge
}) => {
  if (values.length === 0) return null;

  const hasCritical = values.some(v => v.severity === 'critical');

  return (
    <div className={`border rounded-lg p-4 ${
      hasCritical ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
    }`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className={`w-6 h-6 ${
          hasCritical ? 'text-red-600' : 'text-yellow-600'
        }`} />
        <div className="flex-1">
          <h3 className={`font-semibold ${
            hasCritical ? 'text-red-900' : 'text-yellow-900'
          }`}>
            Critical Values Detected - {patientName}
          </h3>
          
          <div className="mt-3 space-y-2">
            {values.map((value, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{value.testName}:</span>
                  <span className={`ml-2 ${
                    value.severity === 'critical' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {value.value}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  Normal: {value.normalRange}
                </span>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={onNotifyDoctor}
              className="flex items-center space-x-1"
            >
              <Phone className="w-4 h-4" />
              <span>Notify Doctor</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onAcknowledge}
            >
              Acknowledge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};