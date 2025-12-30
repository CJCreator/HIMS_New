import { Card, Button, Badge } from '@/components';
import { NotificationDetailModal } from '@/components/NotificationDetailModal';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateAppointmentStatus } from '@/store/appointmentSlice';
import { addNotification, addRoleNotification, markAsRead } from '@/store/notificationSlice';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { 
  FaUsers, 
  FaCheckCircle, 
  FaClock, 
  FaInfoCircle,
  FaBell,
  FaChartLine,
  FaPills,
  FaClipboardList
} from 'react-icons/fa';

export function NurseDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  const todayAppointments = appointments.filter(apt => 
    apt.status === 'in-progress' || apt.status === 'scheduled'
  ).slice(0, 5);

  const nurseNotifications = useMemo(() => {
    return notifications.filter(n => !n.read && n.targetRole === 'nurse').slice(0, 3);
  }, [notifications]);

  const stats = useMemo(() => ({
    total: todayAppointments.length,
    vitalsComplete: todayAppointments.filter(apt => apt.status === 'in-progress').length,
    pending: todayAppointments.filter(apt => apt.status === 'scheduled').length,
    ready: todayAppointments.filter(apt => apt.status === 'confirmed').length
  }), [todayAppointments]);
  
  const markPatientReady = async (appointmentId: string, patientName: string, doctorName: string) => {
    setLoadingStates(prev => ({ ...prev, [appointmentId]: true }));
    
    try {
      dispatch(updateAppointmentStatus({ id: appointmentId, status: 'confirmed' }));
      dispatch(addNotification({
        type: 'success',
        title: 'Patient Ready',
        message: `${patientName} is ready for consultation`,
        priority: 'medium',
        category: 'patient'
      }));
      dispatch(addRoleNotification({
        role: 'doctor',
        type: 'info',
        title: 'Patient Ready',
        message: `${patientName} vitals complete - Ready for consultation with ${doctorName}`,
        priority: 'high',
        category: 'patient',
        relatedId: appointmentId
      }));
      toast.success(`${patientName} marked as ready`);
    } catch (error) {
      toast.error('Failed to mark patient as ready');
    } finally {
      setLoadingStates(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  const handleViewNotificationDetails = (notification: any) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
  };

  const handleNotificationAction = (action: string) => {
    if (action === 'start-consultation' && selectedNotification?.relatedId) {
      navigate(`/nurse/vitals/${selectedNotification.relatedId}`);
    } else if (action === 'view-history' && selectedNotification?.relatedId) {
      navigate(`/nurse/patients`);
    }
    if (selectedNotification) {
      dispatch(markAsRead(selectedNotification.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Nurse Dashboard</h1>
      </div>
      <div className="space-y-6">
        {nurseNotifications.length > 0 && (
          <Card className="p-4 bg-blue-50 border-2 border-blue-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                <FaBell className="text-blue-600" size={18} aria-hidden="true" />
                Notifications
              </h3>
              <Badge status="error">{nurseNotifications.length} New</Badge>
            </div>
            <div className="space-y-2">
              {nurseNotifications.map((notification) => (
                <div key={notification.id} className="p-3 bg-white rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">{notification.title}</p>
                      <p className="text-xs text-neutral-600 mt-1">{notification.message}</p>
                    </div>
                    {notification.priority === 'urgent' && (
                      <Badge status="error">URGENT</Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewNotificationDetails(notification)}
                    className="w-full mt-2"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-nurse">{stats.total}</div>
                <div className="text-sm text-neutral-600 mt-1">Patients Today</div>
              </div>
              <div className="w-12 h-12 bg-nurse/10 rounded-lg flex items-center justify-center">
                <FaUsers className="text-nurse" size={24} aria-hidden="true" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-success">{stats.vitalsComplete}</div>
                <div className="text-sm text-neutral-600 mt-1">Vitals Complete</div>
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
                <div className="text-sm text-neutral-600 mt-1">Pending Vitals</div>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <FaClock className="text-warning" size={24} aria-hidden="true" />
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-info">{stats.ready}</div>
                <div className="text-sm text-neutral-600 mt-1">Ready for Doctor</div>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <FaInfoCircle className="text-info" size={24} aria-hidden="true" />
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-h4 text-neutral-900">Patient Queue</h3>
              <p className="text-body text-neutral-600">Patients requiring pre-consultation preparation</p>
            </div>
            <Button onClick={() => navigate('/nurse/vitals')}>
              Record Vitals
            </Button>
          </div>

          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-neutral-200 rounded-small space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-body font-medium text-neutral-900">{apt.patientName}</h4>
                    <Badge status={apt.status === 'confirmed' ? 'delivered' : apt.status === 'in-progress' ? 'pending' : 'sent'}>
                      {apt.status}
                    </Badge>
                  </div>
                  <p className="text-body-sm text-neutral-600">
                    {apt.time} • {apt.doctorName}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate(`/nurse/vitals/${apt.patientId}`)}
                    disabled={loadingStates[apt.id]}
                  >
                    Record Vitals
                  </Button>
                  {apt.status === 'in-progress' && (
                    <Button 
                      variant="tertiary" 
                      size="sm"
                      className="text-success"
                      onClick={() => markPatientReady(apt.id, apt.patientName, apt.doctorName)}
                      disabled={loadingStates[apt.id]}
                    >
                      {loadingStates[apt.id] ? 'Marking...' : 'Mark Ready'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/nurse/vitals')}>
                <FaChartLine className="mr-2" size={16} aria-hidden="true" />
                Record Vitals
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/nurse/patients')}>
                <FaUsers className="mr-2" size={16} aria-hidden="true" />
                View Patients
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/nurse/medication-requests')}>
                <FaPills className="mr-2" size={16} aria-hidden="true" />
                Medication Requests
              </Button>
              <Button
                variant="secondary"
                className="justify-start"
                onClick={() => navigate('/nurse/shift-handover')}
              >
                <FaClipboardList className="mr-2" size={16} aria-hidden="true" />
                Shift Handover
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Today's Tasks</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-body">Pre-consultation vitals</span>
                <Badge status="pending">4 pending</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body">Medication administration</span>
                <Badge status="delivered">Complete</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body">Patient education</span>
                <Badge status="sent">2 scheduled</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {selectedNotification && (
        <NotificationDetailModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          notification={selectedNotification}
          onAction={handleNotificationAction}
        />
      )}
    </div>
  );
}
