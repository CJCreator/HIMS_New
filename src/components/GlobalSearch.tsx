import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Mic, MicOff, X, User, Calendar, Pill, FileText, ChevronRight } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

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

interface SearchResult {
  id: string;
  type: 'patient' | 'appointment' | 'prescription' | 'lab-result';
  title: string;
  subtitle: string;
  url: string;
  icon: React.ReactNode;
  priority: number; // For sorting results
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
}

export function GlobalSearch({ isOpen, onClose, placeholder = "Search patients, appointments, prescriptions..." }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  // Mock search function - replace with actual API calls
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      const mockResults: SearchResult[] = [];

      // Mock patient results
      if (searchQuery.toLowerCase().includes('john') || searchQuery.toLowerCase().includes('patient')) {
        mockResults.push({
          id: '1',
          type: 'patient',
          title: 'John Doe',
          subtitle: 'Patient ID: P001 | Age: 45 | Room 201',
          url: '/patients/1',
          icon: <User className="w-4 h-4" />,
          priority: 10,
        });
      }

      // Mock appointment results
      if (searchQuery.toLowerCase().includes('appointment') || searchQuery.toLowerCase().includes('today')) {
        mockResults.push({
          id: '2',
          type: 'appointment',
          title: 'Cardiology Consultation',
          subtitle: 'Dr. Smith | Today 2:00 PM | John Doe',
          url: '/appointments/2',
          icon: <Calendar className="w-4 h-4" />,
          priority: 8,
        });
      }

      // Mock prescription results
      if (searchQuery.toLowerCase().includes('prescription') || searchQuery.toLowerCase().includes('medication')) {
        mockResults.push({
          id: '3',
          type: 'prescription',
          title: 'Lisinopril 10mg',
          subtitle: 'John Doe | Prescribed: 2024-01-15 | Dr. Smith',
          url: '/prescriptions/3',
          icon: <Pill className="w-4 h-4" />,
          priority: 6,
        });
      }

      // Mock lab results
      if (searchQuery.toLowerCase().includes('lab') || searchQuery.toLowerCase().includes('test')) {
        mockResults.push({
          id: '4',
          type: 'lab-result',
          title: 'Blood Test Results',
          subtitle: 'John Doe | CBC Panel | Completed: 2024-01-14',
          url: '/lab/results/4',
          icon: <FileText className="w-4 h-4" />,
          priority: 4,
        });
      }

      // Filter and sort results
      const filtered = mockResults
        .filter(result =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 8); // Limit to 8 results

      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Voice search functionality
  const startVoiceSearch = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  }, []);

  const stopVoiceSearch = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  // Handle search input
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Focus management
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results, onClose]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onClose();
    setQuery('');
    setResults([]);
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'patient': return 'text-blue-600 bg-blue-50';
      case 'appointment': return 'text-green-600 bg-green-50';
      case 'prescription': return 'text-purple-600 bg-purple-50';
      case 'lab-result': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 text-lg outline-none placeholder-gray-400"
          />
          <button
            onClick={isListening ? stopVoiceSearch : startVoiceSearch}
            className={`p-2 rounded-full transition-colors ${
              isListening
                ? 'bg-red-100 text-red-600 animate-pulse'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div ref={resultsRef} className="max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2"></div>
              Searching...
            </div>
          )}

          {!isLoading && results.length === 0 && query && (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {result.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {result.subtitle}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-4 text-center text-gray-500">
              <div className="text-sm mb-2">Quick Search Tips:</div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>• Search by patient name, ID, or room number</div>
                <div>• Find appointments by date or doctor name</div>
                <div>• Look up prescriptions by medication name</div>
                <div>• Use voice search for hands-free operation</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}