import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConflictAlertProps {
  conflicts: Array<{
    resourceName: string;
    time: string;
    bookedBy: string;
  }>;
  onResolve?: () => void;
}

export const ConflictAlert: React.FC<ConflictAlertProps> = ({ conflicts, onResolve }) => {
  if (conflicts.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-yellow-900 mb-2">Booking Conflicts Detected</h3>
          <div className="space-y-2">
            {conflicts.map((conflict, index) => (
              <div key={index} className="text-sm text-yellow-800 bg-yellow-100 rounded p-2">
                <p className="font-medium">{conflict.resourceName}</p>
                <p>{conflict.time} - Already booked by {conflict.bookedBy}</p>
              </div>
            ))}
          </div>
          {onResolve && (
            <button
              onClick={onResolve}
              className="mt-3 text-sm font-medium text-yellow-900 hover:text-yellow-700"
            >
              View Alternative Times →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
