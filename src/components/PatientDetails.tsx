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
    { id: 'timeline', label: 'Timeline' },
    { id: 'medications', label: 'Medications' },
    { id: 'allergies', label: 'Allergies' },
    { id: 'immunization', label: 'Immunization' },
    { id: 'problems', label: 'Problem List' },
    { id: 'history', label: 'Medical History' }
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
              <div className="flex gap-4">
                <div className="w-24 text-sm text-gray-600">2 days ago</div>
                <div className="flex-1 border-l-2 border-gray-300 pl-4 pb-4">
                  <div className="font-medium">Lab Results Reviewed</div>
                  <div className="text-sm text-gray-600">All values within normal range</div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'immunization' && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Immunization Records</h3>
              <Button size="sm">Add Immunization</Button>
            </div>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">💉 COVID-19 Vaccine (Pfizer)</div>
                    <div className="text-sm text-gray-600">Administered: March 15, 2024</div>
                    <div className="text-sm text-gray-600">Next due: September 15, 2024</div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Up to date</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">💉 Influenza Vaccine</div>
                    <div className="text-sm text-gray-600">Administered: October 10, 2023</div>
                    <div className="text-sm text-gray-600">Next due: October 2024</div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Due soon</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">💉 Tetanus/Diphtheria</div>
                    <div className="text-sm text-gray-600">Administered: January 20, 2020</div>
                    <div className="text-sm text-gray-600">Next due: January 2030</div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Up to date</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'problems' && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Active Problem List</h3>
              <Button size="sm">Add Problem</Button>
            </div>
            <div className="space-y-3">
              <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-red-800">🔴 Hypertension</div>
                    <div className="text-sm text-red-600">Onset: January 2023 • Status: Active</div>
                    <div className="text-sm text-red-600">Last BP: {patient.vitals?.bloodPressure || 'N/A'}</div>
                  </div>
                  <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">High Priority</span>
                </div>
              </div>
              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-yellow-800">🟡 Type 2 Diabetes</div>
                    <div className="text-sm text-yellow-600">Onset: March 2022 • Status: Controlled</div>
                    <div className="text-sm text-yellow-600">Last HbA1c: 6.8% (Target: &lt;7%)</div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded">Monitoring</span>
                </div>
              </div>
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-blue-800">🔵 Seasonal Allergies</div>
                    <div className="text-sm text-blue-600">Onset: Childhood • Status: Seasonal</div>
                    <div className="text-sm text-blue-600">Triggers: Pollen, dust mites</div>
                  </div>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">Stable</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
