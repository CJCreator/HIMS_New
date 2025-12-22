import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { submitClaim, updateStatus } from '../../../store/insuranceSlice';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';

const statusColors: Record<string, string> = { pending: 'yellow', approved: 'green', rejected: 'red' };

export default function InsuranceClaims() {
  const { claims } = useSelector((state: RootState) => state.insurance);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientName: '', provider: '', amount: '', service: '' });

  const pending = claims.filter(c => c.status === 'pending').length;
  const approved = claims.filter(c => c.status === 'approved').length;
  const rejected = claims.filter(c => c.status === 'rejected').length;

  const handleSubmit = () => {
    dispatch(submitClaim({
      id: `CLM${Date.now()}`,
      ...form,
      amount: parseFloat(form.amount),
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    }));
    setShowModal(false);
    setForm({ patientName: '', provider: '', amount: '', service: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Insurance Claims</h1>
        <Button onClick={() => setShowModal(true)}>+ Submit Claim</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-yellow-600">{pending}</div>
          <div className="text-sm text-gray-600">Pending Claims</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-600">{approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-600">{rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </Card>
      </div>

      <div className="space-y-3">
        {claims.map(claim => (
          <Card key={claim.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{claim.id}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : claim.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {claim.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{claim.patientName} • {claim.provider}</p>
                <p className="text-sm text-gray-700">Service: {claim.service} • ${claim.amount}</p>
                <p className="text-sm text-gray-500">{claim.date}</p>
                {claim.reason && <p className="text-sm text-red-600 mt-1">Reason: {claim.reason}</p>}
              </div>
              {claim.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => dispatch(updateStatus({ id: claim.id, status: 'approved' }))}>Approve</Button>
                  <Button variant="outline" size="sm" onClick={() => dispatch(updateStatus({ id: claim.id, status: 'rejected', reason: 'Documentation incomplete' }))}>Reject</Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit Insurance Claim">
        <div className="space-y-4">
          <Input label="Patient Name" value={form.patientName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, patientName: e.target.value })} />
          <Input label="Insurance Provider" value={form.provider} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, provider: e.target.value })} />
          <Input label="Service Description" value={form.service} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, service: e.target.value })} />
          <Input label="Claim Amount" type="number" value={form.amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, amount: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Claim</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
