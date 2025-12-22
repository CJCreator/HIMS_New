import React, { useState } from 'react';
import { Card } from '../../../components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResourceBooking {
  id: string;
  resourceName: string;
  resourceType: 'room' | 'equipment';
  date: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
}

export const ResourceCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings] = useState<ResourceBooking[]>([
    { id: '1', resourceName: 'Room 101', resourceType: 'room', date: '2024-01-20', startTime: '09:00', endTime: '12:00', bookedBy: 'Dr. Smith' },
    { id: '2', resourceName: 'X-Ray Machine A', resourceType: 'equipment', date: '2024-01-20', startTime: '10:00', endTime: '11:00', bookedBy: 'Dr. Johnson' },
    { id: '3', resourceName: 'OR-1', resourceType: 'room', date: '2024-01-21', startTime: '08:00', endTime: '14:00', bookedBy: 'Dr. Brown' }
  ]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getBookingsForDay = (dayOffset: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.date === dateStr);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Calendar</h1>
          <p className="text-gray-600 mt-1">View and manage resource bookings</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))} className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))} className="p-2 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Card className="p-4 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="font-medium text-gray-700">Time</div>
            {weekDays.map((day, i) => (
              <div key={i} className="font-medium text-gray-700 text-center">{day}</div>
            ))}
          </div>

          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 gap-2 border-t border-gray-200 py-2">
              <div className="text-sm text-gray-600">{hour}:00</div>
              {weekDays.map((_, dayIndex) => {
                const dayBookings = getBookingsForDay(dayIndex);
                const hourBookings = dayBookings.filter(b => {
                  const start = parseInt(b.startTime.split(':')[0]);
                  const end = parseInt(b.endTime.split(':')[0]);
                  return hour >= start && hour < end;
                });

                return (
                  <div key={dayIndex} className="min-h-[40px]">
                    {hourBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className={`text-xs p-1 rounded mb-1 ${
                          booking.resourceType === 'room' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <div className="font-medium truncate">{booking.resourceName}</div>
                        <div className="truncate">{booking.bookedBy}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 rounded"></div>
          <span>Room Bookings</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 rounded"></div>
          <span>Equipment Bookings</span>
        </div>
      </div>
    </div>
  );
};
