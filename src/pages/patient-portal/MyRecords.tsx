import React from 'react';
import { Card, Button } from '@/components';
import { FileText, Download, Eye } from 'lucide-react';

export const MyRecords: React.FC = () => {
  const medicalRecords = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'Consultation',
      doctor: 'Dr. Smith',
      diagnosis: 'Annual Checkup',
      status: 'Complete'
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'Lab Results',
      doctor: 'Dr. Johnson',
      diagnosis: 'Blood Work',
      status: 'Complete'
    },
    {
      id: '3',
      date: '2024-01-05',
      type: 'Prescription',
      doctor: 'Dr. Smith',
      diagnosis: 'Medication Refill',
      status: 'Active'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600">View and download your medical history</p>
        </div>
        <Button variant="primary">
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>

      <div className="grid gap-4">
        {medicalRecords.map((record) => (
          <Card key={record.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{record.type}</h3>
                  <p className="text-sm text-gray-600">{record.doctor} • {record.date}</p>
                  <p className="text-sm text-gray-800 mt-1">{record.diagnosis}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  record.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {record.status}
                </span>
                <Button variant="secondary" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="secondary" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};