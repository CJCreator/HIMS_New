import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string;
  type: 'drug' | 'food' | 'environmental' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  onsetDate?: string;
  notes?: string;
  addedBy: string;
  addedAt: string;
}

interface AllergyState {
  allergies: Allergy[];
}

const mockAllergies: Allergy[] = [
  {
    id: 'ALG001',
    patientId: 'P001',
    allergen: 'Penicillin',
    type: 'drug',
    severity: 'severe',
    reaction: 'Anaphylaxis, difficulty breathing',
    onsetDate: '2020-05-15',
    notes: 'Avoid all penicillin-based antibiotics',
    addedBy: 'Dr. Wilson',
    addedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'ALG002',
    patientId: 'P001',
    allergen: 'Aspirin',
    type: 'drug',
    severity: 'moderate',
    reaction: 'Skin rash, itching',
    addedBy: 'Dr. Brown',
    addedAt: '2024-01-12T14:30:00Z'
  }
];

const initialState: AllergyState = {
  allergies: mockAllergies
};

const allergySlice = createSlice({
  name: 'allergies',
  initialState,
  reducers: {
    addAllergy: (state, action: PayloadAction<Omit<Allergy, 'id' | 'addedAt'>>) => {
      const newAllergy: Allergy = {
        ...action.payload,
        id: `ALG${String(state.allergies.length + 1).padStart(3, '0')}`,
        addedAt: new Date().toISOString()
      };
      state.allergies.unshift(newAllergy);
    },
    removeAllergy: (state, action: PayloadAction<string>) => {
      state.allergies = state.allergies.filter(a => a.id !== action.payload);
    },
    updateAllergy: (state, action: PayloadAction<Allergy>) => {
      const index = state.allergies.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.allergies[index] = action.payload;
      }
    }
  }
});

export const { addAllergy, removeAllergy, updateAllergy } = allergySlice.actions;
export default allergySlice.reducer;
