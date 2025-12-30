import React from 'react';
import { useDispatch } from 'react-redux';
import { addRoleNotification } from '../store/notificationSlice';
import { Button } from './Button';
import { FaExclamationTriangle, FaHeartbeat, FaBolt } from 'react-icons/fa';

const AlertTriangle = FaExclamationTriangle;
const Heart = FaHeartbeat;
const Zap = FaBolt;

interface QuickNotificationsProps {
  userRole: 'nurse' | 'doctor' | 'pharmacy' | 'receptionist';
}

export const QuickNotifications: React.FC<QuickNotificationsProps> = ({ userRole }) => {
  const dispatch = useDispatch();

  const triggerEmergencyAlert = () => {
    dispatch(addRoleNotification({
      role: 'doctor',
      type: 'error',
      title: 'EMERGENCY ALERT',
      message: 'Patient in Room 205 requires immediate attention - Code Blue',
      category: 'patient',
      priority: 'urgent'
    }));
    
    dispatch(addRoleNotification({
      role: 'nurse',
      type: 'error',
      title: 'EMERGENCY ALERT',
      message: 'Code Blue - Room 205 - All available nurses respond',
      category: 'patient',
      priority: 'urgent'
    }));
  };

  const triggerVitalsAlert = () => {
    dispatch(addRoleNotification({
      role: 'doctor',
      type: 'warning',
      title: 'Critical Vitals Alert',
      message: 'Patient John Smith - BP: 180/120, HR: 110 - Requires immediate review',
      category: 'patient',
      priority: 'urgent'
    }));
  };

  const triggerSystemAlert = () => {
    dispatch(addRoleNotification({
      role: 'admin',
      type: 'warning',
      title: 'System Performance Alert',
      message: 'Server response time elevated - Monitor system performance',
      category: 'system',
      priority: 'high'
    }));
  };

  const getQuickActions = () => {
    switch (userRole) {
      case 'nurse':
        return [
          {
            label: 'Emergency Alert',
            icon: <AlertTriangle className="w-4 h-4" />,
            action: triggerEmergencyAlert,
            variant: 'error' as const
          },
          {
            label: 'Critical Vitals',
            icon: <Heart className="w-4 h-4" />,
            action: triggerVitalsAlert,
            variant: 'warning' as const
          }
        ];
      case 'doctor':
        return [
          {
            label: 'Emergency Alert',
            icon: <AlertTriangle className="w-4 h-4" />,
            action: triggerEmergencyAlert,
            variant: 'error' as const
          }
        ];
      case 'pharmacy':
        return [
          {
            label: 'System Alert',
            icon: <Zap className="w-4 h-4" />,
            action: triggerSystemAlert,
            variant: 'warning' as const
          }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  if (quickActions.length === 0) return null;

  return (
    <div className="flex gap-2">
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant === 'error' ? 'primary' : 'secondary'}
          size="sm"
          onClick={action.action}
          className={`flex items-center gap-2 ${
            action.variant === 'error' ? 'bg-red-600 hover:bg-red-700' :
            action.variant === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
            ''
          }`}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
};