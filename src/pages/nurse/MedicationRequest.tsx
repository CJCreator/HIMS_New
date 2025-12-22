import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addMedicationRequest } from '../../store/medicationSlice';
import { addNotification, addRoleNotification } from '../../store/notificationSlice';
// Icons as simple components
const Plus = ({ className }: { className?: string }) => <span className={className}>➕</span>;
const Clock = ({ className }: { className?: string }) => <span className={className}>🕐</span>;
const CheckCircle = ({ className }: { className?: string }) => <span className={className}>✅</span>;
const Truck = ({ className }: { className?: string }) => <span className={className}>🚛</span>;
const Package = ({ className }: { className?: string }) => <span className={className}>📦</span>;
const AlertCircle = ({ className }: { className?: string }) => <span className={className}>⚠️</span>;
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';

interface MedicationRequest {
  id: string;
  patientName: string;
  patientId: string;
  roomNumber: string;
  medication: string;
  dosage: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'request' | 'pending' | 'sent' | 'dispatched' | 'received' | 'delivered';
  requestedBy: string;
  requestTime: string;
  notes?: string;
}

const mockRequests: MedicationRequest[] = [
  {
    id: 'MR001',
    patientName: 'John Smith',
    patientId: 'P001',
    roomNumber: 'A-101',
    medication: 'Paracetamol',
    dosage: '500mg',
    quantity: 10,
    urgency: 'medium',
    status: 'dispatched',
    requestedBy: 'Nurse Sarah',
    requestTime: '2024-01-15 14:30',
    notes: 'Patient experiencing fever'
  },
  {
    id: 'MR002',
    patientName: 'Sarah Johnson',
    patientId: 'P002',
    roomNumber: 'B-205',
    medication: 'Amoxicillin',
    dosage: '250mg',
    quantity: 21,
    urgency: 'high',
    status: 'sent',
    requestedBy: 'Nurse Sarah',
    requestTime: '2024-01-15 13:15'
  }
];

const statusFlow = ['request', 'pending', 'sent', 'dispatched', 'received', 'delivered'];

export const MedicationRequest: React.FC = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((state: RootState) => state.medication);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newRequest, setNewRequest] = useState<{
    patientName: string;
    patientId: string;
    roomNumber: string;
    medication: string;
    dosage: string;
    quantity: number;
    urgency: 'low' | 'medium' | 'high';
    notes: string;
  }>({
    patientName: '',
    patientId: '',
    roomNumber: '',
    medication: '',
    dosage: '',
    quantity: 1,
    urgency: 'medium',
    notes: ''
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'request': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'sent': return <Package className="w-4 h-4" />;
      case 'dispatched': return <Truck className="w-4 h-4" />;
      case 'received': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleSubmitRequest = () => {
    dispatch(addMedicationRequest({
      patientName: newRequest.patientName,
      patientId: newRequest.patientId,
      roomNumber: newRequest.roomNumber,
      medication: newRequest.medication,
      dosage: newRequest.dosage,
      quantity: newRequest.quantity,
      urgency: newRequest.urgency,
      requestedBy: 'Nurse Sarah',
      notes: newRequest.notes || undefined
    }));
    
    dispatch(addRoleNotification({
      role: 'pharmacy',
      type: newRequest.urgency === 'high' ? 'warning' : 'info',
      title: 'Medication Request',
      message: `${newRequest.medication} needed for Room ${newRequest.roomNumber}`,
      priority: newRequest.urgency === 'high' ? 'urgent' : 'medium',
      category: 'medication'
    }));
    
    dispatch(addNotification({
      type: 'success',
      title: 'Medication Request Submitted',
      message: `Request for ${newRequest.medication} has been sent to pharmacy`,
      priority: 'medium',
      category: 'system'
    }));
    
    setNewRequest({
      patientName: '',
      patientId: '',
      roomNumber: '',
      medication: '',
      dosage: '',
      quantity: 1,
      urgency: 'medium' as 'low' | 'medium' | 'high',
      notes: ''
    });
    setShowNewRequest(false);
  };

  const getStatusProgress = (currentStatus: string) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    return ((currentIndex + 1) / statusFlow.length) * 100;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Medication Requests</h1>
        <Button variant="primary" onClick={() => setShowNewRequest(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {requests.map((request) => (
          <Card key={request.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                <p className="text-sm text-gray-500">Room {request.roomNumber} • {request.patientId}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {request.urgency}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="font-medium text-gray-900">{request.medication}</p>
                <p className="text-sm text-gray-500">{request.dosage} × {request.quantity} tablets</p>
              </div>
              
              {request.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes:</p>
                  <p className="text-sm text-gray-900">{request.notes}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                  request.status === 'request' ? 'bg-gray-100 text-gray-800' :
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                  request.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                  request.status === 'received' ? 'bg-green-100 text-green-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {getStatusIcon(request.status)}
                  {request.status}
                </span>
                <span className="text-xs text-gray-500">{Math.round(getStatusProgress(request.status))}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-nurse-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getStatusProgress(request.status)}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <p>Requested by {request.requestedBy}</p>
              <p>{request.requestTime}</p>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showNewRequest}
        onClose={() => setShowNewRequest(false)}
        title="New Medication Request"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Patient Name"
              value={newRequest.patientName}
              onChange={(e) => setNewRequest({...newRequest, patientName: e.target.value})}
              placeholder="Enter patient name"
            />
            <Input
              label="Patient ID"
              value={newRequest.patientId}
              onChange={(e) => setNewRequest({...newRequest, patientId: e.target.value})}
              placeholder="P001"
            />
          </div>

          <Input
            label="Room Number"
            value={newRequest.roomNumber}
            onChange={(e) => setNewRequest({...newRequest, roomNumber: e.target.value})}
            placeholder="A-101"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Medication"
              value={newRequest.medication}
              onChange={(e) => setNewRequest({...newRequest, medication: e.target.value})}
              placeholder="Paracetamol"
            />
            <Input
              label="Dosage"
              value={newRequest.dosage}
              onChange={(e) => setNewRequest({...newRequest, dosage: e.target.value})}
              placeholder="500mg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              value={newRequest.quantity}
              onChange={(e) => setNewRequest({...newRequest, quantity: parseInt(e.target.value)})}
              min="1"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select
                value={newRequest.urgency}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewRequest({...newRequest, urgency: e.target.value as 'low' | 'medium' | 'high'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurse-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={newRequest.notes}
              onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
              placeholder="Additional notes or special instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurse-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleSubmitRequest} className="flex-1">
              Submit Request
            </Button>
            <Button variant="secondary" onClick={() => setShowNewRequest(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};