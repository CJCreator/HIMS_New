import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, Button } from '@/components';
import { Calendar, FileText, Pill, CreditCard, MessageSquare } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const quickActions = [
    { icon: Calendar, label: 'Book Appointment', href: '/patient-portal/appointments' },
    { icon: Pill, label: 'My Prescriptions', href: '/patient-portal/prescriptions' },
    { icon: FileText, label: 'Medical Records', href: '/patient-portal/records' },
    { icon: CreditCard, label: 'Bills & Payments', href: '/patient-portal/bills' },
    { icon: MessageSquare, label: 'Messages', href: '/patient-portal/messages' }
  ];

  const upcomingAppointments = [
    { id: '1', date: '2024-01-15', time: '10:00 AM', doctor: 'Dr. Smith', type: 'Checkup' },
    { id: '2', date: '2024-01-22', time: '2:30 PM', doctor: 'Dr. Johnson', type: 'Follow-up' }
  ];

  const recentPrescriptions = [
    { id: '1', medication: 'Lisinopril 10mg', prescribed: '2024-01-10', refillsLeft: 2 },
    { id: '2', medication: 'Metformin 500mg', prescribed: '2024-01-08', refillsLeft: 0 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">Here's your health overview</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {quickActions.map((action) => (
          <Card key={action.label} className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <action.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium text-gray-900">{action.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{apt.doctor}</p>
                  <p className="text-sm text-gray-600">{apt.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{apt.date}</p>
                  <p className="text-sm text-gray-600">{apt.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="w-full mt-4">
            View All Appointments
          </Button>
        </Card>

        {/* Recent Prescriptions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Prescriptions</h2>
          <div className="space-y-3">
            {recentPrescriptions.map((rx) => (
              <div key={rx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{rx.medication}</p>
                  <p className="text-sm text-gray-600">Prescribed: {rx.prescribed}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {rx.refillsLeft} refills left
                  </p>
                  {rx.refillsLeft === 0 && (
                    <Button variant="primary" size="sm" className="mt-1">
                      Request Refill
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="w-full mt-4">
            View All Prescriptions
          </Button>
        </Card>
      </div>

      {/* Health Summary */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">120/80</p>
            <p className="text-sm text-gray-600">Blood Pressure</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">98.6°F</p>
            <p className="text-sm text-gray-600">Temperature</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">72 bpm</p>
            <p className="text-sm text-gray-600">Heart Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">180 lbs</p>
            <p className="text-sm text-gray-600">Weight</p>
          </div>
        </div>
      </Card>
    </div>
  );
};