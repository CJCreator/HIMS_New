import { Modal, Button, Badge } from '@/components';
import { format } from 'date-fns';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

interface PrescriptionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: {
    id: string;
    patientName: string;
    patientId?: string;
    patientAge?: number;
    patientGender?: string;
    doctorName: string;
    prescriptionDate: string;
    diagnosis?: string;
    medications: Medication[];
    notes?: string;
    status: string;
    eSigned?: boolean;
    eSignedBy?: string;
    eSignedAt?: string;
  };
}

export function PrescriptionDetailModal({ isOpen, onClose, prescription }: PrescriptionDetailModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'dispensed':
        return <Badge status="delivered">Dispensed</Badge>;
      case 'ready':
        return <Badge status="sent">Ready</Badge>;
      case 'processing':
        return <Badge status="pending">Processing</Badge>;
      default:
        return <Badge status="request">Pending</Badge>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prescription Details" size="lg">
      <div className="space-y-6 print:p-8">
        {/* Header - Prescription Info */}
        <div className="flex justify-between items-start pb-4 border-b border-neutral-200">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-1">Prescription #{prescription.id}</h2>
            <p className="text-sm text-neutral-600">
              Date: {format(new Date(prescription.prescriptionDate), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
          <div className="print:hidden">
            {getStatusBadge(prescription.status)}
          </div>
        </div>

        {/* Patient Information */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Patient Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-neutral-600">Name</p>
                <p className="text-sm font-medium text-neutral-900">{prescription.patientName}</p>
              </div>
              {prescription.patientId && (
                <div>
                  <p className="text-xs text-neutral-600">Patient ID</p>
                  <p className="text-sm font-medium text-neutral-900">{prescription.patientId}</p>
                </div>
              )}
              {prescription.patientAge && (
                <div>
                  <p className="text-xs text-neutral-600">Age</p>
                  <p className="text-sm font-medium text-neutral-900">{prescription.patientAge} years</p>
                </div>
              )}
              {prescription.patientGender && (
                <div>
                  <p className="text-xs text-neutral-600">Gender</p>
                  <p className="text-sm font-medium text-neutral-900 capitalize">{prescription.patientGender}</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Prescriber Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-neutral-600">Doctor</p>
                <p className="text-sm font-medium text-neutral-900">{prescription.doctorName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Date Prescribed</p>
                <p className="text-sm font-medium text-neutral-900">
                  {format(new Date(prescription.prescriptionDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        {prescription.diagnosis && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Diagnosis</h3>
            <p className="text-sm text-neutral-900">{prescription.diagnosis}</p>
          </div>
        )}

        {/* Medications */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Medications</h3>
          <div className="space-y-3">
            {prescription.medications.map((med, idx) => (
              <div key={idx} className="p-4 border-2 border-neutral-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-base font-semibold text-neutral-900">{med.name}</h4>
                  <span className="text-sm text-neutral-600">Qty: {med.quantity}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <div>
                    <p className="text-xs text-neutral-600">Dosage</p>
                    <p className="text-sm font-medium text-neutral-900">{med.dosage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600">Frequency</p>
                    <p className="text-sm font-medium text-neutral-900">{med.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600">Duration</p>
                    <p className="text-sm font-medium text-neutral-900">{med.duration}</p>
                  </div>
                </div>
                {med.instructions && (
                  <div className="pt-2 border-t border-neutral-200">
                    <p className="text-xs text-neutral-600 mb-1">Instructions</p>
                    <p className="text-sm text-neutral-900 italic">{med.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Notes */}
        {prescription.notes && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Clinical Notes</h3>
            <p className="text-sm text-neutral-900">{prescription.notes}</p>
          </div>
        )}

        {/* E-Signature Status */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">E-Signature Status</h3>
          {prescription.eSigned ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-medium text-success">Electronically Signed</p>
                {prescription.eSignedBy && (
                  <p className="text-xs text-neutral-600">
                    By {prescription.eSignedBy} on {prescription.eSignedAt && format(new Date(prescription.eSignedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏳</span>
              <p className="text-sm font-medium text-warning">Pending E-Signature</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between gap-2 pt-4 border-t border-neutral-200 print:hidden">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handlePrint}>
              🖨️ Print
            </Button>
            <Button variant="primary">
              📧 Send to Patient
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
