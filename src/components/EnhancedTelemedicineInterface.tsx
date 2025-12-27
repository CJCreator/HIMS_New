import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Badge, Input } from '@/components';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  FileText,
  Pill,
  Camera,
  CameraOff,
  Settings,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Send,
  Download,
  Upload,
  Heart,
  Thermometer,
  Activity
} from 'lucide-react';

interface TelemedicineInterfaceProps {
  patientId: string;
  patientName: string;
  appointmentId: string;
  onEndCall: () => void;
  onSaveNotes?: (notes: string) => void;
  onPrescribe?: (prescription: any) => void;
}

interface VitalSigns {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  oxygenSaturation?: number;
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  message: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

export function EnhancedTelemedicineInterface({
  patientId,
  patientName,
  appointmentId,
  onEndCall,
  onSaveNotes,
  onPrescribe
}: TelemedicineInterfaceProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'consultation' | 'chat' | 'notes' | 'vitals' | 'prescription'>('consultation');

  // Chat functionality
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Notes functionality
  const [consultationNotes, setConsultationNotes] = useState('');

  // Vitals monitoring
  const [vitals, setVitals] = useState<VitalSigns[]>([]);
  const [currentVitals, setCurrentVitals] = useState<Partial<VitalSigns>>({});

  // Prescription
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Mock vitals data
  useEffect(() => {
    const interval = setInterval(() => {
      const newVitals: VitalSigns = {
        heartRate: 70 + Math.random() * 20,
        bloodPressure: `${110 + Math.random() * 20}/${70 + Math.random() * 10}`,
        temperature: 36.5 + Math.random() * 1,
        oxygenSaturation: 95 + Math.random() * 5,
        timestamp: new Date()
      };
      setVitals(prev => [...prev.slice(-9), newVitals]); // Keep last 10 readings
      setCurrentVitals(newVitals);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'doctor',
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const saveNotes = () => {
    onSaveNotes?.(consultationNotes);
  };

  const getVitalStatus = (vital: keyof VitalSigns, value: any) => {
    switch (vital) {
      case 'heartRate':
        return value >= 60 && value <= 100 ? 'normal' : 'warning';
      case 'temperature':
        return value >= 36.1 && value <= 37.2 ? 'normal' : 'warning';
      case 'oxygenSaturation':
        return value >= 95 ? 'normal' : 'critical';
      default:
        return 'normal';
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Telemedicine Consultation</h2>
            <p className="text-sm text-gray-300">with {patientName}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-300">Duration</p>
              <p className="text-lg font-mono">{formatDuration(callDuration)}</p>
            </div>
            {isRecording && (
              <div className="flex items-center gap-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Recording</span>
              </div>
            )}
          </div>
        </div>

        {/* Video Display */}
        <div className="flex-1 relative bg-gray-800">
          {/* Main Video */}
          <div className="w-full h-full flex items-center justify-center">
            {isVideoOn ? (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="text-xl">{patientName}</p>
                  <p className="text-sm text-gray-300">Patient Video Feed</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <VideoOff className="w-24 h-24 mx-auto mb-4" />
                  <p className="text-xl">Video Paused</p>
                </div>
              </div>
            )}
          </div>

          {/* Doctor's Video (PiP) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-600 rounded-lg border-2 border-white overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Dr. Smith</p>
              </div>
            </div>
          </div>

          {/* Screen Share Indicator */}
          {isScreenSharing && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Monitor className="w-4 h-4" />
              Screen Sharing
            </div>
          )}

          {/* Real-time Vitals Overlay */}
          {currentVitals.heartRate && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>{Math.round(currentVitals.heartRate!)} BPM</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>{currentVitals.bloodPressure}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span>{currentVitals.temperature?.toFixed(1)}°C</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="bg-gray-900 p-4">
          <div className="flex justify-center items-center gap-4">
            {/* Audio Control */}
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isAudioOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
            </button>

            {/* Video Control */}
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isVideoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isScreenSharing ? <Monitor className="w-5 h-5 text-white" /> : <MonitorOff className="w-5 h-5 text-white" />}
            </button>

            {/* End Call */}
            <button
              onClick={onEndCall}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
            >
              <PhoneOff className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-96 bg-white flex flex-col border-l border-gray-200">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'consultation', label: 'Consultation', icon: Video },
            { id: 'chat', label: 'Chat', icon: MessageSquare, badge: chatMessages.filter(m => m.sender === 'patient' && m.type !== 'system').length },
            { id: 'notes', label: 'Notes', icon: FileText },
            { id: 'vitals', label: 'Vitals', icon: Activity },
            { id: 'prescription', label: 'Rx', icon: Pill }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 p-3 text-center transition-colors flex flex-col items-center gap-1 ${
                activeTab === tab.id ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs">{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <Badge status="info" size="sm" className="text-xs">{tab.badge}</Badge>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'consultation' && (
            <div className="p-4 space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-gray-900">Active Consultation</h3>
                <p className="text-sm text-gray-600">Patient: {patientName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => setActiveTab('notes')}>
                  <FileText className="w-4 h-4 mr-1" />
                  Take Notes
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveTab('prescription')}>
                  <Pill className="w-4 h-4 mr-1" />
                  Prescribe
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsRecording(!isRecording)}>
                  {isRecording ? <X className="w-4 h-4 mr-1" /> : <Camera className="w-4 h-4 mr-1" />}
                  {isRecording ? 'Stop Record' : 'Record'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveTab('vitals')}>
                  <Activity className="w-4 h-4 mr-1" />
                  Check Vitals
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === 'doctor'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="p-4">
              <textarea
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                placeholder="Enter consultation notes..."
                className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-3 flex justify-end">
                <Button onClick={saveNotes} size="sm">
                  Save Notes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'vitals' && (
            <div className="p-4 space-y-4">
              {currentVitals.heartRate && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">
                      {Math.round(currentVitals.heartRate)}
                    </div>
                    <div className="text-sm text-red-600">BPM</div>
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {currentVitals.bloodPressure}
                    </div>
                    <div className="text-sm text-blue-600">BP</div>
                  </div>

                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">
                      {currentVitals.temperature?.toFixed(1)}
                    </div>
                    <div className="text-sm text-orange-600">°C</div>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                      O₂
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(currentVitals.oxygenSaturation || 0)}
                    </div>
                    <div className="text-sm text-green-600">%</div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Recent Readings</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {vitals.slice(-5).reverse().map((reading, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600">
                      <span>{reading.timestamp.toLocaleTimeString()}</span>
                      <span>HR: {Math.round(reading.heartRate || 0)} | BP: {reading.bloodPressure}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescription' && (
            <div className="p-4">
              <div className="text-center mb-4">
                <h3 className="font-medium text-gray-900">Quick Prescription</h3>
                <p className="text-sm text-gray-600">Prescribe during consultation</p>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setShowPrescriptionForm(true)}
                >
                  <Pill className="w-4 h-4 mr-2" />
                  Create Prescription
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {/* Open prescription history */}}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}