import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card } from '../../components/Card';

export default function AppointmentAnalytics() {
  const { stats, peakHours } = useSelector((state: RootState) => state.appointmentAnalytics);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Appointment Analytics</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Appointments</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-600">{stats.noShows}</div>
          <div className="text-sm text-gray-600">No-Shows ({stats.noShowRate}%)</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-gray-600">{stats.avgWaitTime} min</div>
          <div className="text-sm text-gray-600">Avg Wait Time</div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Peak Hours Analysis</h2>
        <div className="flex gap-4 items-end">
          {peakHours.map(h => (
            <div key={h.hour} className="flex-1 text-center">
              <div className="h-48 bg-gray-200 rounded relative">
                <div className="absolute bottom-0 w-full bg-green-500 rounded" style={{ height: `${(h.count / 70) * 100}%` }}></div>
              </div>
              <div className="mt-2 font-semibold">{h.hour}</div>
              <div className="text-sm text-gray-600">{h.count} appts</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
