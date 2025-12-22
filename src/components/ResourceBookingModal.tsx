import React, { useState } from 'react';
import { Card, Button, Input } from './';
import { X, AlertCircle } from 'lucide-react';

interface ResourceBookingModalProps {
  onClose: () => void;
  resourceType: 'room' | 'equipment';
}

export const ResourceBookingModal: React.FC<ResourceBookingModalProps> = ({ onClose, resourceType }) => {
  const [formData, setFormData] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    department: ''
  });

  const [conflict, setConflict] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate conflict check
    if (formData.startTime === '10:00') {
      setConflict(true);
      return;
    }
    alert('Resource booked successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Book {resourceType === 'room' ? 'Room' : 'Equipment'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {resourceType === 'room' ? 'Room' : 'Equipment'} *
            </label>
            <select
              value={formData.resourceId}
              onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select {resourceType}</option>
              <option value="1">Room 101</option>
              <option value="2">Room 102</option>
            </select>
          </div>

          <Input
            label="Date *"
            type="date"
            value={formData.date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time *"
              type="time"
              value={formData.startTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              label="End Time *"
              type="time"
              value={formData.endTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <Input
            label="Department *"
            value={formData.department}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, department: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
            <textarea
              rows={3}
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {conflict && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Booking Conflict</p>
                <p>This resource is already booked for the selected time slot.</p>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Book Resource
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
