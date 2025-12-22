import { createSlice } from '@reduxjs/toolkit';

interface HealthMetric {
  value: string | number;
  status: string;
  trend: string;
}

interface HealthActivity {
  type: string;
  date: string;
  description: string;
}

interface HealthSummaryState {
  metrics: Record<string, HealthMetric>;
  healthScore: number;
  recentActivity: HealthActivity[];
  recommendations: string[];
}

const healthSummarySlice = createSlice({
  name: 'healthSummary',
  initialState: {
    metrics: {
      bloodPressure: { value: '120/80', status: 'normal', trend: 'stable' },
      heartRate: { value: 72, status: 'normal', trend: 'stable' },
      weight: { value: 70, status: 'normal', trend: 'down' },
      glucose: { value: 95, status: 'normal', trend: 'stable' },
      cholesterol: { value: 180, status: 'normal', trend: 'down' },
    },
    healthScore: 85,
    recentActivity: [
      { type: 'appointment', date: '2024-02-10', description: 'Annual Checkup' },
      { type: 'lab', date: '2024-02-08', description: 'Blood Test Completed' },
      { type: 'prescription', date: '2024-02-05', description: 'Medication Refilled' },
    ],
    recommendations: [
      'Schedule your annual flu shot',
      'Blood pressure trending well - keep up the exercise',
      'Consider scheduling dental checkup',
    ],
  } as HealthSummaryState,
  reducers: {
    updateMetric: (state, action: { payload: { metric: string; value: string | number; status: string; trend: string } }) => {
      const { metric, value, status, trend } = action.payload;
      state.metrics[metric] = { value, status, trend };
    },
  },
});

export const { updateMetric } = healthSummarySlice.actions;
export default healthSummarySlice.reducer;
