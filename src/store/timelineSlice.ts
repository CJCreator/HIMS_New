import { createSlice } from '@reduxjs/toolkit';

const timelineSlice = createSlice({
  name: 'timeline',
  initialState: {
    events: [
      { id: '1', type: 'appointment', date: '2024-01-15', title: 'General Checkup', doctor: 'Dr. Smith', status: 'completed' },
      { id: '2', type: 'prescription', date: '2024-01-15', title: 'Amoxicillin 500mg', doctor: 'Dr. Smith', status: 'active' },
      { id: '3', type: 'lab', date: '2024-01-20', title: 'Blood Test - Complete', result: 'Normal', status: 'completed' },
      { id: '4', type: 'appointment', date: '2024-02-01', title: 'Follow-up Visit', doctor: 'Dr. Johnson', status: 'completed' },
      { id: '5', type: 'lab', date: '2024-02-05', title: 'X-Ray - Chest', result: 'Normal', status: 'completed' },
    ],
  },
  reducers: {
    addEvent: (state, action) => {
      state.events.unshift(action.payload);
    },
  },
});

export const { addEvent } = timelineSlice.actions;
export default timelineSlice.reducer;
