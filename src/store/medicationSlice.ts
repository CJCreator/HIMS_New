import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MedicationRequest {
  id: string;
  patientName: string;
  patientId: string;
  roomNumber: string;
  medication: string;
  dosage: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'request' | 'pending' | 'sent' | 'dispatched' | 'received' | 'delivered';
  requestedBy: string;
  requestTime: string;
  notes?: string;
  processedBy?: string;
  processedTime?: string;
}

interface MedicationState {
  requests: MedicationRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicationState = {
  requests: [
    {
      id: 'MR001',
      patientName: 'John Smith',
      patientId: 'P001',
      roomNumber: 'A-101',
      medication: 'Paracetamol',
      dosage: '500mg',
      quantity: 10,
      urgency: 'medium',
      status: 'dispatched',
      requestedBy: 'Nurse Sarah',
      requestTime: '2024-01-15 14:30',
      notes: 'Patient experiencing fever',
      processedBy: 'Pharmacist John',
      processedTime: '2024-01-15 15:00'
    },
    {
      id: 'MR002',
      patientName: 'Sarah Johnson',
      patientId: 'P002',
      roomNumber: 'B-205',
      medication: 'Amoxicillin',
      dosage: '250mg',
      quantity: 21,
      urgency: 'high',
      status: 'sent',
      requestedBy: 'Nurse Sarah',
      requestTime: '2024-01-15 13:15',
      processedBy: 'Pharmacist John',
      processedTime: '2024-01-15 14:00'
    },
    {
      id: 'MR003',
      patientName: 'Michael Chen',
      patientId: 'P003',
      roomNumber: 'C-310',
      medication: 'Morphine',
      dosage: '10mg',
      quantity: 5,
      urgency: 'high',
      status: 'pending',
      requestedBy: 'Nurse Maria',
      requestTime: '2024-01-15 15:45',
      notes: 'Post-operative pain management'
    },
    {
      id: 'MR004',
      patientName: 'David Williams',
      patientId: 'P005',
      roomNumber: 'ICU-02',
      medication: 'Insulin',
      dosage: '10 units',
      quantity: 1,
      urgency: 'high',
      status: 'request',
      requestedBy: 'Nurse Tom',
      requestTime: '2024-01-15 16:00',
      notes: 'Blood sugar 250 mg/dL'
    }
  ],
  loading: false,
  error: null,
};

const medicationSlice = createSlice({
  name: 'medication',
  initialState,
  reducers: {
    addMedicationRequest: (state, action: PayloadAction<Omit<MedicationRequest, 'id' | 'status' | 'requestTime'>>) => {
      const newRequest: MedicationRequest = {
        ...action.payload,
        id: `MR${String(state.requests.length + 1).padStart(3, '0')}`,
        status: 'request',
        requestTime: new Date().toISOString(),
      };
      state.requests.unshift(newRequest);
    },
    updateMedicationStatus: (state, action: PayloadAction<{ id: string; status: MedicationRequest['status']; processedBy?: string }>) => {
      const { id, status, processedBy } = action.payload;
      const request = state.requests.find(r => r.id === id);
      if (request) {
        request.status = status;
        if (processedBy) {
          request.processedBy = processedBy;
          request.processedTime = new Date().toISOString();
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  addMedicationRequest, 
  updateMedicationStatus, 
  setLoading, 
  setError 
} = medicationSlice.actions;

export default medicationSlice.reducer;