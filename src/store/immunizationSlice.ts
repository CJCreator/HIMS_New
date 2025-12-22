import { createSlice } from '@reduxjs/toolkit';

const immunizationSlice = createSlice({
  name: 'immunization',
  initialState: {
    records: [
      { id: '1', vaccine: 'COVID-19 Booster', date: '2024-01-10', nextDue: '2024-07-10', status: 'completed', lot: 'CV2024A' },
      { id: '2', vaccine: 'Influenza', date: '2023-10-15', nextDue: '2024-10-15', status: 'completed', lot: 'FLU2023B' },
      { id: '3', vaccine: 'Tetanus', date: '2020-05-20', nextDue: '2030-05-20', status: 'completed', lot: 'TET2020C' },
      { id: '4', vaccine: 'Hepatitis B', date: null, nextDue: '2024-03-01', status: 'overdue', lot: null },
    ],
    inventory: [
      { vaccine: 'COVID-19', stock: 45, minStock: 20 },
      { vaccine: 'Influenza', stock: 120, minStock: 50 },
      { vaccine: 'Tetanus', stock: 30, minStock: 15 },
    ],
  },
  reducers: {
    addRecord: (state, action) => {
      state.records.unshift(action.payload);
    },
    updateStock: (state, action) => {
      const item = state.inventory.find(i => i.vaccine === action.payload.vaccine);
      if (item) item.stock = action.payload.stock;
    },
  },
});

export const { addRecord, updateStock } = immunizationSlice.actions;
export default immunizationSlice.reducer;
