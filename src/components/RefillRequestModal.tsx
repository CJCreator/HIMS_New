import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { requestRefill } from '@/store/prescriptionSlice';
import { Button, Modal } from '@/components';

interface RefillRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: {
    id: string;
    medications: Array<{ name: string; dosage: string }>;
    refillsRemaining?: number;
  };
}

export function RefillRequestModal({ isOpen, onClose, prescription }: RefillRequestModalProps) {
  const dispatch = useDispatch();
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    dispatch(requestRefill(prescription.id));
    onClose();
    setReason('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Refill" size="md">
      <div className="space-y-4">
        <div className="p-4 bg-neutral-50 rounded-lg">
          <p className="text-sm font-medium text-neutral-900 mb-2">Prescription Details</p>
          {prescription.medications.map((med, idx) => (
            <p key={idx} className="text-sm text-neutral-700">
              {med.name} - {med.dosage}
            </p>
          ))}
          {prescription.refillsRemaining !== undefined && (
            <p className="text-sm text-neutral-600 mt-2">
              Refills remaining: {prescription.refillsRemaining}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Reason for refill (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="block w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Running low on medication..."
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            ℹ️ Your refill request will be sent to your doctor for approval. You'll be notified once approved.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Request Refill
          </Button>
        </div>
      </div>
    </Modal>
  );
}
