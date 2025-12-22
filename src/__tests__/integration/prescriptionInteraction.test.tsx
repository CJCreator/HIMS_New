import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Prescription } from '../../pages/doctor/consultation/Prescription';
import drugInteractionReducer from '../../store/drugInteractionSlice';

const mockStore = configureStore({
  reducer: {
    drugInteraction: drugInteractionReducer
  }
});

const MockedPrescription = () => (
  <Provider store={mockStore}>
    <Prescription 
      onNext={jest.fn()} 
      onPrevious={jest.fn()} 
      onSave={jest.fn()} 
    />
  </Provider>
);

describe('Prescription Integration with Drug Interactions', () => {
  it('should show interaction alert when conflicting drugs are added', async () => {
    render(<MockedPrescription />);
    
    const medicationInput = screen.getByPlaceholderText('e.g., Amoxicillin');
    fireEvent.change(medicationInput, { target: { value: 'Warfarin' } });
    
    fireEvent.click(screen.getByText('+ Add Medication'));
    const secondMedicationInput = screen.getAllByPlaceholderText('e.g., Amoxicillin')[1];
    fireEvent.change(secondMedicationInput, { target: { value: 'Aspirin' } });
    
    await waitFor(() => {
      expect(screen.getByText('Drug Safety Alert')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Drug Interactions:/)).toBeInTheDocument();
    expect(screen.getByText(/Increased risk of bleeding/)).toBeInTheDocument();
  });

  it('should allow override with reason', async () => {
    render(<MockedPrescription />);
    
    const medicationInput = screen.getByPlaceholderText('e.g., Amoxicillin');
    fireEvent.change(medicationInput, { target: { value: 'Warfarin' } });
    
    fireEvent.click(screen.getByText('+ Add Medication'));
    const secondMedicationInput = screen.getAllByPlaceholderText('e.g., Amoxicillin')[1];
    fireEvent.change(secondMedicationInput, { target: { value: 'Aspirin' } });
    
    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
    });
    
    await waitFor(() => {
      const overrideButton = screen.getByText('Override Warning');
      fireEvent.click(overrideButton);
    });
    
    const reasonTextarea = screen.getByPlaceholderText(/clinical justification/i);
    fireEvent.change(reasonTextarea, { 
      target: { value: 'Patient requires both medications under close monitoring' } 
    });
    
    const confirmButton = screen.getByText('Confirm Override');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Drug Safety Alert')).not.toBeInTheDocument();
    });
  });
});