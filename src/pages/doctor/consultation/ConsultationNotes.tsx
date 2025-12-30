import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/notificationSlice';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';

import { Save, Mic, FileText } from 'lucide-react';

interface ConsultationNotesProps {
  patientName: string;
  patientId: string;
  onNext: () => void;
  onPrevious: () => void;
}

export const ConsultationNotes: React.FC<ConsultationNotesProps> = ({ 
  patientName, 
  patientId, 
  onNext, 
  onPrevious 
}) => {
  const dispatch = useDispatch();
  const [notes, setNotes] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  const templates = [
    {
      id: 'general',
      name: 'General Consultation',
      content: `CHIEF COMPLAINT:
[Patient's main concern]

HISTORY OF PRESENT ILLNESS:
[Detailed description of current symptoms]

PHYSICAL EXAMINATION:
[Examination findings]

ASSESSMENT:
[Clinical impression and diagnosis]

PLAN:
[Treatment plan and follow-up]`
    },
    {
      id: 'followup',
      name: 'Follow-up Visit',
      content: `FOLLOW-UP VISIT:
[Date of last visit and reason for follow-up]

INTERVAL HISTORY:
[Changes since last visit]

CURRENT STATUS:
[Current symptoms and condition]

MEDICATION REVIEW:
[Current medications and compliance]

PLAN:
[Adjustments to treatment plan]`
    },
    {
      id: 'emergency',
      name: 'Emergency Consultation',
      content: `EMERGENCY CONSULTATION:
Time of presentation: [Time]
Mode of arrival: [Ambulance/Walk-in]

PRESENTING COMPLAINT:
[Urgent symptoms]

VITAL SIGNS:
[Current vital signs]

IMMEDIATE ASSESSMENT:
[Urgent findings]

EMERGENCY INTERVENTIONS:
[Immediate treatments given]

DISPOSITION:
[Admit/Discharge/Transfer]`
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    if (notes.trim()) {
      setAutoSaveStatus('saving');
      const timer = setTimeout(() => {
        // Here you would save to backend
        setAutoSaveStatus('saved');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notes]);

  const handleTemplateSelect = (templateContent: string) => {
    if (notes.trim() && !window.confirm('This will replace your current notes. Continue?')) {
      return;
    }
    setNotes(templateContent);
    setSelectedTemplate('');
  };

  const handleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Mock voice recording
      setTimeout(() => {
        setIsRecording(false);
        setNotes(prev => prev + '\n[Voice note transcribed: Patient reports improvement in symptoms since last visit.]');
        dispatch(addNotification({
      type: 'success',
      title: 'Voice Note Added',
      message: 'Voice recording has been transcribed and added to notes',
      priority: 'medium',
      category: 'system'
    }));
      }, 3000);
    }
  };

  const handleSave = () => {
    if (!notes.trim()) {
      dispatch(addNotification({
      type: 'warning',
      title: 'Empty Notes',
      message: 'Please add consultation notes before continuing',
      priority: 'medium',
      category: 'system'
    }));
      return;
    }

    dispatch(addNotification({
      type: 'success',
      title: 'Notes Saved',
      message: 'Consultation notes have been saved successfully',
      priority: 'medium',
      category: 'system'
    }));

    onNext();
  };

  const wordCount = notes.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Consultation Notes</h2>
          <p className="text-gray-600">Document consultation details for {patientName}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Step 12 of 13
          </div>
          <div className={`text-sm px-2 py-1 rounded ${
            autoSaveStatus === 'saved' ? 'bg-green-100 text-green-700' :
            autoSaveStatus === 'saving' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {autoSaveStatus === 'saved' && '✓ Saved'}
            {autoSaveStatus === 'saving' && '⏳ Saving...'}
            {autoSaveStatus === 'unsaved' && '○ Unsaved'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Notes Editor */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Consultation Notes</h3>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleVoiceRecording}
                  disabled={isRecording}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? 'Recording...' : 'Voice Note'}
                </Button>
                <select
                  value={selectedTemplate}
                  onChange={(e) => {
                    const template = templates.find(t => t.id === e.target.value);
                    if (template) {
                      handleTemplateSelect(template.content);
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
                >
                  <option value="">Select Template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter detailed consultation notes here..."
              className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent resize-none font-mono text-sm"
            />
            
            <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
              <span>{wordCount} words</span>
              <span>Last saved: {new Date().toLocaleTimeString()}</span>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Templates</h3>
            <div className="space-y-2">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.content)}
                  className="w-full text-left p-2 text-sm rounded hover:bg-gray-50 border border-gray-200"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Patient Info</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <span className="ml-2 text-gray-900">{patientName}</span>
              </div>
              <div>
                <span className="text-gray-500">ID:</span>
                <span className="ml-2 text-gray-900">{patientId}</span>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-2 text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Time:</span>
                <span className="ml-2 text-gray-900">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="secondary" onClick={onPrevious}>
          Previous
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Notes & Continue
        </Button>
      </div>
    </div>
  );
};