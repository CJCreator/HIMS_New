import { useState } from 'react';
import { Card, Button, Badge, Input } from '@/components';

interface CollaborationNote {
  id: string;
  author: string;
  role: string;
  message: string;
  timestamp: string;
  priority: 'normal' | 'urgent';
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'complete';
  dueTime: string;
}

interface CollaborationWorkspaceProps {
  patientId: string;
  patientName: string;
}

export function CollaborationWorkspace({ patientId, patientName }: CollaborationWorkspaceProps) {
  const [notes, setNotes] = useState<CollaborationNote[]>([
    {
      id: '1',
      author: 'Dr. Wilson',
      role: 'Doctor',
      message: 'Patient requires urgent lab work - HbA1c and lipid panel',
      timestamp: '2 min ago',
      priority: 'urgent'
    },
    {
      id: '2',
      author: 'Nurse Sarah',
      role: 'Nurse',
      message: 'Vitals stable, patient comfortable',
      timestamp: '5 min ago',
      priority: 'normal'
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Process HbA1c test', assignedTo: 'Lab Tech', status: 'in-progress', dueTime: '30 min' },
    { id: '2', title: 'Prepare prescription', assignedTo: 'Pharmacist', status: 'pending', dueTime: '15 min' }
  ]);

  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: CollaborationNote = {
      id: Date.now().toString(),
      author: 'Current User',
      role: 'Doctor',
      message: newNote,
      timestamp: 'Just now',
      priority: 'normal'
    };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-h4 text-neutral-900">Collaboration Workspace</h3>
          <p className="text-body-sm text-neutral-600">Patient: {patientName} ({patientId})</p>
        </div>
        <Badge status="pending">Live</Badge>
      </div>

      {/* Communication Thread */}
      <div className="mb-4">
        <h4 className="text-body font-medium mb-2">Team Communication</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
          {notes.map(note => (
            <div
              key={note.id}
              className={`p-3 rounded-small ${
                note.priority === 'urgent' ? 'bg-error/10 border-l-4 border-error' : 'bg-neutral-50'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span className="text-body-sm font-medium">{note.author}</span>
                  <span className="text-body-sm text-neutral-600"> • {note.role}</span>
                </div>
                <span className="text-body-sm text-neutral-600">{note.timestamp}</span>
              </div>
              <p className="text-body-sm">{note.message}</p>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Add note for team..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
            className="flex-1"
          />
          <Button size="sm" onClick={addNote}>Send</Button>
        </div>
      </div>

      {/* Task Assignment */}
      <div>
        <h4 className="text-body font-medium mb-2">Assigned Tasks</h4>
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded-small">
              <div className="flex-1">
                <p className="text-body-sm font-medium">{task.title}</p>
                <p className="text-body-sm text-neutral-600">{task.assignedTo} • Due: {task.dueTime}</p>
              </div>
              <Badge status={
                task.status === 'complete' ? 'delivered' :
                task.status === 'in-progress' ? 'pending' : 'sent'
              }>
                {task.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
