import { Card, Button, Badge, AutomatedQualityChecks } from '@/components';
import { UnifiedPatientContext } from '@/components/UnifiedPatientContext';

interface FinalReviewStationProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}

export function FinalReviewStation({ onNext, onPrevious, onSave }: FinalReviewStationProps) {
  const patientData = {
    patientId: 'P001',
    patientName: 'John Smith',
    age: 45,
    gender: 'Male',
    allergies: ['Penicillin', 'Sulfa drugs'],
    currentMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
    vitalSigns: { bp: '120/80', hr: 72, temp: 98.6, o2: 98 }
  };

  const consultationData = {
    chiefComplaint: 'Elevated blood sugar levels',
    diagnosis: 'Type 2 Diabetes - Uncontrolled (E11.65)',
    medications: ['Metformin 500mg - 1 tablet daily', 'Glipizide 5mg - 1 tablet daily'],
    labTests: ['HbA1c', 'Lipid Panel'],
    followUp: '2 weeks'
  };

  const validationChecks = [
    { item: 'Chief Complaint', status: 'complete' },
    { item: 'Diagnosis with ICD-10', status: 'complete' },
    { item: 'Prescription', status: 'complete' },
    { item: 'Drug Interaction Check', status: 'complete' },
    { item: 'Allergy Verification', status: 'complete' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h3 text-neutral-900">Final Review Station</h2>
        <div className="flex gap-2">
          <Button variant="tertiary" size="sm" onClick={onPrevious}>← Back</Button>
          <Button variant="secondary" size="sm" onClick={onSave}>Save Draft</Button>
          <Button onClick={onNext}>Complete & Send →</Button>
        </div>
      </div>

      <UnifiedPatientContext {...patientData} />

      {/* Automated Quality Checks */}
      <AutomatedQualityChecks consultationData={consultationData} />

      {/* Automated Validation Checks */}
      <Card className="bg-success/10 border-success">
        <h3 className="text-h4 text-neutral-900 mb-3">✅ Automated Validation Complete</h3>
        <div className="grid grid-cols-2 gap-2">
          {validationChecks.map((check, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-small">
              <span className="text-success">✓</span>
              <span className="text-body-sm">{check.item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Comprehensive Review */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-h4 text-neutral-900">Clinical Assessment</h3>
            <Button variant="tertiary" size="sm">Edit</Button>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-body-sm font-medium text-neutral-700">Chief Complaint</p>
              <p className="text-body">{consultationData.chiefComplaint}</p>
            </div>
            <div>
              <p className="text-body-sm font-medium text-neutral-700">Diagnosis</p>
              <p className="text-body">{consultationData.diagnosis}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-h4 text-neutral-900">Treatment Plan</h3>
            <Button variant="tertiary" size="sm">Edit</Button>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-body-sm font-medium text-neutral-700">Medications</p>
              {consultationData.medications.map((med, idx) => (
                <p key={idx} className="text-body-sm">{med}</p>
              ))}
            </div>
            <div>
              <p className="text-body-sm font-medium text-neutral-700">Lab Tests</p>
              <p className="text-body-sm">{consultationData.labTests.join(', ')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cross-Role Verification */}
      <Card className="bg-info/10">
        <h3 className="text-h4 text-neutral-900 mb-3">Multi-Role Safety Checks</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white rounded-small">
            <span className="text-body-sm">Nurse vitals verification</span>
            <Badge status="delivered">Verified</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white rounded-small">
            <span className="text-body-sm">Pharmacy drug interaction check</span>
            <Badge status="delivered">Clear</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white rounded-small">
            <span className="text-body-sm">Lab test availability</span>
            <Badge status="delivered">Available</Badge>
          </div>
        </div>
      </Card>

      {/* Digital Signature */}
      <Card>
        <h3 className="text-h4 text-neutral-900 mb-3">Digital Signature</h3>
        <div className="border-2 border-dashed border-neutral-300 rounded-small p-4 text-center">
          <p className="text-body-sm text-neutral-600 mb-2">Sign to complete consultation</p>
          <Button variant="primary">Sign Consultation</Button>
        </div>
      </Card>
    </div>
  );
}
