import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '@/components';
import { addPatient } from '@/store/patientSlice';
import { addNotification, addRoleNotification } from '@/store/notificationSlice';
import { syncPatientRegistration } from '@/utils/dataSynchronization';

interface PatientData {
  personalDetails: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  medicalHistory: {
    allergies: string;
    medications: string;
    conditions: string;
  };
}

export function PatientRegistration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientData, setPatientData] = useState<PatientData>({
    personalDetails: { firstName: '', lastName: '', dateOfBirth: '', gender: '', bloodGroup: '' },
    contactInfo: { phone: '', email: '', address: '', city: '', zipCode: '' },
    emergencyContact: { name: '', relationship: '', phone: '' },
    insurance: { provider: '', policyNumber: '', groupNumber: '' },
    medicalHistory: { allergies: '', medications: '', conditions: '' },
  });

  const updateData = (section: keyof PatientData, field: string, value: string) => {
    setPatientData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const fullName = `${patientData.personalDetails.firstName} ${patientData.personalDetails.lastName}`;
      const patientInfo = {
        name: fullName,
        age: new Date().getFullYear() - new Date(patientData.personalDetails.dateOfBirth).getFullYear(),
        gender: patientData.personalDetails.gender,
        phone: patientData.contactInfo.phone,
        email: patientData.contactInfo.email,
        address: `${patientData.contactInfo.address}, ${patientData.contactInfo.city}, ${patientData.contactInfo.zipCode}`,
        emergencyContact: `${patientData.emergencyContact.phone} (${patientData.emergencyContact.name} - ${patientData.emergencyContact.relationship})`,
        medicalHistory: patientData.medicalHistory.conditions ? patientData.medicalHistory.conditions.split(',').map(c => c.trim()) : [],
        currentMedications: patientData.medicalHistory.medications ? patientData.medicalHistory.medications.split(',').map(m => m.trim()) : [],
        allergies: patientData.medicalHistory.allergies ? patientData.medicalHistory.allergies.split(',').map(a => a.trim()) : [],
      };

      dispatch(addPatient(patientInfo));

      // Use cross-portal synchronization
      await syncPatientRegistration(patientInfo, {
        notifyRoles: ['doctor', 'nurse'],
        createInitialAppointment: false // Could be made configurable in future
      });

      navigate('/receptionist/patients');
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Registration Failed',
        message: 'Failed to register patient. Please try again.',
        priority: 'high',
        category: 'system'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <h3 className="text-h4 text-neutral-900 mb-6">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                value={patientData.personalDetails.firstName}
                onChange={(e) => updateData('personalDetails', 'firstName', e.target.value)}
                placeholder="Enter first name"
              />
              <Input
                label="Last Name *"
                value={patientData.personalDetails.lastName}
                onChange={(e) => updateData('personalDetails', 'lastName', e.target.value)}
                placeholder="Enter last name"
              />
              <Input
                label="Date of Birth *"
                type="date"
                value={patientData.personalDetails.dateOfBirth}
                onChange={(e) => updateData('personalDetails', 'dateOfBirth', e.target.value)}
              />
              <div>
                <label className="block text-body font-medium text-neutral-700 mb-1">Gender *</label>
                <select
                  value={patientData.personalDetails.gender}
                  onChange={(e) => updateData('personalDetails', 'gender', e.target.value)}
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-body font-medium text-neutral-700 mb-1">Blood Group</label>
                <select
                  value={patientData.personalDetails.bloodGroup}
                  onChange={(e) => updateData('personalDetails', 'bloodGroup', e.target.value)}
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </Card>
        );

      case 2:
        return (
          <Card>
            <h3 className="text-h4 text-neutral-900 mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number *"
                  value={patientData.contactInfo.phone}
                  onChange={(e) => updateData('contactInfo', 'phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={patientData.contactInfo.email}
                  onChange={(e) => updateData('contactInfo', 'email', e.target.value)}
                  placeholder="patient@email.com"
                />
              </div>
              <Input
                label="Address *"
                value={patientData.contactInfo.address}
                onChange={(e) => updateData('contactInfo', 'address', e.target.value)}
                placeholder="Street address"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City *"
                  value={patientData.contactInfo.city}
                  onChange={(e) => updateData('contactInfo', 'city', e.target.value)}
                  placeholder="City"
                />
                <Input
                  label="ZIP Code *"
                  value={patientData.contactInfo.zipCode}
                  onChange={(e) => updateData('contactInfo', 'zipCode', e.target.value)}
                  placeholder="12345"
                />
              </div>
            </div>
          </Card>
        );

      case 3:
        return (
          <Card>
            <h3 className="text-h4 text-neutral-900 mb-6">Emergency Contact</h3>
            <div className="space-y-4">
              <Input
                label="Contact Name *"
                value={patientData.emergencyContact.name}
                onChange={(e) => updateData('emergencyContact', 'name', e.target.value)}
                placeholder="Emergency contact name"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Relationship *"
                  value={patientData.emergencyContact.relationship}
                  onChange={(e) => updateData('emergencyContact', 'relationship', e.target.value)}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
                <Input
                  label="Phone Number *"
                  value={patientData.emergencyContact.phone}
                  onChange={(e) => updateData('emergencyContact', 'phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </Card>
        );

      case 4:
        return (
          <Card>
            <h3 className="text-h4 text-neutral-900 mb-6">Insurance Details</h3>
            <div className="space-y-4">
              <Input
                label="Insurance Provider"
                value={patientData.insurance.provider}
                onChange={(e) => updateData('insurance', 'provider', e.target.value)}
                placeholder="e.g., Blue Cross Blue Shield"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Policy Number"
                  value={patientData.insurance.policyNumber}
                  onChange={(e) => updateData('insurance', 'policyNumber', e.target.value)}
                  placeholder="Policy number"
                />
                <Input
                  label="Group Number"
                  value={patientData.insurance.groupNumber}
                  onChange={(e) => updateData('insurance', 'groupNumber', e.target.value)}
                  placeholder="Group number"
                />
              </div>
            </div>
          </Card>
        );

      case 5:
        return (
          <Card>
            <h3 className="text-h4 text-neutral-900 mb-6">Medical History Summary</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-neutral-700 mb-1">Known Allergies</label>
                <textarea
                  rows={3}
                  value={patientData.medicalHistory.allergies}
                  onChange={(e) => updateData('medicalHistory', 'allergies', e.target.value)}
                  placeholder="List any known allergies (medications, food, environmental)"
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-body font-medium text-neutral-700 mb-1">Current Medications</label>
                <textarea
                  rows={3}
                  value={patientData.medicalHistory.medications}
                  onChange={(e) => updateData('medicalHistory', 'medications', e.target.value)}
                  placeholder="List current medications and dosages"
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-body font-medium text-neutral-700 mb-1">Medical Conditions</label>
                <textarea
                  rows={3}
                  value={patientData.medicalHistory.conditions}
                  onChange={(e) => updateData('medicalHistory', 'conditions', e.target.value)}
                  placeholder="List any chronic conditions or past medical history"
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Patient Registration</h1>
      </div>
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0 overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-h3 text-neutral-900">New Patient Registration</h2>
            <p className="text-body text-neutral-600">Step {currentStep} of 5</p>
          </div>
          <div className="w-full sm:w-64">
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-receptionist h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {renderStep()}

        <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
          {currentStep === 5 ? (
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              className="w-full sm:w-auto"
            >
              Register Patient
            </Button>
          ) : (
            <Button onClick={handleNext} className="w-full sm:w-auto">
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}