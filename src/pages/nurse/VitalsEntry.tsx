import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Input, Button, Badge } from '@/components';
import { addNotification, addRoleNotification } from '@/store/notificationSlice';
import { updatePatientVitals } from '@/store/patientSlice';
import { RootState } from '@/store';
import { toast } from 'sonner';

export function VitalsEntry() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patients } = useSelector((state: RootState) => state.patients);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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

  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    const foundPatient = patients.find(p => p.id === patientId);
    if (foundPatient) {
      setPatient(foundPatient);
    } else {
      setPatient({
        id: patientId || 'P001',
        name: 'John Smith',
        age: 45,
        appointment: '10:00 AM',
        doctor: 'Dr. Wilson'
      });
    }
  }, [patientId, patients]);

  const bmi = useMemo(() => {
    const weight = parseFloat(vitals.weight);
    const height = parseFloat(vitals.height) / 100;
    if (weight > 0 && height > 0) {
      return (weight / (height * height)).toFixed(1);
    }
    return null;
  }, [vitals.weight, vitals.height]);

  const getBMICategory = (bmiValue: string | null) => {
    if (!bmiValue) return null;
    const bmi = parseFloat(bmiValue);
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  const getVitalWarning = (field: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;

    switch (field) {
      case 'heartRate':
        if (numValue < 60) return { message: 'Bradycardia', severity: 'warning' };
        if (numValue > 100) return { message: 'Tachycardia', severity: 'error' };
        break;
      case 'temperature':
        if (numValue < 97) return { message: 'Hypothermia', severity: 'error' };
        if (numValue > 99.5) return { message: 'Fever', severity: 'warning' };
        break;
      case 'oxygenSaturation':
        if (numValue < 95) return { message: 'Low O2', severity: 'error' };
        break;
      case 'respiratoryRate':
        if (numValue < 12) return { message: 'Bradypnea', severity: 'warning' };
        if (numValue > 20) return { message: 'Tachypnea', severity: 'warning' };
        break;
    }
    return null;
  };

  const handleChange = (field: string, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!vitals.bloodPressure.trim()) {
      newErrors.bloodPressure = 'Blood pressure is required';
    } else if (!/^\d{2,3}\/\d{2,3}$/.test(vitals.bloodPressure)) {
      newErrors.bloodPressure = 'Format should be XXX/XX';
    }
    
    if (!vitals.heartRate.trim()) {
      newErrors.heartRate = 'Heart rate is required';
    } else if (parseInt(vitals.heartRate) < 30 || parseInt(vitals.heartRate) > 200) {
      newErrors.heartRate = 'Heart rate must be between 30-200 bpm';
    }
    
    if (!vitals.temperature.trim()) {
      newErrors.temperature = 'Temperature is required';
    } else if (parseFloat(vitals.temperature) < 95 || parseFloat(vitals.temperature) > 106) {
      newErrors.temperature = 'Temperature must be between 95-106°F';
    }
    
    if (!vitals.respiratoryRate.trim()) {
      newErrors.respiratoryRate = 'Respiratory rate is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }

    setLoading(true);
    try {
      dispatch(updatePatientVitals({
        patientId: patient.id,
        vitals: {
          bloodPressure: vitals.bloodPressure,
          heartRate: parseInt(vitals.heartRate) || 0,
          temperature: parseFloat(vitals.temperature) || 0,
          oxygenSaturation: parseInt(vitals.oxygenSaturation) || 0,
          respiratoryRate: parseInt(vitals.respiratoryRate) || 0,
          painLevel: parseInt(vitals.painLevel) || 0,
          weight: parseFloat(vitals.weight) || undefined,
          height: parseFloat(vitals.height) || undefined,
          bmi: bmi ? parseFloat(bmi) : undefined,
          recordedAt: new Date().toISOString(),
          recordedBy: 'Nurse Sarah',
          notes: vitals.notes
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
        category: 'patient',
        relatedId: patient.id
      }));
      
      toast.success('Vitals recorded successfully');
      navigate('/nurse');
    } catch (error) {
      toast.error('Failed to record vitals');
    } finally {
      setLoading(false);
    }
  };

  if (!patient) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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
                <div>
                  <Input
                    label="Blood Pressure (mmHg) *"
                    placeholder="120/80"
                    value={vitals.bloodPressure}
                    onChange={(e) => handleChange('bloodPressure', e.target.value)}
                    className={errors.bloodPressure ? 'border-red-500' : ''}
                  />
                  {errors.bloodPressure && <p className="text-sm text-red-500 mt-1">{errors.bloodPressure}</p>}
                </div>
                
                <div>
                  <Input
                    label="Heart Rate (bpm) *"
                    placeholder="72"
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => handleChange('heartRate', e.target.value)}
                    className={errors.heartRate ? 'border-red-500' : ''}
                  />
                  {errors.heartRate && <p className="text-sm text-red-500 mt-1">{errors.heartRate}</p>}
                  {getVitalWarning('heartRate', vitals.heartRate) && (
                    <div className={`mt-1 text-sm flex items-center gap-1 ${
                      getVitalWarning('heartRate', vitals.heartRate)?.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      ⚠️ {getVitalWarning('heartRate', vitals.heartRate)?.message}
                    </div>
                  )}
                </div>
                
                <div>
                  <Input
                    label="Temperature (°F) *"
                    placeholder="98.6"
                    type="number"
                    step="0.1"
                    value={vitals.temperature}
                    onChange={(e) => handleChange('temperature', e.target.value)}
                    className={errors.temperature ? 'border-red-500' : ''}
                  />
                  {errors.temperature && <p className="text-sm text-red-500 mt-1">{errors.temperature}</p>}
                  {getVitalWarning('temperature', vitals.temperature) && (
                    <div className={`mt-1 text-sm flex items-center gap-1 ${
                      getVitalWarning('temperature', vitals.temperature)?.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      ⚠️ {getVitalWarning('temperature', vitals.temperature)?.message}
                    </div>
                  )}
                </div>
                
                <div>
                  <Input
                    label="Respiratory Rate (breaths/min) *"
                    placeholder="16"
                    type="number"
                    value={vitals.respiratoryRate}
                    onChange={(e) => handleChange('respiratoryRate', e.target.value)}
                    className={errors.respiratoryRate ? 'border-red-500' : ''}
                  />
                  {errors.respiratoryRate && <p className="text-sm text-red-500 mt-1">{errors.respiratoryRate}</p>}
                  {getVitalWarning('respiratoryRate', vitals.respiratoryRate) && (
                    <div className="mt-1 text-sm text-yellow-600 flex items-center gap-1">
                      ⚠️ {getVitalWarning('respiratoryRate', vitals.respiratoryRate)?.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-body font-medium text-neutral-900 mb-4">Additional Measurements</h3>
              <div className="space-y-4">
                <div>
                  <Input
                    label="Oxygen Saturation (%)"
                    placeholder="98"
                    type="number"
                    value={vitals.oxygenSaturation}
                    onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
                  />
                  {getVitalWarning('oxygenSaturation', vitals.oxygenSaturation) && (
                    <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      ⚠️ {getVitalWarning('oxygenSaturation', vitals.oxygenSaturation)?.message}
                    </div>
                  )}
                </div>
                
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
                
                {bmi && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-neutral-700 mb-1">BMI Calculation</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">{bmi}</span>
                      {getBMICategory(bmi) && (
                        <Badge status="sent">
                          <span className={getBMICategory(bmi)?.color}>
                            {getBMICategory(bmi)?.label}
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
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
              <Button variant="tertiary" onClick={() => toast.info('Draft saved')}>
                Save Draft
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading || !vitals.bloodPressure || !vitals.heartRate || !vitals.temperature}
              >
                {loading ? 'Saving...' : 'Complete & Mark Ready for Doctor'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
