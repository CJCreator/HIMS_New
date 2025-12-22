import React, { useState } from 'react';
import { Button } from './Button';

const Send = ({ className }: { className?: string }) => <span className={className}>📤</span>;

interface Message {
  id: string;
  sender: 'doctor' | 'patient';
  message: string;
  timestamp: string;
}

interface ConsultationChatProps {
  patientName?: string;
}

export const ConsultationChat: React.FC<ConsultationChatProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'patient',
      message: 'Hello doctor, can you hear me clearly?',
      timestamp: '10:05 AM'
    },
    {
      id: '2',
      sender: 'doctor',
      message: 'Yes, I can hear you perfectly. How are you feeling today?',
      timestamp: '10:06 AM'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'doctor',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                msg.sender === 'doctor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p>{msg.message}</p>
              <p className={`text-xs mt-1 ${
                msg.sender === 'doctor' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={2}
            className="flex-1 px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};