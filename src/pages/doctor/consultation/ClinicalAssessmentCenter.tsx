import { useState, useEffect } from 'react';
import { Card, Input, Button, Badge } from '@/components';
import { VoiceInput, AISuggestions } from '@/components';
import { UnifiedPatientContext } from '@/components/UnifiedPatientContext';
import { mockDataService } from '@/services/mockDataService';

interface Symptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  onset: string;
  notes?: string;
  linkedToComplaint?: string;
}

interface ClinicalAssessmentCenterProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  data?: any;
  setData?: (data: any) => void;
}

export function ClinicalAssessmentCenter({ onNext, onPrevious, onSave, data, setData }: ClinicalAssessmentCenterProps) {
  const [chiefComplaints, setChiefComplaints] = useState<string[]>(data?.clinicalAssessment?.chiefComplaints || []);
  const [currentComplaint, setCurrentComplaint] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>(data?.clinicalAssessment?.symptoms || []);
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [newSymptom, setNewSymptom] = useState<Symptom>({
    name: '',
    severity: 'mild',
    duration: '',
    onset: '',
    notes: '',
    linkedToComplaint: ''
  });
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
    if (setData) setData({ ...data, clinicalAssessment: { chiefComplaints, symptoms, diagnosis } });
    onNext();
  };

  const handleSave = () => {
    if (setData) setData({ ...data, clinicalAssessment: { chiefComplaints, symptoms, diagnosis } });
    onSave();
  };

  const addChiefComplaint = () => {
    if (currentComplaint.trim()) {
      setChiefComplaints([...chiefComplaints, currentComplaint.trim()]);
      setCurrentComplaint('');
    }
  };

  const removeChiefComplaint = (index: number) => {
    setChiefComplaints(chiefComplaints.filter((_, i) => i !== index));
  };

  const addSymptom = () => {
    if (newSymptom.name.trim()) {
      setSymptoms([...symptoms, { ...newSymptom }]);
      setNewSymptom({
        name: '',
        severity: 'mild',
        duration: '',
        onset: '',
        notes: '',
        linkedToComplaint: chiefComplaints[0] || ''
      });
      setShowSymptomForm(false);
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
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

      <div className="grid grid-cols-1 gap-4">
        {/* Chief Complaints - Multiple Support */}
        <Card>
          <h3 className="text-h4 text-neutral-900 mb-3">Chief Complaints</h3>
          <div className="flex gap-2 mb-3">
            <Input 
              placeholder="Enter chief complaint..." 
              value={currentComplaint}
              onChange={(e) => setCurrentComplaint(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addChiefComplaint()}
              className="flex-1"
            />
            <Button onClick={addChiefComplaint}>Add</Button>
          </div>
          
          {/* Quick Select Common Complaints */}
          <div className="flex flex-wrap gap-2 mb-3">
            {commonComplaints.map(complaint => (
              <Button 
                key={complaint} 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  setCurrentComplaint(complaint);
                  setChiefComplaints([...chiefComplaints, complaint]);
                  setCurrentComplaint('');
                }}
              >
                + {complaint}
              </Button>
            ))}
          </div>

          {/* Active Complaints */}
          {chiefComplaints.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">Active Complaints:</p>
              {chiefComplaints.map((complaint, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-neutral-900">{complaint}</span>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => removeChiefComplaint(idx)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Structured Symptoms Recording */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-h4 text-neutral-900">Symptoms (Structured)</h3>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setShowSymptomForm(!showSymptomForm)}
            >
              + Add Symptom
            </Button>
          </div>

          {/* Symptom Entry Form */}
          {showSymptomForm && (
            <div className="p-4 bg-neutral-50 rounded-lg mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Symptom Name *</label>
                  <Input 
                    placeholder="e.g., Headache" 
                    value={newSymptom.name}
                    onChange={(e) => setNewSymptom({ ...newSymptom, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Linked to Complaint</label>
                  <select
                    value={newSymptom.linkedToComplaint}
                    onChange={(e) => setNewSymptom({ ...newSymptom, linkedToComplaint: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select complaint</option>
                    {chiefComplaints.map((complaint, idx) => (
                      <option key={idx} value={complaint}>{complaint}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Severity *</label>
                  <select
                    value={newSymptom.severity}
                    onChange={(e) => setNewSymptom({ ...newSymptom, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Duration</label>
                  <Input 
                    placeholder="e.g., 3 days" 
                    value={newSymptom.duration}
                    onChange={(e) => setNewSymptom({ ...newSymptom, duration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Onset</label>
                  <Input 
                    placeholder="e.g., Sudden" 
                    value={newSymptom.onset}
                    onChange={(e) => setNewSymptom({ ...newSymptom, onset: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Additional Notes</label>
                <textarea
                  placeholder="Any additional details..."
                  value={newSymptom.notes}
                  onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addSymptom}>Add Symptom</Button>
                <Button variant="secondary" onClick={() => setShowSymptomForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Symptoms List */}
          {symptoms.length > 0 ? (
            <div className="space-y-2">
              {symptoms.map((symptom, idx) => (
                <div key={idx} className="p-3 border-2 border-neutral-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-semibold text-neutral-900">{symptom.name}</span>
                        <Badge status={symptom.severity === 'severe' ? 'error' : symptom.severity === 'moderate' ? 'pending' : 'sent'}>
                          {symptom.severity}
                        </Badge>
                        {symptom.linkedToComplaint && (
                          <span className="text-xs text-neutral-600 bg-blue-100 px-2 py-1 rounded">
                            → {symptom.linkedToComplaint}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-neutral-600">
                        {symptom.duration && <div>Duration: {symptom.duration}</div>}
                        {symptom.onset && <div>Onset: {symptom.onset}</div>}
                      </div>
                      {symptom.notes && (
                        <p className="text-sm text-neutral-600 mt-1 italic">{symptom.notes}</p>
                      )}
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => removeSymptom(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-neutral-500">
              <p className="text-sm">No symptoms recorded yet. Click "Add Symptom" to begin.</p>
            </div>
          )}

          {/* Quick Add Common Symptoms */}
          <div className="mt-3 pt-3 border-t border-neutral-200">
            <p className="text-xs text-neutral-600 mb-2">Quick add common symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map(symptom => (
                <Button 
                  key={symptom} 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setSymptoms([...symptoms, {
                      name: symptom,
                      severity: 'mild',
                      duration: '',
                      onset: '',
                      linkedToComplaint: chiefComplaints[0] || ''
                    }]);
                  }}
                >
                  + {symptom}
                </Button>
              ))}
            </div>
          </div>
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
        symptoms={symptoms.map(s => s.name)} 
        onSelect={(suggestion) => setDiagnosis(`${suggestion.diagnosis} (${suggestion.icd10})`)} 
      />
    </div>
  );
}
