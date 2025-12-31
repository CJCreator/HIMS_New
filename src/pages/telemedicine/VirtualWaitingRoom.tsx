import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Users, Clock, Video, AlertTriangle } from 'lucide-react';

interface WaitingPatient {
  id: string;
  name: string;
  appointmentTime: string;
  waitTime: number;
  priority: 'normal' | 'urgent';
  techCheck: 'pending' | 'completed' | 'failed';
  status: 'waiting' | 'ready' | 'called';
}

export const VirtualWaitingRoom: React.FC = () => {
  const [patients, setPatients] = useState<WaitingPatient[]>([
    {
      id: '1',
      name: 'John Smith',
      appointmentTime: '10:00 AM',
      waitTime: 5,
      priority: 'normal',
      techCheck: 'completed',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      appointmentTime: '10:30 AM',
      waitTime: 2,
      priority: 'urgent',
      techCheck: 'completed',
      status: 'waiting'
    },
    {
      id: '3',
      name: 'Mike Davis',
      appointmentTime: '11:00 AM',
      waitTime: 0,
      priority: 'normal',
      techCheck: 'pending',
      status: 'waiting'
    }
  ]);

  const callPatient = (patientId: string) => {
    setPatients(patients.map(p => 
      p.id === patientId ? { ...p, status: 'called' } : p
    ));
    // In real implementation, this would initiate the video call
    alert(`Calling ${patients.find(p => p.id === patientId)?.name}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'called': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTechCheckColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const readyPatients = patients.filter(p => p.status === 'ready').length;
  const waitingPatients = patients.filter(p => p.status === 'waiting').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Virtual Waiting Room</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {patients.length} patients
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            {readyPatients} ready
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
            {waitingPatients} waiting
          </div>
        </div>
      </div>

      {/* Patient Queue */}
      <div className="space-y-4">
        {patients.map((patient) => (
          <Card key={patient.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                    {patient.priority === 'urgent' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        URGENT
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Scheduled: {patient.appointmentTime}
                    </div>
                    <div>
                      Wait time: {patient.waitTime} min
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-gray-500">Tech Check:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTechCheckColor(patient.techCheck)}`}>
                      {patient.techCheck}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>

                {patient.status === 'ready' && (
                  <Button 
                    variant="primary" 
                    onClick={() => callPatient(patient.id)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Start Call
                  </Button>
                )}

                {patient.status === 'waiting' && patient.techCheck === 'completed' && (
                  <Button 
                    variant="secondary" 
                    onClick={() => setPatients(patients.map(p => 
                      p.id === patient.id ? { ...p, status: 'ready' } : p
                    ))}
                  >
                    Mark Ready
                  </Button>
                )}

                {patient.techCheck === 'pending' && (
                  <Button variant="secondary" size="sm">
                    Tech Check
                  </Button>
                )}

                {patient.techCheck === 'failed' && (
                  <Button variant="secondary" size="sm">
                    Help Patient
                  </Button>
                )}
              </div>
            </div>

            {patient.techCheck === 'failed' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Technical issues detected. Patient may need assistance with camera/microphone setup.
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {patients.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients waiting</h3>
          <p className="text-gray-500">Patients will appear here when they join the virtual waiting room.</p>
        </Card>
      )}

      {/* Instructions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Virtual Waiting Room Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Patients automatically join 15 minutes before their appointment</li>
          <li>• Tech check verifies camera and microphone functionality</li>
          <li>• Ready patients can be called immediately</li>
          <li>• Urgent cases are highlighted and prioritized</li>
        </ul>
      </Card>
    </div>
  );
};