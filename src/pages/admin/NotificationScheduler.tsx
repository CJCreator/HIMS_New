import React, { useState } from 'react';
import { Card, Button, Input } from '../../components';
import { Calendar, Clock, Users, Send } from 'lucide-react';

interface ScheduledNotification {
  id: string;
  template: string;
  recipients: string;
  scheduledTime: string;
  status: 'pending' | 'sent' | 'failed';
  type: 'appointment' | 'reminder' | 'broadcast';
}

export const NotificationScheduler: React.FC = () => {
  const [notifications] = useState<ScheduledNotification[]>([
    {
      id: '1',
      template: 'Appointment Reminder',
      recipients: '45 patients',
      scheduledTime: '2024-01-16 09:00',
      status: 'pending',
      type: 'appointment'
    },
    {
      id: '2',
      template: 'Lab Results Available',
      recipients: '12 patients',
      scheduledTime: '2024-01-15 14:30',
      status: 'sent',
      type: 'reminder'
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    template: '',
    recipients: '',
    scheduledTime: '',
    type: 'appointment'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleSchedule = () => {
    // Schedule notification logic
    alert('Notification scheduled successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notification Scheduler</h1>
        <Button variant="primary">
          <Send className="w-4 h-4 mr-2" />
          Send Now
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule New Notification */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Notification</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <select
                value={newNotification.template}
                onChange={(e) => setNewNotification({...newNotification, template: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select template</option>
                <option value="appointment-reminder">Appointment Reminder</option>
                <option value="prescription-refill">Prescription Refill</option>
                <option value="lab-results">Lab Results Available</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
              <select
                value={newNotification.recipients}
                onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select recipients</option>
                <option value="all-patients">All Patients</option>
                <option value="appointments-tomorrow">Tomorrow's Appointments</option>
                <option value="overdue-prescriptions">Overdue Prescriptions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
              <Input
                type="datetime-local"
                value={newNotification.scheduledTime}
                onChange={(e) => setNewNotification({...newNotification, scheduledTime: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newNotification.type}
                onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="appointment">Appointment</option>
                <option value="reminder">Reminder</option>
                <option value="broadcast">Broadcast</option>
              </select>
            </div>

            <Button variant="primary" onClick={handleSchedule} className="w-full">
              Schedule Notification
            </Button>
          </div>
        </Card>

        {/* Scheduled Notifications */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Notifications</h2>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{notification.template}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(notification.status)}`}>
                    {notification.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{notification.recipients}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(notification.scheduledTime).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-3">
                  <Button variant="secondary" size="sm">Edit</Button>
                  <Button variant="secondary" size="sm">Cancel</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};