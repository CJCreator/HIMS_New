import React, { useState } from 'react';
import { Card, Button, Input } from '../../components';
import { Calendar, Clock, User, Video } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export const BookAppointment: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'telemedicine'>('in-person');
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    reason: ''
  });

  const doctors: Doctor[] = [
    { id: '1', name: 'Dr. Smith', specialty: 'General Medicine', available: true },
    { id: '2', name: 'Dr. Johnson', specialty: 'Cardiology', available: true },
    { id: '3', name: 'Dr. Brown', specialty: 'Dermatology', available: false }
  ];

  const timeSlots: TimeSlot[] = [
    { time: '9:00 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: true },
    { time: '4:00 PM', available: false }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Handle appointment booking
    alert('Appointment booked successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-600 mt-2">Schedule your visit with our healthcare professionals</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {num}
                </div>
                {num < 4 && <div className="w-8 h-0.5 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-8">
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Select a Doctor</h2>
              <div className="space-y-3">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-blue-500 bg-blue-50'
                        : doctor.available
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                    onClick={() => doctor.available && setSelectedDoctor(doctor)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doctor.name}</p>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doctor.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Select Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Times
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2 text-sm rounded border ${
                          selectedTime === slot.time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : slot.available
                            ? 'border-gray-200 hover:border-gray-300'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Appointment Type */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Appointment Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-6 border rounded-lg cursor-pointer transition-colors ${
                    appointmentType === 'in-person'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setAppointmentType('in-person')}
                >
                  <div className="text-center">
                    <User className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-medium text-gray-900">In-Person Visit</h3>
                    <p className="text-sm text-gray-600 mt-1">Visit our clinic</p>
                  </div>
                </div>
                <div
                  className={`p-6 border rounded-lg cursor-pointer transition-colors ${
                    appointmentType === 'telemedicine'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setAppointmentType('telemedicine')}
                >
                  <div className="text-center">
                    <Video className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-medium text-gray-900">Telemedicine</h3>
                    <p className="text-sm text-gray-600 mt-1">Video consultation</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Patient Information */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={patientInfo.phone}
                  onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={patientInfo.email}
                  onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  rows={3}
                  value={patientInfo.reason}
                  onChange={(e) => setPatientInfo({...patientInfo, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your symptoms or reason for visit"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={
                  (step === 1 && !selectedDoctor) ||
                  (step === 2 && (!selectedDate || !selectedTime))
                }
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!patientInfo.name || !patientInfo.phone || !patientInfo.email}
              >
                Book Appointment
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};