import { createSlice } from '@reduxjs/toolkit';

const inventoryAnalyticsSlice = createSlice({
  name: 'inventoryAnalytics',
  initialState: {
    metrics: {
      turnoverRate: 8.5,
      expiryWaste: 12500,
      stockValue: 285000,
      reorderOptimization: 92,
    },
    topMovers: [
      { item: 'Paracetamol 500mg', units: 2500, value: 12500 },
      { item: 'Amoxicillin 500mg', units: 1800, value: 18000 },
      { item: 'Ibuprofen 200mg', units: 1500, value: 9000 },
    ],
  },
  reducers: {},
});

export default inventoryAnalyticsSlice.reducer;
