import { createSlice } from '@reduxjs/toolkit';

const adherenceSlice = createSlice({
  name: 'adherence',
  initialState: {
    schedule: [
      { id: '1', medication: 'Metformin 850mg', time: '08:00', frequency: 'daily', taken: true, date: '2024-02-15' },
      { id: '2', medication: 'Lisinopril 10mg', time: '08:00', frequency: 'daily', taken: true, date: '2024-02-15' },
      { id: '3', medication: 'Metformin 850mg', time: '20:00', frequency: 'daily', taken: false, date: '2024-02-15' },
    ],
    adherenceRate: 87,
    streak: 12,
    missedDoses: 3,
  },
  reducers: {
    markTaken: (state, action) => {
      const dose = state.schedule.find(s => s.id === action.payload);
      if (dose) dose.taken = true;
    },
    addDose: (state, action) => {
      state.schedule.push(action.payload);
    },
  },
});

export const { markTaken, addDose } = adherenceSlice.actions;
export default adherenceSlice.reducer;
