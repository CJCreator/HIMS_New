import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { saveSignature, signPrescription } from '../../store/signatureSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import SignaturePad from '../../components/SignaturePad';

export default function PrescriptionSignature() {
  const { signatures, signedPrescriptions } = useSelector((state: RootState) => state.signature);
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const dispatch = useDispatch();
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);

  const unsigned = prescriptions.filter((p: any) => !signedPrescriptions.find((sp: any) => sp.prescriptionId === p.id));

  const handleSaveSignature = (signatureData: string) => {
    const newSig = {
      id: Date.now().toString(),
      doctorId: 'D001',
      doctorName: 'Dr. Smith',
      signatureData,
      createdAt: new Date().toISOString(),
    };
    dispatch(saveSignature(newSig));
    
    if (selectedPrescription) {
      dispatch(signPrescription({ id: Date.now().toString(), prescriptionId: selectedPrescription, signatureId: newSig.id }));
    }
    
    setShowSignModal(false);
    setSelectedPrescription(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Electronic Prescription Signature</h1>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Unsigned Prescriptions ({unsigned.length})</h2>
          <div className="space-y-3">
            {unsigned.map((rx: any) => (
              <Card key={rx.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{rx.medication}</h3>
                    <p className="text-sm text-gray-600">{rx.patientName}</p>
                    <p className="text-sm text-gray-500">{rx.date}</p>
                  </div>
                  <Button size="sm" onClick={() => { setSelectedPrescription(rx.id); setShowSignModal(true); }}>
                    Sign
                  </Button>
                </div>
              </Card>
            ))}
            {unsigned.length === 0 && <p className="text-gray-500 text-center py-8">No unsigned prescriptions</p>}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Signature Audit Trail</h2>
          <div className="space-y-3">
            {signedPrescriptions.slice(0, 10).map((sp: any) => {
              const rx = prescriptions.find((p: any) => p.id === sp.prescriptionId);
              if (!rx) return null;
              return (
                <Card key={sp.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{rx?.medications?.[0]?.name || 'Medication'}</h3>
                      <p className="text-xs text-gray-600">{new Date(sp.signedAt).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">IP: {sp.ipAddress}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <Modal isOpen={showSignModal} onClose={() => setShowSignModal(false)} title="Sign Prescription">
        <SignaturePad onSave={handleSaveSignature} onCancel={() => setShowSignModal(false)} />
      </Modal>
    </div>
  );
}
