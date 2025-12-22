import React, { useState } from 'react';
import { Card, Button, Input } from '../../components';
import { MessageSquare, Send, Paperclip, Search } from 'lucide-react';

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  type: 'received' | 'sent';
}

export const Messages: React.FC = () => {
  const [messages] = useState<Message[]>([
    { id: '1', from: 'Dr. Smith', subject: 'Lab Results Available', preview: 'Your recent lab results are now available...', date: '2024-01-15', read: false, type: 'received' },
    { id: '2', from: 'Billing Department', subject: 'Payment Confirmation', preview: 'Thank you for your payment...', date: '2024-01-14', read: true, type: 'received' },
    { id: '3', from: 'You', subject: 'Appointment Question', preview: 'I have a question about my upcoming...', date: '2024-01-13', read: true, type: 'sent' }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  const filteredMessages = messages.filter(msg =>
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.from.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <Button variant="primary" onClick={() => setShowCompose(true)}>
          <Send className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                !message.read ? 'bg-blue-50 border-blue-200' : ''
              } ${selectedMessage?.id === message.id ? 'border-blue-500' : ''}`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start justify-between mb-1">
                <span className={`font-medium ${!message.read ? 'text-blue-900' : 'text-gray-900'}`}>
                  {message.from}
                </span>
                <span className="text-xs text-gray-500">{message.date}</span>
              </div>
              <p className={`text-sm ${!message.read ? 'font-medium text-blue-800' : 'text-gray-700'}`}>
                {message.subject}
              </p>
              <p className="text-sm text-gray-600 truncate mt-1">{message.preview}</p>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="p-6">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{selectedMessage.subject}</h2>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">From: {selectedMessage.from}</span>
                  <span className="text-sm text-gray-500">{selectedMessage.date}</span>
                </div>
              </div>
              <div className="prose max-w-none">
                <p>{selectedMessage.preview}</p>
              </div>
              <div className="mt-6 pt-4 border-t">
                <Button variant="primary">Reply</Button>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Select a message to view</p>
            </Card>
          )}
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 m-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">New Message</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Select recipient</option>
                  <option>Dr. Smith</option>
                  <option>Billing Department</option>
                  <option>Pharmacy</option>
                </select>
              </div>
              <Input label="Subject" placeholder="Enter subject" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Type your message..."
                />
              </div>
              <div className="flex justify-between items-center">
                <Button variant="secondary">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach File
                </Button>
                <div className="flex space-x-2">
                  <Button variant="secondary" onClick={() => setShowCompose(false)}>Cancel</Button>
                  <Button variant="primary">Send</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};