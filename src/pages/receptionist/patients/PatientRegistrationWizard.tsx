import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/notificationSlice';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';

const Upload = ({ className }: { className?: string }) => <span className={className}>📤</span>;
const User = ({ className }: { className?: string }) => <span className={className}>👤</span>;
const Shield = ({ className }: { className?: string }) => <span className={className}>🛡️</span>;

interface PatientRegistrationWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PatientRegistrationWizard: React.FC<PatientRegistrationWizardProps> = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '', lastName: '', dateOfBirth: '', gender: '', ssn: '',
    // Contact Info
    phone: '', email: '', address: '', city: '', state: '', zipCode: '',
    // Insurance Info
    insuranceProvider: '', policyNumber: '', groupNumber: '', subscriberName: '',
    // Emergency Contact
    emergencyName: '', emergencyPhone: '', emergencyRelation: '',
    // Medical History
    allergies: '', medications: '', conditions: '', surgeries: ''
  });

  const steps = [
    { title: 'Personal Information', icon: <User className="w-5 h-5" /> },
    { title: 'Contact Details', icon: <User className="w-5 h-5" /> },
    { title: 'Insurance Information', icon: <Shield className="w-5 h-5" /> },
    { title: 'Emergency Contact', icon: <User className="w-5 h-5" /> },
    { title: 'Medical History', icon: <User className="w-5 h-5" /> }
  ];

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
          dispatch(addNotification({
      type: 'warning',
      title: 'Missing Information',
      message: 'Please fill in all required personal information',
      priority: 'medium',
      category: 'system'
    }));
          return false;
        }
        break;
      case 2:
        if (!formData.phone || !formData.address) {
          dispatch(addNotification({
      type: 'warning',
      title: 'Missing Information',
      message: 'Please provide phone number and address',
      priority: 'medium',
      category: 'system'
    }));
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = () => {
    dispatch(addNotification({
      type: 'success',
      title: 'Patient Registered',
      message: '${formData.firstName} ${formData.lastName} has been successfully registered',
      priority: 'medium',
      category: 'system'
    }));
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Patient Registration</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8 overflow-x-auto">
            {steps.map((stepInfo, index) => (
              <div key={index} className="flex items-center min-w-0">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
                  ${step > index + 1 ? 'bg-green-500 text-white' : 
                    step === index + 1 ? 'bg-receptionist-500 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {step > index + 1 ? '✓' : stepInfo.icon}
                </div>
                <div className="ml-2 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{stepInfo.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name *"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                  <Input
                    label="Last Name *"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                  <Input
                    label="Date of Birth *"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-receptionist-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Social Security Number"
                    value={formData.ssn}
                    onChange={(e) => setFormData({...formData, ssn: e.target.value})}
                    placeholder="XXX-XX-XXXX"
                  />
                </div>
              </Card>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Address *"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
                  <Input
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  />
                </div>
              </Card>
            )}

            {/* Step 3: Insurance Information */}
            {step === 3 && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Insurance Provider"
                    value={formData.insuranceProvider}
                    onChange={(e) => setFormData({...formData, insuranceProvider: e.target.value})}
                  />
                  <Input
                    label="Policy Number"
                    value={formData.policyNumber}
                    onChange={(e) => setFormData({...formData, policyNumber: e.target.value})}
                  />
                  <Input
                    label="Group Number"
                    value={formData.groupNumber}
                    onChange={(e) => setFormData({...formData, groupNumber: e.target.value})}
                  />
                  <Input
                    label="Subscriber Name"
                    value={formData.subscriberName}
                    onChange={(e) => setFormData({...formData, subscriberName: e.target.value})}
                  />
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Document Upload</h4>
                  <div className="space-y-2">
                    <Button variant="secondary" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Insurance Card
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload ID Document
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 4: Emergency Contact */}
            {step === 4 && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Contact Name"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({...formData, emergencyName: e.target.value})}
                  />
                  <Input
                    label="Phone Number"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  />
                  <Input
                    label="Relationship"
                    value={formData.emergencyRelation}
                    onChange={(e) => setFormData({...formData, emergencyRelation: e.target.value})}
                    placeholder="Spouse, Parent, Sibling, etc."
                  />
                </div>
              </Card>
            )}

            {/* Step 5: Medical History */}
            {step === 5 && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medical History</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Known Allergies</label>
                    <textarea
                      value={formData.allergies}
                      onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                      placeholder="List any known allergies..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-receptionist-500"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                    <textarea
                      value={formData.medications}
                      onChange={(e) => setFormData({...formData, medications: e.target.value})}
                      placeholder="List current medications..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-receptionist-500"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                    <textarea
                      value={formData.conditions}
                      onChange={(e) => setFormData({...formData, conditions: e.target.value})}
                      placeholder="List any medical conditions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-receptionist-500"
                      rows={2}
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <div>
              {step > 1 && (
                <Button variant="secondary" onClick={() => setStep(prev => prev - 1)}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              {step < 5 ? (
                <Button variant="primary" onClick={handleNext}>Next</Button>
              ) : (
                <Button variant="primary" onClick={handleSubmit}>Complete Registration</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};