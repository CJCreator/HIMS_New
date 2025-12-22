import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, Input, Button } from '@/components';
import { addNotification, addRoleNotification } from '@/store/notificationSlice';
import { updatePatientVitals } from '@/store/patientSlice';

export function VitalsEntry() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    painLevel: '',
    notes: ''
  });

  const [patient] = useState({
    id: patientId || 'P001',
    name: 'John Smith',
    age: 45,
    appointment: '10:00 AM',
    doctor: 'Dr. Wilson'
  });

  const handleChange = (field: string, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Save vitals to patient record in Redux
    dispatch(updatePatientVitals({
      patientId: patient.id,
      vitals: {
        bloodPressure: vitals.bloodPressure,
        heartRate: parseInt(vitals.heartRate) || 0,
        temperature: parseFloat(vitals.temperature) || 0,
        oxygenSaturation: parseInt(vitals.oxygenSaturation) || 0,
        respiratoryRate: parseInt(vitals.respiratoryRate) || 0,
        painLevel: parseInt(vitals.painLevel) || 0,
        recordedAt: new Date().toISOString(),
        recordedBy: 'Nurse Sarah'
      }
    }));
    
    dispatch(addNotification({
      type: 'success',
      title: 'Vitals Recorded',
      message: `Vitals recorded for ${patient.name}`,
      priority: 'medium',
      category: 'patient'
    }));
    
    dispatch(addRoleNotification({
      role: 'doctor',
      type: 'success',
      title: 'Patient Ready',
      message: `${patient.name} vitals complete - Ready for consultation`,
      priority: 'high',
      category: 'patient'
    }));
    
    navigate('/nurse');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Record Vital Signs</h1>
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-h3 text-neutral-900">Record Vital Signs</h2>
              <p className="text-body text-neutral-600">Patient: {patient.name} • {patient.appointment} • {patient.doctor}</p>
            </div>
            <div className="text-right">
              <div className="text-body-sm text-neutral-500">Patient ID</div>
              <div className="text-body font-medium">{patient.id}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-body font-medium text-neutral-900 mb-4">Primary Vitals</h3>
              <div className="space-y-4">
                <Input
                  label="Blood Pressure (mmHg) *"
                  placeholder="120/80"
                  value={vitals.bloodPressure}
                  onChange={(e) => handleChange('bloodPressure', e.target.value)}
                />
                <Input
                  label="Heart Rate (bpm) *"
                  placeholder="72"
                  type="number"
                  value={vitals.heartRate}
                  onChange={(e) => handleChange('heartRate', e.target.value)}
                />
                <Input
                  label="Temperature (°F) *"
                  placeholder="98.6"
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                />
                <Input
                  label="Respiratory Rate (breaths/min) *"
                  placeholder="16"
                  type="number"
                  value={vitals.respiratoryRate}
                  onChange={(e) => handleChange('respiratoryRate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-body font-medium text-neutral-900 mb-4">Additional Measurements</h3>
              <div className="space-y-4">
                <Input
                  label="Oxygen Saturation (%)"
                  placeholder="98"
                  type="number"
                  value={vitals.oxygenSaturation}
                  onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
                />
                <Input
                  label="Weight (kg)"
                  placeholder="70"
                  type="number"
                  step="0.1"
                  value={vitals.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                />
                <Input
                  label="Height (cm)"
                  placeholder="175"
                  type="number"
                  value={vitals.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                />
                <div>
                  <label className="block text-body font-medium text-neutral-700 mb-2">
                    Pain Level (0-10): {vitals.painLevel || '0'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={vitals.painLevel}
                    onChange={(e) => handleChange('painLevel', e.target.value)}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-body-sm text-neutral-500 mt-1">
                    <span>0 - No Pain</span>
                    <span>5 - Moderate</span>
                    <span>10 - Severe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-body font-medium text-neutral-700 mb-1">
              Nursing Notes
            </label>
            <textarea
              rows={3}
              value={vitals.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any observations or patient concerns..."
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="mt-6 p-4 bg-nurse/10 rounded-small">
            <h4 className="text-body font-medium text-nurse mb-2">✅ Pre-Consultation Checklist</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-body-sm text-neutral-600">
              <div>• Vital signs recorded</div>
              <div>• Patient comfort assessed</div>
              <div>• Chief complaint noted</div>
              <div>• Allergies verified</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 pt-6">
            <Button variant="secondary" onClick={() => navigate('/nurse')}>
              Cancel
            </Button>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button variant="tertiary">
                Save Draft
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!vitals.bloodPressure || !vitals.heartRate || !vitals.temperature}
              >
                Complete & Mark Ready for Doctor
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}