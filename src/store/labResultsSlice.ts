import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  testCode: string;
  value: number;
  unit: string;
  normalMin: number;
  normalMax: number;
  status: 'normal' | 'abnormal' | 'critical';
  orderedBy: string;
  performedAt: string;
  resultDate: string;
  notes?: string;
  category: 'hematology' | 'biochemistry' | 'microbiology' | 'pathology' | 'radiology';
}

export interface LabResultGroup {
  id: string;
  patientId: string;
  orderDate: string;
  results: LabResult[];
  status: 'pending' | 'completed' | 'reviewed';
  orderedBy: string;
}

interface LabResultsState {
  results: LabResult[];
  groups: LabResultGroup[];
  selectedResult: LabResult | null;
}

const mockResults: LabResult[] = [
  {
    id: '1',
    patientId: 'P001',
    testName: 'Hemoglobin',
    testCode: 'HGB',
    value: 14.5,
    unit: 'g/dL',
    normalMin: 13.5,
    normalMax: 17.5,
    status: 'normal',
    orderedBy: 'Dr. Wilson',
    performedAt: '2024-01-15T10:00:00',
    resultDate: '2024-01-15T14:00:00',
    category: 'hematology'
  },
  {
    id: '2',
    patientId: 'P001',
    testName: 'Blood Glucose',
    testCode: 'GLU',
    value: 145,
    unit: 'mg/dL',
    normalMin: 70,
    normalMax: 100,
    status: 'abnormal',
    orderedBy: 'Dr. Wilson',
    performedAt: '2024-01-15T10:00:00',
    resultDate: '2024-01-15T14:00:00',
    notes: 'Fasting glucose elevated',
    category: 'biochemistry'
  }
];

const initialState: LabResultsState = {
  results: mockResults,
  groups: [],
  selectedResult: null
};

const labResultsSlice = createSlice({
  name: 'labResults',
  initialState,
  reducers: {
    addLabResult: (state, action: PayloadAction<LabResult>) => {
      state.results.push(action.payload);
    },
    updateLabResult: (state, action: PayloadAction<LabResult>) => {
      const index = state.results.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.results[index] = action.payload;
      }
    },
    selectResult: (state, action: PayloadAction<LabResult | null>) => {
      state.selectedResult = action.payload;
    },
    addResultGroup: (state, action: PayloadAction<LabResultGroup>) => {
      state.groups.push(action.payload);
    }
  }
});

export const { addLabResult, updateLabResult, selectResult, addResultGroup } = labResultsSlice.actions;
export default labResultsSlice.reducer;
