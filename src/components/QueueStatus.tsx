import React from 'react';
import { Card } from './';
import { Clock, Users, MapPin } from 'lucide-react';

interface QueueStatusProps {
  position: number;
  estimatedWait: number;
  department: string;
  doctor: string;
  appointmentTime: string;
}

export const QueueStatus: React.FC<QueueStatusProps> = ({
  position,
  estimatedWait,
  department,
  doctor,
  appointmentTime
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Queue Status</h3>
        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
          Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center p-4 bg-white rounded-lg">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{position}</p>
          <p className="text-sm text-gray-600">Position in Queue</p>
        </div>

        <div className="text-center p-4 bg-white rounded-lg">
          <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{estimatedWait} min</p>
          <p className="text-sm text-gray-600">Estimated Wait</p>
        </div>

        <div className="text-center p-4 bg-white rounded-lg">
          <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-gray-900">{department}</p>
          <p className="text-sm text-gray-600">Department</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-600">Doctor</p>
            <p className="font-medium text-gray-900">{doctor}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Appointment Time</p>
            <p className="font-medium text-gray-900">{appointmentTime}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Please stay in the waiting area. You'll be called when it's your turn.
        </p>
      </div>
    </Card>
  );
};
