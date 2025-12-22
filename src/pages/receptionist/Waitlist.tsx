import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addToWaitlist, removeFromWaitlist, bookFromWaitlist } from '../../store/waitlistSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';

const priorityColors: Record<string, string> = { high: 'red', medium: 'orange', low: 'blue' };

export default function Waitlist() {
  const { entries } = useSelector((state: RootState) => state.waitlist);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ patientName: '', phone: '', doctor: '', reason: '', priority: 'medium', preferredDates: '' });

  const filtered = entries.filter(e => filter === 'all' || e.priority === filter);

  const handleAdd = () => {
    dispatch(addToWaitlist({
      ...form,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split('T')[0],
      preferredDates: form.preferredDates.split(',').map(d => d.trim()).filter(Boolean),
    }));
    setShowModal(false);
    setForm({ patientName: '', phone: '', doctor: '', reason: '', priority: 'medium', preferredDates: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Waitlist Management</h1>
        <Button onClick={() => setShowModal(true)}>+ Add to Waitlist</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-600">{entries.filter(e => e.priority === 'high').length}</div>
          <div className="text-sm text-gray-600">High Priority</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-orange-600">{entries.filter(e => e.priority === 'medium').length}</div>
          <div className="text-sm text-gray-600">Medium Priority</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-blue-600">{entries.filter(e => e.priority === 'low').length}</div>
          <div className="text-sm text-gray-600">Low Priority</div>
        </Card>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'high', 'medium', 'low'].map(p => (
          <button key={p} onClick={() => setFilter(p)} className={`px-4 py-2 rounded ${filter === p ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(entry => (
          <Card key={entry.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{entry.patientName}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${entry.priority === 'high' ? 'bg-red-100 text-red-800' : entry.priority === 'medium' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                    {entry.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">📞 {entry.phone} • 👨‍⚕️ {entry.doctor}</p>
                <p className="text-sm text-gray-700">Reason: {entry.reason}</p>
                <p className="text-sm text-gray-500">Added: {entry.addedDate}</p>
                {entry.preferredDates.length > 0 && (
                  <p className="text-sm text-gray-500">Preferred: {entry.preferredDates.join(', ')}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => dispatch(bookFromWaitlist(entry.id))}>Book Appointment</Button>
                <Button variant="outline" size="sm" onClick={() => dispatch(removeFromWaitlist(entry.id))}>Remove</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add to Waitlist">
        <div className="space-y-4">
          <Input label="Patient Name" value={form.patientName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, patientName: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Doctor" value={form.doctor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, doctor: e.target.value })} />
          <Input label="Reason" value={form.reason} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, reason: e.target.value })} />
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select value={form.priority} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, priority: e.target.value })} className="w-full border rounded p-2">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <Input label="Preferred Dates (comma-separated)" value={form.preferredDates} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, preferredDates: e.target.value })} placeholder="2024-02-15, 2024-02-16" />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
