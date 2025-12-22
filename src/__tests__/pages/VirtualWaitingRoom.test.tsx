import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VirtualWaitingRoom } from '../../pages/telemedicine/VirtualWaitingRoom';

// Mock components
jest.mock('../../components/Card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>
}));

jest.mock('../../components/Button', () => ({
  Button: ({ children, onClick, disabled, variant, size }: any) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant} data-size={size}>
      {children}
    </button>
  )
}));

// Mock alert
global.alert = jest.fn();

describe('VirtualWaitingRoom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders virtual waiting room interface', () => {
    render(<VirtualWaitingRoom />);
    
    expect(screen.getByText('Virtual Waiting Room')).toBeInTheDocument();
    expect(screen.getByText('3 patients')).toBeInTheDocument();
  });

  test('displays patient queue with correct information', () => {
    render(<VirtualWaitingRoom />);
    
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Mike Davis')).toBeInTheDocument();
  });

  test('shows patient status correctly', () => {
    render(<VirtualWaitingRoom />);
    
    expect(screen.getByText('ready')).toBeInTheDocument();
    expect(screen.getAllByText('waiting')).toHaveLength(2);
  });

  test('displays tech check status', () => {
    render(<VirtualWaitingRoom />);
    
    expect(screen.getAllByText('completed')).toHaveLength(2);
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  test('shows urgent priority badge', () => {
    render(<VirtualWaitingRoom />);
    
    expect(screen.getByText('URGENT')).toBeInTheDocument();
  });

  test('allows starting call for ready patients', async () => {
    render(<VirtualWaitingRoom />);
    
    const startCallButton = screen.getByText('Start Call');
    fireEvent.click(startCallButton);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Calling John Smith...');
    });
  });

  test('allows marking waiting patients as ready', () => {
    render(<VirtualWaitingRoom />);
    
    const markReadyButton = screen.getByText('Mark Ready');
    fireEvent.click(markReadyButton);
    
    expect(screen.getAllByText('ready')).toHaveLength(2);
  });

  test('shows instructions for virtual waiting room', () => {
    render(<VirtualWaitingRoom />);
    
    expect(screen.getByText('Virtual Waiting Room Instructions')).toBeInTheDocument();
    expect(screen.getByText('• Patients automatically join 15 minutes before their appointment')).toBeInTheDocument();
  });
});