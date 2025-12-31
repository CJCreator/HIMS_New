import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateMedicationStatus } from '../../store/medicationSlice';
import { addNotification, addRoleNotification } from '../../store/notificationSlice';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { MedicationStatusTracker } from '../../components/MedicationStatusTracker';
import { Search, Package, Truck } from 'lucide-react';

export const MedicationRequests: React.FC = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((state: RootState) => state.medication);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (id: string, newStatus: 'pending' | 'sent' | 'dispatched') => {
    const request = requests.find(r => r.id === id);
    
    dispatch(updateMedicationStatus({ 
      id, 
      status: newStatus, 
      processedBy: 'Pharmacist John' 
    }));
    
    dispatch(addNotification({
      type: 'success',
      title: 'Medication Request Updated',
      message: `Request ${id} status changed to ${newStatus}`,
      priority: 'medium',
      category: 'system'
    }));
    
    if (newStatus === 'dispatched' && request) {
      dispatch(addRoleNotification({
        role: 'nurse',
        type: 'success',
        title: 'Medication Dispatched',
        message: `${request.medication} for ${request.patientName} (Room ${request.roomNumber}) is on the way`,
        priority: 'high',
        category: 'medication'
      }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Medication Requests from Nurses</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pharmacist-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pharmacist-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="request">New Requests</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="dispatched">Dispatched</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                <p className="text-sm text-gray-500">Room {request.roomNumber} • {request.patientId}</p>
                <p className="text-sm text-gray-500">Requested by {request.requestedBy}</p>
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
              <MedicationStatusTracker status={request.status} className="mb-2" />
              <p className="text-xs text-gray-500">
                Requested: {request.requestTime}
                {request.processedTime && ` • Processed: ${request.processedTime}`}
              </p>
            </div>

            <div className="flex gap-2">
              {request.status === 'request' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleStatusUpdate(request.id, 'pending')}
                  className="flex-1"
                >
                  Accept Request
                </Button>
              )}
              
              {request.status === 'pending' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleStatusUpdate(request.id, 'sent')}
                  className="flex-1"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Prepare & Send
                </Button>
              )}
              
              {request.status === 'sent' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleStatusUpdate(request.id, 'dispatched')}
                  className="flex-1"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Mark Dispatched
                </Button>
              )}
              
              {(request.status === 'dispatched' || request.status === 'received' || request.status === 'delivered') && (
                <div className="flex-1 text-center py-2 text-sm text-gray-500">
                  {request.status === 'dispatched' && 'Waiting for nurse confirmation'}
                  {request.status === 'received' && 'Received by nurse'}
                  {request.status === 'delivered' && 'Delivered to patient'}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No medication requests found</p>
        </div>
      )}
    </div>
  );
};