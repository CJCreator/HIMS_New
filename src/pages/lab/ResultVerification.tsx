import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { verifyLabResult, rejectLabResult } from '@/store/labResultsSlice';
import { addNotification, addRoleNotification } from '@/store/notificationSlice';
import { Card, Button, Modal, Input } from '@/components';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const ResultVerification = () => {
  const dispatch = useDispatch();
  const { results } = useSelector((state: RootState) => state.labResults);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pendingResults = useMemo(() => 
    results.filter(r => r.status === 'pending'),
    [results]
  );

  const handleVerifyClick = (result: any) => {
    setSelectedResult(result);
    setShowVerifyModal(true);
  };

  const handleRejectClick = (result: any) => {
    setSelectedResult(result);
    setShowRejectModal(true);
  };

  const confirmVerify = async () => {
    if (!selectedResult) return;

    setIsLoading(true);
    try {
      dispatch(verifyLabResult(selectedResult.id));

      dispatch(addNotification({
        type: 'success',
        title: 'Result Verified',
        message: `Lab result for ${selectedResult.patientName} verified and released`,
        priority: 'medium',
        category: 'lab'
      }));

      dispatch(addRoleNotification({
        role: 'doctor',
        type: 'info',
        title: 'Lab Results Verified',
        message: `Verified lab results for ${selectedResult.patientName} are now available`,
        priority: 'high',
        category: 'lab'
      }));

      if (selectedResult.critical) {
        dispatch(addRoleNotification({
          role: 'doctor',
          type: 'error',
          title: 'Critical Lab Results Verified',
          message: `CRITICAL: ${selectedResult.patientName} - ${selectedResult.testName} requires immediate attention`,
          priority: 'urgent',
          category: 'lab'
        }));
      }

      toast.success('Result verified and released');
      setShowVerifyModal(false);
      setVerificationNotes('');
      setSelectedResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedResult || !rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setIsLoading(true);
    try {
      dispatch(rejectLabResult({ id: selectedResult.id, reason: rejectReason }));

      dispatch(addNotification({
        type: 'warning',
        title: 'Result Rejected',
        message: `Lab result for ${selectedResult.patientName} rejected: ${rejectReason}`,
        priority: 'high',
        category: 'lab'
      }));

      toast.warning('Result rejected');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Result Verification</h1>
        <p className="text-gray-600 mt-1">Review and verify lab results before release</p>
      </div>

      <div className="space-y-4">
        {pendingResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No results pending verification</p>
          </div>
        ) : (
          pendingResults.map((result) => (
            <Card key={result.id} className={`p-6 ${result.critical ? 'border-red-300 bg-red-50' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{result.testName}</h3>
                    {result.critical && (
                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>CRITICAL</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Order: {result.orderId} • Patient: {result.patientName}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Result</p>
                  <p className="font-semibold text-gray-900">{result.result}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Normal Range</p>
                  <p className="font-semibold text-gray-900">{result.normalRange}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Entered By</p>
                  <p className="font-semibold text-gray-900">{result.enteredBy}</p>
                  <p className="text-xs text-gray-500">{result.enteredAt}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  onClick={() => handleVerifyClick(result)}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify & Release</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleRejectClick(result)}
                  className="flex items-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Verify Modal */}
      {selectedResult && (
        <Modal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          title="Verify Lab Result"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-body-sm text-neutral-600">Patient: {selectedResult.patientName}</p>
              <p className="text-body-sm text-neutral-600">Test: {selectedResult.testName}</p>
              <p className="text-body-sm text-neutral-600">Result: {selectedResult.result}</p>
              <p className="text-body-sm text-neutral-600">Normal Range: {selectedResult.normalRange}</p>
            </div>

            {selectedResult.critical && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-body-sm font-medium text-red-900">⚠️ This is a CRITICAL result. Doctor will be notified immediately.</p>
              </div>
            )}

            <div>
              <label className="block text-body font-medium text-neutral-700 mb-1">Verification Notes (Optional)</label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add any verification notes..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowVerifyModal(false)}>Cancel</Button>
              <Button onClick={confirmVerify} loading={isLoading}>Verify & Release</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {selectedResult && (
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Lab Result"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-body-sm text-neutral-600">Patient: {selectedResult.patientName}</p>
              <p className="text-body-sm text-neutral-600">Test: {selectedResult.testName}</p>
              <p className="text-body-sm text-neutral-600">Result: {selectedResult.result}</p>
            </div>

            <div>
              <label className="block text-body font-medium text-neutral-700 mb-1">Rejection Reason *</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Cancel</Button>
              <Button onClick={confirmReject} loading={isLoading}>Confirm Rejection</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
