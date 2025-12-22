import { createSlice } from '@reduxjs/toolkit';

const problemListSlice = createSlice({
  name: 'problemList',
  initialState: {
    problems: [
      { id: '1', name: 'Hypertension', icd10: 'I10', status: 'active', onset: '2023-05-10', notes: 'Stage 1, controlled with medication' },
      { id: '2', name: 'Type 2 Diabetes', icd10: 'E11.9', status: 'active', onset: '2022-11-20', notes: 'HbA1c 6.8%, diet controlled' },
      { id: '3', name: 'Seasonal Allergies', icd10: 'J30.1', status: 'active', onset: '2020-03-15', notes: 'Spring pollen allergy' },
      { id: '4', name: 'Acute Bronchitis', icd10: 'J20.9', status: 'resolved', onset: '2023-12-01', resolved: '2023-12-15', notes: 'Treated with antibiotics' },
    ],
  },
  reducers: {
    addProblem: (state, action) => {
      state.problems.unshift(action.payload);
    },
    updateStatus: (state, action) => {
      const problem = state.problems.find(p => p.id === action.payload.id);
      if (problem) {
        problem.status = action.payload.status;
        if (action.payload.status === 'resolved') problem.resolved = new Date().toISOString().split('T')[0];
      }
    },
  },
});

export const { addProblem, updateStatus } = problemListSlice.actions;
export default problemListSlice.reducer;
