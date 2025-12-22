import { useState, useEffect } from 'react';
import { Card, Badge } from '@/components';

export function OfflineCapabilityManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const offlineFeatures = [
    { name: 'View Patient Records', available: true },
    { name: 'Record Vitals', available: true },
    { name: 'Add Consultation Notes', available: true },
    { name: 'View Prescriptions', available: true },
    { name: 'Create Prescriptions', available: false },
    { name: 'Order Lab Tests', available: false }
  ];

  return (
    <Card className={isOnline ? 'bg-success/10' : 'bg-warning/10'}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h4 text-neutral-900">
          {isOnline ? '🟢 Online' : '🟡 Offline Mode'}
        </h3>
        <Badge status={isOnline ? 'delivered' : 'pending'}>
          {isOnline ? 'Connected' : 'Offline'}
        </Badge>
      </div>

      {!isOnline && (
        <div className="mb-4 p-3 bg-warning/20 rounded-small">
          <p className="text-body-sm font-medium text-warning-dark">
            Limited functionality available offline
          </p>
          <p className="text-body-sm text-neutral-600 mt-1">
            Data will sync automatically when connection is restored
          </p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-body-sm font-medium text-neutral-700">Available Features:</p>
        {offlineFeatures.map((feature, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-small">
            <span className="text-body-sm">{feature.name}</span>
            <span className={feature.available ? 'text-success' : 'text-neutral-400'}>
              {feature.available ? '✓' : '○'}
            </span>
          </div>
        ))}
      </div>

      {syncQueue.length > 0 && (
        <div className="mt-4 p-3 bg-info/10 rounded-small">
          <p className="text-body-sm font-medium">
            {syncQueue.length} items pending sync
          </p>
        </div>
      )}
    </Card>
  );
}
