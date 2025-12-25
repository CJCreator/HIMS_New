import { useState } from 'react';
import { Card, Button, Input } from '@/components';
import { toast } from 'sonner';

interface TimeSlot {
  start: string;
  end: string;
  type: 'in-person' | 'teleconsultation' | 'both';
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
  breakTime?: { start: string; end: string };
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeeklyScheduleEditor() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    DAYS.map(day => ({
      day,
      enabled: day !== 'Sunday',
      slots: day !== 'Sunday' ? [
        { start: '09:00', end: '13:00', type: 'both' },
        { start: '17:00', end: '20:00', type: 'both' }
      ] : [],
      breakTime: day !== 'Sunday' ? { start: '13:00', end: '14:00' } : undefined
    }))
  );

  const [isEditing, setIsEditing] = useState(false);

  const toggleDay = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].enabled = !newSchedule[dayIndex].enabled;
    if (!newSchedule[dayIndex].enabled) {
      newSchedule[dayIndex].slots = [];
      newSchedule[dayIndex].breakTime = undefined;
    }
    setSchedule(newSchedule);
  };

  const addSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.push({ start: '09:00', end: '17:00', type: 'both' });
    setSchedule(newSchedule);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots.splice(slotIndex, 1);
    setSchedule(newSchedule);
  };

  const updateSlot = (dayIndex: number, slotIndex: number, field: keyof TimeSlot, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots[slotIndex] = {
      ...newSchedule[dayIndex].slots[slotIndex],
      [field]: value
    };
    setSchedule(newSchedule);
  };

  const updateBreakTime = (dayIndex: number, field: 'start' | 'end', value: string) => {
    const newSchedule = [...schedule];
    if (!newSchedule[dayIndex].breakTime) {
      newSchedule[dayIndex].breakTime = { start: '13:00', end: '14:00' };
    }
    newSchedule[dayIndex].breakTime![field] = value;
    setSchedule(newSchedule);
  };

  const handleSave = () => {
    toast.success('Schedule updated successfully');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original schedule if needed
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person': return '🏥';
      case 'teleconsultation': return '💻';
      case 'both': return '🏥💻';
      default: return '';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Weekly Schedule</h2>
          <p className="text-sm text-neutral-600 mt-1">Manage your working hours and consultation types</p>
        </div>
        {!isEditing ? (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            ✏️ Edit Schedule
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              💾 Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {schedule.map((daySchedule, dayIndex) => (
          <div key={daySchedule.day} className={`p-4 border-2 rounded-lg transition-all ${
            daySchedule.enabled ? 'border-primary-200 bg-primary-50/30' : 'border-neutral-200 bg-neutral-50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={daySchedule.enabled}
                    onChange={() => isEditing && toggleDay(dayIndex)}
                    disabled={!isEditing}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-base font-semibold text-neutral-900">{daySchedule.day}</span>
                </label>
                {!daySchedule.enabled && (
                  <span className="text-sm text-neutral-500 italic">Off</span>
                )}
              </div>
              {isEditing && daySchedule.enabled && (
                <Button size="sm" variant="secondary" onClick={() => addSlot(dayIndex)}>
                  + Add Slot
                </Button>
              )}
            </div>

            {daySchedule.enabled && (
              <div className="space-y-3 ml-6">
                {/* Time Slots */}
                {daySchedule.slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200">
                    {isEditing ? (
                      <>
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateSlot(dayIndex, slotIndex, 'start', e.target.value)}
                          className="w-32"
                        />
                        <span className="text-neutral-600">to</span>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateSlot(dayIndex, slotIndex, 'end', e.target.value)}
                          className="w-32"
                        />
                        <select
                          value={slot.type}
                          onChange={(e) => updateSlot(dayIndex, slotIndex, 'type', e.target.value)}
                          className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="in-person">In-Person</option>
                          <option value="teleconsultation">Teleconsultation</option>
                          <option value="both">Both</option>
                        </select>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => removeSlot(dayIndex, slotIndex)}
                          className="ml-auto"
                        >
                          🗑️
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-neutral-900">
                          {slot.start} - {slot.end}
                        </span>
                        <span className="text-sm text-neutral-600">
                          {getTypeIcon(slot.type)} {slot.type === 'both' ? 'In-Person & Teleconsultation' : slot.type === 'in-person' ? 'In-Person' : 'Teleconsultation'}
                        </span>
                      </>
                    )}
                  </div>
                ))}

                {/* Break Time */}
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-neutral-900">☕ Break:</span>
                    {isEditing ? (
                      <>
                        <Input
                          type="time"
                          value={daySchedule.breakTime?.start || '13:00'}
                          onChange={(e) => updateBreakTime(dayIndex, 'start', e.target.value)}
                          className="w-32"
                        />
                        <span className="text-neutral-600">to</span>
                        <Input
                          type="time"
                          value={daySchedule.breakTime?.end || '14:00'}
                          onChange={(e) => updateBreakTime(dayIndex, 'end', e.target.value)}
                          className="w-32"
                        />
                      </>
                    ) : (
                      <span className="text-sm text-neutral-700">
                        {daySchedule.breakTime?.start || '13:00'} - {daySchedule.breakTime?.end || '14:00'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-neutral-900 mb-2">📊 Weekly Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-neutral-600">Working Days</p>
            <p className="font-semibold text-neutral-900">{schedule.filter(d => d.enabled).length} days</p>
          </div>
          <div>
            <p className="text-neutral-600">Total Slots</p>
            <p className="font-semibold text-neutral-900">
              {schedule.reduce((acc, d) => acc + d.slots.length, 0)} slots
            </p>
          </div>
          <div>
            <p className="text-neutral-600">Teleconsultation</p>
            <p className="font-semibold text-neutral-900">
              {schedule.reduce((acc, d) => acc + d.slots.filter(s => s.type !== 'in-person').length, 0)} slots
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
