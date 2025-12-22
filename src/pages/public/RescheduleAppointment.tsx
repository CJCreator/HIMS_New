import React, { useState } from 'react';
import { Card, Button, Input } from '../../components';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

export const RescheduleAppointment: React.FC = () => {
  const [currentAppointment] = useState({
    id: 'APT001',
    doctor: 'Dr. Smith',
    date: '2024-01-20',
    time: '10:00 AM'
  });
  
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const availableSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const handleReschedule = () => {
    alert('Appointment rescheduled successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Reschedule Appointment</h1>

        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Current Appointment</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-900">{currentAppointment.doctor}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{currentAppointment.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{currentAppointment.time}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Select New Date & Time</h2>
          <div className="space-y-4">
            <Input
              label="New Date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setNewTime(slot)}
                    className={`p-2 text-sm rounded border ${
                      newTime === slot
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Rescheduling Policy</p>
              <p>Please reschedule at least 24 hours before your appointment to avoid cancellation fees.</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="secondary" className="flex-1">Cancel</Button>
          <Button 
            variant="primary" 
            className="flex-1"
            onClick={handleReschedule}
            disabled={!newDate || !newTime}
          >
            Confirm Reschedule
          </Button>
        </div>
      </div>
    </div>
  );
};