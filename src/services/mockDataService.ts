// Mock Data Service - localStorage-based data management
const STORAGE_KEYS = {
  PATIENTS: 'hims_patients',
  CONSULTATIONS: 'hims_consultations',
  NOTIFICATIONS: 'hims_notifications',
  VITALS: 'hims_vitals',
  PRESCRIPTIONS: 'hims_prescriptions'
};

// Initialize mock data
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(mockPatients));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VITALS)) {
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(mockVitals));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(mockPrescriptions));
  }
};

// Mock Patients Data
const mockPatients = [
  { id: 'P001', name: 'John Smith', age: 45, gender: 'Male', status: 'in-progress', currentStage: 'Consultation', assignedDoctor: 'Dr. Wilson', waitTime: 5, priority: 'normal', allergies: ['Penicillin'], medications: ['Metformin 500mg'] },
  { id: 'P002', name: 'Sarah Johnson', age: 32, gender: 'Female', status: 'waiting', currentStage: 'Vitals Recording', assignedDoctor: 'Dr. Brown', waitTime: 12, priority: 'urgent', allergies: ['Sulfa drugs'], medications: ['Lisinopril 10mg'] },
  { id: 'P003', name: 'Mike Davis', age: 58, gender: 'Male', status: 'waiting', currentStage: 'Pharmacy', assignedDoctor: 'Dr. Wilson', waitTime: 8, priority: 'normal', allergies: [], medications: [] },
  { id: 'P004', name: 'Emily Chen', age: 28, gender: 'Female', status: 'ready', currentStage: 'Check-in', assignedDoctor: 'Dr. Brown', waitTime: 2, priority: 'critical', allergies: ['Aspirin'], medications: [] },
  { id: 'P005', name: 'Robert Taylor', age: 65, gender: 'Male', status: 'in-progress', currentStage: 'Lab Tests', assignedDoctor: 'Dr. Wilson', waitTime: 15, priority: 'normal', allergies: [], medications: ['Atorvastatin 20mg'] },
  { id: 'P006', name: 'Lisa Anderson', age: 41, gender: 'Female', status: 'ready', currentStage: 'Waiting Room', assignedDoctor: 'Dr. Brown', waitTime: 3, priority: 'normal', allergies: ['Latex'], medications: [] },
  { id: 'P007', name: 'David Martinez', age: 52, gender: 'Male', status: 'waiting', currentStage: 'Billing', assignedDoctor: 'Dr. Wilson', waitTime: 6, priority: 'normal', allergies: [], medications: ['Metoprolol 50mg'] },
  { id: 'P008', name: 'Jennifer White', age: 36, gender: 'Female', status: 'in-progress', currentStage: 'Consultation', assignedDoctor: 'Dr. Brown', waitTime: 10, priority: 'urgent', allergies: ['Iodine'], medications: [] }
];

// Mock Notifications
const mockNotifications = [
  { id: 'N001', type: 'urgent', fromRole: 'Nurse', toRole: 'Doctor', title: 'Patient Ready', message: 'John Smith (P001) vitals complete - BP: 120/80, HR: 72', patientId: 'P001', patientName: 'John Smith', timestamp: Date.now() - 120000, priority: 'high', read: false },
  { id: 'N002', type: 'info', fromRole: 'Doctor', toRole: 'Pharmacy', title: 'Prescription Ready', message: 'Prescription ready for Sarah Johnson - 2 medications', patientId: 'P002', patientName: 'Sarah Johnson', timestamp: Date.now() - 300000, priority: 'medium', read: false },
  { id: 'N003', type: 'warning', fromRole: 'Lab', toRole: 'Doctor', title: 'Critical Results', message: 'Critical results for Michael Chen - HbA1c: 12.5%', patientId: 'P003', patientName: 'Michael Chen', timestamp: Date.now() - 60000, priority: 'urgent', read: false },
  { id: 'N004', type: 'success', fromRole: 'Doctor', toRole: 'Receptionist', title: 'Consultation Complete', message: 'Consultation complete for Jane Doe', patientId: 'P004', patientName: 'Jane Doe', timestamp: Date.now() - 600000, priority: 'medium', read: true }
];

