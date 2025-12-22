import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components';
import { PublicCalendar } from '../../components/PublicCalendar';
import { TimeSlotPicker } from '../../components/TimeSlotPicker';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

export const DoctorAvailability: React.FC = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);

  // Mock data
  const doctor = {
    id: doctorId,
    name: 'Dr. Sarah Smith',
    specialty: 'Cardiology',
    image: ''
  };

  const availableDates = [
    '2024-01-25', '2024-01-26', '2024-01-27', '2024-01-29', '2024-01-30',
    '2024-02-01', '2024-02-02', '2024-02-05', '2024-02-06'
  ];

  const getTimeSlotsForDate = (date: string) => {
    // Mock time slots
    return [
      { time: '09:00', available: true },
      { time: '09:30', available: true },
      { time: '10:00', available: false },
      { time: '10:30', available: true },
      { time: '11:00', available: true },
      { time: '11:30', available: false },
      { time: '14:00', available: true },
      { time: '14:30', available: true },
      { time: '15:00', available: true },
      { time: '15:30', available: false },
      { time: '16:00', available: true },
      { time: '16:30', available: true }
    ];
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      navigate('/public/booking-confirmation', {
        state: { doctor, date: selectedDate, time: selectedTime }
      });
    }
  };

  const handleWaitlist = () => {
    setShowWaitlist(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={() => navigate('/public/doctors')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Doctor List
        </button>

        {/* Doctor Info */}
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-gray-600">{doctor.specialty}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Select Date
            </h2>
            <PublicCalendar
              availableDates={availableDates}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Time Slots */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Select Time
            </h2>
            {selectedDate ? (
              <TimeSlotPicker
                slots={getTimeSlotsForDate(selectedDate)}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-500">Please select a date first</p>
              </Card>
            )}
          </div>
        </div>

        {/* Actions */}
        <Card className="p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              {selectedDate && selectedTime ? (
                <div>
                  <p className="text-sm text-gray-600">Your appointment</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedTime}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Select date and time to continue</p>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={handleWaitlist}>
                Join Waitlist
              </Button>
              <Button
                variant="primary"
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
              >
                Continue to Booking
              </Button>
            </div>
          </div>
        </Card>

        {/* Waitlist Modal */}
        {showWaitlist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Join Waitlist</h3>
              <p className="text-gray-600 mb-4">
                We'll notify you when an earlier appointment becomes available with {doctor.name}.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <Button variant="secondary" className="flex-1" onClick={() => setShowWaitlist(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => {
                  alert('Added to waitlist!');
                  setShowWaitlist(false);
                }}>
                  Join Waitlist
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
