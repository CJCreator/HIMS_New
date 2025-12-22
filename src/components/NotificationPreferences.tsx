import React, { useState } from 'react';
import { Card, Button } from './';
import { Mail, MessageSquare, Bell, Clock } from 'lucide-react';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  appointmentReminders: boolean;
  prescriptionRefills: boolean;
  labResults: boolean;
  reminderTiming: '24h' | '2h' | '1h';
}

export const NotificationPreferences: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    appointmentReminders: true,
    prescriptionRefills: true,
    labResults: false,
    reminderTiming: '24h'
  });

  const updateSetting = (key: keyof NotificationSettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save preferences
    alert('Preferences saved successfully!');
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
      
      <div className="space-y-6">
        {/* Communication Methods */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Communication Methods</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.email}
                onChange={(e) => updateSetting('email', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Mail className="w-5 h-5 text-gray-600" />
              <span>Email notifications</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.sms}
                onChange={(e) => updateSetting('sms', e.target.checked)}
                className="rounded border-gray-300"
              />
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <span>SMS text messages</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.push}
                onChange={(e) => updateSetting('push', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Bell className="w-5 h-5 text-gray-600" />
              <span>Push notifications</span>
            </label>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Notification Types</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span>Appointment reminders</span>
              <input
                type="checkbox"
                checked={settings.appointmentReminders}
                onChange={(e) => updateSetting('appointmentReminders', e.target.checked)}
                className="rounded border-gray-300"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span>Prescription refill reminders</span>
              <input
                type="checkbox"
                checked={settings.prescriptionRefills}
                onChange={(e) => updateSetting('prescriptionRefills', e.target.checked)}
                className="rounded border-gray-300"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span>Lab result notifications</span>
              <input
                type="checkbox"
                checked={settings.labResults}
                onChange={(e) => updateSetting('labResults', e.target.checked)}
                className="rounded border-gray-300"
              />
            </label>
          </div>
        </div>

        {/* Timing */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Reminder Timing</h3>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <select
              value={settings.reminderTiming}
              onChange={(e) => updateSetting('reminderTiming', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="24h">24 hours before</option>
              <option value="2h">2 hours before</option>
              <option value="1h">1 hour before</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button variant="primary" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </Card>
  );
};