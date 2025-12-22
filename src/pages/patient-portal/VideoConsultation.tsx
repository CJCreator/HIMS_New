import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../components';
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

type ConsultationStatus = 'waiting' | 'tech-check' | 'ready' | 'in-call' | 'ended';

export const PatientVideoConsultation: React.FC = () => {
  const [status, setStatus] = useState<ConsultationStatus>('waiting');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [waitTime, setWaitTime] = useState(5);
  const [techCheckPassed, setTechCheckPassed] = useState({
    camera: false,
    microphone: false,
    connection: false
  });

  const appointment = {
    doctor: 'Dr. Smith',
    specialty: 'Cardiology',
    time: '10:00 AM',
    date: 'Today'
  };

  useEffect(() => {
    if (status === 'waiting') {
      const timer = setInterval(() => {
        setWaitTime(prev => Math.max(0, prev - 1));
      }, 60000);
      return () => clearInterval(timer);
    }
  }, [status]);

  const runTechCheck = () => {
    setStatus('tech-check');
    // Simulate tech checks
    setTimeout(() => setTechCheckPassed(prev => ({ ...prev, camera: true })), 500);
    setTimeout(() => setTechCheckPassed(prev => ({ ...prev, microphone: true })), 1000);
    setTimeout(() => setTechCheckPassed(prev => ({ ...prev, connection: true })), 1500);
  };

  const joinCall = () => {
    setStatus('in-call');
  };

  const endCall = () => {
    setStatus('ended');
  };

  if (status === 'waiting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Video className="w-10 h-10 text-blue-600" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Consultation</h1>
              <p className="text-gray-600">Your appointment with {appointment.doctor}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold text-blue-900">
                  Estimated wait time: {waitTime} minutes
                </span>
              </div>
              <p className="text-sm text-blue-700">
                The doctor will join shortly. Please stay on this page.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700">Doctor</span>
                <span className="font-medium">{appointment.doctor}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700">Specialty</span>
                <span className="font-medium">{appointment.specialty}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-gray-700">Scheduled Time</span>
                <span className="font-medium">{appointment.time}</span>
              </div>
            </div>

            <Button variant="primary" onClick={runTechCheck} className="w-full">
              Run Tech Check
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'tech-check') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">System Check</h1>
            <p className="text-gray-600">Testing your camera, microphone, and connection</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <Video className="w-5 h-5 text-gray-600" />
                  <span>Camera</span>
                </div>
                {techCheckPassed.camera ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <Mic className="w-5 h-5 text-gray-600" />
                  <span>Microphone</span>
                </div>
                {techCheckPassed.microphone ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                  <span>Connection</span>
                </div>
                {techCheckPassed.connection ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                )}
              </div>
            </div>

            {Object.values(techCheckPassed).every(v => v) && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">All systems ready!</p>
                </div>
                <Button variant="primary" onClick={joinCall} className="w-full">
                  Join Consultation
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'in-call') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Doctor Video (Main) */}
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Dr. Smith's Video</p>
            </div>
          </div>

          {/* Patient Video (PIP) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-white shadow-lg">
            <div className="w-full h-full flex items-center justify-center text-white">
              {isVideoOff ? (
                <VideoOff className="w-8 h-8 opacity-50" />
              ) : (
                <p className="text-sm">Your Video</p>
              )}
            </div>
          </div>

          {/* Call Info */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
            <p className="text-sm">Consultation with {appointment.doctor}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-center space-x-4">
            <Button
              variant={isMuted ? 'primary' : 'secondary'}
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full w-14 h-14"
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>

            <Button
              variant={isVideoOff ? 'primary' : 'secondary'}
              onClick={() => setIsVideoOff(!isVideoOff)}
              className="rounded-full w-14 h-14"
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </Button>

            <Button
              variant="secondary"
              className="rounded-full w-14 h-14"
            >
              <MessageSquare className="w-6 h-6" />
            </Button>

            <Button
              variant="primary"
              onClick={endCall}
              className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
            >
              <Phone className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'ended') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center space-y-6">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Consultation Ended</h1>
              <p className="text-gray-600">Thank you for using our telemedicine service</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Your consultation notes and any prescriptions will be available in your patient portal shortly.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button variant="secondary" className="flex-1">
                View Summary
              </Button>
              <Button variant="primary" className="flex-1">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};