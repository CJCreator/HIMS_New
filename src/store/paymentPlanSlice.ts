import { createSlice } from '@reduxjs/toolkit';

const paymentPlanSlice = createSlice({
  name: 'paymentPlan',
  initialState: {
    plans: [
      { id: 'PP001', patientName: 'John Doe', totalAmount: 5000, downPayment: 1000, installments: 4, monthlyAmount: 1000, startDate: '2024-02-01', status: 'active', paid: 2000 },
      { id: 'PP002', patientName: 'Jane Smith', totalAmount: 3000, downPayment: 500, installments: 5, monthlyAmount: 500, startDate: '2024-01-15', status: 'active', paid: 1500 },
    ],
    payments: [
      { id: 'PAY001', planId: 'PP001', amount: 1000, date: '2024-02-01', method: 'card', status: 'completed' },
      { id: 'PAY002', planId: 'PP001', amount: 1000, date: '2024-03-01', method: 'card', status: 'completed' },
    ],
  },
  reducers: {
    createPlan: (state, action) => {
      state.plans.unshift(action.payload);
    },
    recordPayment: (state, action) => {
      state.payments.unshift(action.payload);
      const plan = state.plans.find(p => p.id === action.payload.planId);
      if (plan) {
        plan.paid += action.payload.amount;
        if (plan.paid >= plan.totalAmount) plan.status = 'completed';
      }
    },
  },
});

export const { createPlan, recordPayment } = paymentPlanSlice.actions;
export default paymentPlanSlice.reducer;
