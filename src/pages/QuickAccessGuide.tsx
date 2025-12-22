import { Card, Button } from '@/components';
import { useNavigate } from 'react-router-dom';

export function QuickAccessGuide() {
  const navigate = useNavigate();

  const roles = [
    { name: 'Admin', path: '/signin', icon: '👨‍💼', color: 'bg-purple-100' },
    { name: 'Doctor', path: '/signin', icon: '👨‍⚕️', color: 'bg-blue-100' },
    { name: 'Nurse', path: '/signin', icon: '👩‍⚕️', color: 'bg-green-100' },
    { name: 'Pharmacist', path: '/signin', icon: '💊', color: 'bg-orange-100' },
    { name: 'Receptionist', path: '/signin', icon: '📋', color: 'bg-pink-100' },
    { name: 'Patient', path: '/patient-login', icon: '🧑‍🦱', color: 'bg-teal-100' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-info-50 flex items-center justify-center p-6">
      <Card className="max-w-4xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Healthcare System Access
          </h1>
          <p className="text-body text-neutral-600">
            Select your role to access the system
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {roles.map(role => (
            <button
              key={role.name}
              onClick={() => navigate(role.path)}
              className={`${role.color} p-6 rounded-lg hover:shadow-lg transition-all text-center`}
            >
              <div className="text-5xl mb-3">{role.icon}</div>
              <p className="text-body font-medium text-neutral-900">{role.name}</p>
              <p className="text-body-sm text-neutral-600 mt-1">
                {role.name === 'Patient' ? 'Patient Portal' : 'Staff Login'}
              </p>
            </button>
          ))}
        </div>

        <div className="border-t border-neutral-200 pt-6">
          <h3 className="text-h4 text-neutral-900 mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/book-appointment')}
              className="justify-start"
            >
              📅 Book Appointment
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/admin/implementation-progress')}
              className="justify-start"
            >
              📊 View Progress
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/admin/system-comparison')}
              className="justify-start"
            >
              📈 System Comparison
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/doctor/consultation')}
              className="justify-start"
            >
              ⚡ Enhanced Consultation
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-info/10 rounded-lg">
          <p className="text-body-sm text-neutral-700">
            <strong>Patient Portal Access:</strong> Click on "Patient" above or navigate to 
            <code className="mx-1 px-2 py-1 bg-white rounded text-primary-600">/patient-login</code>
          </p>
        </div>
      </Card>
    </div>
  );
}
