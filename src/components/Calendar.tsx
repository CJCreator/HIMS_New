import { useState } from 'react';
import { Button } from './Button';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  doctor: string;
  status: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

export function Calendar({ events = [], onDateSelect, onEventClick, selected, onSelect, minDate, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (date: Date) => {
    if (minDate && date < minDate) return;
    setSelectedDate(date);
    onDateSelect?.(date);
    onSelect?.(date);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  // Simplified calendar - just show current month grid
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth();
  const today = new Date();

  return (
    <div className={`bg-white rounded-small border border-neutral-200 w-full ${className || ''}`}>
      <div className="flex justify-between items-center p-4 border-b border-neutral-200">
        <h3 className="text-h4 text-neutral-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-2">
          <Button variant="tertiary" size="sm" onClick={() => navigateMonth(-1)}>
            ←
          </Button>
          <Button variant="tertiary" size="sm" onClick={() => navigateMonth(1)}>
            →
          </Button>
        </div>
      </div>

      <div className="p-2 sm:p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs sm:text-body-sm font-medium text-neutral-600 p-1 sm:p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="min-h-[60px] sm:min-h-[80px]"></div>;
            }
            
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = (selected || selectedDate)?.toDateString() === date.toDateString();

            return (
              <div
                key={index}
                className={`min-h-[60px] sm:min-h-[80px] p-1 border border-neutral-100 cursor-pointer hover:bg-neutral-50 ${
                  isToday ? 'bg-primary-50' : ''
                } ${isSelected ? 'bg-receptionist/10' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                <div className={`text-xs sm:text-body-sm ${isToday ? 'font-semibold text-primary-600' : ''}`}>
                  {date.getDate()}
                </div>
                <div className="space-y-1 mt-1">
                  {events.slice(0, 1).map(event => (
                    <div
                      key={event.id}
                      className="text-[8px] sm:text-[10px] p-1 bg-receptionist/20 text-receptionist rounded-minimal cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      {event.time}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}