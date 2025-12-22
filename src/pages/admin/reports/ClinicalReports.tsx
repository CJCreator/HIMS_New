import React, { useState } from 'react';
import { Card, Button } from '../../../components';
import { Download, Filter } from 'lucide-react';

export const ClinicalReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'disease' | 'outcomes' | 'readmission' | 'prescriptions'>('disease');

  const tabs = [
    { id: 'disease', label: 'Disease Prevalence' },
    { id: 'outcomes', label: 'Treatment Outcomes' },
    { id: 'readmission', label: 'Readmissions' },
    { id: 'prescriptions', label: 'Prescription Patterns' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clinical Reports</h1>
        <div className="flex space-x-2">
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex space-x-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="p-6">
        {activeTab === 'disease' && <DiseasePrevalenceContent />}
        {activeTab === 'outcomes' && <TreatmentOutcomesContent />}
        {activeTab === 'readmission' && <ReadmissionContent />}
        {activeTab === 'prescriptions' && <PrescriptionPatternsContent />}
      </Card>
    </div>
  );
};

const DiseasePrevalenceContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Top 10 Diagnoses</h2>
    {[
      { disease: 'Hypertension', cases: 245, percentage: 18.5 },
      { disease: 'Type 2 Diabetes', cases: 198, percentage: 15.0 },
      { disease: 'Asthma', cases: 156, percentage: 11.8 }
    ].map((item) => (
      <div key={item.disease} className="flex items-center justify-between p-3 bg-gray-50 rounded">
        <span className="font-medium">{item.disease}</span>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{item.cases} cases</span>
          <span className="font-semibold text-blue-600">{item.percentage}%</span>
        </div>
      </div>
    ))}
  </div>
);

const TreatmentOutcomesContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Treatment Success Rates</h2>
    {[
      { treatment: 'Hypertension Management', success: 92, improved: 6, unchanged: 2 },
      { treatment: 'Diabetes Control', success: 85, improved: 10, unchanged: 5 }
    ].map((item) => (
      <div key={item.treatment} className="p-4 bg-gray-50 rounded">
        <p className="font-medium mb-2">{item.treatment}</p>
        <div className="flex space-x-4 text-sm">
          <span className="text-green-600">Success: {item.success}%</span>
          <span className="text-yellow-600">Improved: {item.improved}%</span>
          <span className="text-gray-600">Unchanged: {item.unchanged}%</span>
        </div>
      </div>
    ))}
  </div>
);

const ReadmissionContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">30-Day Readmission Rates</h2>
    {[
      { department: 'Cardiology', rate: 8.5, total: 45 },
      { department: 'General Medicine', rate: 12.3, total: 67 }
    ].map((item) => (
      <div key={item.department} className="flex items-center justify-between p-3 bg-gray-50 rounded">
        <span className="font-medium">{item.department}</span>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{item.total} readmissions</span>
          <span className={`font-semibold ${item.rate > 10 ? 'text-red-600' : 'text-green-600'}`}>
            {item.rate}%
          </span>
        </div>
      </div>
    ))}
  </div>
);

const PrescriptionPatternsContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Most Prescribed Medications</h2>
    {[
      { medication: 'Lisinopril', prescriptions: 342, trend: 'up' },
      { medication: 'Metformin', prescriptions: 298, trend: 'stable' },
      { medication: 'Atorvastatin', prescriptions: 267, trend: 'down' }
    ].map((item) => (
      <div key={item.medication} className="flex items-center justify-between p-3 bg-gray-50 rounded">
        <span className="font-medium">{item.medication}</span>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{item.prescriptions} prescriptions</span>
          <span className={`text-sm ${
            item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
          </span>
        </div>
      </div>
    ))}
  </div>
);