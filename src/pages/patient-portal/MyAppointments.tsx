import React, { useState } from 'react';
import { Card, Button } from '../../components';
import { QueueStatus } from '../../components/QueueStatus';
import { Calendar, Clock, Video, MapPin, X } from 'lucide-react';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in-person' | 'telemedicine';
  status: 'upcoming' | 'completed' | 'cancelled';
  location?: string;
}

export const MyAppointments: React.FC = () => {
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments] = useState<Appointment[]>([
    { id: '1', doctor: 'Dr. Smith', specialty: 'Cardiology', date: '2024-01-20', time: '10:00 AM', type: 'in-person', status: 'upcoming', location: 'Room 301' },
    { id: '2', doctor: 'Dr. Johnson', specialty: 'General', date: '2024-01-25', time: '2:30 PM', type: 'telemedicine', status: 'upcoming' },
    { id: '3', doctor: 'Dr. Brown', specialty: 'Dermatology', date: '2024-01-10', time: '11:00 AM', type: 'in-person', status: 'completed', location: 'Room 205' }
  ]);

  const filteredAppointments = appointments.filter(apt => 
    filter === 'upcoming' ? apt.status === 'upcoming' : apt.status !== 'upcoming'
  );

  const activeAppointment = appointments.find(apt => apt.status === 'upcoming' && apt.date === '2024-01-20');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <Button variant="primary">Book New Appointment</Button>
      </div>

      <div className="flex space-x-2">
        <Button variant={filter === 'upcoming' ? 'primary' : 'secondary'} onClick={() => setFilter('upcoming')}>
          Upcoming
        </Button>
        <Button variant={filter === 'past' ? 'primary' : 'secondary'} onClick={() => setFilter('past')}>
          Past
        </Button>
      </div>

      {activeAppointment && filter === 'upcoming' && (
        <QueueStatus
          position={3}
          estimatedWait={15}
          department={activeAppointment.specialty}
          doctor={activeAppointment.doctor}
          appointmentTime={activeAppointment.time}
        />
      )}

      <div className="grid gap-4">
        {filteredAppointments.map((apt) => (
          <Card key={apt.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{apt.doctor}</h3>
                  <span className="text-sm text-gray-600">• {apt.specialty}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{apt.time}</span>
                  </div>
                  {apt.type === 'telemedicine' ? (
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-blue-500" />
                      <span>Video Consultation</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{apt.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {apt.status === 'upcoming' && (
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">Reschedule</Button>
                  <Button variant="secondary" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};