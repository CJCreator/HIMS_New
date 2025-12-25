import { useState, useMemo } from 'react';
import { Card, Button, Badge } from '@/components';
import { NotificationDetailModal } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateAppointmentStatus } from '@/store/appointmentSlice';
import { addNotification, addRoleNotification } from '@/store/notificationSlice';
import type { Notification } from '@/types';

export function ReceptionistDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = useMemo(() => 
    appointments.filter(apt => apt.date === today).slice(0, 5),
    [appointments, today]
  );

  const stats = useMemo(() => ({
    total: appointments.filter(apt => apt.date === today).length,
    confirmed: appointments.filter(apt => apt.date === today && apt.status === 'confirmed').length,
    pending: appointments.filter(apt => apt.date === today && apt.status === 'scheduled').length,
    cancelled: appointments.filter(apt => apt.date === today && apt.status === 'cancelled').length,
  }), [appointments, today]);
  
  const handleCheckIn = async (appointmentId: string, patientName: string) => {
    setIsLoading(true);
    try {
      dispatch(updateAppointmentStatus({ id: appointmentId, status: 'in-progress' }));
      dispatch(addNotification({
        type: 'success',
        title: 'Patient Checked In',
        message: `${patientName} has been checked in`,
        priority: 'medium',
        category: 'patient'
      }));
      dispatch(addRoleNotification({
        role: 'nurse',
        type: 'info',
        title: 'Patient Arrived',
        message: `${patientName} has checked in and is waiting`,
        priority: 'high',
        category: 'patient'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Receptionist Dashboard</h1>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <div className="text-h2 text-receptionist">{stats.total}</div>
            <div className="text-body text-neutral-600">Today's Appointments</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-success">{stats.confirmed}</div>
            <div className="text-body text-neutral-600">Confirmed</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-warning">{stats.pending}</div>
            <div className="text-body text-neutral-600">Pending</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-neutral-700">{stats.cancelled}</div>
            <div className="text-body text-neutral-600">Cancelled</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-h4 text-neutral-900">Today's Appointments</h3>
              <Button onClick={() => navigate('/receptionist/appointments')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="flex justify-between items-center p-3 bg-neutral-50 rounded-small">
                  <div>
                    <p className="text-body font-medium">{apt.patientName}</p>
                    <p className="text-body-sm text-neutral-600">{apt.time} • {apt.doctorName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={apt.status === 'confirmed' ? 'delivered' : apt.status === 'in-progress' ? 'pending' : 'sent'}>
                      {apt.status}
                    </Badge>
                    {apt.status === 'scheduled' && (
                      <Button size="sm" onClick={() => handleCheckIn(apt.id, apt.patientName)} loading={isLoading}>
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/receptionist/appointments')}>
                📅 Book Appointment
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/receptionist/patients/register')}>
                👤 Register Patient
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/receptionist/billing')}>
                💰 Process Payment
              </Button>
              <Button
                variant="secondary"
                className="justify-start"
                onClick={() => navigate('/receptionist/patients')}
              >
                📋 Patient Records
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
}