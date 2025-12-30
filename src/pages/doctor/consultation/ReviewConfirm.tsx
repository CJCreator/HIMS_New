import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/notificationSlice';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';

import { CheckCircle, AlertTriangle, FileText, PenTool } from 'lucide-react';

interface ReviewConfirmProps {
  patientName: string;
  patientId: string;
  onNext: () => void;
  onPrevious: () => void;
}

export const ReviewConfirm: React.FC<ReviewConfirmProps> = ({ 
  patientName, 
  patientId, 
  onNext, 
  onPrevious 
}) => {
  const dispatch = useDispatch();
  const [digitalSignature, setDigitalSignature] = useState('');
  const [confirmationChecks, setConfirmationChecks] = useState({
    reviewedDiagnosis: false,
    reviewedTreatment: false,
    reviewedPrescriptions: false,
    reviewedLabOrders: false,
    reviewedFollowUp: false,
    reviewedNotes: false
  });

  // Mock consultation data - in real app this would come from state
  const consultationSummary = {
    chiefComplaint: 'Persistent headache and fatigue for 3 days',
    diagnosis: 'Tension headache, likely stress-related',
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: '72',
      temperature: '98.6°F',
      respiratoryRate: '16'
    },
    prescriptions: [
      { medication: 'Ibuprofen', dosage: '400mg', frequency: 'Every 8 hours', duration: '5 days' },
      { medication: 'Acetaminophen', dosage: '500mg', frequency: 'As needed', duration: '7 days' }
    ],
    labOrders: [
      'Complete Blood Count (CBC)',
      'Basic Metabolic Panel'
    ],
    followUp: {
      scheduled: true,
      date: '2024-01-29',
      time: '10:00 AM',
      type: 'Routine follow-up'
    },
    notes: 'Patient reports significant stress at work. Recommended stress management techniques and adequate rest.'
  };

  const handleCheckboxChange = (key: keyof typeof confirmationChecks) => {
    setConfirmationChecks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const allChecksCompleted = Object.values(confirmationChecks).every(check => check);
  const hasDigitalSignature = digitalSignature.trim().length > 0;

  const handleConfirm = () => {
    if (!allChecksCompleted) {
      dispatch(addNotification({
      type: 'warning',
      title: 'Review Incomplete',
      message: 'Please review all sections before confirming the consultation',
      priority: 'medium',
      category: 'system'
    }));
      return;
    }

    if (!hasDigitalSignature) {
      dispatch(addNotification({
      type: 'warning',
      title: 'Signature Required',
      message: 'Please provide your digital signature to complete the consultation',
      priority: 'medium',
      category: 'system'
    }));
      return;
    }

    dispatch(addNotification({
      type: 'success',
      title: 'Consultation Completed',
      message: 'Consultation for ${patientName} has been completed and documented',
      priority: 'medium',
      category: 'system'
    }));

    onNext();
  };

  const generatePDF = () => {
    dispatch(addNotification({
      type: 'info',
      title: 'PDF Generated',
      message: 'Consultation summary PDF has been generated and saved',
      priority: 'medium',
      category: 'system'
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Review & Confirm</h2>
          <p className="text-gray-600">Review consultation summary for {patientName}</p>
        </div>
        <div className="text-sm text-gray-500">
          Step 13 of 13
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultation Summary */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Consultation Summary</h3>
            
            <div className="space-y-6">
              {/* Patient Info */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Patient Information</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Name:</strong> {patientName}</p>
                  <p><strong>ID:</strong> {patientId}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Chief Complaint</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p>{consultationSummary.chiefComplaint}</p>
                </div>
              </div>

              {/* Vital Signs */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Vital Signs</h4>
                <div className="bg-gray-50 p-3 rounded grid grid-cols-2 gap-4">
                  <p><strong>BP:</strong> {consultationSummary.vitalSigns.bloodPressure}</p>
                  <p><strong>HR:</strong> {consultationSummary.vitalSigns.heartRate} bpm</p>
                  <p><strong>Temp:</strong> {consultationSummary.vitalSigns.temperature}</p>
                  <p><strong>RR:</strong> {consultationSummary.vitalSigns.respiratoryRate}/min</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Diagnosis</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p>{consultationSummary.diagnosis}</p>
                </div>
              </div>

              {/* Prescriptions */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Prescriptions</h4>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  {consultationSummary.prescriptions.map((prescription, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                      <p><strong>{prescription.medication}</strong> {prescription.dosage}</p>
                      <p className="text-sm text-gray-600">{prescription.frequency} for {prescription.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Orders */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Lab Orders</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <ul className="list-disc list-inside space-y-1">
                    {consultationSummary.labOrders.map((lab, index) => (
                      <li key={index}>{lab}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Follow-up */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Follow-up</h4>
                <div className="bg-gray-50 p-3 rounded">
                  {consultationSummary.followUp.scheduled ? (
                    <div>
                      <p><strong>Scheduled:</strong> {consultationSummary.followUp.date} at {consultationSummary.followUp.time}</p>
                      <p><strong>Type:</strong> {consultationSummary.followUp.type}</p>
                    </div>
                  ) : (
                    <p>No follow-up scheduled</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Clinical Notes</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p>{consultationSummary.notes}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Review Checklist & Signature */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Review Checklist</h3>
            <div className="space-y-3">
              {[
                { key: 'reviewedDiagnosis', label: 'Diagnosis reviewed' },
                { key: 'reviewedTreatment', label: 'Treatment plan reviewed' },
                { key: 'reviewedPrescriptions', label: 'Prescriptions verified' },
                { key: 'reviewedLabOrders', label: 'Lab orders confirmed' },
                { key: 'reviewedFollowUp', label: 'Follow-up scheduled' },
                { key: 'reviewedNotes', label: 'Clinical notes complete' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={confirmationChecks[key as keyof typeof confirmationChecks]}
                    onChange={() => handleCheckboxChange(key as keyof typeof confirmationChecks)}
                    className="mr-3"
                  />
                  <span className={confirmationChecks[key as keyof typeof confirmationChecks] ? 'text-green-700' : 'text-gray-700'}>
                    {confirmationChecks[key as keyof typeof confirmationChecks] && <CheckCircle className="inline w-4 h-4 mr-1" />}
                    {label}
                  </span>
                </label>
              ))}
            </div>
            
            {!allChecksCompleted && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-700">Complete all reviews to proceed</span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Digital Signature</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <PenTool className="inline w-4 h-4 mr-1" />
                  Type your full name
                </label>
                <input
                  type="text"
                  value={digitalSignature}
                  onChange={(e) => setDigitalSignature(e.target.value)}
                  placeholder="Dr. [Your Full Name]"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
                />
              </div>
              <div className="text-xs text-gray-500">
                By signing, you confirm that all information is accurate and complete.
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={generatePDF}
                className="w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="secondary" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          variant="primary" 
          onClick={handleConfirm}
          disabled={!allChecksCompleted || !hasDigitalSignature}
        >
          Complete Consultation
        </Button>
      </div>
    </div>
  );
};