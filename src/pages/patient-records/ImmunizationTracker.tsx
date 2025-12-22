import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addRecord } from '../../store/immunizationSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';

export default function ImmunizationTracker() {
  const { records, inventory } = useSelector((state: RootState) => state.immunization);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ vaccine: '', date: '', lot: '' });

  const overdue = records.filter(r => r.status === 'overdue').length;
  const upcoming = records.filter(r => {
    if (!r.nextDue) return false;
    const days = Math.floor((new Date(r.nextDue).getTime() - Date.now()) / 86400000);
    return days > 0 && days <= 30;
  }).length;

  const handleAdd = () => {
    const nextDue = new Date(form.date);
    nextDue.setFullYear(nextDue.getFullYear() + 1);
    dispatch(addRecord({ ...form, id: Date.now().toString(), status: 'completed', nextDue: nextDue.toISOString().split('T')[0] }));
    setShowModal(false);
    setForm({ vaccine: '', date: '', lot: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Immunization Tracker</h1>
        <div className="flex gap-2">
          <Button variant="outline">Generate Certificate</Button>
          <Button onClick={() => setShowModal(true)}>+ Record Vaccine</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-600">{overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-orange-600">{upcoming}</div>
          <div className="text-sm text-gray-600">Due in 30 Days</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-600">{records.filter(r => r.status === 'completed').length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Immunization Records</h2>
          <div className="space-y-3">
            {records.map(record => (
              <Card key={record.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{record.vaccine}</h3>
                    {record.date && <p className="text-sm text-gray-600">Given: {record.date}</p>}
                    <p className="text-sm text-gray-600">Next Due: {record.nextDue}</p>
                    {record.lot && <p className="text-sm text-gray-500">Lot: {record.lot}</p>}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    record.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Vaccine Inventory</h2>
          <div className="space-y-3">
            {inventory.map(item => (
              <Card key={item.vaccine} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.vaccine}</h3>
                    <p className="text-sm text-gray-600">Min Stock: {item.minStock}</p>
                  </div>
                  <div className={`text-2xl font-bold ${item.stock < item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                    {item.stock}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record Vaccination">
        <div className="space-y-4">
          <Input label="Vaccine Name" value={form.vaccine} onChange={(e) => setForm({ ...form, vaccine: e.target.value })} />
          <Input label="Date Given" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="Lot Number" value={form.lot} onChange={(e) => setForm({ ...form, lot: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Record</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
