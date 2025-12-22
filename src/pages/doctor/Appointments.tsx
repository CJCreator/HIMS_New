import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/notificationSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

const Calendar = ({ className }: { className?: string }) => <span className={className}>📅</span>;
const Clock = ({ className }: { className?: string }) => <span className={className}>🕐</span>;
const User = ({ className }: { className?: string }) => <span className={className}>👤</span>;

interface Appointment {
  id: string;
  patient: string;
  patientId: string;
  time: string;
  date: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export const DoctorAppointments: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const appointments: Appointment[] = [
    {
      id: 'A001',
      patient: 'John Smith',
      patientId: 'P001',
      time: '10:00 AM',
      date: '2024-01-15',
      type: 'Consultation',
      status: 'confirmed',
      notes: 'Follow-up for chest pain'
    },
    {
      id: 'A002',
      patient: 'Sarah Johnson',
      patientId: 'P002',
      time: '11:30 AM',
      date: '2024-01-15',
      type: 'Follow-up',
      status: 'pending'
    },
    {
      id: 'A003',
      patient: 'Mike Wilson',
      patientId: 'P003',
      time: '02:00 PM',
      date: '2024-01-15',
      type: 'Check-up',
      status: 'confirmed'
    },
    {
      id: 'A004',
      patient: 'Emma Davis',
      patientId: 'P004',
      time: '03:30 PM',
      date: '2024-01-15',
      type: 'Consultation',
      status: 'completed'
    }
  ];

  const filteredAppointments = appointments.filter(apt => apt.date === selectedDate);

  const handleStartConsultation = (appointment: Appointment) => {
    dispatch(addNotification({
      type: 'info',
      title: 'Starting Consultation',
      message: `Starting consultation with ${appointment.patient}`,
      priority: 'medium',
      category: 'appointment'
    }));
  };

  const handleReschedule = (appointment: Appointment) => {
    dispatch(addNotification({
      type: 'info',
      title: 'Reschedule Request',
      message: `Reschedule request sent for ${appointment.patient}`,
      priority: 'medium',
      category: 'appointment'
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'delivered';
      case 'pending': return 'pending';
      case 'completed': return 'delivered';
      case 'cancelled': return 'error';
      default: return 'pending';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">My Appointments</h1>
        <div className="flex gap-3">
          <Button 
            variant={viewMode === 'day' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('day')}
          >
            Day View
          </Button>
          <Button 
            variant={viewMode === 'week' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('week')}
          >
            Week View
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-600">
            {filteredAppointments.length} appointments scheduled
          </span>
        </div>
      </Card>

      {/* Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.patient}</h3>
                    <p className="text-sm text-gray-500">ID: {appointment.patientId}</p>
                  </div>
                </div>
                <Badge status={getStatusColor(appointment.status) as any}>
                  {appointment.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{appointment.type}</span>
                </div>
                {appointment.notes && (
                  <div className="text-sm text-gray-600">
                    <strong>Notes:</strong> {appointment.notes}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {appointment.status === 'confirmed' && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleStartConsultation(appointment)}
                  >
                    Start Consultation
                  </Button>
                )}
                {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleReschedule(appointment)}
                  >
                    Reschedule
                  </Button>
                )}
                <Button variant="secondary" size="sm">
                  View Details
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="lg:col-span-2 text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
            <p className="text-gray-500">No appointments found for the selected date.</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {appointments.filter(a => a.status === 'confirmed').length}
          </div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {appointments.filter(a => a.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {appointments.filter(a => a.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {appointments.filter(a => a.status === 'cancelled').length}
          </div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </Card>
      </div>
    </div>
  );
};