import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addSymptomCheck } from '../../store/symptomSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

const urgencyColors: Record<string, string> = { high: 'red', medium: 'orange', low: 'blue' };
const urgencyMessages: Record<string, string> = {
  high: 'Seek immediate medical attention',
  medium: 'Schedule an appointment soon',
  low: 'Monitor symptoms, self-care recommended',
};

export default function SymptomChecker() {
  const { history, symptomDatabase } = useSelector((state: RootState) => state.symptom);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const symptoms = Object.keys(symptomDatabase);

  const handleCheck = () => {
    const urgencies = selected.map((s: string) => symptomDatabase[s as keyof typeof symptomDatabase]?.urgency || 'low');
    const urgency: 'high' | 'medium' | 'low' = urgencies.includes('high') ? 'high' : urgencies.includes('medium') ? 'medium' : 'low';
    
    const newCheck = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      symptoms: selected,
      urgency,
      recommendation: urgencyMessages[urgency],
    };
    
    dispatch(addSymptomCheck(newCheck));
    setResult(newCheck);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Symptom Checker</h1>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Select Your Symptoms</h2>
          <div className="space-y-2 mb-6">
            {symptoms.map(symptom => (
              <label key={symptom} className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={selected.includes(symptom)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelected(e.target.checked ? [...selected, symptom] : selected.filter((s: string) => s !== symptom))}
                  className="w-4 h-4"
                />
                <span>{symptom}</span>
              </label>
            ))}
          </div>
          <Button onClick={handleCheck} disabled={selected.length === 0} className="w-full">
            Analyze Symptoms
          </Button>
        </Card>

        <div>
          {result && (
            <Card className={`p-6 mb-6 border-2 ${result.urgency === 'high' ? 'border-red-500' : result.urgency === 'medium' ? 'border-orange-500' : 'border-blue-500'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${result.urgency === 'high' ? 'bg-red-100' : result.urgency === 'medium' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                  {result.urgency === 'high' ? <AlertCircle className="w-6 h-6 text-red-600" /> : result.urgency === 'medium' ? <AlertTriangle className="w-6 h-6 text-orange-600" /> : <Info className="w-6 h-6 text-blue-600" />}
                </div>
                <div>
                  <div className={`font-semibold capitalize ${result.urgency === 'high' ? 'text-red-800' : result.urgency === 'medium' ? 'text-orange-800' : 'text-blue-800'}`}>{result.urgency} Urgency</div>
                  <div className="text-sm text-gray-600">{result.date}</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Symptoms:</div>
                <div className="flex flex-wrap gap-2">
                  {result.symptoms.map((s: string) => (
                    <span key={s} className="px-2 py-1 bg-gray-100 rounded text-sm">{s}</span>
                  ))}
                </div>
              </div>
              <div className={`p-4 rounded ${result.urgency === 'high' ? 'bg-red-50' : result.urgency === 'medium' ? 'bg-orange-50' : 'bg-blue-50'}`}>
                <div className="font-semibold mb-1">Recommendation:</div>
                <div className="text-sm">{result.recommendation}</div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Checks</h2>
            <div className="space-y-3">
              {history.slice(0, 5).map(check => (
                <div key={check.id} className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs ${check.urgency === 'high' ? 'bg-red-100 text-red-800' : check.urgency === 'medium' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                      {check.urgency}
                    </span>
                    <span className="text-sm text-gray-600">{check.date}</span>
                  </div>
                  <div className="text-sm">{check.symptoms.join(', ')}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
