import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card } from '../../components/Card';

export default function DoctorPerformance() {
  const { performance, monthlyData } = useSelector((state: RootState) => state.doctorAnalytics);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doctor Performance Dashboard</h1>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-blue-600">{performance.consultations}</div>
          <div className="text-sm text-gray-600">Total Consultations</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-yellow-600">{performance.avgRating}⭐</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-600">{performance.patientSatisfaction}%</div>
          <div className="text-sm text-gray-600">Satisfaction</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-purple-600">${(performance.revenue / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600">Revenue</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-indigo-600">{performance.prescriptions}</div>
          <div className="text-sm text-gray-600">Prescriptions</div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Performance</h2>
        <div className="flex gap-4">
          {monthlyData.map(m => (
            <div key={m.month} className="flex-1 text-center">
              <div className="h-40 bg-gray-200 rounded relative">
                <div className="absolute bottom-0 w-full bg-blue-500 rounded" style={{ height: `${(m.consultations / 60) * 100}%` }}></div>
              </div>
              <div className="mt-2 font-semibold">{m.month}</div>
              <div className="text-sm text-gray-600">{m.consultations} visits</div>
              <div className="text-sm text-gray-600">${(m.revenue / 1000).toFixed(0)}K</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
