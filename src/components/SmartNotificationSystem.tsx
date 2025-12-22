import { Card, Button, Badge } from '@/components';
import { useNavigate } from 'react-router-dom';

interface SmartNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  fromRole: string;
  toRole: string;
  title: string;
  message: string;
  patientContext: {
    id: string;
    name: string;
    vitals?: string;
  };
  quickActions: Array<{
    label: string;
    action: string;
  }>;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function SmartNotificationSystem() {
  const navigate = useNavigate();

  const notifications: SmartNotification[] = [
    {
      id: 'N001',
      type: 'urgent',
      fromRole: 'Nurse',
      toRole: 'Doctor',
      title: 'Patient Ready for Consultation',
      message: 'John Smith (P001) vitals complete',
      patientContext: {
        id: 'P001',
        name: 'John Smith',
        vitals: 'BP: 120/80, HR: 72'
      },
      quickActions: [
        { label: 'Start Consultation', action: '/doctor/consultation' },
        { label: 'View Vitals', action: '/doctor/patients/P001' }
      ],
      timestamp: '2 min ago',
      priority: 'high'
    },
    {
      id: 'N002',
      type: 'info',
      fromRole: 'Doctor',
      toRole: 'Pharmacy',
      title: 'Prescription Ready',
      message: 'Prescription ready for Sarah Johnson - 2 medications',
      patientContext: {
        id: 'P002',
        name: 'Sarah Johnson'
      },
      quickActions: [
        { label: 'Process Now', action: '/pharmacy/prescriptions/P002' },
        { label: 'View Details', action: '/pharmacy/patients/P002' }
      ],
      timestamp: '5 min ago',
      priority: 'medium'
    },
    {
      id: 'N003',
      type: 'warning',
      fromRole: 'Lab',
      toRole: 'Doctor',
      title: 'Critical Lab Results',
      message: 'Critical results for Michael Chen - HbA1c: 12.5%',
      patientContext: {
        id: 'P003',
        name: 'Michael Chen'
      },
      quickActions: [
        { label: 'Review Immediately', action: '/doctor/lab-results/P003' },
        { label: 'Contact Patient', action: '/doctor/patients/P003/contact' }
      ],
      timestamp: '1 min ago',
      priority: 'urgent'
    },
    {
      id: 'N004',
      type: 'success',
      fromRole: 'Doctor',
      toRole: 'Receptionist',
      title: 'Consultation Complete',
      message: 'Consultation complete for Jane Doe',
      patientContext: {
        id: 'P004',
        name: 'Jane Doe'
      },
      quickActions: [
        { label: 'Ready for Billing', action: '/receptionist/billing/P004' },
        { label: 'Schedule Follow-up', action: '/receptionist/appointments/new?patient=P004' }
      ],
      timestamp: '10 min ago',
      priority: 'medium'
    }
  ];

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-l-4 border-error bg-error/5';
      case 'warning': return 'border-l-4 border-warning bg-warning/5';
      case 'success': return 'border-l-4 border-success bg-success/5';
      default: return 'border-l-4 border-info bg-info/5';
    }
  };

  const handleQuickAction = (action: string) => {
    navigate(action);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h3 text-neutral-900">Smart Notifications</h2>
        <Badge status="error">4 New</Badge>
      </div>

      <div className="space-y-3">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`p-4 rounded-small ${getNotificationStyle(notification.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-body font-medium">{notification.title}</h4>
                  {notification.priority === 'urgent' && (
                    <Badge status="error">URGENT</Badge>
                  )}
                </div>
                <p className="text-body-sm text-neutral-700 mb-2">{notification.message}</p>
                
                {/* Patient Context */}
                <div className="p-2 bg-white rounded-small mb-2">
                  <p className="text-body-sm">
                    <span className="font-medium">{notification.patientContext.name}</span>
                    {' '}({notification.patientContext.id})
                    {notification.patientContext.vitals && (
                      <span className="text-neutral-600"> • {notification.patientContext.vitals}</span>
                    )}
                  </p>
                </div>
              </div>
              <span className="text-body-sm text-neutral-600 ml-3">{notification.timestamp}</span>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              {notification.quickActions.map((action, idx) => (
                <Button 
                  key={idx}
                  variant={idx === 0 ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleQuickAction(action.action)}
                >
                  {action.label}
                </Button>
              ))}
            </div>

            {/* From/To Indicator */}
            <div className="mt-2 pt-2 border-t border-neutral-200">
              <p className="text-body-sm text-neutral-600">
                From: <span className="font-medium">{notification.fromRole}</span> → 
                To: <span className="font-medium">{notification.toRole}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
