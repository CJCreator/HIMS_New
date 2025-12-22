import React from 'react';

const hours = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const data = [
  [12, 18, 25, 32, 28, 22, 15, 20, 18, 10],
  [15, 22, 28, 35, 30, 25, 18, 22, 20, 12],
  [14, 20, 30, 38, 32, 28, 20, 25, 22, 14],
  [16, 24, 32, 40, 35, 30, 22, 28, 24, 16],
  [18, 26, 35, 42, 38, 32, 25, 30, 26, 18],
  [10, 15, 20, 25, 22, 18, 15, 18, 16, 10],
  [8, 12, 16, 20, 18, 15, 12, 15, 14, 8]
];

const getColor = (value: number) => {
  if (value >= 35) return 'bg-red-500';
  if (value >= 25) return 'bg-orange-500';
  if (value >= 15) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const PeakHoursHeatmap: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-11 gap-1">
        <div></div>
        {hours.map((hour) => (
          <div key={hour} className="text-xs text-center text-gray-600">{hour}</div>
        ))}
      </div>
      {days.map((day, dayIndex) => (
        <div key={day} className="grid grid-cols-11 gap-1">
          <div className="text-xs text-gray-600 flex items-center">{day}</div>
          {data[dayIndex].map((value, hourIndex) => (
            <div
              key={hourIndex}
              className={`h-8 rounded ${getColor(value)} flex items-center justify-center text-xs text-white font-medium`}
              title={`${day} ${hours[hourIndex]}: ${value} patients`}
            >
              {value}
            </div>
          ))}
        </div>
      ))}
      <div className="flex items-center justify-center space-x-4 text-xs mt-4">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Low (0-14)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Medium (15-24)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>High (25-34)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Peak (35+)</span>
        </div>
      </div>
    </div>
  );
};
