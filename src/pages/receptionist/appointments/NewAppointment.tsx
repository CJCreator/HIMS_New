import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/notificationSlice';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { Calendar } from '../../../components/Calendar';
import { Clock, User, AlertCircle, X } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: { [date: string]: string[] };
}

interface NewAppointmentProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const NewAppointment: React.FC<NewAppointmentProps> = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    appointmentType: 'consultation',
    selectedDoctor: '',
    selectedDate: null as Date | null,
    selectedTime: '',
    notes: '',
    urgency: 'routine' as 'routine' | 'urgent' | 'emergency'
  });

  // Mock doctors data
  const doctors: Doctor[] = [
    {
      id: 'DR001',
      name: 'Dr. Wilson',
      specialty: 'General Medicine',
      availability: {
        '2024-01-16': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        '2024-01-17': ['09:30', '10:30', '14:30', '15:30'],
        '2024-01-18': ['09:00', '10:00', '11:00', '16:00']
      }
    },
    {
      id: 'DR002',
      name: 'Dr. Brown',
      specialty: 'Cardiology',
      availability: {
        '2024-01-16': ['10:00', '11:00', '15:00', '16:00'],
        '2024-01-17': ['09:00', '10:00', '14:00', '15:00'],
        '2024-01-18': ['09:30', '10:30', '11:30']
      }
    }
  ];

  const selectedDoctor = doctors.find(d => d.id === formData.selectedDoctor);
  const availableTimes = selectedDoctor && formData.selectedDate 
    ? selectedDoctor.availability[formData.selectedDate.toISOString().split('T')[0]] || []
    : [];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.patientName || !formData.patientPhone) {
        dispatch(addNotification({
      type: 'warning',
      title: 'Missing Information',
      message: 'Please fill in patient name and phone number',
      priority: 'medium',
      category: 'system'
    }));
        return;
      }
    } else if (step === 2) {
      if (!formData.selectedDoctor || !formData.selectedDate || !formData.selectedTime) {
        dispatch(addNotification({
      type: 'warning',
      title: 'Incomplete Booking',
      message: 'Please select doctor, date, and time',
      priority: 'medium',
      category: 'system'
    }));
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleConfirm = () => {
    // Check for conflicts (mock)
    const hasConflict = Math.random() < 0.1; // 10% chance of conflict
    
    if (hasConflict) {
      dispatch(addNotification({
      type: 'error',
      title: 'Booking Conflict',
      message: 'This time slot is no longer available. Please select another time.',
      priority: 'urgent',
      category: 'system'
    }));
      setStep(2);
      return;
    }

    dispatch(addNotification({
      type: 'success',
      title: 'Appointment Booked',
      message: 'Appointment scheduled for ${formData.patientName} on ${formData.selectedDate?.toLocaleDateString()} at ${formData.selectedTime}',
      priority: 'medium',
      category: 'system'
    }));

    // Send SMS confirmation (mock)
    if (formData.patientPhone) {
      setTimeout(() => {
        dispatch(addNotification({
      type: 'info',
      title: 'SMS Sent',
      message: 'Confirmation SMS sent to ${formData.patientPhone}',
      priority: 'medium',
      category: 'system'
    }));
      }, 1000);
    }

    onSuccess();
  };

  const estimateWaitTime = () => {
    if (!selectedDoctor || !formData.selectedTime) return null;
    
    // Mock wait time calculation
    const baseWaitTime = 15;
    const timeSlotIndex = availableTimes.indexOf(formData.selectedTime);
    const additionalWait = timeSlotIndex * 5;
    
    return baseWaitTime + additionalWait;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">New Appointment</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= stepNum ? 'bg-receptionist-500 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`
                    w-16 h-0.5 mx-2
                    ${step > stepNum ? 'bg-receptionist-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Patient Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Patient Name *"
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  placeholder="Enter patient full name"
                />
                <Input
                  label="Phone Number *"
                  value={formData.patientPhone}
                  onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.patientEmail}
                  onChange={(e) => setFormData({...formData, patientEmail: e.target.value})}
                  placeholder="patient@email.com"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                  <select
                    value={formData.appointmentType}
                    onChange={(e) => setFormData({...formData, appointmentType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-receptionist-500 focus:border-transparent"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="followup">Follow-up</option>
                    <option value="checkup">Check-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
                <div className="flex gap-3">
                  {[
                    { value: 'routine', label: 'Routine', color: 'green' },
                    { value: 'urgent', label: 'Urgent', color: 'yellow' },
                    { value: 'emergency', label: 'Emergency', color: 'red' }
                  ].map(({ value, label, color }) => (
                    <label key={value} className="flex items-center">
                      <input
                        type="radio"
                        name="urgency"
                        value={value}
                        checked={formData.urgency === value}
                        onChange={(e) => setFormData({...formData, urgency: e.target.value as any})}
                        className="mr-2"
                      />
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-${color}-100 text-${color}-800`}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Doctor & Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Select Doctor & Time</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Available Doctors</h4>
                  <div className="space-y-3">
                    {doctors.map((doctor) => (
                      <Card 
                        key={doctor.id}
                        className={`p-4 cursor-pointer transition-all ${
                          formData.selectedDoctor === doctor.id 
                            ? 'ring-2 ring-receptionist-500 bg-receptionist-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setFormData({...formData, selectedDoctor: doctor.id, selectedTime: ''})}
                      >
                        <div className="flex items-center">
                          <User className="w-8 h-8 text-gray-400 mr-3" />
                          <div>
                            <h5 className="font-medium text-gray-900">{doctor.name}</h5>
                            <p className="text-sm text-gray-500">{doctor.specialty}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Select Date</h4>
                  <Calendar
                    selected={formData.selectedDate}
                    onSelect={(date) => setFormData({...formData, selectedDate: date, selectedTime: ''})}
                    minDate={new Date()}
                    className="w-full"
                  />
                </div>
              </div>

              {formData.selectedDoctor && formData.selectedDate && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Available Times</h4>
                  {availableTimes.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setFormData({...formData, selectedTime: time})}
                          className={`p-3 rounded-lg border text-center ${
                            formData.selectedTime === time
                              ? 'border-receptionist-500 bg-receptionist-50 text-receptionist-700'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <Clock className="w-4 h-4 mx-auto mb-1" />
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      No available times for this date
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Confirm Appointment</h3>
              
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Patient Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {formData.patientName}</p>
                      <p><strong>Phone:</strong> {formData.patientPhone}</p>
                      {formData.patientEmail && <p><strong>Email:</strong> {formData.patientEmail}</p>}
                      <p><strong>Type:</strong> {formData.appointmentType}</p>
                      <p><strong>Urgency:</strong> <span className={`px-2 py-1 rounded text-xs font-medium ${
                        formData.urgency === 'emergency' ? 'bg-red-100 text-red-800' :
                        formData.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>{formData.urgency}</span></p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Appointment Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
                      <p><strong>Specialty:</strong> {selectedDoctor?.specialty}</p>
                      <p><strong>Date:</strong> {formData.selectedDate?.toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {formData.selectedTime}</p>
                      {estimateWaitTime() && (
                        <p><strong>Est. Wait:</strong> {estimateWaitTime()} minutes</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Any special instructions or notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-receptionist-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <div>
              {step > 1 && (
                <Button variant="secondary" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              {step < 3 ? (
                <Button variant="primary" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button variant="primary" onClick={handleConfirm}>
                  Confirm Appointment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};