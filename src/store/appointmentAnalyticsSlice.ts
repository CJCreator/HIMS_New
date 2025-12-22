import { createSlice } from '@reduxjs/toolkit';

const appointmentAnalyticsSlice = createSlice({
  name: 'appointmentAnalytics',
  initialState: {
    stats: {
      total: 1250,
      completed: 1050,
      noShows: 85,
      cancelled: 115,
      noShowRate: 6.8,
      avgWaitTime: 12,
    },
    peakHours: [
      { hour: '9 AM', count: 45 },
      { hour: '10 AM', count: 62 },
      { hour: '11 AM', count: 58 },
      { hour: '2 PM', count: 52 },
      { hour: '3 PM', count: 48 },
    ],
  },
  reducers: {},
});

export default appointmentAnalyticsSlice.reducer;
