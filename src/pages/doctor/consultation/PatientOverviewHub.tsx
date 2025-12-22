import { useState } from 'react';
import { Card, Input, Button } from '@/components';
import { UnifiedPatientContext } from '@/components/UnifiedPatientContext';

interface PatientOverviewHubProps {
  onNext: () => void;
  onSave: () => void;
}

export function PatientOverviewHub({ onNext, onSave }: PatientOverviewHubProps) {
  const [expanded, setExpanded] = useState({ history: true, vitals: true });

  const patientData = {
    patientId: 'P001',
    patientName: 'John Smith',
    age: 45,
    gender: 'Male',
    allergies: ['Penicillin', 'Sulfa drugs'],
    currentMedications: ['Metformin 500mg', 'Lisinopril 10mg'],
    vitalSigns: { bp: '120/80', hr: 72, temp: 98.6, o2: 98 },
    lastVisit: '2024-01-15'
  };

  const medicalHistory = [
    { date: '2024-01-15', condition: 'Type 2 Diabetes', status: 'Ongoing' },
    { date: '2023-11-20', condition: 'Hypertension', status: 'Controlled' },
    { date: '2023-06-10', condition: 'Annual Checkup', status: 'Completed' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h3 text-neutral-900">Patient Overview Hub</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onSave}>Save Draft</Button>
          <Button onClick={onNext}>Continue to Assessment →</Button>
        </div>
      </div>

      <UnifiedPatientContext {...patientData} />

      {/* Medical History - Collapsible */}
      <Card>
        <div className="flex justify-between items-center mb-3 cursor-pointer" onClick={() => setExpanded(prev => ({ ...prev, history: !prev.history }))}>
          <h3 className="text-h4 text-neutral-900">Medical History</h3>
          <span className="text-body">{expanded.history ? '▼' : '▶'}</span>
        </div>
        {expanded.history && (
          <div className="space-y-2">
            <Input placeholder="Search medical history..." className="mb-3" />
            {medicalHistory.map((item, idx) => (
              <div key={idx} className="p-3 bg-neutral-50 rounded-small flex justify-between">
                <div>
                  <p className="text-body font-medium">{item.condition}</p>
                  <p className="text-body-sm text-neutral-600">{item.date}</p>
                </div>
                <span className={`text-body-sm ${item.status === 'Ongoing' ? 'text-warning' : 'text-success'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Vital Signs - Collapsible */}
      <Card>
        <div className="flex justify-between items-center mb-3 cursor-pointer" onClick={() => setExpanded(prev => ({ ...prev, vitals: !prev.vitals }))}>
          <h3 className="text-h4 text-neutral-900">Vital Signs (Recorded by Nurse)</h3>
          <span className="text-body">{expanded.vitals ? '▼' : '▶'}</span>
        </div>
        {expanded.vitals && (
          <>
            <div className="p-3 bg-success/10 rounded-small mb-3">
              <p className="text-body text-success">✅ Vitals completed by Nurse Sarah at 9:45 AM</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-white rounded-small border">
                <div className="text-body-sm font-medium">Blood Pressure</div>
                <div className="text-h4 text-neutral-900">{patientData.vitalSigns.bp}</div>
                <div className="text-body-sm text-neutral-600">mmHg</div>
              </div>
              <div className="text-center p-3 bg-white rounded-small border">
                <div className="text-body-sm font-medium">Heart Rate</div>
                <div className="text-h4 text-neutral-900">{patientData.vitalSigns.hr}</div>
                <div className="text-body-sm text-neutral-600">bpm</div>
              </div>
              <div className="text-center p-3 bg-white rounded-small border">
                <div className="text-body-sm font-medium">Temperature</div>
                <div className="text-h4 text-neutral-900">{patientData.vitalSigns.temp}</div>
                <div className="text-body-sm text-neutral-600">°F</div>
              </div>
              <div className="text-center p-3 bg-white rounded-small border">
                <div className="text-body-sm font-medium">O2 Saturation</div>
                <div className="text-h4 text-neutral-900">{patientData.vitalSigns.o2}</div>
                <div className="text-body-sm text-neutral-600">%</div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="bg-neutral-50">
        <h4 className="text-body font-medium mb-2">Quick Actions</h4>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">View Full History</Button>
          <Button variant="secondary" size="sm">View Lab Results</Button>
          <Button variant="secondary" size="sm">View Prescriptions</Button>
        </div>
      </Card>
    </div>
  );
}
