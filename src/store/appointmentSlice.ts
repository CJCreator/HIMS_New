import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [
    {
      id: 'APT001',
      patientId: 'P001',
      patientName: 'John Smith',
      doctorId: 'D001',
      doctorName: 'Dr. Wilson',
      date: '2024-01-15',
      time: '10:00',
      type: 'Follow-up',
      status: 'in-progress',
      notes: 'Diabetes management review'
    },
    {
      id: 'APT002',
      patientId: 'P002',
      patientName: 'Sarah Johnson',
      doctorId: 'D002',
      doctorName: 'Dr. Brown',
      date: '2024-01-15',
      time: '11:00',
      type: 'Consultation',
      status: 'scheduled',
      notes: 'Asthma symptoms worsening'
    },
    {
      id: 'APT003',
      patientId: 'P003',
      patientName: 'Michael Chen',
      doctorId: 'D001',
      doctorName: 'Dr. Wilson',
      date: '2024-01-15',
      time: '14:00',
      type: 'Routine Checkup',
      status: 'confirmed'
    },
    {
      id: 'APT004',
      patientId: 'P004',
      patientName: 'Emily Rodriguez',
      doctorId: 'D003',
      doctorName: 'Dr. Martinez',
      date: '2024-01-15',
      time: '15:30',
      type: 'New Patient',
      status: 'scheduled'
    },
    {
      id: 'APT005',
      patientId: 'P005',
      patientName: 'David Williams',
      doctorId: 'D001',
      doctorName: 'Dr. Wilson',
      date: '2024-01-16',
      time: '09:00',
      type: 'Follow-up',
      status: 'scheduled',
      notes: 'COPD management'
    },
    {
      id: 'APT006',
      patientId: 'P001',
      patientName: 'John Smith',
      doctorId: 'D001',
      doctorName: 'Dr. Wilson',
      date: '2024-01-16',
      time: '10:30',
      type: 'Lab Results Review',
      status: 'scheduled'
    },
    {
      id: 'APT007',
      patientId: 'P002',
      patientName: 'Sarah Johnson',
      doctorId: 'D002',
      doctorName: 'Dr. Brown',
      date: '2024-01-16',
      time: '14:00',
      type: 'Follow-up',
      status: 'scheduled'
    }
  ],
  loading: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getAppointments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch appointments');
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData: Omit<Appointment, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createAppointment(appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create appointment');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Omit<Appointment, 'id'>>) => {
      const newAppointment: Appointment = {
        ...action.payload,
        id: `APT${String(state.appointments.length + 1).padStart(3, '0')}`,
      };
      state.appointments.push(newAppointment);
    },
    updateAppointmentStatus: (state, action: PayloadAction<{ id: string; status: Appointment['status'] }>) => {
      const { id, status } = action.payload;
      const appointment = state.appointments.find(a => a.id === id);
      if (appointment) {
        appointment.status = status;
      }
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      });
  },
});

export const { addAppointment, updateAppointmentStatus, updateAppointment, clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;