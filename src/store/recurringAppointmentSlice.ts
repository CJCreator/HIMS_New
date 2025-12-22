import { createSlice } from '@reduxjs/toolkit';

interface RecurringSeries {
  id: string;
  patientName: string;
  doctor: string;
  type: string;
  pattern: string;
  startDate: string;
  endDate: string;
  time: string;
  occurrences: number;
  completed: number;
}

interface RecurringAppointment {
  id: string;
  seriesId: string;
  date: string;
  time: string;
  status: string;
}

interface RecurringAppointmentState {
  series: RecurringSeries[];
  appointments: RecurringAppointment[];
}

const recurringAppointmentSlice = createSlice({
  name: 'recurringAppointment',
  initialState: {
    series: [
      { 
        id: 'S1', 
        patientName: 'John Doe', 
        doctor: 'Dr. Smith', 
        type: 'Physical Therapy',
        pattern: 'weekly',
        startDate: '2024-02-01',
        endDate: '2024-05-01',
        time: '10:00',
        occurrences: 12,
        completed: 3,
      },
    ],
    appointments: [],
  } as RecurringAppointmentState,
  reducers: {
    createSeries: (state, action: { payload: RecurringSeries }) => {
      state.series.push(action.payload);
      // Generate individual appointments
      const { startDate, pattern, occurrences, time } = action.payload;
      const appointments: RecurringAppointment[] = [];
      let current = new Date(startDate);
      
      for (let i = 0; i < occurrences; i++) {
        appointments.push({
          id: `${action.payload.id}-${i}`,
          seriesId: action.payload.id,
          date: current.toISOString().split('T')[0],
          time,
          status: 'scheduled',
        });
        
        if (pattern === 'daily') current.setDate(current.getDate() + 1);
        else if (pattern === 'weekly') current.setDate(current.getDate() + 7);
        else if (pattern === 'biweekly') current.setDate(current.getDate() + 14);
        else if (pattern === 'monthly') current.setMonth(current.getMonth() + 1);
      }
      
      state.appointments.push(...appointments);
    },
    cancelSeries: (state, action: { payload: string }) => {
      state.series = state.series.filter(s => s.id !== action.payload);
      state.appointments = state.appointments.filter(a => a.seriesId !== action.payload);
    },
  },
});

export const { createSeries, cancelSeries } = recurringAppointmentSlice.actions;
export default recurringAppointmentSlice.reducer;
