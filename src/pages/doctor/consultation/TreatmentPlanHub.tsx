import { useState, useEffect } from 'react';
import { Card, Input, Button, Badge } from '@/components';
import { UnifiedPatientContext } from '@/components/UnifiedPatientContext';
import { mockDataService } from '@/services/mockDataService';

interface TreatmentPlanHubProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  data?: any;
  setData?: (data: any) => void;
}

export function TreatmentPlanHub({ onNext, onPrevious, onSave, data, setData }: TreatmentPlanHubProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(data?.treatmentPlan?.template || '');
  const [medications, setMedications] = useState<any[]>(data?.treatmentPlan?.medications || []);
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
    if (setData) setData({ ...data, treatmentPlan: { template: selectedTemplate, medications } });
    onNext();
  };

  const handleSave = () => {
    if (setData) setData({ ...data, treatmentPlan: { template: selectedTemplate, medications } });
    onSave();
  };

  if (!patientData) return <div>Loading...</div>;

  const prescriptionTemplates = [
    { id: 1, name: 'Diabetes Management', meds: ['Metformin 500mg', 'Glipizide 5mg'] },
    { id: 2, name: 'Hypertension Control', meds: ['Lisinopril 10mg', 'Amlodipine 5mg'] },
    { id: 3, name: 'Upper Respiratory Infection', meds: ['Amoxicillin 500mg', 'Ibuprofen 400mg'] }
  ];

  const labTests = [
    { name: 'Complete Blood Count (CBC)', priority: 'Routine' },
    { name: 'Lipid Panel', priority: 'Routine' },
    { name: 'HbA1c', priority: 'Urgent' }
  ];

  const applyTemplate = (template: any) => {
    setSelectedTemplate(template.name);
    setMedications(template.meds.map((med: string) => ({ name: med, dosage: '1 tablet', frequency: 'Daily' })));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h3 text-neutral-900">Treatment Plan Hub</h2>
        <div className="flex gap-2">
          <Button variant="tertiary" size="sm" onClick={onPrevious}>← Back</Button>
          <Button variant="secondary" size="sm" onClick={handleSave}>Save Draft</Button>
          <Button onClick={handleNext}>Continue to Review →</Button>
        </div>
      </div>

      <UnifiedPatientContext {...patientData} />

      {/* Parallel Processing Alert */}
      <Card className="bg-info/10 border-info">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-body font-medium">Parallel Processing Active</p>
            <p className="text-body-sm text-neutral-600">Pharmacy and Lab will be notified simultaneously when you complete this section</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* Smart Prescription Templates */}
        <Card>
          <h3 className="text-h4 text-neutral-900 mb-3">Smart Prescription Templates</h3>
          <div className="space-y-2 mb-3">
            {prescriptionTemplates.map(template => (
              <div 
                key={template.id}
                className="p-3 border rounded-small cursor-pointer hover:bg-primary-50 hover:border-primary-300"
                onClick={() => applyTemplate(template)}
              >
                <p className="text-body font-medium">{template.name}</p>
                <p className="text-body-sm text-neutral-600">{template.meds.length} medications</p>
              </div>
            ))}
          </div>
          
          {selectedTemplate && (
            <div className="p-3 bg-success/10 rounded-small">
              <p className="text-body-sm text-success">✅ Template "{selectedTemplate}" applied</p>
            </div>
          )}
        </Card>

        {/* Medications List */}
        <Card>
          <h3 className="text-h4 text-neutral-900 mb-3">Medications</h3>
          {medications.length === 0 ? (
            <div className="text-center py-4 text-neutral-500">
              <p className="text-body-sm">Select a template or add medications manually</p>
            </div>
          ) : (
            <div className="space-y-2">
              {medications.map((med, idx) => (
                <div key={idx} className="p-2 bg-neutral-50 rounded-small">
                  <p className="text-body font-medium">{med.name}</p>
                  <p className="text-body-sm text-neutral-600">{med.dosage} • {med.frequency}</p>
                </div>
              ))}
            </div>
          )}
          <Button variant="secondary" size="sm" className="w-full mt-3">+ Add Medication</Button>
        </Card>
      </div>

      {/* Lab Orders with Quick Order Sets */}
      <Card>
        <h3 className="text-h4 text-neutral-900 mb-3">Lab Test Orders</h3>
        <div className="grid grid-cols-3 gap-2">
          {labTests.map((test, idx) => (
            <label key={idx} className="flex items-start gap-2 p-2 border rounded-small cursor-pointer hover:bg-neutral-50">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="text-body-sm font-medium">{test.name}</p>
                <Badge status={test.priority === 'Urgent' ? 'error' : 'sent'} className="text-xs">
                  {test.priority}
                </Badge>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Real-time Notifications Preview */}
      <Card className="bg-neutral-50">
        <h4 className="text-body font-medium mb-2">Auto-Notifications Ready</h4>
        <div className="space-y-2 text-body-sm">
          <div className="flex items-center gap-2">
            <span>💊</span>
            <span>Pharmacy will receive prescription immediately</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔬</span>
            <span>Lab will receive test orders with priority indicators</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
