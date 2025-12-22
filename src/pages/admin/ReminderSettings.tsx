import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateSettings, updateTemplate, ReminderTemplate } from '@/store/reminderSlice';
import { Card, Button, Input, Modal } from '@/components';
import { ReminderNotification } from '@/components/ReminderNotification';

export function ReminderSettings() {
  const dispatch = useDispatch();
  const { settings, templates, scheduled } = useSelector((state: RootState) => state.reminders);
  const [editingTemplate, setEditingTemplate] = useState<ReminderTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    dispatch(updateSettings({ [key]: !settings[key] }));
  };

  const handleReminderTimeChange = (index: number, value: string) => {
    const newTimes = [...settings.reminderTimes];
    newTimes[index] = parseInt(value) || 0;
    dispatch(updateSettings({ reminderTimes: newTimes }));
  };

  const addReminderTime = () => {
    dispatch(updateSettings({ reminderTimes: [...settings.reminderTimes, 1] }));
  };

  const removeReminderTime = (index: number) => {
    const newTimes = settings.reminderTimes.filter((_, i) => i !== index);
    dispatch(updateSettings({ reminderTimes: newTimes }));
  };

  const handleEditTemplate = (template: ReminderTemplate) => {
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      dispatch(updateTemplate(editingTemplate));
      setShowTemplateModal(false);
      setEditingTemplate(null);
    }
  };

  const recentReminders = scheduled.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Appointment Reminder Settings</h1>
        <p className="text-sm text-neutral-600 mt-1">Configure automated reminders to reduce no-shows</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">General Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">Enable Reminders</p>
                <p className="text-xs text-neutral-600">Master switch for all appointment reminders</p>
              </div>
              <button
                onClick={() => handleToggle('enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enabled ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">SMS Reminders</p>
                <p className="text-xs text-neutral-600">Send text message reminders</p>
              </div>
              <button
                onClick={() => handleToggle('smsEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.smsEnabled ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.smsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">Email Reminders</p>
                <p className="text-xs text-neutral-600">Send email reminders</p>
              </div>
              <button
                onClick={() => handleToggle('emailEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailEnabled ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-neutral-900">Push Notifications</p>
                <p className="text-xs text-neutral-600">Send app push notifications</p>
              </div>
              <button
                onClick={() => handleToggle('pushEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushEnabled ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pushEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-neutral-900">Reminder Timing</h3>
              <Button size="sm" onClick={addReminderTime}>Add Time</Button>
            </div>
            <div className="space-y-3">
              {settings.reminderTimes.map((hours, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={hours}
                    onChange={(e) => handleReminderTimeChange(index, e.target.value)}
                    className="w-24"
                    min="1"
                  />
                  <span className="text-sm text-neutral-600">hours before appointment</span>
                  {settings.reminderTimes.length > 1 && (
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={() => removeReminderTime(index)}
                      className="text-error"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Statistics</h2>
          <div className="space-y-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <p className="text-3xl font-semibold text-primary-700">{scheduled.filter(r => r.status === 'sent').length}</p>
              <p className="text-sm text-neutral-600 mt-1">Reminders Sent</p>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <p className="text-3xl font-semibold text-warning-700">{scheduled.filter(r => r.status === 'pending').length}</p>
              <p className="text-sm text-neutral-600 mt-1">Pending</p>
            </div>
            <div className="text-center p-4 bg-error-50 rounded-lg">
              <p className="text-3xl font-semibold text-error-700">{scheduled.filter(r => r.status === 'failed').length}</p>
              <p className="text-sm text-neutral-600 mt-1">Failed</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Message Templates</h2>
        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="flex items-start justify-between p-4 bg-neutral-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {template.type === 'sms' ? '💬' : template.type === 'email' ? '📧' : '🔔'}
                  </span>
                  <p className="text-sm font-medium text-neutral-900 capitalize">{template.type}</p>
                </div>
                {template.subject && (
                  <p className="text-sm font-medium text-neutral-700 mb-1">{template.subject}</p>
                )}
                <p className="text-xs text-neutral-600 line-clamp-2">{template.message}</p>
              </div>
              <Button variant="tertiary" size="sm" onClick={() => handleEditTemplate(template)}>
                Edit
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Reminders</h2>
        {recentReminders.length === 0 ? (
          <p className="text-sm text-neutral-600 text-center py-8">No reminders scheduled yet</p>
        ) : (
          <div className="space-y-2">
            {recentReminders.map((reminder) => (
              <ReminderNotification
                key={reminder.id}
                appointmentId={reminder.appointmentId}
                patientName="Patient Name"
                doctorName="Doctor Name"
                appointmentDate="2024-01-20"
                appointmentTime="10:00 AM"
                reminderType={reminder.type}
                status={reminder.status}
                scheduledFor={reminder.scheduledFor}
                sentAt={reminder.sentAt}
              />
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title={`Edit ${editingTemplate?.type} Template`}
        size="lg"
      >
        {editingTemplate && (
          <div className="space-y-4">
            {editingTemplate.type === 'email' && (
              <Input
                label="Subject"
                value={editingTemplate.subject || ''}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
              />
            )}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
              <textarea
                value={editingTemplate.message}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, message: e.target.value })}
                rows={6}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Available variables: {'{patientName}'}, {'{doctorName}'}, {'{date}'}, {'{time}'}, {'{location}'}, {'{hospitalName}'}
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowTemplateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>Save Template</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
