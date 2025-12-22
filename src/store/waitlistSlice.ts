import { createSlice } from '@reduxjs/toolkit';

const waitlistSlice = createSlice({
  name: 'waitlist',
  initialState: {
    entries: [
      { id: '1', patientName: 'Sarah Johnson', phone: '555-0101', doctor: 'Dr. Smith', reason: 'Follow-up', priority: 'high', addedDate: '2024-02-01', preferredDates: ['2024-02-15', '2024-02-16'] },
      { id: '2', patientName: 'Mike Brown', phone: '555-0102', doctor: 'Dr. Johnson', reason: 'Consultation', priority: 'medium', addedDate: '2024-02-03', preferredDates: ['2024-02-20'] },
      { id: '3', patientName: 'Lisa Davis', phone: '555-0103', doctor: 'Dr. Smith', reason: 'Checkup', priority: 'low', addedDate: '2024-02-05', preferredDates: [] },
    ],
  },
  reducers: {
    addToWaitlist: (state, action) => {
      state.entries.unshift(action.payload);
    },
    removeFromWaitlist: (state, action) => {
      state.entries = state.entries.filter(e => e.id !== action.payload);
    },
    bookFromWaitlist: (state, action) => {
      state.entries = state.entries.filter(e => e.id !== action.payload);
    },
  },
});

export const { addToWaitlist, removeFromWaitlist, bookFromWaitlist } = waitlistSlice.actions;
export default waitlistSlice.reducer;
