import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LabTest {
  id: string;
  name: string;
  category: string;
  normalRange?: string;
  unit?: string;
}

interface LabOrder {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  orderDate: string;
  tests: LabTest[];
  priority: 'routine' | 'urgent' | 'stat';
  status: 'ordered' | 'collected' | 'processing' | 'completed';
  notes?: string;
  results?: { [testId: string]: { value: string; status: 'normal' | 'abnormal' | 'critical' } };
  completedDate?: string;
}

interface LabState {
  orders: LabOrder[];
  availableTests: LabTest[];
  loading: boolean;
  error: string | null;
}

const availableTests: LabTest[] = [
  { id: 'CBC', name: 'Complete Blood Count', category: 'Hematology', normalRange: '4.5-11.0', unit: '×10³/μL' },
  { id: 'BMP', name: 'Basic Metabolic Panel', category: 'Chemistry' },
  { id: 'LFT', name: 'Liver Function Tests', category: 'Chemistry' },
  { id: 'TSH', name: 'Thyroid Stimulating Hormone', category: 'Endocrinology', normalRange: '0.4-4.0', unit: 'mIU/L' },
  { id: 'HbA1c', name: 'Hemoglobin A1c', category: 'Chemistry', normalRange: '<7.0', unit: '%' },
  { id: 'UA', name: 'Urinalysis', category: 'Urinalysis' },
  { id: 'PT', name: 'Prothrombin Time', category: 'Coagulation', normalRange: '11-13', unit: 'seconds' },
  { id: 'ESR', name: 'Erythrocyte Sedimentation Rate', category: 'Hematology', normalRange: '<20', unit: 'mm/hr' }
];

const initialState: LabState = {
  orders: [
    {
      id: 'LAB001',
      patientName: 'John Smith',
      patientId: 'P001',
      doctorName: 'Dr. Wilson',
      orderDate: '2024-01-15 14:30',
      priority: 'routine',
      status: 'ordered',
      tests: [
        { id: 'CBC', name: 'Complete Blood Count', category: 'Hematology' },
        { id: 'BMP', name: 'Basic Metabolic Panel', category: 'Chemistry' }
      ],
      notes: 'Patient presenting with fatigue and weakness'
    },
    {
      id: 'LAB002',
      patientName: 'Sarah Johnson',
      patientId: 'P002',
      doctorName: 'Dr. Brown',
      orderDate: '2024-01-15 13:00',
      priority: 'urgent',
      status: 'collected',
      tests: [
        { id: 'HbA1c', name: 'Hemoglobin A1c', category: 'Chemistry' }
      ],
      notes: 'Diabetes monitoring'
    },
    {
      id: 'LAB003',
      patientName: 'Michael Chen',
      patientId: 'P003',
      doctorName: 'Dr. Wilson',
      orderDate: '2024-01-15 10:15',
      priority: 'routine',
      status: 'processing',
      tests: [
        { id: 'LFT', name: 'Liver Function Tests', category: 'Chemistry' },
        { id: 'PT', name: 'Prothrombin Time', category: 'Coagulation' }
      ]
    },
    {
      id: 'LAB004',
      patientName: 'David Williams',
      patientId: 'P005',
      doctorName: 'Dr. Wilson',
      orderDate: '2024-01-14 16:00',
      priority: 'stat',
      status: 'completed',
      tests: [
        { id: 'CBC', name: 'Complete Blood Count', category: 'Hematology' },
        { id: 'ESR', name: 'Erythrocyte Sedimentation Rate', category: 'Hematology' }
      ],
      results: {
        'CBC': { value: '8.5 ×10³/μL', status: 'normal' },
        'ESR': { value: '15 mm/hr', status: 'normal' }
      },
      completedDate: '2024-01-15 09:00'
    },
    {
      id: 'LAB005',
      patientName: 'Emily Rodriguez',
      patientId: 'P004',
      doctorName: 'Dr. Martinez',
      orderDate: '2024-01-15 11:30',
      priority: 'routine',
      status: 'ordered',
      tests: [
        { id: 'TSH', name: 'Thyroid Stimulating Hormone', category: 'Endocrinology' },
        { id: 'UA', name: 'Urinalysis', category: 'Urinalysis' }
      ]
    }
  ],
  availableTests,
  loading: false,
  error: null,
};

const labSlice = createSlice({
  name: 'lab',
  initialState,
  reducers: {
    addLabOrder: (state, action: PayloadAction<Omit<LabOrder, 'id' | 'status' | 'orderDate'>>) => {
      const newOrder: LabOrder = {
        ...action.payload,
        id: `LAB${String(state.orders.length + 1).padStart(3, '0')}`,
        status: 'ordered',
        orderDate: new Date().toISOString(),
      };
      state.orders.unshift(newOrder);
    },
    updateLabOrderStatus: (state, action: PayloadAction<{ id: string; status: LabOrder['status']; completedDate?: string }>) => {
      const { id, status, completedDate } = action.payload;
      const order = state.orders.find(o => o.id === id);
      if (order) {
        order.status = status;
        if (completedDate) {
          order.completedDate = completedDate;
        }
      }
    },
    addLabResults: (state, action: PayloadAction<{ orderId: string; results: LabOrder['results'] }>) => {
      const { orderId, results } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.results = results;
        order.status = 'completed';
        order.completedDate = new Date().toISOString();
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
  addLabOrder, 
  updateLabOrderStatus, 
  addLabResults,
  setLoading, 
  setError 
} = labSlice.actions;

export default labSlice.reducer;