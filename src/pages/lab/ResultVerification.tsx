import React, { useState } from 'react';
import { Card, Button } from '../../components';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Result {
  id: string;
  orderId: string;
  patientName: string;
  testName: string;
  result: string;
  normalRange: string;
  status: 'pending' | 'verified' | 'rejected';
  enteredBy: string;
  enteredAt: string;
  critical: boolean;
}

export const ResultVerification: React.FC = () => {
  const [results] = useState<Result[]>([
    { id: '1', orderId: 'LAB-001', patientName: 'John Doe', testName: 'Complete Blood Count', result: '12.5 g/dL', normalRange: '13.5-17.5 g/dL', status: 'pending', enteredBy: 'Tech A', enteredAt: '2024-01-20 10:30', critical: false },
    { id: '2', orderId: 'LAB-002', patientName: 'Jane Smith', testName: 'Blood Glucose', result: '250 mg/dL', normalRange: '70-100 mg/dL', status: 'pending', enteredBy: 'Tech B', enteredAt: '2024-01-20 11:15', critical: true },
    { id: '3', orderId: 'LAB-003', patientName: 'Bob Johnson', testName: 'Lipid Panel', result: 'Normal', normalRange: 'Within limits', status: 'pending', enteredBy: 'Tech A', enteredAt: '2024-01-20 09:45', critical: false }
  ]);

  const handleVerify = (id: string) => {
    alert(`Result ${id} verified`);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) alert(`Result ${id} rejected: ${reason}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Result Verification</h1>
        <p className="text-gray-600 mt-1">Review and verify lab results before release</p>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className={`p-6 ${result.critical ? 'border-red-300 bg-red-50' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{result.testName}</h3>
                  {result.critical && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>CRITICAL</span>
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Order: {result.orderId} • Patient: {result.patientName}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Result</p>
                <p className="font-semibold text-gray-900">{result.result}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Normal Range</p>
                <p className="font-semibold text-gray-900">{result.normalRange}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Entered By</p>
                <p className="font-semibold text-gray-900">{result.enteredBy}</p>
                <p className="text-xs text-gray-500">{result.enteredAt}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="primary"
                onClick={() => handleVerify(result.id)}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify & Release</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleReject(result.id)}
                className="flex items-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
