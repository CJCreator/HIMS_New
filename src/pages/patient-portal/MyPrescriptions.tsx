import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Card, Button, Input, Badge, EmptyState, Modal } from '@/components';
import { RefillRequestModal } from '@/components/RefillRequestModal';
import { format } from 'date-fns';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribed: string;
  doctor: string;
  refillsLeft: number;
  status: 'active' | 'expired' | 'discontinued';
  instructions: string;
}

export const MyPrescriptions: React.FC = () => {
  const dispatch = useDispatch();
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  const myPrescriptions = prescriptions.filter(p => p.patientId === user?.id || true);

  const filteredPrescriptions = myPrescriptions.filter(rx => {
    const matchesSearch = rx.medications.some(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || rx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const requestRefill = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowRefillModal(true);
  };

  const viewDetails = (prescription: any) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Prescriptions</h1>
          <p className="text-sm text-neutral-600 mt-1">View and manage your prescriptions</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search medications..."
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
            icon="💊"
            title="No prescriptions found"
            description={searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your filters" 
              : "Your prescriptions will appear here"}
          />
        ) : (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => (
              <div key={prescription.id} className="p-4 border border-neutral-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💊</span>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Prescription #{prescription.id}</p>
                      <p className="text-xs text-neutral-500">Dr. {prescription.doctorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(prescription.status)}
                    {prescription.refillRequested && (
                      <Badge status="pending">Refill Requested</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  {prescription.medications.map((med, idx) => (
                    <div key={idx} className="flex justify-between items-start p-3 bg-neutral-50 rounded-lg">
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

                <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                  <div className="text-xs text-neutral-600">
                    <span>Prescribed: {format(new Date(prescription.prescriptionDate), 'MMM dd, yyyy')}</span>
                    {prescription.refillsRemaining !== undefined && (
                      <span className="ml-4">Refills: {prescription.refillsRemaining}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {prescription.status === 'dispensed' && !prescription.refillRequested && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedPrescription(prescription);
                          setShowRefillModal(true);
                        }}
                      >
                        Request Refill
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => viewDetails(prescription)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showRefillModal && selectedPrescription && (
        <RefillRequestModal
          isOpen={showRefillModal}
          onClose={() => setShowRefillModal(false)}
          prescription={selectedPrescription}
        />
      )}

      {showDetailsModal && selectedPrescription && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Prescription Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Prescription #{selectedPrescription.id}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Prescribed by Dr. {selectedPrescription.doctorName} on {format(new Date(selectedPrescription.prescriptionDate), 'MMMM dd, yyyy')}
              </p>
            </div>

            <div>
              <h4 className="text-md font-medium text-neutral-900 mb-3">Medications</h4>
              <div className="space-y-3">
                {selectedPrescription.medications.map((med: any, idx: number) => (
                  <div key={idx} className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-neutral-900">{med.name}</h5>
                      <Badge status={selectedPrescription.status === 'dispensed' ? 'delivered' : 'pending'}>
                        {selectedPrescription.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-600">Dosage:</span> {med.dosage}
                      </div>
                      <div>
                        <span className="text-neutral-600">Frequency:</span> {med.frequency}
                      </div>
                      <div>
                        <span className="text-neutral-600">Duration:</span> {med.duration}
                      </div>
                      <div>
                        <span className="text-neutral-600">Quantity:</span> {med.quantity}
                      </div>
                    </div>
                    {med.instructions && (
                      <div className="mt-3 p-3 bg-white rounded border-l-4 border-primary-500">
                        <p className="text-sm text-neutral-700">
                          <span className="font-medium">Instructions:</span> {med.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-neutral-600">
                  <div>Refills Remaining: {selectedPrescription.refillsRemaining || 0}</div>
                  <div>Last Dispensed: {selectedPrescription.lastDispensed ? format(new Date(selectedPrescription.lastDispensed), 'MMM dd, yyyy') : 'Not dispensed'}</div>
                </div>
                <div className="flex gap-2">
                  {selectedPrescription.status === 'dispensed' && !selectedPrescription.refillRequested && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowDetailsModal(false);
                        setSelectedPrescription(selectedPrescription);
                        setShowRefillModal(true);
                      }}
                    >
                      Request Refill
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};