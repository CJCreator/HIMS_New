// Type augmentations for fixing build errors

declare module '@/store/labResultsSlice' {
  export function verifyLabResult(id: string): any;
  export function rejectLabResult(id: string, reason: string): any;
}

declare module '@/store/appointmentSlice' {
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
    updates?: Partial<Appointment>;
  }
}
