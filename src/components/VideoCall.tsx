import React, { useState } from 'react';
import { Button } from './Button';

const Video = ({ className }: { className?: string }) => <span className={className}>📹</span>;
const VideoOff = ({ className }: { className?: string }) => <span className={className}>📹❌</span>;
const Mic = ({ className }: { className?: string }) => <span className={className}>🎤</span>;
const MicOff = ({ className }: { className?: string }) => <span className={className}>🎤❌</span>;
const Phone = ({ className }: { className?: string }) => <span className={className}>📞</span>;
const Monitor = ({ className }: { className?: string }) => <span className={className}>🖥️</span>;

interface VideoCallProps {
  patientName: string;
  onEndCall: () => void;
  onToggleVideo: () => void;
  onToggleMute: () => void;
  onToggleScreenShare: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({
  patientName,
  onEndCall,
  onToggleVideo,
  onToggleMute,
  onToggleScreenShare
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    onToggleVideo();
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    onToggleMute();
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    onToggleScreenShare();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Video Consultation</h2>
          <p className="text-sm text-gray-300">with {patientName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-300">Duration</p>
          <p className="text-lg font-mono">{formatDuration(callDuration)}</p>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-800">
        {/* Main Video (Patient) */}
        <div className="w-full h-full flex items-center justify-center">
          {isVideoOn ? (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="w-24 h-24 mx-auto mb-4" />
                <p className="text-xl">{patientName}</p>
                <p className="text-sm text-gray-300">Patient Video</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <VideoOff className="w-24 h-24 mx-auto mb-4" />
                <p className="text-xl">Video Off</p>
              </div>
            </div>
          )}
        </div>

        {/* Doctor Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-600 rounded-lg border-2 border-white">
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <Video className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">You</p>
            </div>
          </div>
        </div>

        {/* Screen Share Indicator */}
        {isScreenSharing && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            <Monitor className="w-4 h-4 inline mr-1" />
            Screen Sharing
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4">
        <div className="flex justify-center space-x-4">
          <Button
            variant={isMuted ? "primary" : "secondary"}
            onClick={handleToggleMute}
            className={`w-12 h-12 rounded-full ${isMuted ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            variant={isVideoOn ? "secondary" : "primary"}
            onClick={handleToggleVideo}
            className={`w-12 h-12 rounded-full ${!isVideoOn ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button
            variant={isScreenSharing ? "primary" : "secondary"}
            onClick={handleToggleScreenShare}
            className={`w-12 h-12 rounded-full ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button
            variant="primary"
            onClick={onEndCall}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700"
          >
            <Phone className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex justify-center mt-4 space-x-4">
          <Button variant="secondary" size="sm">
            Chat
          </Button>
          <Button variant="secondary" size="sm">
            Notes
          </Button>
          <Button variant="secondary" size="sm">
            Prescription
          </Button>
          <Button variant="secondary" size="sm">
            Record
          </Button>
        </div>
      </div>
    </div>
  );
};