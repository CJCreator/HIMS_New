import { useState, useMemo } from 'react';
import { Card, Button, Badge } from '@/components';
import { NotificationDetailModal } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateAppointmentStatus } from '@/store/appointmentSlice';
import { addNotification, addRoleNotification } from '@/store/notificationSlice';
import type { Notification } from '@/types';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaMoneyBillWave, 
  FaClipboardList,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle
} from 'react-icons/fa';

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
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-receptionist">{stats.total}</div>
                <div className="text-sm text-neutral-600 mt-1">Today's Appointments</div>
              </div>
              <div className="w-12 h-12 bg-receptionist/10 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-receptionist" size={24} aria-hidden="true" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-success">{stats.confirmed}</div>
                <div className="text-sm text-neutral-600 mt-1">Confirmed</div>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-success" size={24} aria-hidden="true" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-warning">{stats.pending}</div>
                <div className="text-sm text-neutral-600 mt-1">Pending</div>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <FaExclamationCircle className="text-warning" size={24} aria-hidden="true" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-neutral-700">{stats.cancelled}</div>
                <div className="text-sm text-neutral-600 mt-1">Cancelled</div>
              </div>
              <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                <FaTimesCircle className="text-neutral-600" size={24} aria-hidden="true" />
              </div>
            </div>
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
                <FaCalendarAlt className="mr-2" size={16} aria-hidden="true" />
                Book Appointment
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/receptionist/patients/register')}>
                <FaUser className="mr-2" size={16} aria-hidden="true" />
                Register Patient
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/receptionist/billing')}>
                <FaMoneyBillWave className="mr-2" size={16} aria-hidden="true" />
                Process Payment
              </Button>
              <Button
                variant="secondary"
                className="justify-start"
                onClick={() => navigate('/receptionist/patients')}
              >
                <FaClipboardList className="mr-2" size={16} aria-hidden="true" />
                Patient Records
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
