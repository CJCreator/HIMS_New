import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components';

interface PatientDetailsProps {
  patientId: string;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const patient = useSelector((state: RootState) => 
    state.patients.patients.find((p: any) => p.id === patientId)
  );

  if (!patient) return <div>Patient not found</div>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'vitals', label: 'Vitals' },
    { id: 'medications', label: 'Medications' },
    { id: 'allergies', label: 'Allergies' },
    { id: 'history', label: 'Medical History' },
    { id: 'timeline', label: 'Timeline' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{patient.name}</h2>
          <p className="text-gray-600">ID: {patient.id} • {patient.age}y {patient.gender}</p>
        </div>
        <Button onClick={() => navigate(`/nurse/vitals/${patient.id}`)}>
          📊 Record Vitals
        </Button>
      </div>

      <div className="border-b">
        <div className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-nurse text-nurse font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Patient Information</h3>
              <div className="space-y-3">
                <div><span className="text-gray-600">Phone:</span> {patient.phone}</div>
                <div><span className="text-gray-600">Email:</span> {patient.email}</div>
                <div><span className="text-gray-600">Address:</span> {patient.address}</div>
                <div><span className="text-gray-600">Emergency Contact:</span> {patient.emergencyContact}</div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Current Status</h3>
              <div className="space-y-3">
                <div><span className="text-gray-600">Blood Type:</span> {(patient as any).bloodType || 'N/A'}</div>
                <div><span className="text-gray-600">Active Medications:</span> {patient.currentMedications?.length || 0}</div>
                <div><span className="text-gray-600">Known Allergies:</span> {patient.allergies?.length || 0}</div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'vitals' && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Latest Vitals</h3>
            {patient.vitals ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Blood Pressure</div>
                  <div className="text-2xl font-bold">{patient.vitals.bloodPressure}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Heart Rate</div>
                  <div className="text-2xl font-bold">{patient.vitals.heartRate} bpm</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Temperature</div>
                  <div className="text-2xl font-bold">{patient.vitals.temperature}°F</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Respiratory Rate</div>
                  <div className="text-2xl font-bold">{patient.vitals.respiratoryRate}/min</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">O2 Saturation</div>
                  <div className="text-2xl font-bold">{patient.vitals.oxygenSaturation}%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Pain Level</div>
                  <div className="text-2xl font-bold">{patient.vitals.painLevel}/10</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No vitals recorded yet</p>
            )}
          </Card>
        )}

        {activeTab === 'medications' && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Current Medications</h3>
            {patient.currentMedications.length > 0 ? (
              <div className="space-y-3">
                {patient.currentMedications.map((med: any, idx: number) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="font-medium">{med}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No active medications</p>
            )}
          </Card>
        )}

        {activeTab === 'allergies' && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Known Allergies</h3>
            {patient.allergies.length > 0 ? (
              <div className="space-y-3">
                {patient.allergies.map((allergy: any, idx: number) => (
                  <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="font-medium text-red-800">⚠️ {allergy}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No known allergies</p>
            )}
          </Card>
        )}

        {activeTab === 'history' && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Medical History</h3>
            {patient.medicalHistory.length > 0 ? (
              <div className="space-y-3">
                {patient.medicalHistory.map((history: any, idx: number) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div>{history}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No medical history recorded</p>
            )}
          </Card>
        )}

        {activeTab === 'timeline' && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Patient Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-24 text-sm text-gray-600">Today</div>
                <div className="flex-1 border-l-2 border-nurse pl-4 pb-4">
                  <div className="font-medium">Vitals Recorded</div>
                  <div className="text-sm text-gray-600">BP: {patient.vitals?.bloodPressure || 'N/A'}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-24 text-sm text-gray-600">Yesterday</div>
                <div className="flex-1 border-l-2 border-gray-300 pl-4 pb-4">
                  <div className="font-medium">Medication Administered</div>
                  <div className="text-sm text-gray-600">Regular schedule</div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
