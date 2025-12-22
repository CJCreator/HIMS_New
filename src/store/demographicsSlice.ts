import { createSlice } from '@reduxjs/toolkit';

const demographicsSlice = createSlice({
  name: 'demographics',
  initialState: {
    ageDistribution: [
      { range: '0-18', count: 245, percentage: 18 },
      { range: '19-35', count: 420, percentage: 31 },
      { range: '36-50', count: 380, percentage: 28 },
      { range: '51-65', count: 215, percentage: 16 },
      { range: '65+', count: 95, percentage: 7 },
    ],
    genderDistribution: [
      { gender: 'Male', count: 645, percentage: 47 },
      { gender: 'Female', count: 710, percentage: 53 },
    ],
    visitFrequency: {
      regular: 520,
      occasional: 680,
      firstTime: 155,
    },
  },
  reducers: {},
});

export default demographicsSlice.reducer;
