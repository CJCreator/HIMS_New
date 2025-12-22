import { Card } from './Card';
import { Badge } from './Badge';

interface PatientContextProps {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  allergies: string[];
  currentMedications: string[];
  vitalSigns?: {
    bp: string;
    hr: number;
    temp: number;
    o2: number;
  };
  lastVisit?: string;
}

export function UnifiedPatientContext({ 
  patientName, 
  age, 
  gender, 
  allergies, 
  currentMedications,
  vitalSigns,
  lastVisit 
}: PatientContextProps) {
  return (
    <Card className="mb-4 bg-primary-50 border-primary-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-h4 text-neutral-900">{patientName}</h3>
          <p className="text-body-sm text-neutral-600">{age}Y • {gender} • Last visit: {lastVisit || 'First visit'}</p>
        </div>
        {vitalSigns && (
          <div className="flex gap-2 text-body-sm">
            <span>BP: {vitalSigns.bp}</span>
            <span>HR: {vitalSigns.hr}</span>
            <span>Temp: {vitalSigns.temp}°F</span>
            <span>O2: {vitalSigns.o2}%</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-body-sm font-medium text-neutral-700 mb-1">Allergies</p>
          <div className="flex flex-wrap gap-1">
            {allergies.length > 0 ? (
              allergies.map((allergy, idx) => (
                <Badge key={idx} status="error">{allergy}</Badge>
              ))
            ) : (
              <span className="text-body-sm text-neutral-500">None</span>
            )}
          </div>
        </div>
        <div>
          <p className="text-body-sm font-medium text-neutral-700 mb-1">Current Medications</p>
          <div className="flex flex-wrap gap-1">
            {currentMedications.length > 0 ? (
              currentMedications.slice(0, 3).map((med, idx) => (
                <Badge key={idx} status="pending">{med}</Badge>
              ))
            ) : (
              <span className="text-body-sm text-neutral-500">None</span>
            )}
            {currentMedications.length > 3 && (
              <Badge status="sent">+{currentMedications.length - 3} more</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
