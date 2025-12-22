import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addProblem, updateStatus } from '../../store/problemListSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';

export default function ProblemList() {
  const { problems } = useSelector((state: RootState) => state.problemList);
  const dispatch = useDispatch();
  const [view, setView] = useState('active');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', icd10: '', onset: '', notes: '' });

  const filtered = problems.filter(p => view === 'all' || p.status === view);

  const handleAdd = () => {
    dispatch(addProblem({ ...form, id: Date.now().toString(), status: 'active' }));
    setShowModal(false);
    setForm({ name: '', icd10: '', onset: '', notes: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Problem List</h1>
        <Button onClick={() => setShowModal(true)}>+ Add Problem</Button>
      </div>

      <div className="flex gap-2 mb-6">
        {['active', 'resolved', 'all'].map(v => (
          <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded ${view === v ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            {v.charAt(0).toUpperCase() + v.slice(1)} ({problems.filter(p => v === 'all' || p.status === v).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(problem => (
          <Card key={problem.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{problem.name}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm font-mono">{problem.icd10}</span>
                  <span className={`px-2 py-1 rounded text-sm ${problem.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {problem.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Onset: {problem.onset}</p>
                {problem.resolved && <p className="text-sm text-gray-600 mb-1">Resolved: {problem.resolved}</p>}
                <p className="text-sm text-gray-700">{problem.notes}</p>
              </div>
              {problem.status === 'active' && (
                <Button variant="outline" size="sm" onClick={() => dispatch(updateStatus({ id: problem.id, status: 'resolved' }))}>
                  Mark Resolved
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Problem">
        <div className="space-y-4">
          <Input label="Problem Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="ICD-10 Code" value={form.icd10} onChange={(e) => setForm({ ...form, icd10: e.target.value })} />
          <Input label="Onset Date" type="date" value={form.onset} onChange={(e) => setForm({ ...form, onset: e.target.value })} />
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border rounded p-2" rows={3} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Problem</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
