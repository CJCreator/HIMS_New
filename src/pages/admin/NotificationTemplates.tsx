import React, { useState } from 'react';
import { Card, Button, Input } from '../../components';
import { ManualNotificationTrigger } from '../../components/ManualNotificationTrigger';
import { Mail, MessageSquare, Bell, Edit, Trash2, Send } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  subject: string;
  content: string;
  variables: string[];
}

export const NotificationTemplates: React.FC = () => {
  const [templates] = useState<Template[]>([
    {
      id: '1',
      name: 'Appointment Reminder',
      type: 'email',
      subject: 'Appointment Reminder - {{date}} at {{time}}',
      content: 'Dear {{patientName}}, this is a reminder of your appointment with {{doctorName}} on {{date}} at {{time}}.',
      variables: ['patientName', 'doctorName', 'date', 'time']
    },
    {
      id: '2',
      name: 'SMS Reminder',
      type: 'sms',
      subject: '',
      content: 'Hi {{patientName}}, reminder: appointment with {{doctorName}} tomorrow at {{time}}. Reply CONFIRM or call us.',
      variables: ['patientName', 'doctorName', 'time']
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showManualTrigger, setShowManualTrigger] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notification Templates</h1>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => setShowManualTrigger(true)}>
            <Send className="w-4 h-4 mr-2" />
            Send Manual Notification
          </Button>
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Create Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template List */}
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTemplate(template)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(template.type)}
                  <div>
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{template.type}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Template Preview */}
        {selectedTemplate && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{selectedTemplate.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="flex items-center space-x-2">
                  {getTypeIcon(selectedTemplate.type)}
                  <span className="capitalize">{selectedTemplate.type}</span>
                </div>
              </div>

              {selectedTemplate.subject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{selectedTemplate.subject}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{selectedTemplate.content}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variables</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable) => (
                    <span key={variable} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {showManualTrigger && (
        <ManualNotificationTrigger onClose={() => setShowManualTrigger(false)} />
      )}
    </div>
  );
};