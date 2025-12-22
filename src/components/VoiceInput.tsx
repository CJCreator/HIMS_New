import { useState, useEffect } from 'react';
import { Button } from './Button';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function VoiceInput({ onTranscript, placeholder = 'Click to speak...', className = '' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    setIsListening(true);
    // Simulated voice recognition - in production, use Web Speech API
    setTimeout(() => {
      const mockTranscript = 'Patient reports persistent headache for 3 days, mild fever, and fatigue';
      setTranscript(mockTranscript);
      onTranscript(mockTranscript);
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={isListening ? 'primary' : 'secondary'}
        size="sm"
        onClick={isListening ? stopListening : startListening}
        className={isListening ? 'animate-pulse' : ''}
      >
        {isListening ? '🔴 Listening...' : '🎤 Voice Input'}
      </Button>
      {transcript && (
        <span className="text-body-sm text-success">✓ Transcribed</span>
      )}
    </div>
  );
}
