import { createSlice } from '@reduxjs/toolkit';

const batchSlice = createSlice({
  name: 'batch',
  initialState: {
    batches: [
      { id: 'B001', medication: 'Amoxicillin 500mg', lotNumber: 'LOT2024A', mfgDate: '2023-12-01', expiry: '2025-12-01', qty: 500, status: 'active' },
      { id: 'B002', medication: 'Ibuprofen 200mg', lotNumber: 'LOT2024B', mfgDate: '2024-01-15', expiry: '2026-01-15', qty: 300, status: 'active' },
      { id: 'B003', medication: 'Aspirin 100mg', lotNumber: 'LOT2023C', mfgDate: '2023-10-01', expiry: '2024-03-01', qty: 150, status: 'recalled' },
    ],
    recalls: [
      { id: 'R001', batchId: 'B003', reason: 'Quality control issue', date: '2024-02-01', affectedQty: 150 },
    ],
  },
  reducers: {
    addBatch: (state, action) => {
      state.batches.unshift(action.payload);
    },
    recallBatch: (state, action) => {
      const batch = state.batches.find(b => b.id === action.payload.batchId);
      if (batch) batch.status = 'recalled';
      state.recalls.unshift(action.payload);
    },
  },
});

export const { addBatch, recallBatch } = batchSlice.actions;
export default batchSlice.reducer;
