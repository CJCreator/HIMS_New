import React, { useState } from 'react';
import { Card, Button } from '../../../components';
import { Stethoscope, Calendar, Clock } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in-use' | 'maintenance';
  location: string;
  nextAvailable?: string;
}

interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  department: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

export const EquipmentScheduling: React.FC = () => {
  const [equipment] = useState<Equipment[]>([
    { id: '1', name: 'X-Ray Machine A', type: 'Imaging', status: 'in-use', location: 'Radiology', nextAvailable: '14:00' },
    { id: '2', name: 'Ultrasound B', type: 'Imaging', status: 'available', location: 'Radiology' },
    { id: '3', name: 'Ventilator 5', type: 'Life Support', status: 'in-use', location: 'ICU', nextAvailable: '16:30' },
    { id: '4', name: 'ECG Monitor', type: 'Monitoring', status: 'available', location: 'Cardiology' }
  ]);

  const [bookings] = useState<Booking[]>([
    { id: '1', equipmentId: '1', equipmentName: 'X-Ray Machine A', department: 'Orthopedics', startTime: '10:00', endTime: '11:00', purpose: 'Fracture Assessment' },
    { id: '2', equipmentId: '3', equipmentName: 'Ventilator 5', department: 'ICU', startTime: '08:00', endTime: '16:30', purpose: 'Patient Support' }
  ]);

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment Scheduling</h1>
          <p className="text-gray-600 mt-1">Manage medical equipment bookings</p>
        </div>
        <Button variant="primary">Book Equipment</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Equipment</h2>
          <div className="space-y-3">
            {equipment.map((eq) => (
              <Card key={eq.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{eq.name}</h3>
                      <p className="text-sm text-gray-600">{eq.type} • {eq.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                      {eq.status}
                    </span>
                    {eq.nextAvailable && (
                      <p className="text-xs text-gray-500 mt-1">Next: {eq.nextAvailable}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Bookings</h2>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{booking.equipmentName}</h3>
                  <Button variant="secondary" size="sm">Cancel</Button>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{booking.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{booking.startTime} - {booking.endTime}</span>
                  </div>
                  <p className="text-gray-700">{booking.purpose}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
