import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { FaClock, FaCircle } from 'react-icons/fa';

const Clock = FaClock;


interface QueueItem {
  id: string;
  patientName: string;
  tokenNumber: string;
  doctor: string;
  estimatedWait: number;
  status: 'waiting' | 'in-progress' | 'called';
  priority: 'normal' | 'urgent';
}

export const QueueDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [queue] = useState<QueueItem[]>([
    {
      id: '1',
      patientName: 'John S.',
      tokenNumber: 'A001',
      doctor: 'Dr. Wilson',
      estimatedWait: 5,
      status: 'in-progress',
      priority: 'normal'
    },
    {
      id: '2',
      patientName: 'Sarah J.',
      tokenNumber: 'A002',
      doctor: 'Dr. Wilson',
      estimatedWait: 15,
      status: 'waiting',
      priority: 'urgent'
    },
    {
      id: '3',
      patientName: 'Mike D.',
      tokenNumber: 'A003',
      doctor: 'Dr. Brown',
      estimatedWait: 10,
      status: 'waiting',
      priority: 'normal'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);



  const getPriorityIcon = (priority: string) => {
    return priority === 'urgent' ? 
      <FaCircle className="text-red-500" /> : 
      <FaCircle className="text-green-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Queue</h1>
          <div className="flex justify-center items-center text-xl text-gray-600">
            <Clock className="w-6 h-6 mr-2" />
            {currentTime.toLocaleTimeString()}
          </div>
        </div>

        {/* Current Patient */}
        <Card className="p-8 mb-8 bg-blue-50 border-blue-200">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Now Serving</h2>
            {queue.find(q => q.status === 'in-progress') ? (
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {queue.find(q => q.status === 'in-progress')?.tokenNumber}
              </div>
            ) : (
              <div className="text-2xl text-gray-500">No patient currently being served</div>
            )}
          </div>
        </Card>

        {/* Queue List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Waiting Queue</h3>
            <div className="space-y-3">
              {queue.filter(q => q.status === 'waiting').map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getPriorityIcon(item.priority)}</span>
                    <div>
                      <div className="font-semibold text-lg">{item.tokenNumber}</div>
                      <div className="text-sm text-gray-600">{item.doctor}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium">~{item.estimatedWait} min</div>
                    <div className="text-sm text-gray-500">estimated wait</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Doctor Availability</h3>
            <div className="space-y-3">
              {['Dr. Wilson', 'Dr. Brown', 'Dr. Davis'].map((doctor) => {
                const doctorQueue = queue.filter(q => q.doctor === doctor);
                const currentPatient = doctorQueue.find(q => q.status === 'in-progress');
                const waitingCount = doctorQueue.filter(q => q.status === 'waiting').length;
                
                return (
                  <div key={doctor} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{doctor}</div>
                        <div className="text-sm text-gray-600">
                          {currentPatient ? `Serving ${currentPatient.tokenNumber}` : 'Available'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{waitingCount}</div>
                        <div className="text-sm text-gray-500">waiting</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="p-6 mt-6 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Instructions</h3>
          <ul className="text-yellow-800 space-y-1">
            <li><FaCircle className="inline text-red-500 mr-2" />Urgent cases will be prioritized</li>
            <li><FaCircle className="inline text-green-500 mr-2" />Regular appointments in order</li>
            <li>📱 You will receive an SMS when your turn approaches</li>
            <li>🏥 Please stay in the waiting area</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};