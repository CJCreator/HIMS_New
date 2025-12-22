import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const icons = { appointment: '📅', prescription: '💊', lab: '🔬' };
const colors = { appointment: 'blue', prescription: 'green', lab: 'purple' };

export default function PatientTimeline() {
  const { events } = useSelector((state: RootState) => state.timeline);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = events.filter((e: any) => 
    (filter === 'all' || e.type === filter) &&
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patient Timeline</h1>
        <Button>Export Timeline</Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex gap-4">
          <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded px-3">
            <option value="all">All Events</option>
            <option value="appointment">Appointments</option>
            <option value="prescription">Prescriptions</option>
            <option value="lab">Lab Results</option>
          </select>
        </div>
      </Card>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        <div className="space-y-6">
          {filtered.map((event: any) => (
            <div key={event.id} className="relative pl-16">
              <div className={`absolute left-5 w-6 h-6 rounded-full bg-${colors[event.type as keyof typeof colors]}-500 flex items-center justify-center text-white text-xs`}>
                {icons[event.type as keyof typeof icons]}
              </div>
              <Card className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.date}</p>
                    {event.doctor && <p className="text-sm text-gray-500">{event.doctor}</p>}
                    {event.result && <p className="text-sm text-green-600">Result: {event.result}</p>}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${event.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {event.status}
                  </span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
