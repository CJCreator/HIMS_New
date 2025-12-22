import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoCall } from '../../components/VideoCall';

// Mock components
jest.mock('../../components/Button', () => ({
  Button: ({ children, onClick, disabled, variant, className }: any) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant} className={className}>
      {children}
    </button>
  )
}));

describe('VideoCall', () => {
  const mockProps = {
    patientName: 'John Smith',
    onEndCall: jest.fn(),
    onToggleVideo: jest.fn(),
    onToggleMute: jest.fn(),
    onToggleScreenShare: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders video call interface', () => {
    render(<VideoCall {...mockProps} />);
    
    expect(screen.getByText('Video Consultation')).toBeInTheDocument();
    expect(screen.getByText('with John Smith')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
  });

  test('displays patient name in video area', () => {
    render(<VideoCall {...mockProps} />);
    
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Patient Video')).toBeInTheDocument();
  });

  test('shows call duration timer', () => {
    render(<VideoCall {...mockProps} />);
    
    // Should show initial duration
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  test('calls onToggleMute when mute button is clicked', () => {
    render(<VideoCall {...mockProps} />);
    
    const muteButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('🎤')
    );
    
    expect(muteButton).toBeInTheDocument();
    fireEvent.click(muteButton!);
    
    expect(mockProps.onToggleMute).toHaveBeenCalledTimes(1);
  });

  test('calls onToggleVideo when video button is clicked', () => {
    render(<VideoCall {...mockProps} />);
    
    const videoButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('📹')
    );
    
    expect(videoButton).toBeInTheDocument();
    fireEvent.click(videoButton!);
    
    expect(mockProps.onToggleVideo).toHaveBeenCalledTimes(1);
  });

  test('calls onToggleScreenShare when screen share button is clicked', () => {
    render(<VideoCall {...mockProps} />);
    
    const screenShareButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('🖥️')
    );
    
    expect(screenShareButton).toBeInTheDocument();
    fireEvent.click(screenShareButton!);
    
    expect(mockProps.onToggleScreenShare).toHaveBeenCalledTimes(1);
  });

  test('calls onEndCall when end call button is clicked', () => {
    render(<VideoCall {...mockProps} />);
    
    const endCallButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('📞') && btn.className?.includes('bg-red-600')
    );
    
    expect(endCallButton).toBeInTheDocument();
    fireEvent.click(endCallButton!);
    
    expect(mockProps.onEndCall).toHaveBeenCalledTimes(1);
  });

  test('shows video off state when video is toggled', () => {
    render(<VideoCall {...mockProps} />);
    
    const videoButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('📹')
    );
    
    // Click to turn off video
    fireEvent.click(videoButton!);
    
    // Should show video off state
    expect(screen.getByText('Video Off')).toBeInTheDocument();
  });

  test('shows muted state when mute is toggled', () => {
    render(<VideoCall {...mockProps} />);
    
    const muteButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('🎤')
    );
    
    // Click to mute
    fireEvent.click(muteButton!);
    
    // Button should show muted state
    expect(muteButton?.textContent).toContain('🎤❌');
  });

  test('shows screen sharing indicator when active', () => {
    render(<VideoCall {...mockProps} />);
    
    const screenShareButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('🖥️')
    );
    
    // Click to start screen sharing
    fireEvent.click(screenShareButton!);
    
    // Should show screen sharing indicator
    expect(screen.getByText('Screen Sharing')).toBeInTheDocument();
  });

  test('renders control buttons for additional features', () => {
    render(<VideoCall {...mockProps} />);
    
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Prescription')).toBeInTheDocument();
    expect(screen.getByText('Record')).toBeInTheDocument();
  });
});