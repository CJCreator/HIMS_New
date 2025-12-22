import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/test/test-utils';
import { setupMockApi } from '@/test/api-mocks';
import { PrescriptionWorkflow } from '@/components/PrescriptionWorkflow';

// Setup API mocks
setupMockApi();

describe('Prescription Workflow Integration', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore({
      auth: {
        user: { id: 'doctor-1', role: 'doctor', name: 'Dr. Smith' },
        isAuthenticated: true
      },
      patients: {
        currentPatient: {
          id: 'patient-1',
          name: 'John Doe',
          allergies: [
            { medication: 'Penicillin', severity: 'severe', reaction: 'Anaphylaxis' }
          ],
          medications: []
        }
      }
    });
  });

  const renderPrescriptionWorkflow = () => {
    return render(
      <Provider store={store}>
        <PrescriptionWorkflow patientId="patient-1" />
      </Provider>
    );
  };

  it('completes full prescription creation workflow', async () => {
    renderPrescriptionWorkflow();

    // Step 1: Search and select medication
    const medicationSearch = screen.getByLabelText('Search Medication');
    fireEvent.change(medicationSearch, { target: { value: 'Amoxicillin' } });
    
    await waitFor(() => {
      expect(screen.getByText('Amoxicillin 500mg')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Amoxicillin 500mg'));

    // Step 2: Configure dosage
    fireEvent.change(screen.getByLabelText('Dosage'), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText('Unit'), { target: { value: 'mg' } });
    fireEvent.change(screen.getByLabelText('Frequency'), { target: { value: 'twice daily' } });
    fireEvent.change(screen.getByLabelText('Duration'), { target: { value: '7' } });
    fireEvent.change(screen.getByLabelText('Duration Unit'), { target: { value: 'days' } });

    // Step 3: Add instructions
    fireEvent.change(screen.getByLabelText('Instructions'), { 
      target: { value: 'Take with food to reduce stomach upset' } 
    });

    // Step 4: Check for allergies and interactions
    fireEvent.click(screen.getByText('Check Safety'));

    // Should show allergy alert for Penicillin (Amoxicillin is a penicillin)
    await waitFor(() => {
      expect(screen.getByText('ALLERGY ALERT')).toBeInTheDocument();
      expect(screen.getByText('Patient is allergic to Penicillin')).toBeInTheDocument();
      expect(screen.getByText('Severity: severe')).toBeInTheDocument();
    });

    // Cannot proceed without acknowledging allergy
    expect(screen.getByText('Add to Prescription')).toBeDisabled();

    // Acknowledge allergy and provide alternative
    fireEvent.click(screen.getByText('Acknowledge Allergy'));
    fireEvent.change(screen.getByLabelText('Clinical Notes'), {
      target: { value: 'Patient allergic to penicillin. Using alternative antibiotic.' }
    });

    // Change to non-penicillin antibiotic
    fireEvent.change(medicationSearch, { target: { value: 'Azithromycin' } });
    fireEvent.click(screen.getByText('Azithromycin 250mg'));

    // Recheck safety
    fireEvent.click(screen.getByText('Check Safety'));

    await waitFor(() => {
      expect(screen.queryByText('ALLERGY ALERT')).not.toBeInTheDocument();
      expect(screen.getByText('No allergies detected')).toBeInTheDocument();
    });

    // Add to prescription
    fireEvent.click(screen.getByText('Add to Prescription'));

    // Verify prescription added to list
    await waitFor(() => {
      expect(screen.getByText('Azithromycin 250mg')).toBeInTheDocument();
      expect(screen.getByText('twice daily for 7 days')).toBeInTheDocument();
    });
  });

  it('detects and handles drug interactions', async () => {
    // Pre-populate patient with existing medication
    store = createTestStore({
      auth: {
        user: { id: 'doctor-1', role: 'doctor', name: 'Dr. Smith' },
        isAuthenticated: true
      },
      patients: {
        currentPatient: {
          id: 'patient-1',
          name: 'John Doe',
          allergies: [],
          medications: [
            { name: 'Warfarin', dosage: '5mg', frequency: 'once daily' }
          ]
        }
      }
    });

    renderPrescriptionWorkflow();

    // Add Aspirin (interacts with Warfarin)
    const medicationSearch = screen.getByLabelText('Search Medication');
    fireEvent.change(medicationSearch, { target: { value: 'Aspirin' } });
    fireEvent.click(screen.getByText('Aspirin 81mg'));

    fireEvent.change(screen.getByLabelText('Dosage'), { target: { value: '81' } });
    fireEvent.change(screen.getByLabelText('Frequency'), { target: { value: 'once daily' } });

    fireEvent.click(screen.getByText('Check Safety'));

    // Should show interaction alert
    await waitFor(() => {
      expect(screen.getByText('DRUG INTERACTION DETECTED')).toBeInTheDocument();
      expect(screen.getByText('High Risk Interaction')).toBeInTheDocument();
      expect(screen.getByText('Warfarin + Aspirin')).toBeInTheDocument();
      expect(screen.getByText(/bleeding risk/i)).toBeInTheDocument();
    });

    // Verify recommendations shown
    expect(screen.getByText('Monitor INR closely')).toBeInTheDocument();
    expect(screen.getByText('Consider alternative antiplatelet therapy')).toBeInTheDocument();

    // Cannot proceed without acknowledgment
    expect(screen.getByText('Add to Prescription')).toBeDisabled();

    // Acknowledge interaction
    fireEvent.click(screen.getByLabelText('I acknowledge this interaction'));
    fireEvent.change(screen.getByLabelText('Clinical Justification'), {
      target: { value: 'Benefits outweigh risks. Will monitor INR weekly.' }
    });

    // Now can add medication
    expect(screen.getByText('Add to Prescription')).toBeEnabled();
  });

  it('validates prescription data before submission', async () => {
    renderPrescriptionWorkflow();

    // Try to submit empty prescription
    fireEvent.click(screen.getByText('Submit Prescription'));

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('At least one medication is required')).toBeInTheDocument();
    });

    // Add medication but with incomplete data
    const medicationSearch = screen.getByLabelText('Search Medication');
    fireEvent.change(medicationSearch, { target: { value: 'Paracetamol' } });
    fireEvent.click(screen.getByText('Paracetamol 500mg'));

    // Leave dosage empty
    fireEvent.click(screen.getByText('Add to Prescription'));

    // Should show field validation
    expect(screen.getByText('Dosage is required')).toBeInTheDocument();
    expect(screen.getByText('Frequency is required')).toBeInTheDocument();

    // Fill required fields
    fireEvent.change(screen.getByLabelText('Dosage'), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText('Frequency'), { target: { value: 'every 6 hours' } });
    fireEvent.change(screen.getByLabelText('Duration'), { target: { value: '5' } });

    fireEvent.click(screen.getByText('Add to Prescription'));

    // Should successfully add
    await waitFor(() => {
      expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument();
    });

    // Now submission should work
    fireEvent.click(screen.getByText('Submit Prescription'));

    await waitFor(() => {
      expect(screen.getByText('Prescription submitted successfully')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    renderPrescriptionWorkflow();

    // Add valid medication
    const medicationSearch = screen.getByLabelText('Search Medication');
    fireEvent.change(medicationSearch, { target: { value: 'Paracetamol' } });
    fireEvent.click(screen.getByText('Paracetamol 500mg'));

    fireEvent.change(screen.getByLabelText('Dosage'), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText('Frequency'), { target: { value: 'every 6 hours' } });
    fireEvent.click(screen.getByText('Add to Prescription'));

    // Try to submit
    fireEvent.click(screen.getByText('Submit Prescription'));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Failed to submit prescription. Please try again.')).toBeInTheDocument();
    });

    // Prescription should remain in draft state
    expect(screen.getByText('Paracetamol 500mg')).toBeInTheDocument();
    expect(screen.getByText('Submit Prescription')).toBeInTheDocument();
  });

  it('auto-saves prescription draft', async () => {
    renderPrescriptionWorkflow();

    // Add medication
    const medicationSearch = screen.getByLabelText('Search Medication');
    fireEvent.change(medicationSearch, { target: { value: 'Paracetamol' } });
    fireEvent.click(screen.getByText('Paracetamol 500mg'));

    fireEvent.change(screen.getByLabelText('Dosage'), { target: { value: '500' } });

    // Wait for auto-save
    await waitFor(() => {
      expect(screen.getByText('Draft saved')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify draft is saved in store
    const state = store.getState();
    expect(state.prescriptions.draft).toBeDefined();
    expect(state.prescriptions.draft.medications).toHaveLength(1);
  });

  it('calculates total prescription cost', async () => {
    renderPrescriptionWorkflow();

    // Add multiple medications
    const medications = [
      { name: 'Paracetamol 500mg', dosage: '500', frequency: 'every 6 hours', duration: '5', cost: 5.99 },
      { name: 'Ibuprofen 400mg', dosage: '400', frequency: 'every 8 hours', duration: '3', cost: 8.50 }
    ];

    for (const med of medications) {
      const medicationSearch = screen.getByLabelText('Search Medication');
      fireEvent.change(medicationSearch, { target: { value: med.name } });
      fireEvent.click(screen.getByText(med.name));

      fireEvent.change(screen.getByLabelText('Dosage'), { target: { value: med.dosage } });
      fireEvent.change(screen.getByLabelText('Frequency'), { target: { value: med.frequency } });
      fireEvent.change(screen.getByLabelText('Duration'), { target: { value: med.duration } });

      fireEvent.click(screen.getByText('Add to Prescription'));
    }

    // Verify total cost calculation
    await waitFor(() => {
      expect(screen.getByText('Total Cost: $14.49')).toBeInTheDocument();
    });

    // Verify individual costs shown
    expect(screen.getByText('$5.99')).toBeInTheDocument();
    expect(screen.getByText('$8.50')).toBeInTheDocument();
  });
});