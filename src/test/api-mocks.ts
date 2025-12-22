import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Mock data
export const mockPatients = [
  { id: 'P001', name: 'John Smith', age: 45, gender: 'Male' },
  { id: 'P002', name: 'Sarah Johnson', age: 32, gender: 'Female' },
];

export const mockAppointments = [
  { id: 'A001', patientId: 'P001', date: '2024-01-15', time: '09:00', status: 'scheduled' },
  { id: 'A002', patientId: 'P002', date: '2024-01-15', time: '10:00', status: 'completed' },
];

// API handlers
export const handlers = [
  // Patients
  http.get('/api/patients', () => {
    return HttpResponse.json(mockPatients);
  }),

  http.get('/api/patients/:id', ({ params }) => {
    const { id } = params;
    const patient = mockPatients.find(p => p.id === id);
    return patient
      ? HttpResponse.json(patient)
      : HttpResponse.json({ error: 'Patient not found' }, { status: 404 });
  }),

  http.post('/api/patients', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 'P003', ...body }, { status: 201 });
  }),

  // Appointments
  http.get('/api/appointments', () => {
    return HttpResponse.json(mockAppointments);
  }),

  http.post('/api/appointments', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 'A003', ...body }, { status: 201 });
  }),

  // Auth
  http.post('/api/auth/signin', () => {
    return HttpResponse.json({
      token: 'mock-token',
      user: { id: 'U001', email: 'doctor@hospital.com', role: 'doctor' }
    });
  }),

  // Prescriptions
  http.get('/api/prescriptions', () => {
    return HttpResponse.json([
      { id: 'RX001', patientId: 'P001', medication: 'Lisinopril', dosage: '10mg' }
    ]);
  }),
];

// Setup MSW server
export const server = setupServer(...handlers);

// Setup function for tests
export const setupMockApi = () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};
