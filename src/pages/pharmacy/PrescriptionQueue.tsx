import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updatePrescriptionStatus } from '@/store/prescriptionSlice';
import { addNotification, addRoleNotification } from '@/store/notificationSlice';
import { Button, Input, Card, Modal, Badge } from '@/components';
import { toast } from 'sonner';

export const PrescriptionQueue = () => {
  const dispatch = useDispatch();
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(prescription => {
      const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [prescriptions, searchTerm, statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: 'pending' | 'processing' | 'ready' | 'dispensed') => {
    const prescription = prescriptions.find(p => p.id === id);
    if (!prescription) return;

    setIsLoading(true);
    try {
      dispatch(updatePrescriptionStatus({ id, status: newStatus }));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Prescription Updated',
        message: `Prescription ${id} status changed to ${newStatus}`,
        priority: 'medium',
        category: 'medication'
      }));
      
      if (newStatus === 'dispensed') {
        dispatch(addRoleNotification({
          role: 'receptionist',
          type: 'info',
          title: 'Prescription Dispensed',
          message: `${prescription.patientName} prescription ready for billing`,
          priority: 'medium',
          category: 'medication'
        }));
      }

      toast.success(`Prescription ${newStatus}`);
    } finally {
      setIsLoading(false);
    }
  };

  const viewPrescriptionDetails = (prescription: any) => {
    setSelectedPrescription(prescription);
    setShowDetails(true);
  };

  const handlePrint = (prescription: any) => {
    setSelectedPrescription(prescription);
    setShowPrintModal(true);
  };

  const confirmPrint = () => {
    toast.success('Prescription sent to printer');
    dispatch(addNotification({
      type: 'info',
      title: 'Prescription Printed',
      message: `Prescription for ${selectedPrescription?.patientName} printed`,
      priority: 'low',
      category: 'medication'
    }));
    setShowPrintModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Prescription Queue</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
        {filteredPrescriptions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No prescriptions found</p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{prescription.patientName}</h3>
                  <p className="text-sm text-gray-500">{prescription.patientId} • {prescription.id}</p>
                </div>
                <div className="flex gap-2">
                  <Badge status={
                    prescription.priority === 'high' ? 'error' :
                    prescription.priority === 'medium' ? 'pending' : 'delivered'
                  }>
                    {prescription.priority}
                  </Badge>
                  <Badge status={
                    prescription.status === 'pending' ? 'pending' :
                    prescription.status === 'processing' ? 'sent' :
                    prescription.status === 'ready' ? 'dispatched' : 'delivered'
                  }>
                    {prescription.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Prescribed by</p>
                  <p className="font-medium text-gray-900">{prescription.doctorName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Medications ({prescription.medications?.length || 0})</p>
                  <div className="space-y-1">
                    {prescription.medications?.slice(0, 2).map((med: any, index: number) => (
                      <p key={index} className="text-sm text-gray-900">
                        {med.name} {med.dosage} × {med.quantity}
                      </p>
                    ))}
                    {prescription.medications && prescription.medications.length > 2 && (
                      <p className="text-sm text-gray-500">
                        +{prescription.medications.length - 2} more
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Prescription Date</p>
                  <p className="text-sm text-gray-900">{prescription.prescriptionDate || prescription.date}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => viewPrescriptionDetails(prescription)}
                  className="flex-1"
                >
                  View
                </Button>
                
                {prescription.status === 'pending' && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleUpdateStatus(prescription.id, 'processing')}
                    loading={isLoading}
                  >
                    Start
                  </Button>
                )}
                
                {prescription.status === 'processing' && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => handleUpdateStatus(prescription.id, 'ready')}
                    loading={isLoading}
                  >
                    Ready
                  </Button>
                )}
                
                {prescription.status === 'ready' && (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handlePrint(prescription)}
                    >
                      Print
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleUpdateStatus(prescription.id, 'dispensed')}
                      loading={isLoading}
                    >
                      Dispense
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedPrescription && (
        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title="Prescription Details"
          size="lg"
        >
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
                <p className="text-gray-900">{selectedPrescription.prescriptionDate || selectedPrescription.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <Badge status={
                  selectedPrescription.priority === 'high' ? 'error' :
                  selectedPrescription.priority === 'medium' ? 'pending' : 'delivered'
                }>
                  {selectedPrescription.priority}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Medications</h3>
              <div className="space-y-4">
                {selectedPrescription.medications?.map((medication: any, index: number) => (
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

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDetails(false)}>Close</Button>
              <Button onClick={() => handlePrint(selectedPrescription)}>Print</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Print Modal */}
      {selectedPrescription && (
        <Modal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          title="Print Prescription"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-body">Print prescription for {selectedPrescription.patientName}?</p>
            <div className="p-4 bg-neutral-50 rounded-small">
              <p className="text-body-sm text-neutral-600">Prescription ID: {selectedPrescription.id}</p>
              <p className="text-body-sm text-neutral-600">Medications: {selectedPrescription.medications?.length || 0}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowPrintModal(false)}>Cancel</Button>
              <Button onClick={confirmPrint}>Print</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
