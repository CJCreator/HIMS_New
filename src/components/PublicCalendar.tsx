import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PublicCalendarProps {
  availableDates: string[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export const PublicCalendar: React.FC<PublicCalendarProps> = ({
  availableDates,
  selectedDate,
  onDateSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateAvailable = (date: string) => {
    return availableDates.includes(date);
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-12" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    const isAvailable = isDateAvailable(dateStr);
    const isSelected = selectedDate === dateStr;
    const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

    days.push(
      <button
        key={day}
        onClick={() => isAvailable && onDateSelect(dateStr)}
        disabled={!isAvailable || isPast}
        className={`h-12 rounded-md text-sm font-medium transition-colors ${
          isSelected
            ? 'bg-blue-600 text-white'
            : isAvailable && !isPast
            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            : 'text-gray-300 cursor-not-allowed'
        }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-md">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-gray-900">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-md">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-50 rounded" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-600 rounded" />
          <span className="text-gray-600">Selected</span>
        </div>
      </div>
    </div>
  );
};
