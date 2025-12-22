import { Badge } from './Badge';
import { format } from 'date-fns';

interface ReminderNotificationProps {
  appointmentId: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reminderType: 'sms' | 'email' | 'push';
  status: 'pending' | 'sent' | 'failed';
  scheduledFor: string;
  sentAt?: string;
}

export function ReminderNotification({
  patientName,
  doctorName,
  appointmentDate,
  appointmentTime,
  reminderType,
  status,
  scheduledFor,
  sentAt
}: ReminderNotificationProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'sent':
        return <Badge status="delivered">Sent</Badge>;
      case 'failed':
        return <Badge status="error">Failed</Badge>;
      default:
        return <Badge status="pending">Pending</Badge>;
    }
  };

  const getTypeIcon = () => {
    switch (reminderType) {
      case 'sms':
        return '💬';
      case 'email':
        return '📧';
      case 'push':
        return '🔔';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-2xl">{getTypeIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-neutral-900">{patientName}</p>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-neutral-600">
            Appointment with Dr. {doctorName} on {appointmentDate} at {appointmentTime}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {status === 'sent' && sentAt ? (
              <>Sent {format(new Date(sentAt), 'MMM dd, yyyy HH:mm')}</>
            ) : (
              <>Scheduled for {format(new Date(scheduledFor), 'MMM dd, yyyy HH:mm')}</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
