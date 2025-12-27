import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addAppointment, updateAppointmentStatus, updateAppointment } from '@/store/appointmentSlice';
import { addNotification } from '@/store/notificationSlice';
import { Card, Button, Modal, Input } from '@/components';
import { Calendar, Clock, Video, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';

const doctors = [
  { id: 'DR001', name: 'Dr. Sarah Wilson', specialization: 'Cardiologist' },
  { id: 'DR002', name: 'Dr. John Brown', specialization: 'General Medicine' },
  { id: 'DR003', name: 'Dr. Emily Davis', specialization: 'Pediatrics' },
];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export const MyAppointments = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    date: '',
    time: '',
    type: 'Consultation',
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    time: '',
  });

  const patientAppointments = useMemo(() => 
    appointments.filter(apt => apt.patientId === user?.id),
    [appointments, user?.id]
  );

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return patientAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return filter === 'upcoming' 
        ? aptDate >= now && apt.status !== 'cancelled'
        : aptDate < now || apt.status === 'cancelled';
    });
  }, [patientAppointments, filter]);

  const handleBookAppointment = async () => {
    if (!bookingForm.doctorId || !bookingForm.date || !bookingForm.time) {
      toast.error('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const doctor = doctors.find(d => d.id === bookingForm.doctorId);
      dispatch(addAppointment({
        patientId: user?.id || '',
        patientName: user?.name || '',
        doctorId: bookingForm.doctorId,
        doctorName: doctor?.name || '',
        date: bookingForm.date,
        time: bookingForm.time,
        type: bookingForm.type,
        status: 'scheduled' as const,
      }));

      dispatch(addNotification({
        type: 'success',
        title: 'Appointment Booked',
        message: `Your appointment with ${doctor?.name} is confirmed`,
        priority: 'medium',
        category: 'appointment'
      }));

      toast.success('Appointment booked successfully');
      setShowBookModal(false);
      setBookingForm({ doctorId: '', date: '', time: '', type: 'Consultation' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleForm.date || !rescheduleForm.time) {
      toast.error('Please select date and time');
      return;
    }

    setIsLoading(true);
    try {
      dispatch(updateAppointment({
        ...selectedAppointment,
        date: rescheduleForm.date,
        time: rescheduleForm.time,
      }));

      dispatch(addNotification({
        type: 'info',
        title: 'Appointment Rescheduled',
        message: `Appointment rescheduled to ${rescheduleForm.date} at ${rescheduleForm.time}`,
        priority: 'medium',
        category: 'appointment'
      }));

      toast.success('Appointment rescheduled');
      setShowRescheduleModal(false);
      setRescheduleForm({ date: '', time: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!confirm('Cancel this appointment?')) return;

    setIsLoading(true);
    try {
      dispatch(updateAppointmentStatus({ id: appointmentId, status: 'cancelled' }));
      
      dispatch(addNotification({
        type: 'warning',
        title: 'Appointment Cancelled',
        message: 'Your appointment has been cancelled',
        priority: 'medium',
        category: 'appointment'
      }));

      toast.success('Appointment cancelled');
    } finally {
      setIsLoading(false);
    }
  };

  const openRescheduleModal = (apt: any) => {
    setSelectedAppointment(apt);
    setRescheduleForm({ date: apt.date, time: apt.time });
    setShowRescheduleModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <Button variant="primary" onClick={() => setShowBookModal(true)}>Book New Appointment</Button>
      </div>

      <div className="flex space-x-2">
        <Button variant={filter === 'upcoming' ? 'primary' : 'secondary'} onClick={() => setFilter('upcoming')}>
          Upcoming
        </Button>
        <Button variant={filter === 'past' ? 'primary' : 'secondary'} onClick={() => setFilter('past')}>
          Past
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No {filter} appointments</p>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <Card key={apt.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{apt.doctorName}</h3>
                    <span className="text-sm text-gray-600">• {apt.type}</span>
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
                  </div>
                </div>

                {apt.status === 'scheduled' && filter === 'upcoming' && (
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => openRescheduleModal(apt)}>Reschedule</Button>
                    <Button variant="secondary" size="sm" onClick={() => handleCancel(apt.id)} loading={isLoading}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Book Appointment Modal */}
      <Modal isOpen={showBookModal} onClose={() => setShowBookModal(false)} title="Book New Appointment" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">Doctor *</label>
            <select
              value={bookingForm.doctorId}
              onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date *"
              type="date"
              value={bookingForm.date}
              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />

            <div>
              <label className="block text-body font-medium text-neutral-700 mb-1">Time *</label>
              <select
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowBookModal(false)}>Cancel</Button>
            <Button onClick={handleBookAppointment} loading={isLoading}>Book Appointment</Button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      {selectedAppointment && (
        <Modal isOpen={showRescheduleModal} onClose={() => setShowRescheduleModal(false)} title="Reschedule Appointment" size="md">
          <div className="space-y-4">
            <div className="p-3 bg-neutral-50 rounded-small">
              <p className="text-body-sm text-neutral-600">Doctor: <span className="font-medium">{selectedAppointment.doctorName}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="New Date *"
                type="date"
                value={rescheduleForm.date}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />

              <div>
                <label className="block text-body font-medium text-neutral-700 mb-1">New Time *</label>
                <select
                  value={rescheduleForm.time}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setShowRescheduleModal(false)}>Cancel</Button>
              <Button onClick={handleReschedule} loading={isLoading}>Confirm Reschedule</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
