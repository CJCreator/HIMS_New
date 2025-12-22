import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/notificationSlice';
import { Button } from './Button';
import { Modal } from './Modal';

interface EmergencyAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [alertType, setAlertType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleEmergencyAlert = () => {
    dispatch(addNotification({
      type: 'error',
      title: '🚨 EMERGENCY ALERT',
      message: '${alertType} at ${location}: ${description}',
      priority: 'urgent',
      category: 'system'
    }));

    // Simulate broadcasting to all users
    setTimeout(() => {
      dispatch(addNotification({
      type: 'info',
      title: 'Emergency Response',
      message: 'Emergency team has been notified and is responding',
      priority: 'medium',
      category: 'system'
    }));
    }, 2000);

    onClose();
    setAlertType('');
    setLocation('');
    setDescription('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🚨 Emergency Alert System">
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm font-medium">
            ⚠️ This will send an immediate alert to all hospital staff
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Type</label>
          <select
            value={alertType}
            onChange={(e) => setAlertType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Select emergency type</option>
            <option value="Code Blue">Code Blue - Cardiac Arrest</option>
            <option value="Code Red">Code Red - Fire Emergency</option>
            <option value="Code Gray">Code Gray - Security Alert</option>
            <option value="Code Yellow">Code Yellow - Missing Patient</option>
            <option value="Code Green">Code Green - Emergency Activation</option>
            <option value="Code Black">Code Black - Bomb Threat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., ICU Room 301, Emergency Department"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the emergency situation"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            variant="primary" 
            onClick={handleEmergencyAlert}
            disabled={!alertType || !location}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            🚨 Send Emergency Alert
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const EmergencyButton: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowAlert(true)}
        className="fixed bottom-4 left-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg z-50 animate-pulse"
        title="Emergency Alert"
      >
        <span className="text-xl">🚨</span>
      </button>
      
      <EmergencyAlert 
        isOpen={showAlert} 
        onClose={() => setShowAlert(false)} 
      />
    </>
  );
};