import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addBatch, recallBatch } from '../../store/batchSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';

export default function BatchTracking() {
  const { batches, recalls } = useSelector((state: RootState) => state.batch);
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [form, setForm] = useState({ medication: '', lotNumber: '', mfgDate: '', expiry: '', qty: '' });
  const [recallReason, setRecallReason] = useState('');

  const active = batches.filter(b => b.status === 'active').length;
  const recalled = batches.filter(b => b.status === 'recalled').length;

  const handleAdd = () => {
    dispatch(addBatch({ ...form, id: `B${Date.now()}`, status: 'active', qty: parseInt(form.qty) }));
    setShowAddModal(false);
    setForm({ medication: '', lotNumber: '', mfgDate: '', expiry: '', qty: '' });
  };

  const handleRecall = () => {
    if (!selectedBatch) return;
    dispatch(recallBatch({
      id: `R${Date.now()}`,
      batchId: selectedBatch.id,
      reason: recallReason,
      date: new Date().toISOString().split('T')[0],
      affectedQty: selectedBatch.qty,
    }));
    setShowRecallModal(false);
    setSelectedBatch(null);
    setRecallReason('');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Batch/Lot Tracking</h1>
        <Button onClick={() => setShowAddModal(true)}>+ Add Batch</Button>
      </div>

      {recalls.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ Active Recalls ({recalls.length})</h3>
          {recalls.slice(0, 3).map(r => {
            const batch = batches.find(b => b.id === r.batchId);
            return (
              <p key={r.id} className="text-sm text-red-700">
                {batch?.medication} - Lot {batch?.lotNumber}: {r.reason}
              </p>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-600">{active}</div>
          <div className="text-sm text-gray-600">Active Batches</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-600">{recalled}</div>
          <div className="text-sm text-gray-600">Recalled Batches</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-blue-600">{batches.reduce((sum, b) => sum + b.qty, 0)}</div>
          <div className="text-sm text-gray-600">Total Units</div>
        </Card>
      </div>

      <div className="space-y-3">
        {batches.map(batch => (
          <Card key={batch.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{batch.medication}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-mono">{batch.lotNumber}</span>
                  <span className={`px-2 py-1 rounded text-xs ${batch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {batch.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Mfg: {batch.mfgDate} | Expiry: {batch.expiry} | Qty: {batch.qty} units</p>
              </div>
              {batch.status === 'active' && (
                <Button variant="outline" size="sm" onClick={() => { setSelectedBatch(batch); setShowRecallModal(true); }}>
                  Recall
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Batch">
        <div className="space-y-4">
          <Input label="Medication" value={form.medication} onChange={(e) => setForm({ ...form, medication: e.target.value })} />
          <Input label="Lot Number" value={form.lotNumber} onChange={(e) => setForm({ ...form, lotNumber: e.target.value })} />
          <Input label="Manufacturing Date" type="date" value={form.mfgDate} onChange={(e) => setForm({ ...form, mfgDate: e.target.value })} />
          <Input label="Expiry Date" type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
          <Input label="Quantity" type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Batch</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showRecallModal} onClose={() => setShowRecallModal(false)} title="Recall Batch">
        {selectedBatch && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-800">⚠️ This will recall batch {selectedBatch.lotNumber} ({selectedBatch.qty} units)</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recall Reason</label>
              <textarea value={recallReason} onChange={(e) => setRecallReason(e.target.value)} className="w-full border rounded p-2" rows={3} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRecallModal(false)}>Cancel</Button>
              <Button onClick={handleRecall}>Confirm Recall</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
