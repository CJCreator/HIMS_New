import { createSlice } from '@reduxjs/toolkit';

const reorderSlice = createSlice({
  name: 'reorder',
  initialState: {
    items: [
      { id: '1', medication: 'Amoxicillin 500mg', currentStock: 45, reorderPoint: 100, reorderQty: 500, supplier: 'MedSupply Co', status: 'low', lastOrdered: '2024-01-15' },
      { id: '2', medication: 'Ibuprofen 200mg', currentStock: 15, reorderPoint: 50, reorderQty: 300, supplier: 'PharmaDirect', status: 'critical', lastOrdered: '2024-01-20' },
      { id: '3', medication: 'Metformin 850mg', currentStock: 120, reorderPoint: 80, reorderQty: 400, supplier: 'MedSupply Co', status: 'ok', lastOrdered: '2024-02-01' },
    ],
    purchaseOrders: [
      { id: 'PO001', supplier: 'MedSupply Co', items: [{ medication: 'Amoxicillin 500mg', qty: 500 }], total: 2500, status: 'pending', date: '2024-02-10' },
    ],
    suppliers: [
      { id: 'S1', name: 'MedSupply Co', contact: '555-1001', email: 'orders@medsupply.com', rating: 4.5 },
      { id: 'S2', name: 'PharmaDirect', contact: '555-1002', email: 'sales@pharmadirect.com', rating: 4.2 },
    ],
  },
  reducers: {
    createPO: (state, action) => {
      state.purchaseOrders.unshift(action.payload);
    },
    updateStock: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.currentStock = action.payload.stock;
        item.status = action.payload.stock < item.reorderPoint ? (action.payload.stock < item.reorderPoint * 0.5 ? 'critical' : 'low') : 'ok';
      }
    },
  },
});

export const { createPO, updateStock } = reorderSlice.actions;
export default reorderSlice.reducer;
