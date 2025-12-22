import React, { useState } from 'react';
import { Card, Button } from '../../components';
import { InteractionHistory } from '../../components/InteractionHistory';
import { PDFViewer } from '../../components/PDFViewer';
import { FileText, Download, Eye } from 'lucide-react';

interface MedicalRecord {
  id: string;
  type: 'lab' | 'imaging' | 'visit' | 'prescription';
  title: string;
  date: string;
  doctor: string;
  status: 'available' | 'pending';
}

export const MyRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'interactions'>('records');
  const [selectedPDF, setSelectedPDF] = useState<{ url: string; name: string } | null>(null);
  const [records] = useState<MedicalRecord[]>([
    { id: '1', type: 'lab', title: 'Complete Blood Count', date: '2024-01-15', doctor: 'Dr. Smith', status: 'available' },
    { id: '2', type: 'imaging', title: 'Chest X-Ray', date: '2024-01-10', doctor: 'Dr. Johnson', status: 'available' },
    { id: '3', type: 'visit', title: 'Annual Checkup', date: '2024-01-05', doctor: 'Dr. Brown', status: 'available' },
    { id: '4', type: 'lab', title: 'Lipid Panel', date: '2024-01-18', doctor: 'Dr. Smith', status: 'pending' }
  ]);

  const getTypeIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  const getTypeLabel = (type: string) => {
    const labels = { lab: 'Lab Result', imaging: 'Imaging', visit: 'Visit Summary', prescription: 'Prescription' };
    return labels[type as keyof typeof labels];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <Button variant="secondary">Request Records</Button>
      </div>

      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'records'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Medical Records
        </button>
        <button
          onClick={() => setActiveTab('interactions')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'interactions'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Drug Interaction History
        </button>
      </div>

      {activeTab === 'records' && (
        <div className="grid gap-4">
        {records.map((record) => (
          <Card key={record.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getTypeIcon(record.type)}
                <div>
                  <h3 className="font-semibold text-gray-900">{record.title}</h3>
                  <p className="text-sm text-gray-600">{getTypeLabel(record.type)} • {record.doctor}</p>
                  <p className="text-sm text-gray-500">{record.date}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {record.status === 'available' ? (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setSelectedPDF({ url: `/api/records/${record.id}.pdf`, name: record.title })}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
        </div>
      )}

      {activeTab === 'interactions' && (
        <InteractionHistory patientId="current-patient" />
      )}

      {selectedPDF && (
        <PDFViewer
          fileUrl={selectedPDF.url}
          fileName={selectedPDF.name}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </div>
  );
};