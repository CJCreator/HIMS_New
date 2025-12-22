import React, { useState } from 'react';
import { Card } from './';
import { Mail, MessageSquare, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'email' | 'sms' | 'push';
  category: 'appointment' | 'prescription' | 'lab' | 'billing' | 'general';
  subject: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  recipient: string;
}

export const NotificationHistory: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'email' | 'sms' | 'push'>('all');
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'email',
      category: 'appointment',
      subject: 'Appointment Reminder',
      message: 'Your appointment with Dr. Smith is tomorrow at 10:00 AM',
      sentAt: '2024-01-20T09:00:00',
      status: 'delivered',
      recipient: 'john.doe@example.com'
    },
    {
      id: '2',
      type: 'sms',
      category: 'prescription',
      subject: 'Prescription Ready',
      message: 'Your prescription is ready for pickup',
      sentAt: '2024-01-19T14:30:00',
      status: 'delivered',
      recipient: '(555) 123-4567'
    },
    {
      id: '3',
      type: 'push',
      category: 'lab',
      subject: 'Lab Results Available',
      message: 'Your lab results are now available in the portal',
      sentAt: '2024-01-18T11:15:00',
      status: 'delivered',
      recipient: 'Mobile App'
    },
    {
      id: '4',
      type: 'email',
      category: 'billing',
      subject: 'Payment Reminder',
      message: 'You have an outstanding balance of $150.00',
      sentAt: '2024-01-17T08:00:00',
      status: 'sent',
      recipient: 'john.doe@example.com'
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5 text-blue-600" />;
      case 'sms': return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'push': return <Bell className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'sent': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return null;
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Notification History</h2>
        <div className="flex space-x-2">
          {['all', 'email', 'sms', 'push'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className="p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{notification.subject}</h3>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(notification.status)}
                    <span className="text-sm text-gray-500 capitalize">{notification.status}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>To: {notification.recipient}</span>
                  <span>•</span>
                  <span>{new Date(notification.sentAt).toLocaleString()}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                    {notification.category}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No notifications found
        </div>
      )}
    </div>
  );
};
