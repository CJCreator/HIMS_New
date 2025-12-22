import React, { useState } from 'react';
import { Card, Button, Input } from '../../components';
import { QueuePosition } from '../../components/QueuePosition';
import { CheckCircle, User, Calendar } from 'lucide-react';

export const CheckInKiosk: React.FC = () => {
  const [step, setStep] = useState<'search' | 'confirm' | 'complete'>('search');
  const [patientId, setPatientId] = useState('');
  const [appointment, setAppointment] = useState<any>(null);

  const handleSearch = () => {
    // Mock appointment lookup
    setAppointment({
      id: 'APT001',
      patientName: 'John Doe',
      doctor: 'Dr. Smith',
      time: '10:30 AM',
      date: 'Today'
    });
    setStep('confirm');
  };

  const handleCheckIn = () => {
    setStep('complete');
  };

  const resetKiosk = () => {
    setStep('search');
    setPatientId('');
    setAppointment(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Check-In</h1>
          <p className="text-gray-600">Please check in for your appointment</p>
        </div>

        {step === 'search' && (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Find Your Appointment</h2>
              <p className="text-gray-600">Enter your patient ID or phone number</p>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Patient ID or Phone Number"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter your patient ID"
                className="text-lg p-4"
              />
              <Button
                variant="primary"
                onClick={handleSearch}
                disabled={!patientId}
                className="w-full text-lg py-4"
              >
                Find Appointment
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && appointment && (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirm Your Appointment</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-semibold text-gray-900">{appointment.doctor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">{appointment.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold text-gray-900">{appointment.time}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="secondary"
                onClick={() => setStep('search')}
                className="flex-1 text-lg py-4"
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleCheckIn}
                className="flex-1 text-lg py-4"
              >
                Check In
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-6 text-center">
            <CheckCircle className="w-20 h-20 mx-auto text-green-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check-In Complete!</h2>
              <p className="text-gray-600 mb-6">Thank you for checking in. Please take a seat in the waiting area.</p>
            </div>

            <QueuePosition
              position={3}
              estimatedWait={15}
              totalInQueue={8}
            />

            <Button
              variant="primary"
              onClick={resetKiosk}
              className="text-lg py-4 px-8"
            >
              Check In Another Patient
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};