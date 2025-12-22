import React, { useState, useEffect } from 'react';
import { useQueueWebSocket } from '../../hooks/useQueueWebSocket';
import { Clock, Users, AlertCircle, Wifi } from 'lucide-react';

interface QueueItem {
  id: string;
  patientName: string;
  appointmentTime: string;
  doctor: string;
  status: 'waiting' | 'in_progress' | 'called';
  priority: 'normal' | 'urgent';
}

export const QueueDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { queueData, isConnected } = useQueueWebSocket('display-screen');
  const [queue] = useState<QueueItem[]>([
    { id: '1', patientName: 'John D.', appointmentTime: '10:00 AM', doctor: 'Dr. Smith', status: 'in_progress', priority: 'normal' },
    { id: '2', patientName: 'Sarah M.', appointmentTime: '10:15 AM', doctor: 'Dr. Johnson', status: 'waiting', priority: 'urgent' },
    { id: '3', patientName: 'Mike R.', appointmentTime: '10:30 AM', doctor: 'Dr. Smith', status: 'waiting', priority: 'normal' },
    { id: '4', patientName: 'Lisa K.', appointmentTime: '10:45 AM', doctor: 'Dr. Brown', status: 'waiting', priority: 'normal' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const waitingPatients = queue.filter(p => p.status === 'waiting');
  const inProgressPatients = queue.filter(p => p.status === 'in_progress');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Queue</h1>
            <p className="text-gray-600">Real-time waiting room display</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Wifi className={`w-4 h-4 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Live Updates' : 'Disconnected'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-gray-600">
              {currentTime.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Now Being Seen */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Now Being Seen</h2>
          </div>
          <div className="space-y-3">
            {inProgressPatients.length > 0 ? (
              inProgressPatients.map((patient) => (
                <div key={patient.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-green-900">{patient.patientName}</p>
                      <p className="text-sm text-green-700">{patient.doctor}</p>
                    </div>
                    <span className="text-sm text-green-600">{patient.appointmentTime}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No patients currently being seen</p>
            )}
          </div>
        </div>

        {/* Waiting Queue */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Waiting Queue</h2>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {waitingPatients.length} waiting
            </span>
          </div>
          <div className="space-y-3">
            {waitingPatients.map((patient, index) => (
              <div key={patient.id} className={`border rounded-lg p-4 ${
                patient.priority === 'urgent' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="bg-white border-2 border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">{patient.patientName}</p>
                      <p className="text-sm text-gray-600">{patient.doctor}</p>
                    </div>
                    {patient.priority === 'urgent' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{patient.appointmentTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
        <p className="text-center text-gray-600">
          Please wait for your name to be called. If you have any questions, please approach the reception desk.
        </p>
      </div>
    </div>
  );
};