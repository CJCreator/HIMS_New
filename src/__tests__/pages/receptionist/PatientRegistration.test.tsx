import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { PatientRegistration } from '@/pages/receptionist/patients/PatientRegistration';
import patientSlice from '@/store/patientSlice';
import notificationSlice from '@/store/notificationSlice';

// Mock the data synchronization utility
jest.mock('@/utils/dataSynchronization', () => ({
  syncPatientRegistration: jest.fn().mockResolvedValue(undefined)
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      patients: patientSlice,
      notifications: notificationSlice,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('PatientRegistration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the patient registration form', () => {
    renderWithProviders(<PatientRegistration />);

    expect(screen.getByText('Patient Registration')).toBeInTheDocument();
    expect(screen.getByText('New Patient Registration')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
  });

  it('navigates through form steps correctly', async () => {
    renderWithProviders(<PatientRegistration />);

    // Start with personal details step
    expect(screen.getByText('Personal Details')).toBeInTheDocument();

    // Fill required fields for step 1
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '1990-01-01' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /gender/i }), {
      target: { value: 'male' }
    });

    // Click next
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Should be on contact info step
    await waitFor(() => {
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderWithProviders(<PatientRegistration />);

    // Try to go to next step without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Should still be on first step (validation prevents navigation)
    expect(screen.getByText('Personal Details')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    renderWithProviders(<PatientRegistration />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();

    // Progress should start at 20% (1/5)
    expect(progressBar).toHaveStyle({ width: '20%' });
  });

  it('handles form submission', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));

    renderWithProviders(<PatientRegistration />);

    // Fill all required fields across all steps (simplified for test)
    // Step 1: Personal Details
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '1990-01-01' }
    });
    fireEvent.change(screen.getByRole('combobox', { name: /gender/i }), {
      target: { value: 'male' }
    });

    // Navigate through all steps
    for (let i = 1; i < 5; i++) {
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    }

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));

    // Should show loading state
    expect(screen.getByRole('button', { name: /register patient/i })).toBeDisabled();
  });

  it('handles previous navigation', () => {
    renderWithProviders(<PatientRegistration />);

    // Go to next step
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Go back
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));

    // Should be back on first step
    expect(screen.getByText('Personal Details')).toBeInTheDocument();
  });

  it('disables previous button on first step', () => {
    renderWithProviders(<PatientRegistration />);

    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it('shows correct step content', () => {
    renderWithProviders(<PatientRegistration />);

    // Step 1 should show personal details
    expect(screen.getByText('Personal Details')).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();

    // Navigate to step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Should show contact information
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });
});