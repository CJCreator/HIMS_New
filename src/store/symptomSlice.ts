import { createSlice } from '@reduxjs/toolkit';

const symptomSlice = createSlice({
  name: 'symptom',
  initialState: {
    history: [
      { id: '1', date: '2024-02-10', symptoms: ['Headache', 'Fever'], urgency: 'medium', recommendation: 'Monitor symptoms, rest and hydrate' },
      { id: '2', date: '2024-01-25', symptoms: ['Cough', 'Sore Throat'], urgency: 'low', recommendation: 'Over-the-counter remedies recommended' },
    ],
    symptomDatabase: {
      'Chest Pain': { urgency: 'high', category: 'cardiac' },
      'Severe Headache': { urgency: 'high', category: 'neurological' },
      'Fever': { urgency: 'medium', category: 'general' },
      'Headache': { urgency: 'low', category: 'general' },
      'Cough': { urgency: 'low', category: 'respiratory' },
      'Sore Throat': { urgency: 'low', category: 'respiratory' },
    },
  },
  reducers: {
    addSymptomCheck: (state, action) => {
      state.history.unshift(action.payload);
    },
  },
});

export const { addSymptomCheck } = symptomSlice.actions;
export default symptomSlice.reducer;
