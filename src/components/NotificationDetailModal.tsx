import { Modal, Button, Badge } from '@/components';
import { format } from 'date-fns';

interface NotificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'urgent';
    title: string;
    message: string;
    timestamp: number | string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    patientName?: string;
    patientId?: string;
    patientAge?: number;
    patientGender?: string;
    fromRole?: string;
    toRole?: string;
    category?: string;
  };
  onAction?: (action: string) => void;
}

export function NotificationDetailModal({ isOpen, onClose, notification, onAction }: NotificationDetailModalProps) {
  const getPriorityColor = (priority: string): 'error' | 'pending' | 'sent' => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'error';
      case 'medium': return 'pending';
      default: return 'sent';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return '🚨';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  const formatTimestamp = (timestamp: number | string) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
    return format(date, 'MMM dd, yyyy HH:mm');
  };

  const quickActions = [
    { label: 'Start Consultation', action: 'start-consultation', variant: 'primary' as const },
    { label: 'View Patient History', action: 'view-history', variant: 'secondary' as const },
    { label: 'Send Message', action: 'send-message', variant: 'secondary' as const },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notification Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="text-4xl">{getTypeIcon(notification.type)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-neutral-900">{notification.title}</h3>
              <Badge status={getPriorityColor(notification.priority)}>
                {notification.priority.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600">{notification.message}</p>
          </div>
        </div>

        {/* Patient Information */}
        {notification.patientName && (
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3">Patient Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-neutral-600">Name</p>
                <p className="text-sm font-medium text-neutral-900">{notification.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Patient ID</p>
                <p className="text-sm font-medium text-neutral-900">{notification.patientId}</p>
              </div>
              {notification.patientAge && (
                <div>
                  <p className="text-xs text-neutral-600">Age</p>
                  <p className="text-sm font-medium text-neutral-900">{notification.patientAge} years</p>
                </div>
              )}
              {notification.patientGender && (
                <div>
                  <p className="text-xs text-neutral-600">Gender</p>
                  <p className="text-sm font-medium text-neutral-900 capitalize">{notification.patientGender}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notification Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-600 mb-1">Timestamp</p>
            <p className="text-sm font-medium text-neutral-900">{formatTimestamp(notification.timestamp)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-600 mb-1">Type</p>
            <p className="text-sm font-medium text-neutral-900 capitalize">{notification.type}</p>
          </div>
          {notification.fromRole && (
            <div>
              <p className="text-xs text-neutral-600 mb-1">From</p>
              <p className="text-sm font-medium text-neutral-900 capitalize">{notification.fromRole}</p>
            </div>
          )}
          {notification.toRole && (
            <div>
              <p className="text-xs text-neutral-600 mb-1">To</p>
              <p className="text-sm font-medium text-neutral-900 capitalize">{notification.toRole}</p>
            </div>
          )}
          {notification.category && (
            <div>
              <p className="text-xs text-neutral-600 mb-1">Category</p>
              <p className="text-sm font-medium text-neutral-900 capitalize">{notification.category}</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {notification.patientId && (
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-3">Recommended Actions</h4>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.action}
                  variant={action.variant}
                  size="sm"
                  onClick={() => {
                    onAction?.(action.action);
                    onClose();
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onClose}>
            Mark as Read
          </Button>
        </div>
      </div>
    </Modal>
  );
}
