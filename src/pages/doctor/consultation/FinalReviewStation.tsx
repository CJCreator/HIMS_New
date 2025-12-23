import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components';
import { AutomatedQualityChecks } from '@/components/AutomatedQualityChecks';
import { UnifiedPatientContext } from '@/components/UnifiedPatientContext';
import { mockDataService } from '@/services/mockDataService';

interface FinalReviewStationProps {
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  data?: any;
  setData?: (data: any) => void;
}

export function FinalReviewStation({ onNext, onPrevious, onSave, data, setData }: FinalReviewStationProps) {
  const [patientData, setPatientData] = useState<any>(null);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const patient = mockDataService.getPatient(data?.patientId || 'P001');
    const vitals = mockDataService.getVitals(data?.patientId || 'P001')[0];
    if (patient) {
      setPatientData({
        patientId: patient.id,
        patientName: patient.name,
        age: patient.age,
        gender: patient.gender,
        allergies: patient.allergies,
        currentMedications: patient.medications,
        vitalSigns: vitals || { bp: '120/80', hr: 72, temp: 98.6, o2: 98 }
      });
    }
  }, [data?.patientId]);

  const handleNext = () => {
    if (setData) setData({ ...data, finalReview: { signed, timestamp: Date.now() } });
    onNext();
  };

  const handleSave = () => {
    if (setData) setData({ ...data, finalReview: { signed, timestamp: Date.now() } });
    onSave();
  };

  const handleSign = () => {
    setSigned(true);
    alert('Consultation signed successfully!');
  };

  if (!patientData) return <div>Loading...</div>;

  const consultationData = {
    chiefComplaint: data?.clinicalAssessment?.chiefComplaint || 'Not recorded',
    diagnosis: data?.clinicalAssessment?.diagnosis || 'Not recorded',
    medications: data?.treatmentPlan?.medications?.map((m: any) => `${m.name} - ${m.dosage} ${m.frequency}`) || [],
    labTests: ['HbA1c', 'Lipid Panel'],
    followUp: '2 weeks'
  };

  const validationChecks = [
    { item: 'Chief Complaint', status: data?.clinicalAssessment?.chiefComplaint ? 'complete' : 'incomplete' },
    { item: 'Diagnosis with ICD-10', status: data?.clinicalAssessment?.diagnosis ? 'complete' : 'incomplete' },
    { item: 'Prescription', status: data?.treatmentPlan?.medications?.length > 0 ? 'complete' : 'incomplete' },
    { item: 'Drug Interaction Check', status: 'complete' },
    { item: 'Allergy Verification', status: 'complete' }
  ];

  const allComplete = validationChecks.every(c => c.status === 'complete');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h3 text-neutral-900">Final Review Station</h2>
        <div className="flex gap-2">
          <Button variant="tertiary" size="sm" onClick={onPrevious}>← Back</Button>
          <Button variant="secondary" size="sm" onClick={handleSave}>Save Draft</Button>
          <Button onClick={handleNext} disabled={!signed}>Complete & Send →</Button>
        </div>
      </div>

      <UnifiedPatientContext {...patientData} />

      {/* Automated Quality Checks */}
      <AutomatedQualityChecks consultationData={consultationData} />

      {/* Automated Validation Checks */}
      <Card className={allComplete ? 'bg-success/10 border-success' : 'bg-warning/10 border-warning'}>
        <h3 className="text-h4 text-neutral-900 mb-3">
          {allComplete ? '✅ Automated Validation Complete' : '⚠️ Validation Incomplete'}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {validationChecks.map((check, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-small">
              <span className={check.status === 'complete' ? 'text-success' : 'text-warning'}>
                {check.status === 'complete' ? '✓' : '⚠'}
              </span>
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
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-body-sm font-medium text-neutral-700">Medications</p>
              {consultationData.medications.length > 0 ? (
                consultationData.medications.map((med: string, idx: number) => (
                  <p key={idx} className="text-body-sm">{med}</p>
                ))
              ) : (
                <p className="text-body-sm text-neutral-500">No medications prescribed</p>
              )}
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
          {signed ? (
            <div className="text-success">
              <p className="text-h4 mb-2">✓ Signed</p>
              <p className="text-body-sm">Consultation signed at {new Date().toLocaleTimeString()}</p>
            </div>
          ) : (
            <>
              <p className="text-body-sm text-neutral-600 mb-2">Sign to complete consultation</p>
              <Button variant="primary" onClick={handleSign}>Sign Consultation</Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
