import React, { useState } from 'react';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { User, Search, FileText } from 'lucide-react';


interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room: string;
  admissionDate: string;
  allergies: string[];
  currentMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
  }>;
  medicalHistory: string[];
}

export const PatientRecords: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const mockPatients: Patient[] = [
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      room: 'A101',
      admissionDate: '2024-01-10',
      allergies: ['Penicillin', 'Shellfish'],
      currentMedications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescribedBy: 'Dr. Wilson' },
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribedBy: 'Dr. Wilson' }
      ],
      medicalHistory: ['Hypertension', 'Type 2 Diabetes', 'Previous MI (2020)']
    },
    {
      id: 'P002',
      name: 'Sarah Johnson',
      age: 32,
      gender: 'Female',
      room: 'A103',
      admissionDate: '2024-01-12',
      allergies: ['Latex'],
      currentMedications: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', prescribedBy: 'Dr. Chen' }
      ],
      medicalHistory: ['Pneumonia', 'Asthma']
    }
  ];

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Patient Records</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pharmacist-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?.id === patient.id
                      ? 'bg-pharmacist-50 border border-pharmacist-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center">
                    <User className="w-8 h-8 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">ID: {patient.id} • Room {patient.room}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-gray-600">Patient ID: {selectedPatient.id}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Age</p>
                    <p className="font-medium">{selectedPatient.age}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p className="font-medium">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Room</p>
                    <p className="font-medium">{selectedPatient.room}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Admitted</p>
                    <p className="font-medium">{selectedPatient.admissionDate}</p>
                  </div>
                </div>
              </Card>

              {/* Current Medications */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                <div className="space-y-3">
                  {selectedPatient.currentMedications.map((med, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{med.name}</p>
                          <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                          <p className="text-xs text-gray-500">Prescribed by {med.prescribedBy}</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Allergies */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Medical History */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                <div className="space-y-2">
                  {selectedPatient.medicalHistory.map((condition, index) => (
                    <div key={index} className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-700">{condition}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
              <p className="text-gray-500">Choose a patient from the list to view their medication records and history.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};