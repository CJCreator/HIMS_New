import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card, Input, Button } from '@/components';
import DrugInteractionAlert from '../../../components/DrugInteractionAlert';
import DrugInteractionModal from '../../../components/DrugInteractionModal';
import { DosageCalculator } from '@/components/DosageCalculator';
import { RootState } from '@/store';
import { checkInteractions, setPatientAllergies, clearCurrentCheck } from '../../../store/drugInteractionSlice';
import { addPrescription } from '@/store/prescriptionSlice';
import { addRoleNotification } from '@/store/notificationSlice';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}

export function Prescription({ onNext, onPrevious, onSave }: PrescriptionProps) {
  const dispatch = useDispatch();
  const { currentCheck } = useSelector((state: RootState) => state.drugInteraction);
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showDosageCalculator, setShowDosageCalculator] = useState(false);
  
  // Mock patient allergies - in real app, fetch from patient record
  useEffect(() => {
    dispatch(setPatientAllergies([
      { id: '1', allergen: 'Penicillin', reaction: 'Rash, difficulty breathing', severity: 'severe' },
      { id: '2', allergen: 'Aspirin', reaction: 'Stomach upset', severity: 'mild' }
    ]));
  }, [dispatch]);

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const isComplete = medications.some(med => med.name.trim() !== '');
  
  const checkForInteractions = () => {
    const drugNames = medications
      .filter(med => med.name.trim() !== '')
      .map(med => med.name.trim());
    
    if (drugNames.length > 0) {
      dispatch(checkInteractions({ patientId: 'current-patient', drugs: drugNames }));
    }
  };
  
  const handleNext = () => {
    checkForInteractions();
    
    // Check if there are interactions or warnings
    if (currentCheck && (currentCheck.interactions.length > 0 || currentCheck.warnings.length > 0)) {
      setShowInteractionModal(true);
    } else {
      onNext();
    }
  };
  
  const handleProceedWithInteractions = () => {
    setShowInteractionModal(false);
    dispatch(clearCurrentCheck());
    
    const validMedications = medications.filter(m => m.name.trim());
    
    dispatch(addPrescription({
      patientName: 'John Smith',
      patientId: 'P001',
      doctorName: 'Dr. Wilson',
      medications: validMedications.map(med => ({
        name: med.name,
        dosage: med.dosage,
        quantity: parseInt(med.duration) * 3 || 30,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions
      })),
      priority: validMedications.some(m => m.name.toLowerCase().includes('urgent')) ? 'high' : 'medium',
      notes: ''
    }));
    
    dispatch(addRoleNotification({
      role: 'pharmacy',
      type: 'info',
      title: 'New Prescription',
      message: `New prescription with ${validMedications.length} medication(s) ready for processing`,
      priority: 'medium',
      category: 'medication'
    }));
    
    onNext();
  };
  
  // Check interactions when medications change
  useEffect(() => {
    if (medications.some(med => med.name.trim() !== '')) {
      checkForInteractions();
    }
  }, [medications]);

  return (
    <ConsultationLayout
      currentStep={9}
      totalSteps={14}
      title="Prescription Creation"
      onNext={handleNext}
      onPrevious={onPrevious}
      onSave={onSave}
      onSkip={onNext}
      nextDisabled={!isComplete}
    >
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-h4 text-neutral-900">Create Prescription</h2>
          <Button variant="secondary" onClick={addMedication}>
            + Add Medication
          </Button>
        </div>
        
        <div className="space-y-6">
          {medications.map((medication, index) => (
            <div key={index} className="p-4 border border-neutral-200 rounded-small">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-body font-medium text-neutral-900">
                  Medication {index + 1}
                </h3>
                {medications.length > 1 && (
                  <Button
                    variant="tertiary"
                    size="sm"
                    onClick={() => removeMedication(index)}
                    className="text-error"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Medication Name *"
                  placeholder="e.g., Amoxicillin"
                  value={medication.name}
                  onChange={(e) => updateMedication(index, 'name', e.target.value)}
                />
                <div>
                  <div className="flex gap-2">
                    <Input
                      label="Dosage"
                      placeholder="e.g., 500mg"
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex flex-col justify-end">
                      <Button variant="secondary" size="sm" onClick={() => setShowDosageCalculator(!showDosageCalculator)}>
                        Calc
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-body font-medium text-neutral-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={medication.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="once-daily">Once daily</option>
                    <option value="twice-daily">Twice daily</option>
                    <option value="three-times-daily">Three times daily</option>
                    <option value="four-times-daily">Four times daily</option>
                    <option value="as-needed">As needed</option>
                  </select>
                </div>
                <Input
                  label="Duration"
                  placeholder="e.g., 7 days"
                  value={medication.duration}
                  onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                />
              </div>

              <div className="mt-4">
                <label className="block text-body font-medium text-neutral-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Take with food, avoid alcohol"
                  value={medication.instructions}
                  onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          ))}

          {/* Drug Interaction Alerts */}
          <DrugInteractionAlert />
          
          {/* Dosage Calculator */}
          {showDosageCalculator && (
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-medium text-gray-900 mb-3">Dosage Calculator</h3>
              <DosageCalculator />
            </div>
          )}
          
          <div className="p-4 bg-warning/10 rounded-small">
            <h4 className="text-body font-medium text-warning mb-2">⚠️ Prescription Safety</h4>
            <ul className="text-body-sm text-neutral-600 space-y-1">
              <li>• Check for drug allergies and interactions</li>
              <li>• Verify dosage calculations</li>
              <li>• Include clear administration instructions</li>
              <li>• Consider patient's age, weight, and medical history</li>
            </ul>
          </div>
        </div>
      </Card>
      
      <DrugInteractionModal
        isOpen={showInteractionModal}
        onClose={() => setShowInteractionModal(false)}
        onProceed={handleProceedWithInteractions}
      />
    </ConsultationLayout>
  );
}