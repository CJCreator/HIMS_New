import { createSlice } from '@reduxjs/toolkit';

const revenueSlice = createSlice({
  name: 'revenue',
  initialState: {
    summary: {
      daily: 8500,
      monthly: 185000,
      outstanding: 42000,
      collected: 143000,
    },
    paymentMethods: [
      { method: 'Cash', amount: 45000, percentage: 24 },
      { method: 'Card', amount: 78000, percentage: 42 },
      { method: 'Insurance', amount: 52000, percentage: 28 },
      { method: 'Other', amount: 10000, percentage: 6 },
    ],
  },
  reducers: {},
});

export default revenueSlice.reducer;