// Mock Vitals
const mockVitals = [
  { patientId: 'P001', bp: '120/80', hr: 72, temp: 98.6, o2: 98, weight: 180, height: 70, recordedBy: 'Nurse Sarah', timestamp: Date.now() - 300000 },
  { patientId: 'P002', bp: '140/90', hr: 88, temp: 99.2, o2: 96, weight: 145, height: 65, recordedBy: 'Nurse Sarah', timestamp: Date.now() - 720000 },
  { patientId: 'P004', bp: '110/70', hr: 65, temp: 98.4, o2: 99, weight: 125, height: 64, recordedBy: 'Nurse John', timestamp: Date.now() - 180000 }
];

// Mock Prescriptions
const mockPrescriptions = [
  { id: 'RX001', patientId: 'P001', patientName: 'John Smith', doctor: 'Dr. Wilson', medications: [{ name: 'Metformin 500mg', dosage: '1 tablet', frequency: 'Twice daily' }], status: 'pending', priority: 'normal', timestamp: Date.now() - 600000 },
  { id: 'RX002', patientId: 'P002', patientName: 'Sarah Johnson', doctor: 'Dr. Brown', medications: [{ name: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily' }, { name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: 'Once daily' }], status: 'processing', priority: 'high', timestamp: Date.now() - 300000 }
];

// CRUD Operations
export const mockDataService = {
  // Initialize
  init: () => {
    initializeMockData();
  },

  // Patients
  getPatients: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : mockPatients;
  },

  getPatient: (id: string) => {
    const patients = mockDataService.getPatients();
    return patients.find((p: any) => p.id === id);
  },

  updatePatient: (id: string, updates: any) => {
    const patients = mockDataService.getPatients();
    const index = patients.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    }
    return patients[index];
  },

  updatePatientStatus: (id: string, status: string, stage: string) => {
    return mockDataService.updatePatient(id, { status, currentStage: stage });
  },

  // Notifications
  getNotifications: () => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : mockNotifications;
  },

  addNotification: (notification: any) => {
    const notifications = mockDataService.getNotifications();
    const newNotification = {
      id: `N${Date.now()}`,
      timestamp: Date.now(),
      read: false,
      ...notification
    };
    notifications.unshift(newNotification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return newNotification;
  },

  markNotificationRead: (id: string) => {
    const notifications = mockDataService.getNotifications();
    const notification = notifications.find((n: any) => n.id === id);
    if (notification) {
      notification.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  },

  clearNotifications: () => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  },

  // Vitals
  getVitals: (patientId: string) => {
    const vitals = localStorage.getItem(STORAGE_KEYS.VITALS);
    const allVitals = vitals ? JSON.parse(vitals) : mockVitals;
    return allVitals.filter((v: any) => v.patientId === patientId);
  },

  addVitals: (vitals: any) => {
    const allVitals = localStorage.getItem(STORAGE_KEYS.VITALS);
    const vitalsArray = allVitals ? JSON.parse(allVitals) : mockVitals;
    const newVitals = { ...vitals, timestamp: Date.now() };
    vitalsArray.push(newVitals);
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitalsArray));
    return newVitals;
  },

  // Prescriptions
  getPrescriptions: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return data ? JSON.parse(data) : mockPrescriptions;
  },

  getPrescription: (id: string) => {
    const prescriptions = mockDataService.getPrescriptions();
    return prescriptions.find((p: any) => p.id === id);
  },

  addPrescription: (prescription: any) => {
    const prescriptions = mockDataService.getPrescriptions();
    const newPrescription = {
      id: `RX${Date.now()}`,
      timestamp: Date.now(),
      status: 'pending',
      ...prescription
    };
    prescriptions.push(newPrescription);
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
    return newPrescription;
  },

  updatePrescriptionStatus: (id: string, status: string) => {
    const prescriptions = mockDataService.getPrescriptions();
    const prescription = prescriptions.find((p: any) => p.id === id);
    if (prescription) {
      prescription.status = status;
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
    }
    return prescription;
  },

  // Consultations
  saveConsultation: (patientId: string, data: any) => {
    const key = `consultation_${patientId}`;
    localStorage.setItem(key, JSON.stringify({ ...data, timestamp: Date.now() }));
  },

  getConsultation: (patientId: string) => {
    const key = `consultation_${patientId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  // Reset all data
  resetAllData: () => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(mockPatients));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications));
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(mockVitals));
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(mockPrescriptions));
  }
};

// Initialize on import
mockDataService.init();
