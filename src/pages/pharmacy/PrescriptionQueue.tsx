import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updatePrescriptionStatus } from '../../store/prescriptionSlice';
import { addNotification, addRoleNotification } from '../../store/notificationSlice';
// Icons as simple components
const Search = ({ className }: { className?: string }) => <span className={className}>🔍</span>;
const Eye = ({ className }: { className?: string }) => <span className={className}>👁️</span>;
const CheckCircle = ({ className }: { className?: string }) => <span className={className}>✅</span>;
const Clock = ({ className }: { className?: string }) => <span className={className}>🕐</span>;
const AlertTriangle = ({ className }: { className?: string }) => <span className={className}>⚠️</span>;
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  prescriptionDate: string;
  medications: Medication[];
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'processing' | 'ready' | 'dispensed';
  notes?: string;
}

interface Medication {
  name: string;
  dosage: string;
  quantity: number;
  frequency: string;
  duration: string;
  instructions?: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: 'RX001',
    patientName: 'John Smith',
    patientId: 'P001',
    doctorName: 'Dr. Wilson',
    prescriptionDate: '2024-01-15 14:30',
    priority: 'high',
    status: 'pending',
    medications: [
      {
        name: 'Paracetamol',
        dosage: '500mg',
        quantity: 20,
        frequency: 'Every 6 hours',
        duration: '5 days',
        instructions: 'Take with food'
      },
      {
        name: 'Amoxicillin',
        dosage: '250mg',
        quantity: 21,
        frequency: 'Three times daily',
        duration: '7 days'
      }
    ],
    notes: 'Patient has fever and infection'
  },
  {
    id: 'RX002',
    patientName: 'Sarah Johnson',
    patientId: 'P002',
    doctorName: 'Dr. Brown',
    prescriptionDate: '2024-01-15 13:15',
    priority: 'medium',
    status: 'processing',
    medications: [
      {
        name: 'Ibuprofen',
        dosage: '400mg',
        quantity: 10,
        frequency: 'Twice daily',
        duration: '3 days'
      }
    ]
  }
];

export const PrescriptionQueue: React.FC = () => {
  const dispatch = useDispatch();
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });



  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertTriangle className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'dispensed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const prescription = prescriptions.find(p => p.id === id);
    
    dispatch(updatePrescriptionStatus({ id, status: newStatus as 'pending' | 'processing' | 'ready' | 'dispensed' }));
    dispatch(addNotification({
      type: 'success',
      title: 'Prescription Updated',
      message: `Prescription ${id} status changed to ${newStatus}`,
      priority: 'medium',
      category: 'system'
    }));
    
    if (newStatus === 'dispensed' && prescription) {
      dispatch(addRoleNotification({
        role: 'receptionist',
        type: 'info',
        title: 'Prescription Dispensed',
        message: `${prescription.patientName} prescription ready for billing`,
        priority: 'medium',
        category: 'medication'
      }));
    }
  };

  const viewPrescriptionDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowDetails(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Prescription Queue</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pharmacist-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="dispensed">Dispensed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{prescription.patientName}</h3>
                <p className="text-sm text-gray-500">{prescription.patientId} • {prescription.id}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  prescription.priority === 'high' ? 'bg-red-100 text-red-800' :
                  prescription.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {prescription.priority}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                  prescription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  prescription.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  prescription.status === 'ready' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusIcon(prescription.status)}
                  {prescription.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm text-gray-500">Prescribed by</p>
                <p className="font-medium text-gray-900">{prescription.doctorName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Medications ({prescription.medications.length})</p>
                <div className="space-y-1">
                  {prescription.medications.slice(0, 2).map((med, index) => (
                    <p key={index} className="text-sm text-gray-900">
                      {med.name} {med.dosage} × {med.quantity}
                    </p>
                  ))}
                  {prescription.medications.length > 2 && (
                    <p className="text-sm text-gray-500">
                      +{prescription.medications.length - 2} more
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Prescription Date</p>
                <p className="text-sm text-gray-900">{prescription.prescriptionDate}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => viewPrescriptionDetails(prescription)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              
              {prescription.status === 'pending' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleUpdateStatus(prescription.id, 'processing')}
                >
                  Start Processing
                </Button>
              )}
              
              {prescription.status === 'processing' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleUpdateStatus(prescription.id, 'ready')}
                >
                  Mark Ready
                </Button>
              )}
              
              {prescription.status === 'ready' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleUpdateStatus(prescription.id, 'dispensed')}
                >
                  Dispense
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Prescription Details"
        size="lg"
      >
        {selectedPrescription && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Patient</label>
                <p className="text-gray-900">{selectedPrescription.patientName}</p>
                <p className="text-sm text-gray-500">{selectedPrescription.patientId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Prescribed by</label>
                <p className="text-gray-900">{selectedPrescription.doctorName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date</label>
                <p className="text-gray-900">{selectedPrescription.prescriptionDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedPrescription.priority === 'high' ? 'bg-red-100 text-red-800' :
                  selectedPrescription.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedPrescription.priority}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Medications</h3>
              <div className="space-y-4">
                {selectedPrescription.medications.map((medication, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{medication.name}</h4>
                      <span className="text-sm text-gray-500">{medication.dosage}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Quantity:</span>
                        <span className="ml-2 text-gray-900">{medication.quantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Frequency:</span>
                        <span className="ml-2 text-gray-900">{medication.frequency}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2 text-gray-900">{medication.duration}</span>
                      </div>
                    </div>
                    {medication.instructions && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Instructions:</span>
                        <p className="text-sm text-gray-900">{medication.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedPrescription.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{selectedPrescription.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};