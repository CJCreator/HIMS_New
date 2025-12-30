import { Card, Button } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  FaUserTie, 
  FaUserMd, 
  FaUserNurse, 
  FaPills, 
  FaClipboardList, 
  FaMicroscope, 
  FaUser,
  FaCalendarAlt,
  FaChartLine,
  FaChartBar,
  FaBolt
} from 'react-icons/fa';

export function QuickAccessGuide() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleNavigation = (path: string, requiresAuth: boolean = true) => {
    if (requiresAuth && !isAuthenticated) {
      navigate('/signin');
    } else {
      navigate(path);
    }
  };

  const roles = [
    { name: 'Admin', path: '/signin', icon: FaUserTie, color: 'bg-purple-100 hover:bg-purple-200' },
    { name: 'Doctor', path: '/signin', icon: FaUserMd, color: 'bg-blue-100 hover:bg-blue-200' },
    { name: 'Nurse', path: '/signin', icon: FaUserNurse, color: 'bg-green-100 hover:bg-green-200' },
    { name: 'Pharmacist', path: '/signin', icon: FaPills, color: 'bg-orange-100 hover:bg-orange-200' },
    { name: 'Receptionist', path: '/signin', icon: FaClipboardList, color: 'bg-pink-100 hover:bg-pink-200' },
    { name: 'Lab Technician', path: '/signin', icon: FaMicroscope, color: 'bg-cyan-100 hover:bg-cyan-200' },
    { name: 'Patient', path: '/patient-login', icon: FaUser, color: 'bg-teal-100 hover:bg-teal-200' }
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {roles.map(role => {
            const IconComponent = role.icon;
            return (
              <button
                key={role.name}
                onClick={() => navigate(role.path)}
                className={`${role.color} p-6 rounded-lg hover:shadow-lg transition-all duration-200 text-center group`}
                aria-label={`Login as ${role.name}`}
              >
                <div className="flex justify-center mb-3">
                  <IconComponent 
                    className="text-neutral-700 group-hover:scale-110 transition-transform duration-200" 
                    size={48}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-body font-semibold text-neutral-900">{role.name}</p>
                <p className="text-body-sm text-neutral-600 mt-1">
                  {role.name === 'Patient' ? 'Patient Portal' : 'Staff Login'}
                </p>
              </button>
            );
          })}
        </div>

        <div className="border-t border-neutral-200 pt-6">
          <h3 className="text-h4 text-neutral-900 mb-3 font-semibold">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="secondary" 
              onClick={() => handleNavigation('/book-appointment', false)}
              className="justify-start"
            >
              <FaCalendarAlt className="mr-2" size={16} aria-hidden="true" />
              Book Appointment
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleNavigation('/admin/implementation-progress')}
              className="justify-start"
            >
              <FaChartBar className="mr-2" size={16} aria-hidden="true" />
              View Progress
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleNavigation('/admin/system-comparison')}
              className="justify-start"
            >
              <FaChartLine className="mr-2" size={16} aria-hidden="true" />
              System Comparison
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleNavigation('/doctor/consultation')}
              className="justify-start"
            >
              <FaBolt className="mr-2" size={16} aria-hidden="true" />
              Enhanced Consultation
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
