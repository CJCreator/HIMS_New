import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  prescriptionDate: string;
  date?: string; // Alias for prescriptionDate
  medications: {
    name: string;
    dosage: string;
    quantity: number;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'processing' | 'ready' | 'dispensed';
  notes?: string;
  processedBy?: string;
  processedTime?: string;
  refillsRemaining?: number;
  refillRequested?: boolean;
  refillRequestDate?: string;
}

interface PrescriptionState {
  prescriptions: Prescription[];
  loading: boolean;
  error: string | null;
  draft?: Partial<Prescription>;
}

const initialState: PrescriptionState = {
  prescriptions: [
    {
      id: 'RX001',
      patientName: 'John Smith',
      patientId: 'P001',
      doctorName: 'Dr. Wilson',
      prescriptionDate: '2024-01-15 14:30',
      priority: 'high',
      status: 'pending',
      medications: [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          quantity: 20,
          frequency: 'Every 6 hours',
          duration: '5 days',
          instructions: 'Take with food'
        },
        {
          name: 'Amoxicillin',
          dosage: '250mg',
          quantity: 21,
          frequency: 'Three times daily',
          duration: '7 days'
        }
      ],
      notes: 'Patient has fever and infection'
    },
    {
      id: 'RX002',
      patientName: 'Sarah Johnson',
      patientId: 'P002',
      doctorName: 'Dr. Brown',
      prescriptionDate: '2024-01-15 13:15',
      priority: 'medium',
      status: 'processing',
      medications: [
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          quantity: 10,
          frequency: 'Twice daily',
          duration: '3 days'
        }
      ]
    },
    {
      id: 'RX003',
      patientName: 'Michael Chen',
      patientId: 'P003',
      doctorName: 'Dr. Wilson',
      prescriptionDate: '2024-01-15 11:00',
      priority: 'low',
      status: 'ready',
      medications: [
        {
          name: 'Atorvastatin',
          dosage: '20mg',
          quantity: 30,
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take at bedtime'
        }
      ],
      processedBy: 'Pharmacist John',
      processedTime: '2024-01-15 12:00'
    },
    {
      id: 'RX004',
      patientName: 'Emily Rodriguez',
      patientId: 'P004',
      doctorName: 'Dr. Martinez',
      prescriptionDate: '2024-01-14 16:45',
      priority: 'medium',
      status: 'dispensed',
      medications: [
        {
          name: 'Cetirizine',
          dosage: '10mg',
          quantity: 14,
          frequency: 'Once daily',
          duration: '14 days'
        }
      ],
      processedBy: 'Pharmacist John',
      processedTime: '2024-01-15 09:00'
    },
    {
      id: 'RX005',
      patientName: 'David Williams',
      patientId: 'P005',
      doctorName: 'Dr. Wilson',
      prescriptionDate: '2024-01-15 10:20',
      priority: 'high',
      status: 'pending',
      medications: [
        {
          name: 'Spiriva',
          dosage: '18mcg',
          quantity: 30,
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Use inhaler as directed'
        },
        {
          name: 'Prednisone',
          dosage: '10mg',
          quantity: 10,
          frequency: 'Once daily',
          duration: '10 days',
          instructions: 'Take with food'
        }
      ],
      notes: 'COPD exacerbation'
    }
  ],
  loading: false,
  error: null,
  draft: undefined,
};

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    addPrescription: (state, action: PayloadAction<Omit<Prescription, 'id' | 'status' | 'prescriptionDate'>>) => {
      const newPrescription: Prescription = {
        ...action.payload,
        id: `RX${String(state.prescriptions.length + 1).padStart(3, '0')}`,
        status: 'pending',
        prescriptionDate: new Date().toISOString(),
      };
      state.prescriptions.unshift(newPrescription);
    },
    updatePrescriptionStatus: (state, action: PayloadAction<{ id: string; status: Prescription['status']; processedBy?: string }>) => {
      const { id, status, processedBy } = action.payload;
      const prescription = state.prescriptions.find(p => p.id === id);
      if (prescription) {
        prescription.status = status;
        if (processedBy) {
          prescription.processedBy = processedBy;
          prescription.processedTime = new Date().toISOString();
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    requestRefill: (state, action: PayloadAction<string>) => {
      const prescription = state.prescriptions.find(p => p.id === action.payload);
      if (prescription) {
        prescription.refillRequested = true;
        prescription.refillRequestDate = new Date().toISOString();
      }
    },
    approveRefill: (state, action: PayloadAction<string>) => {
      const prescription = state.prescriptions.find(p => p.id === action.payload);
      if (prescription && prescription.refillsRemaining && prescription.refillsRemaining > 0) {
        prescription.refillsRemaining -= 1;
        prescription.refillRequested = false;
        prescription.status = 'pending';
      }
    },
  },
});

export const { 
  addPrescription, 
  updatePrescriptionStatus, 
  setLoading, 
  setError,
  requestRefill,
  approveRefill
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;