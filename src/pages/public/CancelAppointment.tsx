import React, { useState } from 'react';
import { Card, Button } from '../../components';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

export const CancelAppointment: React.FC = () => {
  const [appointment] = useState({
    id: 'APT001',
    doctor: 'Dr. Smith',
    specialty: 'Cardiology',
    date: '2024-01-20',
    time: '10:00 AM'
  });
  
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const reasons = [
    'Schedule conflict',
    'Feeling better',
    'Need to reschedule',
    'Financial reasons',
    'Other'
  ];

  const handleCancel = () => {
    alert('Appointment cancelled successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cancel Appointment</h1>

        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Appointment Details</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-900">{appointment.doctor}</p>
            <p className="text-sm text-gray-600">{appointment.specialty}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{appointment.time}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Reason for Cancellation</h2>
          <div className="space-y-2">
            {reasons.map((r) => (
              <label key={r} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-blue-600"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </Card>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Cancellation Policy</p>
              <p>Cancellations within 24 hours may incur a $25 fee. Multiple no-shows may affect future booking privileges.</p>
            </div>
          </div>
        </div>

        <label className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">I understand the cancellation policy</span>
        </label>

        <div className="flex space-x-3">
          <Button variant="secondary" className="flex-1">Go Back</Button>
          <Button 
            variant="primary" 
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={handleCancel}
            disabled={!reason || !confirmed}
          >
            Confirm Cancellation
          </Button>
        </div>
      </div>
    </div>
  );
};