import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { updateAppointmentStatus } from '../../store/appointmentSlice';
import { addNotification } from '../../store/notificationSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { toast } from 'sonner';

import { Calendar, Clock, User } from 'lucide-react';

export const DoctorAppointments: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const myAppointments = useMemo(() => {
    return appointments.filter(apt => 
      apt.doctorName === (user?.name || 'Dr. Wilson')
    );
  }, [appointments, user?.name]);

  const filteredAppointments = useMemo(() => {
    return myAppointments.filter(apt => {
      const matchesDate = apt.date === selectedDate;
      const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.patientId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
      return matchesDate && matchesSearch && matchesStatus;
    });
  }, [myAppointments, selectedDate, searchTerm, filterStatus]);

  const stats = useMemo(() => ({
    confirmed: myAppointments.filter(a => a.status === 'confirmed').length,
    pending: myAppointments.filter(a => a.status === 'scheduled').length,
    completed: myAppointments.filter(a => a.status === 'completed').length,
    cancelled: myAppointments.filter(a => a.status === 'cancelled').length
  }), [myAppointments]);

  const handleStartConsultation = async (appointment: any) => {
    setLoading(prev => ({ ...prev, [appointment.id]: true }));
    try {
      dispatch(updateAppointmentStatus({ id: appointment.id, status: 'in-progress' }));
      toast.success(`Starting consultation with ${appointment.patientName}`);
      navigate(`/doctor/consultation/${appointment.patientId}`);
    } catch (error) {
      toast.error('Failed to start consultation');
    } finally {
      setLoading(prev => ({ ...prev, [appointment.id]: false }));
    }
  };

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    setRescheduleDate(appointment.date);
    setRescheduleTime(appointment.time);
    setShowRescheduleModal(true);
  };

  const submitReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error('Please select date and time');
      return;
    }
    
    dispatch(addNotification({
      type: 'success',
      title: 'Appointment Rescheduled',
      message: `Appointment with ${selectedAppointment.patientName} rescheduled to ${rescheduleDate} at ${rescheduleTime}`,
      priority: 'medium',
      category: 'appointment'
    }));
    
    toast.success('Appointment rescheduled successfully');
    setShowRescheduleModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'delivered';
      case 'scheduled': return 'pending';
      case 'in-progress': return 'sent';
      case 'completed': return 'delivered';
      case 'cancelled': return 'error';
      default: return 'pending';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Appointments</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your consultation schedule</p>
        </div>
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

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
            />
          </div>
          <Input
            placeholder="Search by patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
        </div>
      </Card>

      {/* Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
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
              </div>

              <div className="flex flex-wrap gap-2">
                {(appointment.status === 'confirmed' || appointment.status === 'scheduled') && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleStartConsultation(appointment)}
                    disabled={loading[appointment.id]}
                  >
                    {loading[appointment.id] ? 'Starting...' : 'Start Consultation'}
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
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleViewDetails(appointment)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="lg:col-span-2 text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">Try adjusting your filters or select a different date.</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </Card>
      </div>

      {/* Details Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Appointment Details"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Patient</p>
                <p className="font-medium">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-medium">{selectedAppointment.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{selectedAppointment.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{selectedAppointment.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{selectedAppointment.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge status={getStatusColor(selectedAppointment.status) as any}>
                  {selectedAppointment.status}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
              <Button 
                variant="primary"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleStartConsultation(selectedAppointment);
                }}
              >
                Start Consultation
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reschedule Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          title="Reschedule Appointment"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Rescheduling appointment for {selectedAppointment.patientName}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
              <input
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="secondary" onClick={() => setShowRescheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={submitReschedule}>
                Confirm Reschedule
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
