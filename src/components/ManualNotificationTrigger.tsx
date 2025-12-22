import React, { useState } from 'react';
import { Card, Button, Input } from './';
import { Send, X } from 'lucide-react';

interface ManualNotificationProps {
  onClose?: () => void;
  patientId?: string;
  patientName?: string;
}

export const ManualNotificationTrigger: React.FC<ManualNotificationProps> = ({
  onClose,
  patientId,
  patientName
}) => {
  const [formData, setFormData] = useState({
    recipient: patientId || '',
    recipientName: patientName || '',
    type: 'email' as 'email' | 'sms' | 'push',
    category: 'general' as 'appointment' | 'prescription' | 'lab' | 'billing' | 'general',
    subject: '',
    message: '',
    sendImmediately: true,
    scheduledTime: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      alert('Notification sent successfully!');
      setIsSending(false);
      onClose?.();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Send Manual Notification</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Recipient */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Patient ID"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              placeholder="Enter patient ID"
              required
            />
            <Input
              label="Patient Name"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              placeholder="Enter patient name"
              required
            />
          </div>

          {/* Type and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="email">📧 Email</option>
                <option value="sms">💬 SMS</option>
                <option value="push">🔔 Push Notification</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="general">General</option>
                <option value="appointment">Appointment</option>
                <option value="prescription">Prescription</option>
                <option value="lab">Lab Results</option>
                <option value="billing">Billing</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <Input
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Enter notification subject"
            required
          />

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter notification message"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.message.length} / 500 characters
            </p>
          </div>

          {/* Scheduling */}
          <div className="border-t pt-4">
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={formData.sendImmediately}
                onChange={(e) => setFormData({ ...formData, sendImmediately: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Send immediately</span>
            </label>

            {!formData.sendImmediately && (
              <Input
                label="Schedule for"
                type="datetime-local"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              />
            )}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <div className="space-y-1 text-sm">
              <p><strong>To:</strong> {formData.recipientName || 'Patient'} ({formData.recipient || 'N/A'})</p>
              <p><strong>Type:</strong> {formData.type.toUpperCase()}</p>
              <p><strong>Subject:</strong> {formData.subject || '(No subject)'}</p>
              <p><strong>Message:</strong> {formData.message || '(No message)'}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={isSending || !formData.recipient || !formData.subject || !formData.message}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSending ? 'Sending...' : 'Send Notification'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
