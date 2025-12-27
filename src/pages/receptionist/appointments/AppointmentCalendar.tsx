import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addAppointment, updateAppointmentStatus, updateAppointment } from '@/store/appointmentSlice';
import { addRoleNotification, addNotification } from '@/store/notificationSlice';
import { Card, Button, Modal, Input, Badge } from '@/components';
import { Calendar } from '@/components/Calendar';
import { toast } from 'sonner';

const doctors = [
  { id: 'DR001', name: 'Dr. Sarah Wilson', specialization: 'Cardiologist' },
  { id: 'DR002', name: 'Dr. John Brown', specialization: 'General Medicine' },
  { id: 'DR003', name: 'Dr. Emily Davis', specialization: 'Pediatrics' },
];

const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

export function AppointmentCalendar() {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { patients } = useSelector((state: RootState) => state.patients);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [bookingForm, setBookingForm] = useState({
    patientId: '',
    patientName: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'Consultation',
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    time: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, filterStatus]);

  const todayAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return filteredAppointments.filter(apt => apt.date === today);
  }, [filteredAppointments]);

  const handleBookAppointment = async () => {
    if (!bookingForm.patientName || !bookingForm.doctorId || !bookingForm.date || !bookingForm.time) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const doctor = doctors.find(d => d.id === bookingForm.doctorId);
      const appointment = {
        patientId: bookingForm.patientId || `P${Date.now()}`,
        patientName: bookingForm.patientName,
        doctorId: bookingForm.doctorId,
        doctorName: doctor?.name || '',
        date: bookingForm.date,
        time: bookingForm.time,
        type: bookingForm.type,
        status: 'scheduled' as const,
      };
      
      dispatch(addAppointment(appointment));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Appointment Booked',
        message: `Appointment for ${bookingForm.patientName} booked successfully`,
        priority: 'medium',
        category: 'appointment'
      }));
      
      dispatch(addRoleNotification({
        role: 'doctor',
        type: 'info',
        title: 'New Appointment Scheduled',
        message: `Appointment with ${bookingForm.patientName} scheduled for ${bookingForm.date} at ${bookingForm.time}`,
        category: 'appointment',
        priority: 'medium'
      }));
      
      toast.success('Appointment booked successfully');
      setShowBookingModal(false);
      setBookingForm({ patientId: '', patientName: '', doctorId: '', date: '', time: '', type: 'Consultation' });
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

      toast.success('Appointment rescheduled successfully');
      setShowRescheduleModal(false);
      setRescheduleForm({ date: '', time: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string, patientName: string) => {
    if (!confirm(`Cancel appointment for ${patientName}?`)) return;

    setIsLoading(true);
    try {
      dispatch(updateAppointmentStatus({ id: appointmentId, status: 'cancelled' }));
      
      dispatch(addNotification({
        type: 'warning',
        title: 'Appointment Cancelled',
        message: `Appointment for ${patientName} has been cancelled`,
        priority: 'medium',
        category: 'appointment'
      }));

      toast.success('Appointment cancelled');
    } finally {
      setIsLoading(false);
    }
  };

  const openRescheduleModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setRescheduleForm({ date: appointment.date, time: appointment.time });
    setShowRescheduleModal(true);
  };

  const openDetailsModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Appointment Calendar</h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search by patient or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <Button onClick={() => setShowBookingModal(true)}>
          + Book New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Calendar
            events={filteredAppointments.map(apt => ({
              id: apt.id,
              title: apt.patientName,
              time: apt.time,
              doctor: apt.doctorName,
              status: apt.status
            }))}
            onDateSelect={setSelectedDate}
            onEventClick={(event) => {
              const apt = appointments.find(a => a.id === event.id);
              if (apt) openDetailsModal(apt);
            }}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {todayAppointments.length === 0 ? (
                <p className="text-body-sm text-neutral-500 text-center py-4">No appointments today</p>
              ) : (
                todayAppointments.map((apt) => (
                  <div key={apt.id} className="p-3 border border-neutral-200 rounded-small">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-body font-medium">{apt.patientName}</p>
                        <p className="text-body-sm text-neutral-600">{apt.time} • {apt.doctorName}</p>
                      </div>
                      <Badge status={apt.status === 'confirmed' ? 'delivered' : apt.status === 'cancelled' ? 'error' : 'pending'}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="tertiary" size="sm" onClick={() => openDetailsModal(apt)}>View</Button>
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <>
                          <Button variant="tertiary" size="sm" onClick={() => openRescheduleModal(apt)}>Reschedule</Button>
                          <Button variant="tertiary" size="sm" className="text-error" onClick={() => handleCancel(apt.id, apt.patientName)}>
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Available Doctors</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="p-2 bg-neutral-50 rounded-small">
                  <p className="text-body font-medium">{doctor.name}</p>
                  <p className="text-body-sm text-neutral-600">{doctor.specialization}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Book New Appointment" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">Select Patient</label>
            <select
              value={bookingForm.patientId}
              onChange={(e) => {
                const patient = patients.find(p => p.id === e.target.value);
                setBookingForm({ ...bookingForm, patientId: e.target.value, patientName: patient?.name || '' });
              }}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select existing patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Or Enter New Patient Name *"
            value={bookingForm.patientName}
            onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value, patientId: '' })}
            placeholder="Enter patient name"
          />
          
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

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">Appointment Type</label>
            <select
              value={bookingForm.type}
              onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value })}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Check-up">Check-up</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowBookingModal(false)}>Cancel</Button>
            <Button onClick={handleBookAppointment} loading={isLoading}>Book Appointment</Button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      {selectedAppointment && (
        <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Appointment Details" size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-body-sm text-neutral-600">Patient</p>
                <p className="text-body font-medium">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Doctor</p>
                <p className="text-body font-medium">{selectedAppointment.doctorName}</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Date</p>
                <p className="text-body font-medium">{selectedAppointment.date}</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Time</p>
                <p className="text-body font-medium">{selectedAppointment.time}</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Type</p>
                <p className="text-body font-medium">{selectedAppointment.type}</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Status</p>
                <Badge status={selectedAppointment.status === 'confirmed' ? 'delivered' : selectedAppointment.status === 'cancelled' ? 'error' : 'pending'}>
                  {selectedAppointment.status}
                </Badge>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</Button>
              {selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed' && (
                <Button onClick={() => {
                  setShowDetailsModal(false);
                  openRescheduleModal(selectedAppointment);
                }}>
                  Reschedule
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Reschedule Modal */}
      {selectedAppointment && (
        <Modal isOpen={showRescheduleModal} onClose={() => setShowRescheduleModal(false)} title="Reschedule Appointment" size="md">
          <div className="space-y-4">
            <div className="p-3 bg-neutral-50 rounded-small">
              <p className="text-body-sm text-neutral-600">Patient: <span className="font-medium">{selectedAppointment.patientName}</span></p>
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
}
