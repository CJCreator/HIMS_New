import React from 'react';
import { useDispatch } from 'react-redux';
import { addRoleNotification } from '../store/notificationSlice';
import { Button } from './Button';
import { Card } from './Card';

const User = ({ className }: { className?: string }) => <span className={className}>👤</span>;
const Clock = ({ className }: { className?: string }) => <span className={className}>🕐</span>;

interface PatientArrivalTrackerProps {
  userRole?: 'receptionist';
}

export const PatientArrivalTracker: React.FC<PatientArrivalTrackerProps> = () => {
  const dispatch = useDispatch();
  
  // Mock upcoming appointments
  const upcomingAppointments = [
    { id: 'A001', patientName: 'John Smith', time: '10:00 AM', doctor: 'Dr. Wilson', status: 'scheduled' },
    { id: 'A002', patientName: 'Sarah Johnson', time: '10:30 AM', doctor: 'Dr. Brown', status: 'scheduled' },
    { id: 'A003', patientName: 'Mike Davis', time: '11:00 AM', doctor: 'Dr. Wilson', status: 'arrived' }
  ];

  const handlePatientArrival = (appointment: { id: string; patientName: string; time: string; }) => {
    // Notify doctor
    dispatch(addRoleNotification({
      role: 'doctor',
      type: 'info',
      title: 'Patient Arrived',
      message: `${appointment.patientName} has arrived for their ${appointment.time} appointment`,
      category: 'appointment',
      priority: 'medium',
      relatedId: appointment.id
    }));

    // Notify nurse if needed
    dispatch(addRoleNotification({
      role: 'nurse',
      type: 'info',
      title: 'Patient Check-in',
      message: `${appointment.patientName} is ready for vitals check`,
      category: 'patient',
      priority: 'medium',
      relatedId: appointment.id
    }));
  };

  return (
    <Card className="p-4">
      <h3 className="font-medium text-gray-900 mb-3">Patient Arrivals</h3>
      <div className="space-y-2">
        {upcomingAppointments.map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                <p className="text-xs text-gray-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {appointment.time} • {appointment.doctor}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                appointment.status === 'arrived' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {appointment.status}
              </span>
              {appointment.status === 'scheduled' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handlePatientArrival(appointment)}
                >
                  Check In
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};