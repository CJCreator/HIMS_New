import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { sendMessage, createThread, markRead } from '../../store/messagingSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';

export default function SecureMessaging() {
  const { threads, messages } = useSelector((state: RootState) => state.messaging);
  const dispatch = useDispatch();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newThread, setNewThread] = useState({ recipient: '', subject: '' });

  const threadMessages = selectedThread ? messages.filter(m => m.threadId === selectedThread) : [];
  const thread = threads.find(t => t.id === selectedThread);

  const handleSend = () => {
    if (!selectedThread || !messageText.trim()) return;
    dispatch(sendMessage({
      id: `M${Date.now()}`,
      threadId: selectedThread,
      sender: 'You',
      text: messageText,
      date: new Date().toISOString(),
      read: true,
    }));
    setMessageText('');
  };

  const handleNewThread = () => {
    const id = `T${Date.now()}`;
    dispatch(createThread({
      id,
      subject: newThread.subject,
      recipient: newThread.recipient,
      lastMessage: 'New conversation',
      unread: 0,
      date: new Date().toISOString().split('T')[0],
    }));
    setShowNewModal(false);
    setNewThread({ recipient: '', subject: '' });
    setSelectedThread(id);
  };

  const handleSelectThread = (id: string) => {
    setSelectedThread(id);
    dispatch(markRead(id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Secure Messages</h1>
        <Button onClick={() => setShowNewModal(true)}>+ New Message</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Conversations</h2>
          <div className="space-y-2">
            {threads.map(t => (
              <div
                key={t.id}
                onClick={() => handleSelectThread(t.id)}
                className={`p-3 rounded cursor-pointer ${selectedThread === t.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-sm">{t.subject}</div>
                  {t.unread > 0 && <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs">{t.unread}</span>}
                </div>
                <div className="text-xs text-gray-600">{t.recipient}</div>
                <div className="text-xs text-gray-500 truncate">{t.lastMessage}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 col-span-2">
          {selectedThread ? (
            <>
              <div className="border-b pb-3 mb-4">
                <h2 className="font-semibold">{thread?.subject}</h2>
                <div className="text-sm text-gray-600">{thread?.recipient}</div>
              </div>

              <div className="h-96 overflow-y-auto mb-4 space-y-3">
                {threadMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded ${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                      <div className="text-sm">{msg.text}</div>
                      <div className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.date).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend}>Send</Button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </Card>
      </div>

      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="New Message">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Recipient</label>
            <select value={newThread.recipient} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewThread({ ...newThread, recipient: e.target.value })} className="w-full border rounded p-2">
              <option value="">Select...</option>
              <option value="Dr. Smith">Dr. Smith</option>
              <option value="Dr. Johnson">Dr. Johnson</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Billing">Billing</option>
            </select>
          </div>
          <Input label="Subject" value={newThread.subject} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewThread({ ...newThread, subject: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowNewModal(false)}>Cancel</Button>
            <Button onClick={handleNewThread}>Start Conversation</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
