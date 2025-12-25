import { Modal, Button, Badge } from '@/components';

interface PatientDetailsModalProps {
  patient: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export function PatientDetailsModal({ patient, isOpen, onClose, onEdit }: PatientDetailsModalProps) {
  if (!patient) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Patient Details" size="lg">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-h3 text-neutral-900">{patient.name}</h3>
            <p className="text-body text-neutral-600">ID: {patient.id}</p>
          </div>
          <Badge status="delivered">Active</Badge>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-body font-medium text-neutral-900 mb-3">Personal Information</h4>
            <div className="space-y-2">
              <div>
                <p className="text-body-sm text-neutral-600">Age</p>
                <p className="text-body">{patient.age} years</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Gender</p>
                <p className="text-body">{patient.gender || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Phone</p>
                <p className="text-body">{patient.phone}</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Email</p>
                <p className="text-body">{patient.email || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-body font-medium text-neutral-900 mb-3">Medical Information</h4>
            <div className="space-y-2">
              <div>
                <p className="text-body-sm text-neutral-600">Allergies</p>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.map((allergy: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-body">None reported</p>
                )}
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Current Medications</p>
                {patient.currentMedications && patient.currentMedications.length > 0 ? (
                  <ul className="list-disc list-inside text-body">
                    {patient.currentMedications.map((med: string, idx: number) => (
                      <li key={idx}>{med}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body">None</p>
                )}
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Medical History</p>
                {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                  <ul className="list-disc list-inside text-body">
                    {patient.medicalHistory.map((condition: string, idx: number) => (
                      <li key={idx}>{condition}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body">None reported</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-body font-medium text-neutral-900 mb-3">Emergency Contact</h4>
          <p className="text-body">{patient.emergencyContact || 'Not provided'}</p>
        </div>

        {patient.address && (
          <div>
            <h4 className="text-body font-medium text-neutral-900 mb-3">Address</h4>
            <p className="text-body">{patient.address}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {onEdit && <Button onClick={onEdit}>Edit Patient</Button>}
        </div>
      </div>
    </Modal>
  );
}
