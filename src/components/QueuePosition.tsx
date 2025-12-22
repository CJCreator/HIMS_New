import React from 'react';
import { Clock, Users } from 'lucide-react';

interface QueuePositionProps {
  position: number;
  estimatedWait: number;
  totalInQueue: number;
}

export const QueuePosition: React.FC<QueuePositionProps> = ({
  position,
  estimatedWait,
  totalInQueue
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-lg font-semibold text-blue-900">
              Position #{position}
            </p>
            <p className="text-sm text-blue-700">
              {totalInQueue} patients in queue
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-lg font-semibold text-blue-900">
              ~{estimatedWait} min
            </span>
          </div>
          <p className="text-sm text-blue-700">estimated wait</p>
        </div>
      </div>
    </div>
  );
};