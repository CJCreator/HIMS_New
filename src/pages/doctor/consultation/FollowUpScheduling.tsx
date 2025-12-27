import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification, addRoleNotification } from '../../../store/notificationSlice';
import { addAppointment } from '../../../store/appointmentSlice';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Calendar } from '../../../components/Calendar';

const Clock = ({ className }: { className?: string }) => <span className={className}>🕐</span>;
const CalendarIcon = ({ className }: { className?: string }) => <span className={className}>📅</span>;

interface FollowUpSchedulingProps {
  patientName: string;
  patientId: string;
  onNext: () => void;
  onPrevious: () => void;
}

const FollowUpScheduling: React.FC<FollowUpSchedulingProps> = ({
  patientName, 
  patientId, 
  onNext, 
  onPrevious 
}) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [followUpType, setFollowUpType] = useState<'routine' | 'urgent' | 'specialist'>('routine');
  const [notes, setNotes] = useState('');
  const [skipFollowUp, setSkipFollowUp] = useState(false);

  // Mock available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const followUpIntervals = {
    routine: { days: 14, label: '2 weeks' },
    urgent: { days: 3, label: '3 days' },
    specialist: { days: 30, label: '1 month' }
  };

  const suggestedDate = new Date();
  suggestedDate.setDate(suggestedDate.getDate() + followUpIntervals[followUpType].days);

  const handleSchedule = () => {
    if (!skipFollowUp && (!selectedDate || !selectedTime)) {
      dispatch(addNotification({
      type: 'warning',
      title: 'Incomplete Information',
      message: 'Please select both date and time for the follow-up appointment',
      priority: 'medium',
      category: 'system'
    }));
      return;
    }

    if (!skipFollowUp && selectedDate) {
      dispatch(addAppointment({
        patientId,
        patientName,
        doctorId: 'D001',
        doctorName: 'Dr. Wilson',
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        type: 'Follow-up',
        status: 'scheduled'
      }));
      
      dispatch(addRoleNotification({
        role: 'receptionist',
        type: 'info',
        title: 'Follow-up Scheduled',
        message: `${patientName} - ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
        priority: 'medium',
        category: 'appointment'
      }));
      
      dispatch(addNotification({
      type: 'success',
      title: 'Follow-up Scheduled',
      message: `Follow-up appointment scheduled for ${patientName} on ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
      priority: 'medium',
      category: 'system'
    }));
    } else if (skipFollowUp) {
      dispatch(addNotification({
      type: 'info',
      title: 'No Follow-up Scheduled',
      message: 'Patient consultation completed without follow-up appointment',
      priority: 'medium',
      category: 'system'
    }));
    }

    onNext();
  };

  const handleQuickSchedule = () => {
    setSelectedDate(suggestedDate);
    setSelectedTime('10:00');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Follow-up Scheduling</h2>
          <p className="text-gray-600">Schedule follow-up appointment for {patientName}</p>
        </div>
        <div className="text-sm text-gray-500">
          Step 11 of 13
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Follow-up Options */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Follow-up Required?</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="followUpRequired"
                  checked={!skipFollowUp}
                  onChange={() => setSkipFollowUp(false)}
                  className="mr-3"
                />
                <span>Yes, schedule follow-up appointment</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="followUpRequired"
                  checked={skipFollowUp}
                  onChange={() => setSkipFollowUp(true)}
                  className="mr-3"
                />
                <span>No follow-up needed</span>
              </label>
            </div>
          </Card>

          {!skipFollowUp && (
            <>
              <Card className="p-6">
                <h3 className="font-medium text-gray-900 mb-4">Follow-up Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(followUpIntervals).map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => setFollowUpType(type as any)}
                      className={`p-3 rounded-lg border text-center ${
                        followUpType === type
                          ? 'border-doctor-500 bg-doctor-50 text-doctor-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium capitalize">{type}</div>
                      <div className="text-sm text-gray-500">{info.label}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <CalendarIcon className="inline w-4 h-4 mr-1" />
                    Suggested date: {suggestedDate.toLocaleDateString()}
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleQuickSchedule}
                    className="mt-2"
                  >
                    Use Suggested Date & Time
                  </Button>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Select Date</h3>
                  <Calendar
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    minDate={new Date()}
                    className="w-full"
                  />
                </Card>

                <Card className="p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Available Times</h3>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded text-sm ${
                            selectedTime === time
                              ? 'bg-doctor-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <Clock className="inline w-3 h-3 mr-1" />
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Please select a date first
                    </p>
                  )}
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Appointment Summary */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Appointment Summary</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Patient:</span>
                <span className="ml-2 text-gray-900">{patientName}</span>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 text-gray-900 capitalize">
                  {skipFollowUp ? 'No follow-up' : `${followUpType} follow-up`}
                </span>
              </div>
              {!skipFollowUp && selectedDate && (
                <div>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-2 text-gray-900">{selectedDate.toLocaleDateString()}</span>
                </div>
              )}
              {!skipFollowUp && selectedTime && (
                <div>
                  <span className="text-gray-500">Time:</span>
                  <span className="ml-2 text-gray-900">{selectedTime}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Follow-up Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for follow-up, specific instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
              rows={4}
            />
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="secondary" onClick={onPrevious}>
          Previous
        </Button>
        <Button variant="primary" onClick={handleSchedule}>
          {skipFollowUp ? 'Continue' : 'Schedule & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default FollowUpScheduling;