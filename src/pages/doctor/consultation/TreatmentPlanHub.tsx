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
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([]);
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
    if (setData) setData({ ...data, treatmentPlan: { template: selectedTemplate, medications, labTests: selectedLabTests } });
    onNext();
  };

  const handleSave = () => {
    if (setData) setData({ ...data, treatmentPlan: { template: selectedTemplate, medications, labTests: selectedLabTests } });
    onSave();
  };

  const addMedication = () => {
    if (newMedication.name.trim()) {
      setMedications([...medications, { ...newMedication }]);
      setNewMedication({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
      setShowMedicationForm(false);
    }
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const toggleLabTest = (testName: string) => {
    setSelectedLabTests(prev => 
      prev.includes(testName) 
        ? prev.filter(t => t !== testName)
        : [...prev, testName]
    );
  };

  if (!patientData) return <div>Loading...</div>;

  const prescriptionTemplates = [
    { id: 1, name: 'Diabetes Management', specialty: 'Endocrinology', meds: ['Metformin 500mg', 'Glipizide 5mg'] },
    { id: 2, name: 'Hypertension Control', specialty: 'Cardiology', meds: ['Lisinopril 10mg', 'Amlodipine 5mg'] },
    { id: 3, name: 'Upper Respiratory Infection', specialty: 'General', meds: ['Amoxicillin 500mg', 'Ibuprofen 400mg'] },
    { id: 4, name: 'Asthma Management', specialty: 'Pulmonology', meds: ['Albuterol Inhaler', 'Fluticasone Inhaler'] },
    { id: 5, name: 'Migraine Treatment', specialty: 'Neurology', meds: ['Sumatriptan 50mg', 'Naproxen 500mg'] }
  ];

  const labTestPanels = [
    {
      name: 'Basic Metabolic Panel',
      tests: ['Glucose', 'Calcium', 'Sodium', 'Potassium', 'CO2', 'Chloride', 'BUN', 'Creatinine'],
      priority: 'Routine'
    },
    {
      name: 'Complete Blood Count (CBC)',
      tests: ['WBC', 'RBC', 'Hemoglobin', 'Hematocrit', 'Platelets'],
      priority: 'Routine'
    },
    {
      name: 'Lipid Panel',
      tests: ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides'],
      priority: 'Routine'
    },
    {
      name: 'Liver Function Tests',
      tests: ['ALT', 'AST', 'Alkaline Phosphatase', 'Bilirubin', 'Albumin'],
      priority: 'Routine'
    },
    {
      name: 'Thyroid Panel',
      tests: ['TSH', 'T3', 'T4'],
      priority: 'Urgent'
    },
    {
      name: 'Diabetes Screening',
      tests: ['HbA1c', 'Fasting Glucose'],
      priority: 'Urgent'
    }
  ];

  const applyTemplate = (template: any) => {
    setSelectedTemplate(template.name);
    setMedications(template.meds.map((med: string) => ({ 
      name: med, 
      dosage: '1 tablet', 
      frequency: 'Once daily',
      duration: '30 days',
      instructions: 'Take with food'
    })));
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Smart Prescription Templates */}
        <Card>
          <h3 className="text-h4 text-neutral-900 mb-3">Smart Prescription Templates</h3>
          <p className="text-sm text-neutral-600 mb-3">Select a template by specialty or complaint</p>
          <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
            {prescriptionTemplates.map(template => (
              <div 
                key={template.id}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.name
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:bg-primary-50 hover:border-primary-300'
                }`}
                onClick={() => applyTemplate(template)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-body font-medium">{template.name}</p>
                    <p className="text-body-sm text-neutral-600">{template.specialty} • {template.meds.length} medications</p>
                  </div>
                  {selectedTemplate === template.name && (
                    <Badge status="delivered">Applied</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Medications List */}
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-h4 text-neutral-900">Medications</h3>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setShowMedicationForm(!showMedicationForm)}
            >
              + Add Medication
            </Button>
          </div>

          {/* Add Medication Form */}
          {showMedicationForm && (
            <div className="p-4 bg-neutral-50 rounded-lg mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Medication Name *</label>
                <Input 
                  placeholder="e.g., Amoxicillin" 
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Dosage *</label>
                  <Input 
                    placeholder="e.g., 500mg" 
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Frequency *</label>
                  <Input 
                    placeholder="e.g., Twice daily" 
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Duration</label>
                <Input 
                  placeholder="e.g., 7 days" 
                  value={newMedication.duration}
                  onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Instructions</label>
                <textarea
                  placeholder="e.g., Take with food"
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addMedication}>Add Medication</Button>
                <Button variant="secondary" onClick={() => setShowMedicationForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {medications.length === 0 ? (
            <div className="text-center py-6 text-neutral-500">
              <p className="text-body-sm">No medications added yet</p>
              <p className="text-body-sm">Select a template or add manually</p>
            </div>
          ) : (
            <div className="space-y-2">
              {medications.map((med, idx) => (
                <div key={idx} className="p-3 bg-white border-2 border-neutral-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-body font-medium">{med.name}</p>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => removeMedication(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-neutral-600">
                    <div>Dosage: {med.dosage}</div>
                    <div>Frequency: {med.frequency}</div>
                    {med.duration && <div>Duration: {med.duration}</div>}
                  </div>
                  {med.instructions && (
                    <p className="text-sm text-neutral-600 mt-2 italic">{med.instructions}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Lab Orders with Grouped Panels */}
      <Card>
        <h3 className="text-h4 text-neutral-900 mb-3">Lab Test Orders - Grouped Panels</h3>
        <p className="text-sm text-neutral-600 mb-4">Select preset test panels or individual tests</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {labTestPanels.map((panel, idx) => (
            <div 
              key={idx} 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedLabTests.includes(panel.name)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
              }`}
              onClick={() => toggleLabTest(panel.name)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={selectedLabTests.includes(panel.name)}
                    onChange={() => toggleLabTest(panel.name)}
                    className="w-4 h-4"
                  />
                  <p className="text-sm font-semibold text-neutral-900">{panel.name}</p>
                </div>
                <Badge status={panel.priority === 'Urgent' ? 'error' : 'sent'}>
                  {panel.priority}
                </Badge>
              </div>
              <div className="ml-6">
                <p className="text-xs text-neutral-600 mb-1">Includes:</p>
                <ul className="text-xs text-neutral-600 space-y-0.5">
                  {panel.tests.slice(0, 3).map((test, i) => (
                    <li key={i}>• {test}</li>
                  ))}
                  {panel.tests.length > 3 && (
                    <li className="text-neutral-500">+ {panel.tests.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Tests Summary */}
        {selectedLabTests.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-900 mb-2">
              ✅ {selectedLabTests.length} panel(s) selected
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedLabTests.map((test, idx) => (
                <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-green-300">
                  {test}
                </span>
              ))}
            </div>
          </div>
        )}
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
