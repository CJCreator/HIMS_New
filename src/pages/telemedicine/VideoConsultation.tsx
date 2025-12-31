import React, { useState } from 'react';
import { VideoCall } from '../../components/VideoCall';
import { ConsultationChat } from '../../components/ConsultationChat';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { MessageCircle, FileText, X } from 'lucide-react';

interface VideoConsultationProps {
  patientName?: string;
  patientId?: string;
}

export const VideoConsultation: React.FC<VideoConsultationProps> = ({
  patientName = "John Smith",
  patientId = "P001"
}) => {
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [isCallActive, setIsCallActive] = useState(true);

  const handleEndCall = () => {
    setIsCallActive(false);
    // In real implementation, this would end the video call and redirect
    alert('Call ended. Redirecting to consultation summary...');
  };

  if (!isCallActive) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Consultation Ended</h2>
          <p className="text-gray-600 mb-6">The video consultation with {patientName} has ended.</p>
          <div className="flex justify-center space-x-4">
            <Button variant="primary">View Summary</Button>
            <Button variant="secondary">Schedule Follow-up</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <VideoCall
        patientName={patientName}
        onEndCall={handleEndCall}
        onToggleVideo={() => console.log('Toggle video')}
        onToggleMute={() => console.log('Toggle mute')}
        onToggleScreenShare={() => console.log('Toggle screen share')}
      />

      {/* Chat Sidebar */}
      {showChat && (
        <div className="absolute right-0 top-0 h-full w-80 bg-white border-l shadow-lg z-10">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Chat</h3>
              <Button variant="secondary" size="sm" onClick={() => setShowChat(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <ConsultationChat patientName={patientName} />
        </div>
      )}

      {/* Notes Sidebar */}
      {showNotes && (
        <div className="absolute right-0 top-0 h-full w-80 bg-white border-l shadow-lg z-10">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Consultation Notes</h3>
              <Button variant="secondary" size="sm" onClick={() => setShowNotes(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 h-full">
            <textarea
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              placeholder="Enter consultation notes..."
              className="w-full h-4/5 p-3 border rounded-lg resize-none"
            />
            <Button variant="primary" size="sm" className="mt-2 w-full">
              Save Notes
            </Button>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="absolute bottom-20 right-4 flex flex-col space-y-2">
        <Button
          variant={showChat ? "primary" : "secondary"}
          onClick={() => {
            setShowChat(!showChat);
            setShowNotes(false);
          }}
          className="w-12 h-12 rounded-full"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
        <Button
          variant={showNotes ? "primary" : "secondary"}
          onClick={() => {
            setShowNotes(!showNotes);
            setShowChat(false);
          }}
          className="w-12 h-12 rounded-full"
        >
          <FileText className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};