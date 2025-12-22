import { createSlice } from '@reduxjs/toolkit';

const insuranceSlice = createSlice({
  name: 'insurance',
  initialState: {
    claims: [
      { id: 'CLM001', patientName: 'John Doe', provider: 'Blue Cross', amount: 2500, status: 'pending', date: '2024-02-10', service: 'Surgery' },
      { id: 'CLM002', patientName: 'Jane Smith', provider: 'Aetna', amount: 850, status: 'approved', date: '2024-02-08', service: 'Consultation' },
      { id: 'CLM003', patientName: 'Bob Johnson', provider: 'Cigna', amount: 1200, status: 'rejected', date: '2024-02-05', service: 'Lab Tests', reason: 'Pre-authorization required' },
    ],
  },
  reducers: {
    submitClaim: (state, action) => {
      state.claims.unshift(action.payload);
    },
    updateStatus: (state, action) => {
      const claim = state.claims.find(c => c.id === action.payload.id);
      if (claim) {
        claim.status = action.payload.status;
        if (action.payload.reason) claim.reason = action.payload.reason;
      }
    },
  },
});

export const { submitClaim, updateStatus } = insuranceSlice.actions;
export default insuranceSlice.reducer;
