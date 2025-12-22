import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';

const Plus = ({ className }: { className?: string }) => <span className={className}>➕</span>;
const X = ({ className }: { className?: string }) => <span className={className}>❌</span>;

interface DiagnosisSuggestion {
  id: string;
  condition: string;
  probability: number;
  icd10: string;
  description: string;
  keySymptoms: string[];
  differentials: string[];
}

export const DiagnosisSuggester: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [suggestions, setSuggestions] = useState<DiagnosisSuggestion[]>([]);

  const mockSuggestions: DiagnosisSuggestion[] = [
    {
      id: '1',
      condition: 'Acute Bronchitis',
      probability: 85,
      icd10: 'J20.9',
      description: 'Inflammation of the bronchial tubes',
      keySymptoms: ['cough', 'fever', 'chest pain'],
      differentials: ['Pneumonia', 'Asthma', 'COPD exacerbation']
    },
    {
      id: '2',
      condition: 'Upper Respiratory Infection',
      probability: 72,
      icd10: 'J06.9',
      description: 'Common cold or viral upper respiratory infection',
      keySymptoms: ['cough', 'runny nose', 'sore throat'],
      differentials: ['Sinusitis', 'Allergic rhinitis', 'Strep throat']
    }
  ];

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const generateSuggestions = () => {
    if (symptoms.length > 0) {
      setSuggestions(mockSuggestions);
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600 bg-green-50';
    if (probability >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Patient Symptoms</h2>
        
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Enter symptom (e.g., cough, fever, headache)"
            value={currentSymptom}
            onChange={(e) => setCurrentSymptom(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
            className="flex-1"
          />
          <Button onClick={addSymptom} disabled={!currentSymptom.trim()}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {symptoms.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Symptoms:</h3>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {symptom}
                  <button
                    onClick={() => removeSymptom(symptom)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={generateSuggestions} 
          disabled={symptoms.length === 0}
          variant="primary"
        >
          Generate Diagnosis Suggestions
        </Button>
      </Card>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Suggested Diagnoses</h2>
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{suggestion.condition}</h3>
                  <p className="text-sm text-gray-600">ICD-10: {suggestion.icd10}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilityColor(suggestion.probability)}`}>
                  {suggestion.probability}% match
                </span>
              </div>

              <p className="text-gray-700 mb-4">{suggestion.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Symptoms</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {suggestion.keySymptoms.map((symptom, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Differential Diagnoses</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {suggestion.differentials.map((differential, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        {differential}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="secondary" size="sm">
                  View Guidelines
                </Button>
                <Button variant="secondary" size="sm">
                  Order Tests
                </Button>
                <Button variant="primary" size="sm">
                  Select Diagnosis
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};