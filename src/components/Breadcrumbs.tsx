import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    admin: 'Admin',
    users: 'User Management',
    beds: 'Bed Management',
    analytics: 'Analytics',
    'appointment-analytics': 'Appointment Analytics',
    demographics: 'Demographics',
    reminders: 'Reminders',
    feedback: 'Feedback',
    'api-docs': 'API Documentation',
    settings: 'Settings',
    doctor: 'Doctor',
    nurse: 'Nurse',
    pharmacist: 'Pharmacy',
    receptionist: 'Reception',
    lab: 'Laboratory',
    patients: 'Patients',
    appointments: 'Appointments',
    consultation: 'Consultation',
    prescriptions: 'Prescriptions',
    inventory: 'Inventory',
  };

  return (
    <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
      <Link to="/" className="hover:text-primary-600">Home</Link>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const label = breadcrumbMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="text-neutral-900 font-medium">{label}</span>
            ) : (
              <Link to={href} className="hover:text-primary-600">{label}</Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
