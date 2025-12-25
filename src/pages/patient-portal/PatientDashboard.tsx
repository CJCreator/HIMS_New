import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { Card, Button } from '@/components';
import { Calendar, FileText, Pill, CreditCard, MessageSquare } from 'lucide-react';

export const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);

  const patientAppointments = useMemo(() => 
    appointments.filter(apt => apt.patientId === user?.id && apt.status !== 'cancelled'),
    [appointments, user?.id]
  );

  const upcomingAppointments = useMemo(() => 
    patientAppointments
      .filter(apt => new Date(apt.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 2),
    [patientAppointments]
  );

  const patientPrescriptions = useMemo(() => 
    prescriptions.filter(rx => rx.patientId === user?.id).slice(0, 2),
    [prescriptions, user?.id]
  );

  const quickActions = [
    { icon: Calendar, label: 'Book Appointment', path: '/patient-portal/appointments' },
    { icon: Pill, label: 'My Prescriptions', path: '/patient-portal/prescriptions' },
    { icon: FileText, label: 'Medical Records', path: '/patient-portal/records' },
    { icon: CreditCard, label: 'Bills & Payments', path: '/patient-portal/bills' },
    { icon: MessageSquare, label: 'Messages', path: '/patient-portal/messages' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">Here's your health overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {quickActions.map((action) => (
          <Card 
            key={action.label} 
            className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(action.path)}
          >
            <action.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium text-gray-900">{action.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No upcoming appointments</p>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{apt.doctorName}</p>
                    <p className="text-sm text-gray-600">{apt.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{apt.date}</p>
                    <p className="text-sm text-gray-600">{apt.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Button variant="secondary" className="w-full mt-4" onClick={() => navigate('/patient-portal/appointments')}>
            View All Appointments
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Prescriptions</h2>
          <div className="space-y-3">
            {patientPrescriptions.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No prescriptions</p>
            ) : (
              patientPrescriptions.map((rx) => (
                <div key={rx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{rx.medications?.[0]?.name || 'Prescription'}</p>
                    <p className="text-sm text-gray-600">Prescribed: {rx.prescriptionDate || rx.date}</p>
                  </div>
                  <div className="text-right">
                    <Button variant="primary" size="sm">View</Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <Button variant="secondary" className="w-full mt-4" onClick={() => navigate('/patient-portal/prescriptions')}>
            View All Prescriptions
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="secondary" onClick={() => navigate('/patient-portal/lab-results')}>
            Lab Results
          </Button>
          <Button variant="secondary" onClick={() => navigate('/patient-portal/health-summary')}>
            Health Summary
          </Button>
          <Button variant="secondary" onClick={() => navigate('/patient-portal/symptom-checker')}>
            Symptom Checker
          </Button>
          <Button variant="secondary" onClick={() => navigate('/patient-portal/feedback')}>
            Feedback
          </Button>
        </div>
      </Card>
    </div>
  );
};
