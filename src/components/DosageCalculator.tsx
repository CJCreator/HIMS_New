import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';

interface DosageResult {
  medication: string;
  calculatedDose: number;
  unit: string;
  frequency: string;
  maxDailyDose: number;
  warnings: string[];
  adjustments: string[];
}

export const DosageCalculator: React.FC = () => {
  const [patientData, setPatientData] = useState({
    weight: '',
    age: '',
    creatinine: '',
    medication: ''
  });
  const [result, setResult] = useState<DosageResult | null>(null);

  const medications = [
    'Paracetamol',
    'Ibuprofen',
    'Amoxicillin',
    'Metformin',
    'Lisinopril',
    'Warfarin'
  ];

  const calculateDosage = () => {
    const weight = parseFloat(patientData.weight);
    const age = parseInt(patientData.age);
    const creatinine = parseFloat(patientData.creatinine);

    // Mock calculation logic
    let calculatedDose = 0;
    let unit = 'mg';
    let frequency = 'twice daily';
    let maxDailyDose = 0;
    const warnings: string[] = [];
    const adjustments: string[] = [];

    switch (patientData.medication) {
      case 'Paracetamol':
        calculatedDose = Math.min(weight * 15, 1000);
        maxDailyDose = 4000;
        frequency = 'every 6 hours';
        if (age > 65) warnings.push('Reduce dose in elderly patients');
        break;
      case 'Ibuprofen':
        calculatedDose = Math.min(weight * 5, 400);
        maxDailyDose = 1200;
        frequency = 'three times daily';
        if (creatinine > 1.5) {
          warnings.push('Caution in renal impairment');
          adjustments.push('Consider dose reduction');
        }
        break;
      case 'Amoxicillin':
        calculatedDose = weight * 20;
        maxDailyDose = 3000;
        frequency = 'three times daily';
        if (creatinine > 2.0) {
          adjustments.push('Extend dosing interval to 12 hours');
        }
        break;
      default:
        calculatedDose = 500;
        maxDailyDose = 1000;
    }

    if (age > 75) {
      warnings.push('Consider dose reduction in elderly patients');
    }

    setResult({
      medication: patientData.medication,
      calculatedDose,
      unit,
      frequency,
      maxDailyDose,
      warnings,
      adjustments
    });
  };

  const isFormValid = patientData.weight && patientData.age && patientData.medication;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Weight (kg)"
            type="number"
            value={patientData.weight}
            onChange={(e) => setPatientData({ ...patientData, weight: e.target.value })}
            placeholder="Enter patient weight"
          />
          
          <Input
            label="Age (years)"
            type="number"
            value={patientData.age}
            onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
            placeholder="Enter patient age"
          />
          
          <Input
            label="Serum Creatinine (mg/dL)"
            type="number"
            step="0.1"
            value={patientData.creatinine}
            onChange={(e) => setPatientData({ ...patientData, creatinine: e.target.value })}
            placeholder="Optional - for renal dosing"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
            <select
              value={patientData.medication}
              onChange={(e) => setPatientData({ ...patientData, medication: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
            >
              <option value="">Select medication</option>
              {medications.map((med) => (
                <option key={med} value={med}>{med}</option>
              ))}
            </select>
          </div>
        </div>

        <Button 
          onClick={calculateDosage} 
          disabled={!isFormValid}
          variant="primary"
        >
          Calculate Dosage
        </Button>
      </Card>

      {result && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dosage Calculation Result</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">{result.medication}</h3>
            <div className="text-2xl font-bold text-blue-800 mb-1">
              {result.calculatedDose} {result.unit}
            </div>
            <p className="text-blue-700">{result.frequency}</p>
            <p className="text-sm text-blue-600 mt-2">
              Maximum daily dose: {result.maxDailyDose} {result.unit}
            </p>
          </div>

          {result.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-yellow-900 mb-2">⚠️ Warnings</h4>
              <ul className="text-yellow-800 space-y-1">
                {result.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {result.adjustments.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-orange-900 mb-2">📋 Dose Adjustments</h4>
              <ul className="text-orange-800 space-y-1">
                {result.adjustments.map((adjustment, index) => (
                  <li key={index} className="text-sm">• {adjustment}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" size="sm">
              View Prescribing Info
            </Button>
            <Button variant="primary" size="sm">
              Add to Prescription
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};