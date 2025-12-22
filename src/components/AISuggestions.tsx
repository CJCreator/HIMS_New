import { Card, Badge } from '@/components';

interface AISuggestion {
  diagnosis: string;
  icd10: string;
  confidence: number;
  treatments: string[];
  reasoning: string;
}

interface AISuggestionsProps {
  symptoms: string[];
  onSelect: (suggestion: AISuggestion) => void;
}

export function AISuggestions({ symptoms, onSelect }: AISuggestionsProps) {
  const suggestions: AISuggestion[] = [
    {
      diagnosis: 'Type 2 Diabetes - Uncontrolled',
      icd10: 'E11.65',
      confidence: 92,
      treatments: ['Metformin 500mg', 'Lifestyle modification', 'HbA1c monitoring'],
      reasoning: 'Based on elevated blood sugar, patient history, and symptoms'
    },
    {
      diagnosis: 'Hypertension',
      icd10: 'I10',
      confidence: 85,
      treatments: ['Lisinopril 10mg', 'Low sodium diet', 'Regular BP monitoring'],
      reasoning: 'Consistent elevated BP readings, family history'
    },
    {
      diagnosis: 'Upper Respiratory Infection',
      icd10: 'J06.9',
      confidence: 78,
      treatments: ['Amoxicillin 500mg', 'Rest', 'Fluids'],
      reasoning: 'Symptoms align with viral/bacterial URI'
    }
  ];

  return (
    <Card className="bg-primary-50 border-primary-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🤖</span>
        <h3 className="text-h4 text-neutral-900">AI-Powered Suggestions</h3>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="p-3 bg-white rounded-small cursor-pointer hover:bg-primary-100 border border-primary-200"
            onClick={() => onSelect(suggestion)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-body font-medium">{suggestion.diagnosis}</h4>
                <p className="text-body-sm text-neutral-600">{suggestion.icd10}</p>
              </div>
              <Badge status={suggestion.confidence > 85 ? 'delivered' : 'pending'}>
                {suggestion.confidence}% confidence
              </Badge>
            </div>
            <p className="text-body-sm text-neutral-600 mb-2">{suggestion.reasoning}</p>
            <div className="flex flex-wrap gap-1">
              {suggestion.treatments.map((treatment, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-primary-100 rounded-small">
                  {treatment}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
