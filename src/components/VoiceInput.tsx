import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './Button';
import { Mic, MicOff, Square, RotateCcw, Volume2 } from 'lucide-react';

// Type definitions for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

// Extend Window interface
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
  }
}

interface VoiceInputProps {
  onTranscript: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  className?: string;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  medicalMode?: boolean; // Enable medical terminology recognition
  autoSave?: boolean;
}

export function VoiceInput({
  onTranscript,
  onError,
  placeholder = 'Click to speak...',
  className = '',
  language = 'en-US',
  continuous = true,
  interimResults = true,
  medicalMode = true,
  autoSave = true
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      // Medical terminology hints (if supported)
      if (medicalMode && 'grammars' in recognition) {
        // Add medical vocabulary hints
        const grammar = '#JSGF V1.0; grammar medical; public <medical> = acetaminophen | ibuprofen | hypertension | diabetes | myocardial infarction | pneumonia | appendicitis | cholecystitis;';
        (recognition as any).grammars.addFromString(grammar, 1);
      }

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        console.log('Voice recognition started');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        if (finalTranscript) {
          finalTranscriptRef.current += finalTranscript;
          setTranscript(finalTranscriptRef.current);
          onTranscript(finalTranscriptRef.current, true);

          // Auto-save if enabled
          if (autoSave) {
            localStorage.setItem('voice-transcript-draft', finalTranscriptRef.current);
          }
        }

        if (interimTranscript) {
          setInterimTranscript(interimTranscript);
          onTranscript(interimTranscript, false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        onError?.(event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, continuous, interimResults, medicalMode, onTranscript, onError, autoSave]);

  // Load saved transcript on mount
  useEffect(() => {
    if (autoSave) {
      const saved = localStorage.getItem('voice-transcript-draft');
      if (saved) {
        setTranscript(saved);
        finalTranscriptRef.current = saved;
      }
    }
  }, [autoSave]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported');
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start voice recognition');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    if (autoSave) {
      localStorage.removeItem('voice-transcript-draft');
    }
  }, [autoSave]);

  const speakTranscript = useCallback(() => {
    if ('speechSynthesis' in window && transcript) {
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      // Use medical voice if available
      const voices = speechSynthesis.getVoices();
      const medicalVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('medical') ||
        voice.name.toLowerCase().includes('clinical')
      );
      if (medicalVoice) {
        utterance.voice = medicalVoice;
      }

      speechSynthesis.speak(utterance);
    }
  }, [transcript]);

  if (!isSupported) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        🎤 Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Control Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={isListening ? 'destructive' : 'primary'}
          size="sm"
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 ${isListening ? 'animate-pulse' : ''}`}
          disabled={!!error}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Start Voice Input
            </>
          )}
        </Button>

        {transcript && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={clearTranscript}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={speakTranscript}
              className="flex items-center gap-2"
              disabled={!('speechSynthesis' in window)}
            >
              <Volume2 className="w-4 h-4" />
              Speak
            </Button>
          </>
        )}
      </div>

      {/* Status and Error Display */}
      <div className="flex items-center gap-2 text-sm">
        {isListening && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            Listening... Speak clearly
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {confidence > 0 && (
          <div className="text-gray-500">
            Confidence: {Math.round(confidence * 100)}%
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {(transcript || interimTranscript) && (
        <div className="bg-gray-50 border rounded-lg p-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Voice Transcript:</div>

          {transcript && (
            <div className="text-gray-900 mb-2 whitespace-pre-wrap">
              {transcript}
            </div>
          )}

          {interimTranscript && (
            <div className="text-gray-500 italic">
              {interimTranscript}
              <span className="animate-pulse">...</span>
            </div>
          )}

          {medicalMode && (
            <div className="text-xs text-blue-600 mt-2">
              💊 Medical terminology recognition enabled
            </div>
          )}
        </div>
      )}

      {/* Placeholder when empty */}
      {!transcript && !interimTranscript && !isListening && (
        <div className="text-sm text-gray-500 italic">
          {placeholder}
        </div>
      )}
    </div>
  );
}
