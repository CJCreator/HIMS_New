import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAppointment } from '../../../store/appointmentSlice';
import { addRoleNotification, addNotification } from '../../../store/notificationSlice';
import { Card, Button, Modal, Input, Badge } from '@/components';
import { Calendar } from '@/components/Calendar';
import { sanitizer } from '@/utils/sanitizer';

const appointments = [
  { id: '1', title: 'John Smith', time: '09:00', doctor: 'Dr. Wilson', status: 'confirmed' },
  { id: '2', title: 'Sarah Johnson', time: '10:30', doctor: 'Dr. Brown', status: 'pending' },
  { id: '3', title: 'Mike Davis', time: '14:00', doctor: 'Dr. Wilson', status: 'confirmed' },
];

const doctors = [
  { id: '1', name: 'Dr. Sarah Wilson', specialization: 'Cardiologist', availability: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
  { id: '2', name: 'Dr. John Brown', specialization: 'General Medicine', availability: ['08:00', '09:30', '11:30', '13:00', '16:00'] },
  { id: '3', name: 'Dr. Emily Davis', specialization: 'Pediatrics', availability: ['10:00', '11:00', '14:30', '15:30', '16:30'] },
];

export function AppointmentCalendar() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [patientName, setPatientName] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(150);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
  const availableSlots = selectedDoctorData?.availability || [];

  const handleBookAppointment = () => {
    const appointment = {
      patientId: 'P001',
      patientName,
      doctorId: selectedDoctor,
      doctorName: selectedDoctorData?.name || '',
      date: selectedDate?.toISOString().split('T')[0] || '',
      time: appointmentTime,
      type: 'Consultation',
      status: 'scheduled' as const,
    };
    
    dispatch(addAppointment(appointment));
    
    dispatch(addNotification({
      type: 'success',
      title: 'Appointment Booked',
      message: `Appointment for ${patientName} booked successfully`,
      priority: 'medium',
      category: 'appointment'
    }));
    
    dispatch(addRoleNotification({
      role: 'doctor',
      type: 'info',
      title: 'New Appointment Scheduled',
      message: `Appointment with ${patientName} scheduled for ${selectedDate?.toLocaleDateString()} at ${appointmentTime}`,
      category: 'appointment',
      priority: 'medium'
    }));
    
    setShowBookingModal(false);
    setShowPaymentModal(false);
    setPatientName('');
    setSelectedDoctor('');
    setAppointmentTime('');
    setPaymentAmount(150);
    setPaymentMethod('cash');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Appointment Calendar</h1>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-h3 text-neutral-900">Appointment Calendar</h2>
            <p className="text-body text-neutral-600">Manage and schedule patient appointments</p>
          </div>
          <Button onClick={() => setShowBookingModal(true)}>
            + Book New Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <Calendar
              events={appointments}
              onDateSelect={setSelectedDate}
              onEventClick={(event) => console.log('Event clicked:', sanitizer.forLog(event.id))}
            />
          </div>

          <div className="space-y-4">
            <Card>
              <h3 className="text-h4 text-neutral-900 mb-4">Today's Schedule</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-3 border border-neutral-200 rounded-small">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <p className="text-body font-medium">{apt.title}</p>
                        <p className="text-body-sm text-neutral-600">{apt.time} • {apt.doctor}</p>
                      </div>
                      <Badge status={apt.status === 'confirmed' ? 'delivered' : 'pending'}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button variant="tertiary" size="sm" className="w-full sm:w-auto">Reschedule</Button>
                      <Button variant="tertiary" size="sm" className="text-error w-full sm:w-auto">Cancel</Button>
                    </div>
                  </div>
                ))}
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
      </div>

      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book New Appointment"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
          />
          
          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">Doctor</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">Available Time Slots</label>
            <select
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={!selectedDoctor}
            >
              <option value="">Select time slot</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {selectedDoctor && availableSlots.length === 0 && (
              <p className="text-sm text-red-600 mt-1">No available slots for selected doctor</p>
            )}
          </div>

          {selectedDate && (
            <div className="p-3 bg-neutral-50 rounded-small">
              <p className="text-body-sm text-neutral-600">Selected Date:</p>
              <p className="text-body font-medium">{selectedDate.toLocaleDateString()}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowPaymentModal(true)} disabled={!patientName || !selectedDoctor || !appointmentTime}>
              Proceed to Payment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Payment Collection"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Appointment Summary</h4>
            <p className="text-sm text-gray-600">Patient: {patientName}</p>
            <p className="text-sm text-gray-600">Doctor: {selectedDoctorData?.name}</p>
            <p className="text-sm text-gray-600">Date: {selectedDate?.toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Time: {appointmentTime}</p>
          </div>

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">Consultation Fee</label>
            <Input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-body font-medium text-neutral-700 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Back
            </Button>
            <Button onClick={handleBookAppointment}>
              Collect Payment & Book
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}