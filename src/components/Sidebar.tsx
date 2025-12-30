import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { UserRole } from '@/types';
import {
  BarChart3,
  Users,
  Bed,
  TrendingUp,
  Clock,
  MessageSquare,
  Smartphone,
  Settings,
  Calendar,
  Pill,
  PenTool,
  Trophy,
  User,
  RotateCcw,
  Hourglass,
  DollarSign,
  CreditCard,
  Building,
  ClipboardList,
  Activity,
  FileText,
  CheckCircle,
  TestTube,
  Heart,
  Stethoscope,
  Mail,
  Download,
  FileCheck,
  Video,
  ScrollText,
  Package,
  AlertTriangle,
  Tag,
  Microscope,
  Edit,
  Phone,
  Shield,
  Truck,
  Box,
  Zap,
  Star,
  Camera,
  Monitor,
  Bell
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';

const menuItems: Record<UserRole, Array<{name: string; path: string; icon: LucideIcon}>> = {
  admin: [
    { name: 'Dashboard', path: '/admin', icon: BarChart3 },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Bed Management', path: '/admin/beds', icon: Bed },
    { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
    { name: 'Appointment Analytics', path: '/admin/appointment-analytics', icon: BarChart3 },
    { name: 'Demographics', path: '/admin/demographics', icon: Users },
    { name: 'Reminders', path: '/admin/reminders', icon: Clock },
    { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
    { name: 'API Docs', path: '/admin/api-docs', icon: Smartphone },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ],
  doctor: [
    { name: 'Dashboard', path: '/doctor', icon: BarChart3 },
    { name: 'Patient Queue', path: '/doctor/queue', icon: Users },
    { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
    { name: 'E-Signature', path: '/doctor/prescription-signature', icon: PenTool },
    { name: 'Performance', path: '/doctor/performance', icon: Trophy },
    { name: 'Profile', path: '/doctor/profile', icon: User },
  ],
  receptionist: [
    { name: 'Dashboard', path: '/receptionist', icon: BarChart3 },
    { name: 'Appointments', path: '/receptionist/appointments', icon: Calendar },
    { name: 'Recurring Appts', path: '/receptionist/recurring-appointments', icon: RotateCcw },
    { name: 'Waitlist', path: '/receptionist/waitlist', icon: Hourglass },
    { name: 'Patients', path: '/receptionist/patients', icon: Users },
    { name: 'Billing', path: '/receptionist/billing', icon: DollarSign },
    { name: 'Payment Plans', path: '/receptionist/billing/payment-plans', icon: CreditCard },
    { name: 'Revenue Reports', path: '/receptionist/billing/revenue-reports', icon: TrendingUp },
    { name: 'Insurance Claims', path: '/receptionist/billing/insurance-claims', icon: Building },
  ],
  nurse: [
    { name: 'Dashboard', path: '/nurse', icon: BarChart3 },
    { name: 'Patient Records', path: '/nurse/patients', icon: ClipboardList },
    { name: 'Vitals Entry', path: '/nurse/vitals', icon: Activity },
    { name: 'Medication Requests', path: '/nurse/medication-requests', icon: Pill },
    { name: 'Ward Management', path: '/nurse/wards', icon: Building },
    { name: 'Shift Handover', path: '/nurse/shift-handover', icon: RotateCcw },
  ],
  pharmacist: [
    { name: 'Dashboard', path: '/pharmacist', icon: BarChart3 },
    { name: 'Prescription Queue', path: '/pharmacist/prescriptions', icon: ScrollText },
    { name: 'Medication Requests', path: '/pharmacist/medication-requests', icon: Pill },
    { name: 'Patient Records', path: '/pharmacist/patients', icon: ClipboardList },
    { name: 'Inventory', path: '/pharmacist/inventory', icon: Package },
    { name: 'Expiry Alerts', path: '/pharmacist/expiry-alerts', icon: AlertTriangle },
    { name: 'Reorder', path: '/pharmacist/reorder-management', icon: RotateCcw },
    { name: 'Batch Tracking', path: '/pharmacist/batch-tracking', icon: Tag },
    { name: 'Analytics', path: '/pharmacist/inventory-analytics', icon: TrendingUp },
  ],
  lab: [
    { name: 'Dashboard', path: '/lab', icon: Microscope },
    { name: 'Order Queue', path: '/lab/orders', icon: ClipboardList },
    { name: 'Result Entry', path: '/lab/results', icon: Edit },
    { name: 'Verification', path: '/lab/verification', icon: CheckCircle },
    { name: 'Reports', path: '/lab/reports', icon: FileText },
  ],
  patient: [
    { name: 'Dashboard', path: '/patient-portal', icon: BarChart3 },
    { name: 'Health Summary', path: '/patient-portal/health-summary', icon: Heart },
    { name: 'My Appointments', path: '/patient-portal/appointments', icon: Calendar },
    { name: 'Lab Results', path: '/patient-portal/lab-results', icon: TestTube },
    { name: 'Prescriptions', path: '/patient-portal/prescriptions', icon: Pill },
    { name: 'Medication Adherence', path: '/patient-portal/medication-adherence', icon: CheckCircle },
    { name: 'Symptom Checker', path: '/patient-portal/symptom-checker', icon: Stethoscope },
    { name: 'Messages', path: '/patient-portal/messages', icon: Mail },
    { name: 'Download Records', path: '/patient-portal/record-download', icon: Download },
    { name: 'Feedback', path: '/patient-portal/feedback', icon: MessageSquare },
    { name: 'Medical Records', path: '/patient-portal/records', icon: FileCheck },
    { name: 'Bills & Payments', path: '/patient-portal/bills', icon: DollarSign },
    { name: 'Video Consultation', path: '/patient-portal/video-consultation', icon: Video },
    { name: 'My Profile', path: '/patient-portal/profile', icon: User },
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
    <div className="w-[280px] h-screen bg-white border-r border-neutral-200 flex flex-col overflow-y-auto" role="complementary" aria-label="Sidebar navigation">
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
                <item.icon className="w-5 h-5" aria-hidden="true" />
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
