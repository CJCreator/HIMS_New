import { rest } from 'msw';
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
  rest.get('/api/patients', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockPatients));
  }),

  rest.get('/api/patients/:id', (req, res, ctx) => {
    const { id } = req.params;
    const patient = mockPatients.find(p => p.id === id);
    return patient
      ? res(ctx.status(200), ctx.json(patient))
      : res(ctx.status(404), ctx.json({ error: 'Patient not found' }));
  }),

  rest.post('/api/patients', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ id: 'P003', ...req.body }));
  }),

  // Appointments
  rest.get('/api/appointments', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockAppointments));
  }),

  rest.post('/api/appointments', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ id: 'A003', ...req.body }));
  }),

  // Auth
  rest.post('/api/auth/signin', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-token',
        user: { id: 'U001', email: 'doctor@hospital.com', role: 'doctor' }
      })
    );
  }),

  // Prescriptions
  rest.get('/api/prescriptions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 'RX001', patientId: 'P001', medication: 'Lisinopril', dosage: '10mg' }
      ])
    );
  }),
];

// Setup MSW server
export const server = setupServer(...handlers);
