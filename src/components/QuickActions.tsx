import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  UserPlus,
  Calendar,
  Pill,
  FileText,
  AlertTriangle,
  Zap,
  Clock,
  Users,
  BarChart3,
  Settings,
  Stethoscope,
  ClipboardList,
  TestTube,
  Package
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut: string;
  action: () => void;
  color: string;
  description: string;
  priority: number; // Higher priority actions appear first
}

interface QuickActionsProps {
  role: 'doctor' | 'nurse' | 'pharmacist' | 'receptionist' | 'lab' | 'admin';
  className?: string;
}

export function QuickActions({ role, className = '' }: QuickActionsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [recentActions, setRecentActions] = useState<string[]>([]);

  // Load recent actions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`quick-actions-${role}`);
    if (saved) {
      setRecentActions(JSON.parse(saved));
    }
  }, [role]);

  // Save recent actions to localStorage
  const saveRecentAction = (actionId: string) => {
    const updated = [actionId, ...recentActions.filter(id => id !== actionId)].slice(0, 5);
    setRecentActions(updated);
    localStorage.setItem(`quick-actions-${role}`, JSON.stringify(updated));
  };

  const getRoleActions = (): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: 'search',
        label: 'Global Search',
        icon: <Zap className="w-4 h-4" />,
        shortcut: 'Ctrl+K',
        action: () => {
          // Trigger global search - this would need to be connected to the search component
          const searchEvent = new CustomEvent('open-global-search');
          window.dispatchEvent(searchEvent);
        },
        color: 'bg-blue-500 hover:bg-blue-600',
        description: 'Search across all records',
        priority: 10,
      },
    ];

    switch (role) {
      case 'doctor':
        return [
          ...baseActions,
          {
            id: 'new-consultation',
            label: 'New Consultation',
            icon: <Stethoscope className="w-4 h-4" />,
            shortcut: 'Ctrl+N',
            action: () => navigate('/doctor/consultation/new'),
            color: 'bg-green-500 hover:bg-green-600',
            description: 'Start a new patient consultation',
            priority: 9,
          },
          {
            id: 'patient-queue',
            label: 'Patient Queue',
            icon: <Users className="w-4 h-4" />,
            shortcut: 'Ctrl+Q',
            action: () => navigate('/doctor/queue'),
            color: 'bg-orange-500 hover:bg-orange-600',
            description: 'View waiting patients',
            priority: 8,
          },
          {
            id: 'prescriptions',
            label: 'Write Prescription',
            icon: <Pill className="w-4 h-4" />,
            shortcut: 'Ctrl+P',
            action: () => navigate('/doctor/prescriptions/new'),
            color: 'bg-purple-500 hover:bg-purple-600',
            description: 'Create new prescription',
            priority: 7,
          },
          {
            id: 'emergency',
            label: 'Emergency Alert',
            icon: <AlertTriangle className="w-4 h-4" />,
            shortcut: 'Ctrl+E',
            action: () => {
              // Trigger emergency protocol
              console.log('Emergency alert triggered');
            },
            color: 'bg-red-500 hover:bg-red-600',
            description: 'Send emergency notification',
            priority: 6,
          },
        ];

      case 'nurse':
        return [
          ...baseActions,
          {
            id: 'vitals',
            label: 'Record Vitals',
            icon: <ClipboardList className="w-4 h-4" />,
            shortcut: 'Ctrl+V',
            action: () => navigate('/nurse/vitals/new'),
            color: 'bg-blue-500 hover:bg-blue-600',
            description: 'Record patient vital signs',
            priority: 9,
          },
          {
            id: 'medications',
            label: 'Administer Meds',
            icon: <Pill className="w-4 h-4" />,
            shortcut: 'Ctrl+M',
            action: () => navigate('/nurse/medications'),
            color: 'bg-green-500 hover:bg-green-600',
            description: 'Medication administration',
            priority: 8,
          },
          {
            id: 'patient-rounds',
            label: 'Patient Rounds',
            icon: <Users className="w-4 h-4" />,
            shortcut: 'Ctrl+R',
            action: () => navigate('/nurse/rounds'),
            color: 'bg-orange-500 hover:bg-orange-600',
            description: 'Start patient rounds',
            priority: 7,
          },
        ];

      case 'pharmacist':
        return [
          ...baseActions,
          {
            id: 'verify-prescription',
            label: 'Verify Rx',
            icon: <FileText className="w-4 h-4" />,
            shortcut: 'Ctrl+V',
            action: () => navigate('/pharmacist/verify'),
            color: 'bg-green-500 hover:bg-green-600',
            description: 'Verify prescription',
            priority: 9,
          },
          {
            id: 'inventory',
            label: 'Check Inventory',
            icon: <Package className="w-4 h-4" />,
            shortcut: 'Ctrl+I',
            action: () => navigate('/pharmacist/inventory'),
            color: 'bg-blue-500 hover:bg-blue-600',
            description: 'Medicine inventory',
            priority: 8,
          },
          {
            id: 'counseling',
            label: 'Patient Counseling',
            icon: <Users className="w-4 h-4" />,
            shortcut: 'Ctrl+C',
            action: () => navigate('/pharmacist/counseling'),
            color: 'bg-purple-500 hover:bg-purple-600',
            description: 'Medication counseling',
            priority: 7,
          },
        ];

      case 'receptionist':
        return [
          ...baseActions,
          {
            id: 'new-appointment',
            label: 'New Appointment',
            icon: <Calendar className="w-4 h-4" />,
            shortcut: 'Ctrl+A',
            action: () => navigate('/receptionist/appointments/new'),
            color: 'bg-green-500 hover:bg-green-600',
            description: 'Schedule new appointment',
            priority: 9,
          },
          {
            id: 'register-patient',
            label: 'Register Patient',
            icon: <UserPlus className="w-4 h-4" />,
            shortcut: 'Ctrl+R',
            action: () => navigate('/receptionist/patients/new'),
            color: 'bg-blue-500 hover:bg-blue-600',
            description: 'Register new patient',
            priority: 8,
          },
          {
            id: 'queue-status',
            label: 'Queue Status',
            icon: <Clock className="w-4 h-4" />,
            shortcut: 'Ctrl+Q',
            action: () => navigate('/receptionist/queue'),
            color: 'bg-orange-500 hover:bg-orange-600',
            description: 'Check waiting queue',
            priority: 7,
          },
        ];

      case 'lab':
        return [
          ...baseActions,
          {
            id: 'new-test',
            label: 'Order Test',
            icon: <TestTube className="w-4 h-4" />,
            shortcut: 'Ctrl+T',
            action: () => navigate('/lab/orders/new'),
            color: 'bg-blue-500 hover:bg-blue-600',
            description: 'Order new lab test',
            priority: 9,
          },
          {
            id: 'results',
            label: 'Enter Results',
            icon: <FileText className="w-4 h-4" />,
            shortcut: 'Ctrl+R',
            action: () => navigate('/lab/results/enter'),
            color: 'bg-green-500 hover:bg-green-600',
            description: 'Enter test results',
            priority: 8,
          },
        ];

      case 'admin':
        return [
          ...baseActions,
          {
            id: 'analytics',
            label: 'View Analytics',
            icon: <BarChart3 className="w-4 h-4" />,
            shortcut: 'Ctrl+A',
            action: () => navigate('/admin/analytics'),
            color: 'bg-purple-500 hover:bg-purple-600',
            description: 'System analytics dashboard',
            priority: 9,
          },
          {
            id: 'user-management',
            label: 'User Management',
            icon: <Users className="w-4 h-4" />,
            shortcut: 'Ctrl+U',
            action: () => navigate('/admin/users'),
            color: 'bg-blue-500 hover:bg-blue-600',
            description: 'Manage system users',
            priority: 8,
          },
          {
            id: 'system-settings',
            label: 'System Settings',
            icon: <Settings className="w-4 h-4" />,
            shortcut: 'Ctrl+S',
            action: () => navigate('/admin/settings'),
            color: 'bg-gray-500 hover:bg-gray-600',
            description: 'Configure system settings',
            priority: 7,
          },
        ];

      default:
        return baseActions;
    }
  };

  const actions = getRoleActions();

  // Sort by priority and recent usage
  const sortedActions = actions.sort((a, b) => {
    const aRecent = recentActions.indexOf(a.id);
    const bRecent = recentActions.indexOf(b.id);

    if (aRecent !== -1 && bRecent !== -1) {
      return aRecent - bRecent; // More recent first
    }
    if (aRecent !== -1) return -1;
    if (bRecent !== -1) return 1;

    return b.priority - a.priority; // Higher priority first
  });

  const handleActionClick = (action: QuickAction) => {
    action.action();
    saveRecentAction(action.id);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const action = actions.find(a => {
          const shortcut = a.shortcut.toLowerCase();
          const key = e.key.toLowerCase();
          return shortcut.includes(key) || shortcut.includes(`ctrl+${key}`);
        });

        if (action) {
          e.preventDefault();
          handleActionClick(action);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
        <span className="text-xs text-gray-500">Press Ctrl+key</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {sortedActions.slice(0, 8).map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${action.color}`}
            title={`${action.description} (${action.shortcut})`}
          >
            {action.icon}
            <span className="text-xs font-medium text-center leading-tight">
              {action.label}
            </span>
            <span className="text-xs opacity-75">
              {action.shortcut}
            </span>
          </button>
        ))}
      </div>

      {recentActions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Recent Actions</div>
          <div className="flex gap-1 overflow-x-auto">
            {recentActions.slice(0, 5).map((actionId) => {
              const action = actions.find(a => a.id === actionId);
              if (!action) return null;

              return (
                <button
                  key={actionId}
                  onClick={() => handleActionClick(action)}
                  className={`flex-shrink-0 p-2 rounded-md text-white transition-colors ${action.color}`}
                  title={action.description}
                >
                  {action.icon}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}