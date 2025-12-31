import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Video, Calendar, Users, Clock } from 'lucide-react';

interface VideoConsultation {
  id: string;
  patientName: string;
  scheduledTime: string;
  status: 'scheduled' | 'waiting' | 'in-progress' | 'completed';
  duration?: number;
  type: 'follow-up' | 'initial' | 'urgent';
}

export const TelemedicineDashboard: React.FC = () => {
  const [consultations] = useState<VideoConsultation[]>([
    {
      id: '1',
      patientName: 'John Smith',
      scheduledTime: '10:00 AM',
      status: 'waiting',
      type: 'follow-up'
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      scheduledTime: '10:30 AM',
      status: 'scheduled',
      type: 'initial'
    },
    {
      id: '3',
      patientName: 'Mike Davis',
      scheduledTime: '11:00 AM',
      status: 'scheduled',
      type: 'urgent'
    }
  ]);

  const stats = {
    todayConsultations: consultations.length,
    waitingPatients: consultations.filter(c => c.status === 'waiting').length,
    completedToday: 5,
    avgDuration: 25
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'initial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Telemedicine Dashboard</h1>
        <Button variant="primary">
          <Video className="w-4 h-4 mr-2" />
          Start Consultation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.todayConsultations}</p>
              <p className="text-sm text-gray-600">Today's Consultations</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.waitingPatients}</p>
              <p className="text-sm text-gray-600">Waiting Patients</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Video className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
              <p className="text-sm text-gray-600">Completed Today</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgDuration}m</p>
              <p className="text-sm text-gray-600">Avg Duration</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Consultation Queue */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Video Consultations</h2>
        <div className="space-y-3">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <Video className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{consultation.patientName}</h3>
                  <p className="text-sm text-gray-600">Scheduled: {consultation.scheduledTime}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(consultation.type)}`}>
                  {consultation.type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                  {consultation.status}
                </span>
                
                {consultation.status === 'waiting' && (
                  <Button variant="primary" size="sm">
                    Join Call
                  </Button>
                )}
                
                {consultation.status === 'scheduled' && (
                  <Button variant="secondary" size="sm">
                    View Details
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
          <div className="text-center">
            <Video className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Virtual Waiting Room</h3>
            <p className="text-sm text-gray-600">View patients waiting for consultation</p>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Schedule Consultation</h3>
            <p className="text-sm text-gray-600">Book new video appointments</p>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-md transition-shadow">
          <div className="text-center">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Consultation History</h3>
            <p className="text-sm text-gray-600">View past video consultations</p>
          </div>
        </Card>
      </div>
    </div>
  );
};