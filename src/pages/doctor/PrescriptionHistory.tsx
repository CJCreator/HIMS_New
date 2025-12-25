import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { approveRefill } from '@/store/prescriptionSlice';
import { Card, Button, Input, Badge, EmptyState } from '@/components';
import { PrescriptionDetailModal } from '@/components/PrescriptionDetailModal';
import { format } from 'date-fns';

export function PrescriptionHistory() {
  const dispatch = useDispatch();
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showRefillRequests, setShowRefillRequests] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const myPrescriptions = prescriptions.filter(p => p.doctorName === user?.name || true);

  const filteredPrescriptions = myPrescriptions.filter(rx => {
    const matchesSearch = rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.medications.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || rx.status === statusFilter;
    const matchesRefill = !showRefillRequests || rx.refillRequested;
    return matchesSearch && matchesStatus && matchesRefill;
  });

  const refillRequestCount = myPrescriptions.filter(p => p.refillRequested).length;

  const handleApproveRefill = (prescriptionId: string) => {
    dispatch(approveRefill(prescriptionId));
  };

  const handleViewDetails = (prescription: any) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'dispensed':
        return <Badge status="delivered">Dispensed</Badge>;
      case 'ready':
        return <Badge status="sent">Ready</Badge>;
      case 'processing':
        return <Badge status="pending">Processing</Badge>;
      default:
        return <Badge status="request">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Prescription History</h1>
          <p className="text-sm text-neutral-600 mt-1">View and manage patient prescriptions</p>
        </div>
        {refillRequestCount > 0 && (
          <Button 
            onClick={() => setShowRefillRequests(!showRefillRequests)}
            className="flex items-center gap-2"
          >
            <span className="bg-error text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {refillRequestCount}
            </span>
            {showRefillRequests ? 'Show All' : 'Refill Requests'}
          </Button>
        )}
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by patient or medication..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="dispensed">Dispensed</option>
          </select>
        </div>

        {filteredPrescriptions.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No prescriptions found"
            description={searchTerm || statusFilter !== 'all' || showRefillRequests
              ? "Try adjusting your filters" 
              : "Prescriptions you write will appear here"}
          />
        ) : (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => (
              <div key={prescription.id} className={`p-4 border-2 rounded-lg transition-all ${
                prescription.refillRequested ? 'border-warning-300 bg-warning-50' : 'border-neutral-200'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-semibold text-neutral-900">{prescription.patientName}</p>
                      {prescription.refillRequested && (
                        <Badge status="pending">Refill Requested</Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600">
                      Prescription #{prescription.id} • {format(new Date(prescription.prescriptionDate), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  {getStatusBadge(prescription.status)}
                </div>

                <div className="space-y-2 mb-3">
                  {prescription.medications.map((med, idx) => (
                    <div key={idx} className="flex justify-between items-start p-3 bg-white rounded-lg border border-neutral-200">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900">{med.name}</p>
                        <p className="text-xs text-neutral-600">
                          {med.dosage} • {med.frequency} • {med.duration}
                        </p>
                        {med.instructions && (
                          <p className="text-xs text-neutral-500 mt-1 italic">{med.instructions}</p>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600">Qty: {med.quantity}</p>
                    </div>
                  ))}
                </div>

                {prescription.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg mb-3">
                    <p className="text-xs text-neutral-600 mb-1">Clinical Notes</p>
                    <p className="text-sm text-neutral-900">{prescription.notes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                  <div className="text-xs text-neutral-600">
                    {prescription.refillsRemaining !== undefined && (
                      <span>Refills remaining: {prescription.refillsRemaining}</span>
                    )}
                    {prescription.refillRequestDate && (
                      <span className="ml-4">
                        Requested: {format(new Date(prescription.refillRequestDate), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {prescription.refillRequested && (
                      <Button
                        size="sm"
                        onClick={() => handleApproveRefill(prescription.id)}
                      >
                        Approve Refill
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => handleViewDetails(prescription)}>
                      View Full Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <p className="text-3xl font-semibold text-primary-700">{myPrescriptions.length}</p>
            <p className="text-sm text-neutral-600 mt-1">Total Prescriptions</p>
          </div>
          <div className="text-center p-4 bg-warning-50 rounded-lg">
            <p className="text-3xl font-semibold text-warning-700">{refillRequestCount}</p>
            <p className="text-sm text-neutral-600 mt-1">Refill Requests</p>
          </div>
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <p className="text-3xl font-semibold text-success-700">
              {myPrescriptions.filter(p => p.status === 'dispensed').length}
            </p>
            <p className="text-sm text-neutral-600 mt-1">Dispensed</p>
          </div>
          <div className="text-center p-4 bg-neutral-100 rounded-lg">
            <p className="text-3xl font-semibold text-neutral-700">
              {myPrescriptions.filter(p => p.status === 'pending').length}
            </p>
            <p className="text-sm text-neutral-600 mt-1">Pending</p>
          </div>
        </div>
      </Card>

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <PrescriptionDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          prescription={selectedPrescription}
        />
      )}
    </div>
  );
}
