import { createSlice } from '@reduxjs/toolkit';

const doctorAnalyticsSlice = createSlice({
  name: 'doctorAnalytics',
  initialState: {
    performance: {
      consultations: 245,
      avgRating: 4.7,
      patientSatisfaction: 92,
      revenue: 125000,
      prescriptions: 180,
    },
    monthlyData: [
      { month: 'Jan', consultations: 45, revenue: 22500 },
      { month: 'Feb', consultations: 52, revenue: 26000 },
      { month: 'Mar', consultations: 48, revenue: 24000 },
    ],
  },
  reducers: {},
});

export default doctorAnalyticsSlice.reducer;
