import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PatientDetails } from '../../components/PatientDetails';

const Search = ({ className }: { className?: string }) => <span className={className}>🔍</span>;

export const PatientRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const { patients } = useSelector((state: RootState) => state.patients);
  const navigate = useNavigate();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedPatientId) {
    return (
      <div className="p-6">
        <Button onClick={() => setSelectedPatientId(null)} variant="secondary" className="mb-4">
          ← Back to Patient List
        </Button>
        <PatientDetails patientId={selectedPatientId} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patient Records</h1>
          <p className="text-sm text-gray-600 mt-1">Select a patient to view timeline, immunizations, problem list, and allergies</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div 
                onClick={() => setSelectedPatientId(patient.id)}
                className="cursor-pointer flex-1"
              >
                <h3 className="font-medium text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500">{patient.age}y • {patient.gender}</p>
              </div>
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/nurse/vitals/${patient.id}`);
                }}
                className="ml-2"
              >
                📊 Record Vitals
              </Button>
            </div>
            <div 
              onClick={() => setSelectedPatientId(patient.id)}
              className="cursor-pointer space-y-2 text-sm"
            >
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="text-gray-900">{patient.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active Problems:</span>
                <span className="text-gray-900">{patient.medicalHistory?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Medications:</span>
                <span className="text-gray-900">{patient.currentMedications.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Allergies:</span>
                <span className="text-gray-900 text-red-600">{patient.allergies.length > 0 ? patient.allergies.length : 'None'}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                📅 Timeline • 💉 Immunizations • 📝 Problem List • ⚠️ Allergies
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};