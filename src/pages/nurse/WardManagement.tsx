import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/notificationSlice';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

const Bed = ({ className }: { className?: string }) => <span className={className}>🛏️</span>;
const User = ({ className }: { className?: string }) => <span className={className}>👤</span>;
const AlertTriangle = ({ className }: { className?: string }) => <span className={className}>⚠️</span>;
const CheckCircle = ({ className }: { className?: string }) => <span className={className}>✅</span>;

interface BedInfo {
  id: string;
  number: string;
  ward: string;
  status: 'occupied' | 'available' | 'maintenance' | 'reserved';
  patient?: {
    name: string;
    id: string;
    admissionDate: string;
    condition: 'stable' | 'critical' | 'recovering';
  };
  lastCleaned?: string;
}

export const WardManagement: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedWard, setSelectedWard] = useState('A');
  const [selectedBed, setSelectedBed] = useState<BedInfo | null>(null);

  const beds: BedInfo[] = [
    {
      id: 'A101',
      number: '101',
      ward: 'A',
      status: 'occupied',
      patient: {
        name: 'John Smith',
        id: 'P001',
        admissionDate: '2024-01-10',
        condition: 'stable'
      },
      lastCleaned: '2024-01-15 08:00'
    },
    {
      id: 'A102',
      number: '102',
      ward: 'A',
      status: 'available',
      lastCleaned: '2024-01-15 10:00'
    },
    {
      id: 'A103',
      number: '103',
      ward: 'A',
      status: 'occupied',
      patient: {
        name: 'Sarah Johnson',
        id: 'P002',
        admissionDate: '2024-01-12',
        condition: 'critical'
      },
      lastCleaned: '2024-01-15 07:30'
    },
    {
      id: 'A104',
      number: '104',
      ward: 'A',
      status: 'maintenance',
      lastCleaned: '2024-01-14 16:00'
    }
  ];

  const wardBeds = beds.filter(bed => bed.ward === selectedWard);
  const wardStats = {
    total: wardBeds.length,
    occupied: wardBeds.filter(b => b.status === 'occupied').length,
    available: wardBeds.filter(b => b.status === 'available').length,
    maintenance: wardBeds.filter(b => b.status === 'maintenance').length
  };

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'available': return 'bg-green-100 border-green-300 text-green-800';
      case 'maintenance': return 'bg-red-100 border-red-300 text-red-800';
      case 'reserved': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getConditionIcon = (condition?: string) => {
    switch (condition) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'stable': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'recovering': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const handleBedAction = () => {
    dispatch(addNotification({
      type: 'success',
      title: 'Bed Updated',
      message: 'Bed action completed successfully',
      priority: 'medium',
      category: 'system'
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Ward Management</h1>
        <div className="flex gap-3">
          <Button variant="secondary">Shift Handover</Button>
          <Button variant="primary">Emergency Alert</Button>
        </div>
      </div>

      {/* Ward Selection */}
      <div className="flex gap-3">
        {['A', 'B', 'C', 'ICU'].map((ward) => (
          <button
            key={ward}
            onClick={() => setSelectedWard(ward)}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedWard === ward
                ? 'bg-nurse-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ward {ward}
          </button>
        ))}
      </div>

      {/* Ward Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Bed className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{wardStats.total}</p>
              <p className="text-sm text-gray-600">Total Beds</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{wardStats.occupied}</p>
              <p className="text-sm text-gray-600">Occupied</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-600">{wardStats.available}</p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-red-600">{wardStats.maintenance}</p>
              <p className="text-sm text-gray-600">Maintenance</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bed Grid */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ward {selectedWard} Layout</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {wardBeds.map((bed) => (
            <div
              key={bed.id}
              onClick={() => setSelectedBed(bed)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${getBedStatusColor(bed.status)}
                ${selectedBed?.id === bed.id ? 'ring-2 ring-nurse-500' : ''}
              `}
            >
              <div className="text-center">
                <Bed className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">{bed.number}</p>
                <p className="text-xs capitalize">{bed.status}</p>
                {bed.patient && (
                  <div className="mt-2">
                    <p className="text-xs font-medium truncate">{bed.patient.name}</p>
                    <div className="flex items-center justify-center mt-1">
                      {getConditionIcon(bed.patient.condition)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bed Details Panel */}
      {selectedBed && (
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Bed {selectedBed.number} Details
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBedStatusColor(selectedBed.status)}`}>
              {selectedBed.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Bed Information</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Bed ID:</strong> {selectedBed.id}</p>
                <p><strong>Ward:</strong> {selectedBed.ward}</p>
                <p><strong>Last Cleaned:</strong> {selectedBed.lastCleaned}</p>
              </div>
            </div>

            {selectedBed.patient && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedBed.patient.name}</p>
                  <p><strong>Patient ID:</strong> {selectedBed.patient.id}</p>
                  <p><strong>Admission Date:</strong> {selectedBed.patient.admissionDate}</p>
                  <p className="flex items-center">
                    <strong>Condition:</strong>
                    <span className="ml-2 flex items-center">
                      {getConditionIcon(selectedBed.patient.condition)}
                      <span className="ml-1 capitalize">{selectedBed.patient.condition}</span>
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            {selectedBed.status === 'occupied' && (
              <>
                <Button variant="secondary" size="sm" onClick={() => handleBedAction()}>
                  Record Vitals
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleBedAction()}>
                  Administer Medication
                </Button>
              </>
            )}
            {selectedBed.status === 'available' && (
              <Button variant="primary" size="sm" onClick={() => handleBedAction()}>
                Assign Patient
              </Button>
            )}
            {selectedBed.status === 'maintenance' && (
              <Button variant="primary" size="sm" onClick={() => handleBedAction()}>
                Complete Maintenance
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => handleBedAction()}>
              Mark as Cleaned
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};