// Test data factories for generating mock data

export const createMockPatient = (overrides = {}) => ({
  id: 'P001',
  name: 'John Doe',
  age: 45,
  gender: 'Male',
  phone: '+1-555-0101',
  email: 'john.doe@email.com',
  address: '123 Main St, New York, NY 10001',
  emergencyContact: '+1-555-0102 (Jane Doe - Wife)',
  medicalHistory: ['Hypertension'],
  currentMedications: ['Lisinopril 10mg'],
  allergies: ['Penicillin'],
  ...overrides,
});

export const createMockAppointment = (overrides = {}) => ({
  id: 'A001',
  patientId: 'P001',
  patientName: 'John Doe',
  doctorId: 'D001',
  doctorName: 'Dr. Wilson',
  date: '2024-01-15',
  time: '09:00',
  status: 'scheduled',
  type: 'consultation',
  ...overrides,
});

export const createMockPrescription = (overrides = {}) => ({
  id: 'RX001',
  patientId: 'P001',
  patientName: 'John Doe',
  doctorId: 'D001',
  doctorName: 'Dr. Wilson',
  medications: [
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }
  ],
  date: '2024-01-15',
  status: 'pending',
  ...overrides,
});

export const createMockVitals = (overrides = {}) => ({
  bloodPressure: '120/80',
  heartRate: 72,
  temperature: 98.6,
  oxygenSaturation: 98,
  respiratoryRate: 16,
  painLevel: 2,
  recordedAt: '2024-01-15 09:45',
  recordedBy: 'Nurse Sarah',
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'U001',
  email: 'doctor@hospital.com',
  name: 'Dr. Wilson',
  role: 'doctor',
  ...overrides,
});

export const createMockNotification = (overrides = {}) => ({
  id: 'N001',
  type: 'info',
  title: 'New Patient',
  message: 'Patient John Doe has checked in',
  timestamp: new Date().toISOString(),
  read: false,
  ...overrides,
});

// Batch creation helpers
export const createMockPatients = (count: number) => {
  return Array.from({ length: count }, (_, i) => 
    createMockPatient({
      id: `P${String(i + 1).padStart(3, '0')}`,
      name: `Patient ${i + 1}`,
      age: 30 + (i % 50),
    })
  );
};

export const createMockAppointments = (count: number) => {
  return Array.from({ length: count }, (_, i) => 
    createMockAppointment({
      id: `A${String(i + 1).padStart(3, '0')}`,
      time: `${9 + i}:00`,
    })
  );
};
