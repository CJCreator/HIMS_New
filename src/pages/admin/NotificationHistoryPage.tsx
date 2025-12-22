import React, { useState } from 'react';
import { NotificationHistory } from '../../components/NotificationHistory';
import { ManualNotificationTrigger } from '../../components/ManualNotificationTrigger';
import { Button } from '../../components';
import { Send, Download } from 'lucide-react';

export const NotificationHistoryPage: React.FC = () => {
  const [showManualTrigger, setShowManualTrigger] = useState(false);

  const handleExport = () => {
    alert('Exporting notification history...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification History</h1>
          <p className="text-gray-600 mt-1">View all sent notifications and their delivery status</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={() => setShowManualTrigger(true)}>
            <Send className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      <NotificationHistory />

      {showManualTrigger && (
        <ManualNotificationTrigger onClose={() => setShowManualTrigger(false)} />
      )}
    </div>
  );
};
