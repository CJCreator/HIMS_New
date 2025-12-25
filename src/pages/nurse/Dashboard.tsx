import { Card, Button, Badge } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateAppointmentStatus } from '@/store/appointmentSlice';
import { addNotification, addRoleNotification } from '@/store/notificationSlice';

const __patientQueue = [
  { id: 'P001', name: 'John Smith', appointment: '10:00 AM', doctor: 'Dr. Wilson', status: 'waiting', vitalsComplete: false },
  { id: 'P002', name: 'Sarah Johnson', appointment: '10:30 AM', doctor: 'Dr. Brown', status: 'in-progress', vitalsComplete: true },
  { id: 'P003', name: 'Mike Davis', appointment: '11:00 AM', doctor: 'Dr. Wilson', status: 'ready', vitalsComplete: true },
];

export function NurseDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointments } = useSelector((state: RootState) => state.appointments);
  
  const todayAppointments = appointments.filter(apt => 
    apt.status === 'in-progress' || apt.status === 'scheduled'
  ).slice(0, 5);
  
  const markPatientReady = (appointmentId: string, patientName: string, doctorName: string) => {
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
      category: 'patient'
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Nurse Dashboard</h1>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <div className="text-h2 text-nurse">12</div>
            <div className="text-body text-neutral-600">Patients Today</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-success">8</div>
            <div className="text-body text-neutral-600">Vitals Complete</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-warning">4</div>
            <div className="text-body text-neutral-600">Pending Vitals</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-info">3</div>
            <div className="text-body text-neutral-600">Ready for Doctor</div>
          </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-h4 text-neutral-900">Patient Queue</h3>
              <p className="text-body text-neutral-600">Patients requiring pre-consultation preparation</p>
            </div>
            <Button onClick={() => navigate('/nurse/vitals/new')}>
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
                  >
                    Record Vitals
                  </Button>
                  {apt.status === 'in-progress' && (
                    <Button 
                      variant="tertiary" 
                      size="sm"
                      className="text-success"
                      onClick={() => markPatientReady(apt.id, apt.patientName, apt.doctorName)}
                    >
                      Mark Ready
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
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/nurse/vitals/new')}>
                📊 Record Vitals
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/nurse/patients')}>
                👥 View Patients
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => navigate('/nurse/medication-requests')}>
                💊 Medication Requests
              </Button>
              <Button
                variant="secondary"
                className="justify-start"
                onClick={() => navigate('/nurse/wards')}
              >
                🏥 Ward Management
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
    </div>
  );
}