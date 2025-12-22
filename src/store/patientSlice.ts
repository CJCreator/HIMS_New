import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
    respiratoryRate: number;
    painLevel: number;
    recordedAt: string;
    recordedBy: string;
  };
}

interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      phone: '+1-555-0101',
      email: 'john.smith@email.com',
      address: '123 Main St, New York, NY 10001',
      emergencyContact: '+1-555-0102 (Jane Smith - Wife)',
      medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
      currentMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
      allergies: ['Penicillin'],
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        oxygenSaturation: 98,
        respiratoryRate: 16,
        painLevel: 2,
        recordedAt: '2024-01-15 09:45',
        recordedBy: 'Nurse Sarah'
      }
    },
    {
      id: 'P002',
      name: 'Sarah Johnson',
      age: 32,
      gender: 'Female',
      phone: '+1-555-0201',
      email: 'sarah.j@email.com',
      address: '456 Oak Ave, Brooklyn, NY 11201',
      emergencyContact: '+1-555-0202 (Mike Johnson - Husband)',
      medicalHistory: ['Asthma'],
      currentMedications: ['Albuterol Inhaler'],
      allergies: ['Latex', 'Shellfish'],
      vitals: {
        bloodPressure: '118/75',
        heartRate: 68,
        temperature: 98.4,
        oxygenSaturation: 99,
        respiratoryRate: 14,
        painLevel: 0,
        recordedAt: '2024-01-15 10:15',
        recordedBy: 'Nurse Sarah'
      }
    },
    {
      id: 'P003',
      name: 'Michael Chen',
      age: 58,
      gender: 'Male',
      phone: '+1-555-0301',
      email: 'm.chen@email.com',
      address: '789 Park Blvd, Queens, NY 11375',
      emergencyContact: '+1-555-0302 (Lisa Chen - Daughter)',
      medicalHistory: ['High Cholesterol', 'Arthritis'],
      currentMedications: ['Atorvastatin 20mg', 'Ibuprofen 400mg'],
      allergies: [],
    },
    {
      id: 'P004',
      name: 'Emily Rodriguez',
      age: 28,
      gender: 'Female',
      phone: '+1-555-0401',
      email: 'emily.r@email.com',
      address: '321 Elm St, Manhattan, NY 10002',
      emergencyContact: '+1-555-0402 (Carlos Rodriguez - Brother)',
      medicalHistory: [],
      currentMedications: [],
      allergies: ['Pollen'],
    },
    {
      id: 'P005',
      name: 'David Williams',
      age: 67,
      gender: 'Male',
      phone: '+1-555-0501',
      email: 'd.williams@email.com',
      address: '654 Pine St, Bronx, NY 10451',
      emergencyContact: '+1-555-0502 (Mary Williams - Wife)',
      medicalHistory: ['COPD', 'Hypertension', 'Previous MI'],
      currentMedications: ['Spiriva', 'Aspirin 81mg', 'Metoprolol 50mg'],
      allergies: ['Sulfa drugs'],
    }
  ],
  selectedPatient: null,
  loading: false,
  error: null,
};

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPatients();
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch patients');
    }
  }
);

export const fetchPatient = createAsyncThunk(
  'patients/fetchPatient',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiService.getPatient(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch patient');
    }
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData: Omit<Patient, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createPatient(patientData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create patient');
    }
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    addPatient: (state, action: PayloadAction<Omit<Patient, 'id'>>) => {
      const newPatient: Patient = {
        ...action.payload,
        id: `P${String(state.patients.length + 1).padStart(3, '0')}`,
      };
      state.patients.push(newPatient);
    },
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
      state.selectedPatient = action.payload;
    },
    updatePatientVitals: (state, action: PayloadAction<{ patientId: string; vitals: any }>) => {
      const { patientId, vitals } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);
      if (patient) {
        patient.vitals = vitals;
      }
      if (state.selectedPatient?.id === patientId) {
        state.selectedPatient.vitals = vitals;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.selectedPatient = action.payload;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload);
      });
  },
});

export const { addPatient, setSelectedPatient, updatePatientVitals, clearError } = patientSlice.actions;
export default patientSlice.reducer;