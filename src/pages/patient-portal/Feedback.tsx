import { useState } from 'react';
import { Card, Modal } from '@/components';
import { FeedbackForm } from '@/components/FeedbackForm';

export function Feedback() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFeedbackSubmit = () => {
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Share Your Feedback</h1>
        <p className="text-sm text-neutral-600 mt-1">Help us improve our services</p>
      </div>

      <Card className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Recent Appointment</h2>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-900 font-medium">Dr. Wilson</p>
            <p className="text-xs text-neutral-600">January 15, 2024 • General Consultation</p>
          </div>
        </div>

        <FeedbackForm
          appointmentId="APT001"
          doctorName="Dr. Wilson"
          onSubmit={handleFeedbackSubmit}
        />
      </Card>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thank You!"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-lg font-medium text-neutral-900 mb-2">Feedback Submitted</p>
          <p className="text-sm text-neutral-600">
            Thank you for taking the time to share your experience with us.
          </p>
        </div>
      </Modal>
    </div>
  );
}
