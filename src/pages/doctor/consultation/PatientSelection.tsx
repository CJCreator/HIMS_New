import { useState } from 'react';
import { ConsultationLayout } from '@/components/ConsultationLayout';
import { Card, Input, Button } from '@/components';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit?: string;
}

const patients: Patient[] = [
  { id: '1', name: 'John Smith', age: 45, gender: 'Male', phone: '+1-555-0123', lastVisit: '2024-01-10' },
  { id: '2', name: 'Sarah Johnson', age: 32, gender: 'Female', phone: '+1-555-0124', lastVisit: '2024-01-08' },
  { id: '3', name: 'Mike Wilson', age: 28, gender: 'Male', phone: '+1-555-0125' },
];

interface PatientSelectionProps {
  onNext: (patientId: string) => void;
  onSave: () => void;
}

export function PatientSelection({ onNext, onSave }: PatientSelectionProps) {
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <ConsultationLayout
      currentStep={1}
      totalSteps={14}
      title="Patient Selection"
      onNext={() => selectedPatient && onNext(selectedPatient)}
      onSave={onSave}
      nextDisabled={!selectedPatient}
    >
      <Card>
        <h2 className="text-h4 text-neutral-900 mb-4">Select Patient for Consultation</h2>
        
        <div className="mb-6">
          <Input
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={`p-4 border rounded-small cursor-pointer transition-colors ${
                selectedPatient === patient.id
                  ? 'border-doctor bg-doctor/5'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
              onClick={() => setSelectedPatient(patient.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-body font-medium text-neutral-900">{patient.name}</h3>
                  <p className="text-body-sm text-neutral-600">
                    {patient.age} years • {patient.gender} • {patient.phone}
                  </p>
                  {patient.lastVisit && (
                    <p className="text-body-sm text-neutral-500">
                      Last visit: {patient.lastVisit}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedPatient === patient.id}
                    onChange={() => setSelectedPatient(patient.id)}
                    className="text-doctor focus:ring-doctor"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8">
            <p className="text-body text-neutral-500">No patients found matching your search.</p>
            <Button variant="secondary" className="mt-4">
              Register New Patient
            </Button>
          </div>
        )}
      </Card>
    </ConsultationLayout>
  );
}