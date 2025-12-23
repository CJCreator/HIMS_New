import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components';
import { useNavigate } from 'react-router-dom';
import { mockDataService } from '@/services/mockDataService';
import { useRealtimeSimulation } from '@/hooks/useRealtimeSimulation';

export function SmartNotificationSystem() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const { updateCount } = useRealtimeSimulation();

  useEffect(() => {
    setNotifications(mockDataService.getNotifications());
  }, [updateCount]);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-l-4 border-error bg-error/5';
      case 'warning': return 'border-l-4 border-warning bg-warning/5';
      case 'success': return 'border-l-4 border-success bg-success/5';
      default: return 'border-l-4 border-info bg-info/5';
    }
  };

  const handleQuickAction = (notificationId: string, action: string) => {
    mockDataService.markNotificationRead(notificationId);
    navigate(action);
  };

  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h3 text-neutral-900">Smart Notifications</h2>
        <Badge status="error">{unreadCount} New</Badge>
      </div>

      <div className="space-y-3">
        {notifications.slice(0, 5).map(notification => (
          <div 
            key={notification.id}
            className={`p-4 rounded-small ${getNotificationStyle(notification.type)} ${notification.read ? 'opacity-60' : ''}`}
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
                    <span className="font-medium">{notification.patientName}</span>
                    {' '}({notification.patientId})
                  </p>
                </div>
              </div>
              <span className="text-body-sm text-neutral-600 ml-3">{formatTimestamp(notification.timestamp)}</span>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button 
                variant="primary"
                size="sm"
                onClick={() => handleQuickAction(notification.id, `/doctor/consultation/${notification.patientId}`)}
              >
                Start Consultation
              </Button>
              <Button 
                variant="secondary"
                size="sm"
                onClick={() => handleQuickAction(notification.id, `/doctor/patients/${notification.patientId}`)}
              >
                View Details
              </Button>
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
