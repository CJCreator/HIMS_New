import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReminderSettings {
  enabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  reminderTimes: number[]; // hours before appointment
}

export interface ReminderTemplate {
  id: string;
  type: 'sms' | 'email' | 'push';
  subject?: string;
  message: string;
}

export interface ScheduledReminder {
  id: string;
  appointmentId: string;
  patientId: string;
  type: 'sms' | 'email' | 'push';
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
}

interface ReminderState {
  settings: ReminderSettings;
  templates: ReminderTemplate[];
  scheduled: ScheduledReminder[];
}

const defaultTemplates: ReminderTemplate[] = [
  {
    id: '1',
    type: 'sms',
    message: 'Reminder: You have an appointment with Dr. {doctorName} on {date} at {time}. Reply CONFIRM to confirm.'
  },
  {
    id: '2',
    type: 'email',
    subject: 'Appointment Reminder - {hospitalName}',
    message: 'Dear {patientName},\n\nThis is a reminder for your upcoming appointment:\n\nDoctor: Dr. {doctorName}\nDate: {date}\nTime: {time}\nLocation: {location}\n\nPlease arrive 15 minutes early.\n\nThank you!'
  },
  {
    id: '3',
    type: 'push',
    message: 'Appointment with Dr. {doctorName} on {date} at {time}'
  }
];

const initialState: ReminderState = {
  settings: {
    enabled: true,
    smsEnabled: true,
    emailEnabled: true,
    pushEnabled: false,
    reminderTimes: [24, 2] // 24 hours and 2 hours before
  },
  templates: defaultTemplates,
  scheduled: []
};

const reminderSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<ReminderSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    updateTemplate: (state, action: PayloadAction<ReminderTemplate>) => {
      const index = state.templates.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },
    scheduleReminder: (state, action: PayloadAction<ScheduledReminder>) => {
      state.scheduled.push(action.payload);
    },
    updateReminderStatus: (state, action: PayloadAction<{ id: string; status: ScheduledReminder['status']; sentAt?: string }>) => {
      const reminder = state.scheduled.find(r => r.id === action.payload.id);
      if (reminder) {
        reminder.status = action.payload.status;
        if (action.payload.sentAt) {
          reminder.sentAt = action.payload.sentAt;
        }
      }
    },
    clearScheduled: (state) => {
      state.scheduled = state.scheduled.filter(r => r.status === 'pending');
    }
  }
});

export const { updateSettings, updateTemplate, scheduleReminder, updateReminderStatus, clearScheduled } = reminderSlice.actions;
export default reminderSlice.reducer;
