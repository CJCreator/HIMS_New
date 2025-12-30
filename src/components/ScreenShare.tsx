import React, { useState } from 'react';
import { Button } from './Button';
import { FaDesktop, FaSquare } from 'react-icons/fa';

const Monitor = FaDesktop;
const Square = FaSquare;

interface ScreenShareProps {
  isSharing: boolean;
  onToggleShare: () => void;
}

export const ScreenShare: React.FC<ScreenShareProps> = ({ isSharing, onToggleShare }) => {
  const [shareType, setShareType] = useState<'screen' | 'window' | 'tab'>('screen');

  const handleStartShare = async () => {
    try {
      // In real implementation, this would use navigator.mediaDevices.getDisplayMedia()
      console.log(`Starting ${shareType} share...`);
      onToggleShare();
    } catch (error) {
      console.error('Error starting screen share:', error);
      alert('Failed to start screen sharing. Please check permissions.');
    }
  };

  const handleStopShare = () => {
    console.log('Stopping screen share...');
    onToggleShare();
  };

  if (isSharing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Monitor className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Screen Sharing Active</h3>
            <p className="text-gray-600">Your screen is being shared with the patient.</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              ⚠️ Make sure to only share relevant medical information and close any sensitive applications.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleStopShare} className="flex-1">
              Stop Sharing
            </Button>
            <Button variant="primary" onClick={() => {}} className="flex-1">
              Switch Source
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Screen</h3>
          <p className="text-gray-600">Choose what you'd like to share with the patient.</p>
        </div>

        <div className="space-y-3 mb-6">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="shareType"
              value="screen"
              checked={shareType === 'screen'}
              onChange={(e) => setShareType(e.target.value as any)}
              className="mr-3"
            />
            <Monitor className="w-6 h-6 mr-3 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Entire Screen</p>
              <p className="text-sm text-gray-600">Share everything on your screen</p>
            </div>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="shareType"
              value="window"
              checked={shareType === 'window'}
              onChange={(e) => setShareType(e.target.value as any)}
              className="mr-3"
            />
            <Square className="w-6 h-6 mr-3 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Application Window</p>
              <p className="text-sm text-gray-600">Share a specific application</p>
            </div>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="shareType"
              value="tab"
              checked={shareType === 'tab'}
              onChange={(e) => setShareType(e.target.value as any)}
              className="mr-3"
            />
            <Square className="w-6 h-6 mr-3 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Browser Tab</p>
              <p className="text-sm text-gray-600">Share a specific browser tab</p>
            </div>
          </label>
        </div>

        <div className="flex space-x-3">
          <Button variant="secondary" onClick={onToggleShare} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStartShare} className="flex-1">
            Start Sharing
          </Button>
        </div>
      </div>
    </div>
  );
};