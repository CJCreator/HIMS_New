import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/notificationSlice';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';

const Clock = ({ className }: { className?: string }) => <span className={className}>🕐</span>;
const User = ({ className }: { className?: string }) => <span className={className}>👤</span>;
const FileText = ({ className }: { className?: string }) => <span className={className}>📄</span>;


interface HandoverNote {
  id: string;
  patientName: string;
  room: string;
  priority: 'low' | 'medium' | 'high';
  category: 'medication' | 'vitals' | 'care' | 'alert';
  note: string;
  timestamp: string;
  nurseFrom: string;
  nurseTo?: string;
}

export const ShiftHandover: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [newNote, setNewNote] = useState({
    patientName: '',
    room: '',
    priority: 'medium' as const,
    category: 'care' as const,
    note: ''
  });

  const incomingNotes: HandoverNote[] = [
    {
      id: '1',
      patientName: 'John Smith',
      room: 'A101',
      priority: 'high',
      category: 'medication',
      note: 'Patient missed 2PM medication dose. Needs to be administered ASAP.',
      timestamp: '14:30',
      nurseFrom: 'Sarah Johnson'
    },
    {
      id: '2',
      patientName: 'Mary Wilson',
      room: 'A103',
      priority: 'medium',
      category: 'vitals',
      note: 'Monitor BP every 2 hours. Last reading was 140/90.',
      timestamp: '14:15',
      nurseFrom: 'Sarah Johnson'
    }
  ];

  const [outgoingNotes, setOutgoingNotes] = useState<HandoverNote[]>([]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication': return '💊';
      case 'vitals': return '📊';
      case 'care': return '🏥';
      case 'alert': return '⚠️';
      default: return '📝';
    }
  };

  const handleAddNote = () => {
    if (!newNote.patientName || !newNote.room || !newNote.note) return;

    const note: HandoverNote = {
      id: Date.now().toString(),
      ...newNote,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      nurseFrom: 'Current Nurse'
    };

    setOutgoingNotes([...outgoingNotes, note]);
    
    dispatch(addNotification({
      type: 'success',
      title: 'Handover Note Added',
      message: `Note added for ${newNote.patientName} in room ${newNote.room}`,
      priority: 'medium',
      category: 'system'
    }));

    setNewNote({
      patientName: '',
      room: '',
      priority: 'medium',
      category: 'care',
      note: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Shift Handover</h1>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          {new Date().toLocaleString()}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'incoming'
              ? 'bg-white text-nurse-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Incoming Notes ({incomingNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'outgoing'
              ? 'bg-white text-nurse-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Notes ({outgoingNotes.length})
        </button>
      </div>

      {activeTab === 'incoming' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Notes from Previous Shift</h2>
          {incomingNotes.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No handover notes from previous shift</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {incomingNotes.map((note) => (
                <Card key={note.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(note.category)}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{note.patientName}</h3>
                        <p className="text-sm text-gray-600">Room {note.room}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(note.priority)}`}>
                        {note.priority}
                      </span>
                      <span className="text-sm text-gray-500">{note.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{note.note}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      From: {note.nurseFrom}
                    </div>
                    <Button variant="secondary" size="sm">
                      Mark as Acknowledged
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'outgoing' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Handover Note</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Patient Name"
                  value={newNote.patientName}
                  onChange={(e) => setNewNote({ ...newNote, patientName: e.target.value })}
                  placeholder="Enter patient name"
                />
                <Input
                  label="Room Number"
                  value={newNote.room}
                  onChange={(e) => setNewNote({ ...newNote, room: e.target.value })}
                  placeholder="e.g., A101"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newNote.priority}
                    onChange={(e) => setNewNote({ ...newNote, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurse-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurse-500 focus:border-transparent"
                  >
                    <option value="care">General Care</option>
                    <option value="medication">Medication</option>
                    <option value="vitals">Vitals</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea
                  value={newNote.note}
                  onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
                  placeholder="Enter detailed handover note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurse-500 focus:border-transparent"
                />
              </div>
              <Button onClick={handleAddNote} disabled={!newNote.patientName || !newNote.room || !newNote.note}>
                Add Note
              </Button>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Handover Notes</h2>
            {outgoingNotes.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No handover notes created yet</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {outgoingNotes.map((note) => (
                  <Card key={note.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getCategoryIcon(note.category)}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{note.patientName}</h3>
                          <p className="text-sm text-gray-600">Room {note.room}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(note.priority)}`}>
                          {note.priority}
                        </span>
                        <span className="text-sm text-gray-500">{note.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{note.note}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};