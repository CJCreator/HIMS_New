import React from 'react';

interface MedicationStatusTrackerProps {
  status: 'request' | 'pending' | 'sent' | 'dispatched' | 'received' | 'delivered';
  className?: string;
}

const statusFlow = [
  { key: 'request', label: 'Requested', icon: '📝' },
  { key: 'pending', label: 'Pending', icon: '⏳' },
  { key: 'sent', label: 'Sent to Pharmacy', icon: '📤' },
  { key: 'dispatched', label: 'Dispatched', icon: '🚛' },
  { key: 'received', label: 'Received', icon: '📦' },
  { key: 'delivered', label: 'Delivered', icon: '✅' }
];

export const MedicationStatusTracker: React.FC<MedicationStatusTrackerProps> = ({ 
  status, 
  className = '' 
}) => {
  const currentIndex = statusFlow.findIndex(step => step.key === status);
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {statusFlow.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div key={step.key} className="flex items-center">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium
              ${isActive 
                ? isCurrent 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {step.icon}
            </div>
            {index < statusFlow.length - 1 && (
              <div className={`
                w-8 h-0.5 mx-1
                ${index < currentIndex ? 'bg-green-500' : 'bg-gray-200'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
};