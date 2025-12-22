import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';


const Video = ({ className }: { className?: string }) => <span className={className}>📹</span>;
const Clock = ({ className }: { className?: string }) => <span className={className}>🕐</span>;

interface ScheduleData {
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  duration: number;
  type: 'follow-up' | 'initial' | 'urgent';
  notes: string;
}

export const ConsultationScheduler: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    patientName: '',
    patientEmail: '',
    date: '',
    time: '',
    duration: 30,
    type: 'follow-up',
    notes: ''
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleSchedule = () => {
    console.log('Scheduling consultation:', scheduleData);
    alert(`Video consultation scheduled for ${scheduleData.patientName} on ${scheduleData.date} at ${scheduleData.time}`);
    
    // Reset form
    setScheduleData({
      patientName: '',
      patientEmail: '',
      date: '',
      time: '',
      duration: 30,
      type: 'follow-up',
      notes: ''
    });
  };

  const isFormValid = scheduleData.patientName && scheduleData.patientEmail && 
                     scheduleData.date && scheduleData.time;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Schedule Video Consultation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduling Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Consultation Details</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Patient Name *"
                  value={scheduleData.patientName}
                  onChange={(e) => setScheduleData({...scheduleData, patientName: e.target.value})}
                  placeholder="Enter patient name"
                />
                <Input
                  label="Patient Email *"
                  type="email"
                  value={scheduleData.patientEmail}
                  onChange={(e) => setScheduleData({...scheduleData, patientEmail: e.target.value})}
                  placeholder="patient@email.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date *"
                  type="date"
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
                  <select
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <select
                    value={scheduleData.duration}
                    onChange={(e) => setScheduleData({...scheduleData, duration: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Type</label>
                  <select
                    value={scheduleData.type}
                    onChange={(e) => setScheduleData({...scheduleData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="follow-up">Follow-up</option>
                    <option value="initial">Initial Consultation</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={scheduleData.notes}
                  onChange={(e) => setScheduleData({...scheduleData, notes: e.target.value})}
                  placeholder="Additional notes or preparation instructions..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Button
                onClick={handleSchedule}
                disabled={!isFormValid}
                variant="primary"
                className="w-full"
              >
                <Video className="w-4 h-4 mr-2" />
                Schedule Video Consultation
              </Button>
            </div>
          </Card>
        </div>

        {/* Summary & Instructions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Consultation Summary</h3>
            {isFormValid ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-medium">{scheduleData.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{scheduleData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{scheduleData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{scheduleData.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{scheduleData.type}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Fill in the form to see consultation summary</p>
            )}
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">
              <Video className="w-5 h-5 inline mr-2" />
              Video Consultation Setup
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Patient will receive email invitation with join link</li>
              <li>• Test video/audio 5 minutes before appointment</li>
              <li>• Ensure stable internet connection</li>
              <li>• Have patient records ready for reference</li>
              <li>• Use headphones for better audio quality</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              <Clock className="w-5 h-5 inline mr-2" />
              Available Time Slots
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map(slot => (
                <div
                  key={slot}
                  className={`p-2 text-center text-sm rounded border ${
                    scheduleData.time === slot
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {slot}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};