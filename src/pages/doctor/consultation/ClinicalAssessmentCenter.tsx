import { useState, useEffect } from 'react';
import { Card, Input, Button } from '@/components';
import { VoiceInput, AISuggestions } from '@/components';
import { UnifiedPatientContext } from '@/components/UnifiedPatientContext';
import { mockDataService } from '@/services/mockDataService';

interface ClinicalAssessmentCenterProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  data?: any;
  setData?: (data: any) => void;
}

export function ClinicalAssessmentCenter({ onNext, onPrevious, onSave, data, setData }: ClinicalAssessmentCenterProps) {
  const [chiefComplaint, setChiefComplaint] = useState(data?.clinicalAssessment?.chiefComplaint || '');
  const [symptoms, setSymptoms] = useState<string[]>(data?.clinicalAssessment?.symptoms || []);
  const [diagnosis, setDiagnosis] = useState(data?.clinicalAssessment?.diagnosis || '');
  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    const patient = mockDataService.getPatient(data?.patientId || 'P001');
    const vitals = mockDataService.getVitals(data?.patientId || 'P001')[0];
    if (patient) {
      setPatientData({
        patientId: patient.id,
        patientName: patient.name,
        age: patient.age,
        gender: patient.gender,
        allergies: patient.allergies,
        currentMedications: patient.medications,
        vitalSigns: vitals || { bp: '120/80', hr: 72, temp: 98.6, o2: 98 }
      });
    }
  }, [data?.patientId]);

  const handleNext = () => {
    if (setData) setData({ ...data, clinicalAssessment: { chiefComplaint, symptoms, diagnosis } });
    onNext();
  };

  const handleSave = () => {
    if (setData) setData({ ...data, clinicalAssessment: { chiefComplaint, symptoms, diagnosis } });
    onSave();
  };

  if (!patientData) return <div>Loading...</div>;

  const commonComplaints = ['Fever', 'Cough', 'Headache', 'Chest Pain', 'Abdominal Pain'];
  const commonSymptoms = ['Fatigue', 'Nausea', 'Dizziness', 'Shortness of breath', 'Loss of appetite'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h3 text-neutral-900">Clinical Assessment Center</h2>
        <div className="flex gap-2">
          <Button variant="tertiary" size="sm" onClick={onPrevious}>← Back</Button>
          <Button variant="secondary" size="sm" onClick={handleSave}>Save Draft</Button>
          <Button onClick={handleNext}>Continue to Treatment →</Button>
        </div>
      </div>

      <UnifiedPatientContext {...patientData} />

      <div className="grid grid-cols-2 gap-4">
        {/* Chief Complaint */}
        <Card>
          <h3 className="text-h4 text-neutral-900 mb-3">Chief Complaint</h3>
          <Input 
            placeholder="Describe main complaint..." 
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            className="mb-2"
          />
          <div className="flex flex-wrap gap-2">
            {commonComplaints.map(complaint => (
              <Button 
                key={complaint} 
                variant="secondary" 
                size="sm"
                onClick={() => setChiefComplaint(complaint)}
              >
                {complaint}
              </Button>
            ))}
          </div>
        </Card>

        {/* Symptoms Recording */}
        <Card>
          <h3 className="text-h4 text-neutral-900 mb-3">Symptoms</h3>
          <div className="flex gap-2 mb-2">
            <Input placeholder="Add symptom..." className="flex-1" />
            <VoiceInput onTranscript={(text) => setSymptoms(prev => [...prev, text])} />
          </div>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map(symptom => (
              <Button 
                key={symptom} 
                variant="secondary" 
                size="sm"
                onClick={() => setSymptoms(prev => [...prev, symptom])}
              >
                + {symptom}
              </Button>
            ))}
          </div>
          {symptoms.length > 0 && (
            <div className="mt-2 p-2 bg-neutral-50 rounded-small">
              <p className="text-body-sm">Selected: {symptoms.join(', ')}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Physical Examination */}
      <Card>
        <h3 className="text-h4 text-neutral-900 mb-3">Physical Examination</h3>
        <div className="grid grid-cols-3 gap-3">
          {['General', 'Cardiovascular', 'Respiratory', 'Abdominal', 'Neurological', 'Musculoskeletal'].map(system => (
            <label key={system} className="flex items-center gap-2 p-2 border rounded-small cursor-pointer hover:bg-neutral-50">
              <input type="checkbox" />
              <span className="text-body">{system}</span>
            </label>
          ))}
        </div>
        <Input placeholder="Additional examination notes..." className="mt-3" />
      </Card>

      {/* Diagnosis with AI Suggestions */}
      <AISuggestions 
        symptoms={symptoms} 
        onSelect={(suggestion) => setDiagnosis(`${suggestion.diagnosis} (${suggestion.icd10})`)} 
      />
    </div>
  );
}
