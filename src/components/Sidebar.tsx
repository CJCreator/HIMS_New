import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { UserRole } from '@/types';

const menuItems: Record<UserRole, Array<{name: string; path: string; icon: string}>> = {
  admin: [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'User Management', path: '/admin/users', icon: '👥' },
    { name: 'Bed Management', path: '/admin/beds', icon: '🛏️' },
    { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { name: 'Appointment Analytics', path: '/admin/appointment-analytics', icon: '📊' },
    { name: 'Demographics', path: '/admin/demographics', icon: '👥' },
    { name: 'Reminders', path: '/admin/reminders', icon: '⏰' },
    { name: 'Feedback', path: '/admin/feedback', icon: '💬' },
    { name: 'API Docs', path: '/admin/api-docs', icon: '📱' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ],
  doctor: [
    { name: 'Dashboard', path: '/doctor', icon: '📊' },
    { name: 'Patient Queue', path: '/doctor/queue', icon: '👥' },
    { name: 'Appointments', path: '/doctor/appointments', icon: '📅' },
    { name: 'Prescriptions', path: '/doctor/prescriptions', icon: '💊' },
    { name: 'E-Signature', path: '/doctor/prescription-signature', icon: '✍️' },
    { name: 'Performance', path: '/doctor/performance', icon: '🏆' },
    { name: 'Profile', path: '/doctor/profile', icon: '👨⚕️' },
  ],
  receptionist: [
    { name: 'Dashboard', path: '/receptionist', icon: '📊' },
    { name: 'Appointments', path: '/receptionist/appointments', icon: '📅' },
    { name: 'Recurring Appts', path: '/receptionist/recurring-appointments', icon: '🔄' },
    { name: 'Waitlist', path: '/receptionist/waitlist', icon: '⏳' },
    { name: 'Patients', path: '/receptionist/patients', icon: '👥' },
    { name: 'Billing', path: '/receptionist/billing', icon: '💰' },
    { name: 'Payment Plans', path: '/receptionist/billing/payment-plans', icon: '💳' },
    { name: 'Revenue Reports', path: '/receptionist/billing/revenue-reports', icon: '📈' },
    { name: 'Insurance Claims', path: '/receptionist/billing/insurance-claims', icon: '🏥' },
  ],
  nurse: [
    { name: 'Dashboard', path: '/nurse', icon: '📊' },
    { name: 'Patient Records', path: '/nurse/patients', icon: '📋' },
    { name: 'Vitals Entry', path: '/nurse/vitals', icon: '📊' },
    { name: 'Medication Requests', path: '/nurse/medication-requests', icon: '💊' },
    { name: 'Ward Management', path: '/nurse/wards', icon: '🏥' },
    { name: 'Shift Handover', path: '/nurse/shift-handover', icon: '🔄' },
  ],
  pharmacist: [
    { name: 'Dashboard', path: '/pharmacist', icon: '📊' },
    { name: 'Prescription Queue', path: '/pharmacist/prescriptions', icon: '📜' },
    { name: 'Medication Requests', path: '/pharmacist/medication-requests', icon: '💊' },
    { name: 'Patient Records', path: '/pharmacist/patients', icon: '📋' },
    { name: 'Inventory', path: '/pharmacist/inventory', icon: '📦' },
    { name: 'Expiry Alerts', path: '/pharmacist/expiry-alerts', icon: '⚠️' },
    { name: 'Reorder', path: '/pharmacist/reorder-management', icon: '🔄' },
    { name: 'Batch Tracking', path: '/pharmacist/batch-tracking', icon: '🏷️' },
    { name: 'Analytics', path: '/pharmacist/inventory-analytics', icon: '📈' },
  ],
  lab: [
    { name: 'Dashboard', path: '/lab', icon: '🔬' },
    { name: 'Order Queue', path: '/lab/orders', icon: '📋' },
    { name: 'Result Entry', path: '/lab/results', icon: '📝' },
    { name: 'Verification', path: '/lab/verification', icon: '✅' },
    { name: 'Reports', path: '/lab/reports', icon: '📊' },
  ],
  patient: [
    { name: 'Dashboard', path: '/patient-portal', icon: '📊' },
    { name: 'Health Summary', path: '/patient-portal/health-summary', icon: '❤️' },
    { name: 'My Appointments', path: '/patient-portal/appointments', icon: '📅' },
    { name: 'Lab Results', path: '/patient-portal/lab-results', icon: '🔬' },
    { name: 'Prescriptions', path: '/patient-portal/prescriptions', icon: '💊' },
    { name: 'Medication Adherence', path: '/patient-portal/medication-adherence', icon: '✅' },
    { name: 'Symptom Checker', path: '/patient-portal/symptom-checker', icon: '🩺' },
    { name: 'Messages', path: '/patient-portal/messages', icon: '✉️' },
    { name: 'Download Records', path: '/patient-portal/record-download', icon: '📥' },
    { name: 'Feedback', path: '/patient-portal/feedback', icon: '💬' },
    { name: 'Medical Records', path: '/patient-portal/records', icon: '📋' },
    { name: 'Bills & Payments', path: '/patient-portal/bills', icon: '💰' },
    { name: 'Video Consultation', path: '/patient-portal/video-consultation', icon: '🎥' },
    { name: 'My Profile', path: '/patient-portal/profile', icon: '👤' },
  ],
};

const roleColors: Record<UserRole, string> = {
  admin: 'text-admin',
  doctor: 'text-doctor',
  receptionist: 'text-receptionist',
  nurse: 'text-nurse',
  pharmacist: 'text-pharmacist',
  lab: 'text-blue-600',
  patient: 'text-teal-600',
};

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps = {}) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  if (!user) return null;

  const items = menuItems[user.role] || [];
  const roleColor = roleColors[user.role];

  return (
    <div className="w-sidebar h-screen bg-white border-r border-neutral-200 flex flex-col" role="complementary" aria-label="Sidebar navigation">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-small flex items-center justify-center">
            <span className="text-white font-semibold">AC</span>
          </div>
          <div>
            <h1 className="text-h4 text-neutral-900">AroCord</h1>
            <p className={`text-body-sm capitalize ${roleColor}`}>{user.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto" role="navigation" aria-label="Main navigation">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/doctor' || item.path === '/admin' || item.path === '/nurse' || item.path === '/receptionist' || item.path === '/pharmacist' || item.path === '/patient-portal' || item.path === '/lab'}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-small text-body transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-opacity-50 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`
                }
                onClick={() => onClose?.()}
                aria-label={`Navigate to ${item.name}`}
              >
                <span className="text-lg" aria-hidden="true">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
            <span className="text-neutral-600 text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-body font-medium text-neutral-900">{user.name}</p>
            <p className="text-body-sm text-neutral-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="w-full text-left px-3 py-2 text-body text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 rounded-small transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-opacity-50"
          aria-label="Sign out of your account"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
