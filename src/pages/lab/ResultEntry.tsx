import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addLabResults } from '../../store/labSlice';
import { Card, Button, Input } from '../../components';
import { CriticalValueAlert } from '../../components/CriticalValueAlert';

interface TestResult {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical';
}

export const ResultEntry: React.FC = () => {
  const dispatch = useDispatch();
  const [orderId] = useState('LAB001');
  const [patientName] = useState('John Doe');
  const [results, setResults] = useState<TestResult[]>([
    { name: 'Hemoglobin', value: '', unit: 'g/dL', normalRange: '12.0-15.5', status: 'normal' },
    { name: 'White Blood Count', value: '', unit: '10³/μL', normalRange: '4.5-11.0', status: 'normal' },
    { name: 'Glucose', value: '', unit: 'mg/dL', normalRange: '70-100', status: 'normal' }
  ]);

  const updateResult = (index: number, value: string) => {
    const updated = [...results];
    updated[index].value = value;
    
    // Simple validation for critical values
    if (updated[index].name === 'Glucose' && parseFloat(value) > 200) {
      updated[index].status = 'critical';
    } else if (updated[index].name === 'Hemoglobin' && parseFloat(value) < 8) {
      updated[index].status = 'critical';
    } else {
      updated[index].status = 'normal';
    }
    
    setResults(updated);
  };

  const criticalValues = results
    .filter(r => r.status === 'critical' && r.value)
    .map(r => ({
      testName: r.name,
      value: `${r.value} ${r.unit}`,
      normalRange: r.normalRange,
      severity: 'critical' as const
    }));

  const handleSubmit = () => {
    const labResults = results
      .filter(r => r.value)
      .reduce((acc, r) => {
        acc[r.name] = { value: r.value, status: r.status };
        return acc;
      }, {} as { [key: string]: { value: string; status: 'normal' | 'abnormal' | 'critical' } });
    
    dispatch(addLabResults({
      orderId,
      results: labResults
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Result Entry</h1>
          <p className="text-gray-600">Order #{orderId} - {patientName}</p>
        </div>
      </div>

      {criticalValues.length > 0 && (
        <CriticalValueAlert
          values={criticalValues}
          patientName={patientName}
          onNotifyDoctor={() => alert('Doctor notified')}
          onAcknowledge={() => alert('Acknowledged')}
        />
      )}

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h2>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={result.name} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <p className="font-medium text-gray-900">{result.name}</p>
                <p className="text-sm text-gray-600">Normal: {result.normalRange}</p>
              </div>
              <Input
                type="number"
                placeholder="Enter value"
                value={result.value}
                onChange={(e) => updateResult(index, e.target.value)}
                className={result.status === 'critical' ? 'border-red-500' : ''}
              />
              <span className="text-sm text-gray-600">{result.unit}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                result.status === 'critical' ? 'bg-red-100 text-red-800' :
                result.status === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {result.status}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary">Save Draft</Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!results.some(r => r.value)}
          >
            Submit Results
          </Button>
        </div>
      </Card>
    </div>
  );
};