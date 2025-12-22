import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DosageCalculator } from '../../components/DosageCalculator';

// Mock components
jest.mock('../../components/Card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>
}));

jest.mock('../../components/Button', () => ({
  Button: ({ children, onClick, disabled, variant }: any) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant}>
      {children}
    </button>
  )
}));

jest.mock('../../components/Input', () => ({
  Input: ({ label, value, onChange, type, placeholder }: any) => (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        data-testid={`input-${label?.toLowerCase().replace(/\s+/g, '-')}`}
      />
    </div>
  )
}));

describe('DosageCalculator', () => {
  test('renders dosage calculator form', () => {
    render(<DosageCalculator />);
    
    expect(screen.getByText('Patient Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Weight (kg)')).toBeInTheDocument();
    expect(screen.getByLabelText('Age (years)')).toBeInTheDocument();
    expect(screen.getByText('Medication')).toBeInTheDocument();
  });

  test('calculates paracetamol dosage correctly', () => {
    render(<DosageCalculator />);
    
    // Fill in patient data
    fireEvent.change(screen.getByTestId('input-weight-(kg)'), {
      target: { value: '70' }
    });
    fireEvent.change(screen.getByTestId('input-age-(years)'), {
      target: { value: '30' }
    });
    
    // Select medication
    const medicationSelect = screen.getByDisplayValue('Select medication');
    fireEvent.change(medicationSelect, { target: { value: 'Paracetamol' } });
    
    // Calculate dosage
    fireEvent.click(screen.getByText('Calculate Dosage'));
    
    // Check result
    expect(screen.getByText('Dosage Calculation Result')).toBeInTheDocument();
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('1000 mg')).toBeInTheDocument(); // 70kg * 15mg, capped at 1000mg
  });

  test('shows warnings for elderly patients', () => {
    render(<DosageCalculator />);
    
    // Fill in elderly patient data
    fireEvent.change(screen.getByTestId('input-weight-(kg)'), {
      target: { value: '60' }
    });
    fireEvent.change(screen.getByTestId('input-age-(years)'), {
      target: { value: '80' }
    });
    
    // Select medication
    const medicationSelect = screen.getByDisplayValue('Select medication');
    fireEvent.change(medicationSelect, { target: { value: 'Paracetamol' } });
    
    // Calculate dosage
    fireEvent.click(screen.getByText('Calculate Dosage'));
    
    // Check for elderly warning
    expect(screen.getByText('⚠️ Warnings')).toBeInTheDocument();
    expect(screen.getByText('Consider dose reduction in elderly patients')).toBeInTheDocument();
  });

  test('shows renal adjustments for high creatinine', () => {
    render(<DosageCalculator />);
    
    // Fill in patient data with high creatinine
    fireEvent.change(screen.getByTestId('input-weight-(kg)'), {
      target: { value: '70' }
    });
    fireEvent.change(screen.getByTestId('input-age-(years)'), {
      target: { value: '50' }
    });
    fireEvent.change(screen.getByTestId('input-serum-creatinine-(mg/dl)'), {
      target: { value: '2.5' }
    });
    
    // Select medication that requires renal adjustment
    const medicationSelect = screen.getByDisplayValue('Select medication');
    fireEvent.change(medicationSelect, { target: { value: 'Amoxicillin' } });
    
    // Calculate dosage
    fireEvent.click(screen.getByText('Calculate Dosage'));
    
    // Check for renal adjustment
    expect(screen.getByText('📋 Dose Adjustments')).toBeInTheDocument();
    expect(screen.getByText('Extend dosing interval to 12 hours')).toBeInTheDocument();
  });

  test('disables calculate button when required fields are empty', () => {
    render(<DosageCalculator />);
    
    const calculateButton = screen.getByText('Calculate Dosage');
    expect(calculateButton).toBeDisabled();
    
    // Fill in weight only
    fireEvent.change(screen.getByTestId('input-weight-(kg)'), {
      target: { value: '70' }
    });
    expect(calculateButton).toBeDisabled();
    
    // Fill in age
    fireEvent.change(screen.getByTestId('input-age-(years)'), {
      target: { value: '30' }
    });
    expect(calculateButton).toBeDisabled();
    
    // Select medication
    const medicationSelect = screen.getByDisplayValue('Select medication');
    fireEvent.change(medicationSelect, { target: { value: 'Paracetamol' } });
    expect(calculateButton).not.toBeDisabled();
  });
});