import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { createSeries, cancelSeries } from '../store/recurringAppointmentSlice';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';

export default function RecurringAppointmentForm() {
  const { series, appointments } = useSelector((state: RootState) => state.recurringAppointment);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    patientName: '',
    doctor: '',
    type: '',
    pattern: 'weekly',
    startDate: '',
    time: '',
    occurrences: 10,
  });

  const handleCreate = () => {
    const endDate = new Date(form.startDate);
    if (form.pattern === 'weekly') endDate.setDate(endDate.getDate() + form.occurrences * 7);
    else if (form.pattern === 'monthly') endDate.setMonth(endDate.getMonth() + form.occurrences);
    
    dispatch(createSeries({
      ...form,
      id: `S${Date.now()}`,
      endDate: endDate.toISOString().split('T')[0],
      completed: 0,
    }));
    
    setForm({ patientName: '', doctor: '', type: '', pattern: 'weekly', startDate: '', time: '', occurrences: 10 });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recurring Appointments</h1>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Create Recurring Series</h2>
          <div className="space-y-4">
            <Input label="Patient Name" value={form.patientName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, patientName: e.target.value })} />
            <Input label="Doctor" value={form.doctor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, doctor: e.target.value })} />
            <Input label="Appointment Type" value={form.type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, type: e.target.value })} />
            
            <div>
              <label className="block text-sm font-medium mb-1">Recurrence Pattern</label>
              <select value={form.pattern} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, pattern: e.target.value })} className="w-full border rounded p-2">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="date" value={form.startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, startDate: e.target.value })} />
              <Input label="Time" type="time" value={form.time} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, time: e.target.value })} />
            </div>

            <Input label="Number of Occurrences" type="number" value={form.occurrences} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, occurrences: parseInt(e.target.value) })} />

            <Button onClick={handleCreate} className="w-full">Create Series</Button>
          </div>
        </Card>

        <div>
          <h2 className="text-lg font-semibold mb-4">Active Series ({series.length})</h2>
          <div className="space-y-3">
            {series.map(s => (
              <Card key={s.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{s.type}</h3>
                    <p className="text-sm text-gray-600">{s.patientName} • {s.doctor}</p>
                    <p className="text-sm text-gray-500">{s.pattern} • {s.time}</p>
                    <p className="text-sm text-gray-500">{s.startDate} to {s.endDate}</p>
                    <div className="mt-2">
                      <div className="text-xs text-gray-600">Progress: {s.completed}/{s.occurrences}</div>
                      <div className="w-full bg-gray-200 rounded h-2 mt-1">
                        <div className="bg-blue-500 h-2 rounded" style={{ width: `${(s.completed / s.occurrences) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => dispatch(cancelSeries(s.id))}>Cancel</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
