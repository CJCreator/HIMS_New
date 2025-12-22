import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedTime,
  onTimeSelect
}) => {
  const morningSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0]);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = slots.filter(s => {
    const hour = parseInt(s.time.split(':')[0]);
    return hour >= 17;
  });

  const renderSlots = (slotList: TimeSlot[], label: string) => {
    if (slotList.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slotList.map(slot => (
            <button
              key={slot.time}
              onClick={() => slot.available && onTimeSelect(slot.time)}
              disabled={!slot.available}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTime === slot.time
                  ? 'bg-blue-600 text-white'
                  : slot.available
                  ? 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Select Time</h3>
      </div>

      {slots.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No time slots available for this date
        </div>
      ) : (
        <>
          {renderSlots(morningSlots, '🌅 Morning (Before 12 PM)')}
          {renderSlots(afternoonSlots, '☀️ Afternoon (12 PM - 5 PM)')}
          {renderSlots(eveningSlots, '🌙 Evening (After 5 PM)')}
        </>
      )}

      {selectedTime && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Selected:</strong> {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
};
