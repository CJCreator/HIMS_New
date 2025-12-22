import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { markTaken } from '../../store/adherenceSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export default function MedicationAdherence() {
  const { schedule, adherenceRate, streak, missedDoses } = useSelector((state: RootState) => state.adherence);
  const dispatch = useDispatch();

  const today = schedule.filter(s => s.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Medication Adherence</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-600">{adherenceRate}%</div>
          <div className="text-sm text-gray-600">Adherence Rate</div>
          <div className="mt-2 w-full bg-gray-200 rounded h-2">
            <div className="bg-green-500 h-2 rounded" style={{ width: `${adherenceRate}%` }}></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-blue-600">{streak}</div>
          <div className="text-sm text-gray-600">Day Streak 🔥</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-600">{missedDoses}</div>
          <div className="text-sm text-gray-600">Missed This Month</div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {today.map(dose => (
            <div key={dose.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dose.taken ? 'bg-green-100' : 'bg-gray-200'}`}>
                  {dose.taken ? '✓' : '💊'}
                </div>
                <div>
                  <div className="font-semibold">{dose.medication}</div>
                  <div className="text-sm text-gray-600">{dose.time} • {dose.frequency}</div>
                </div>
              </div>
              {!dose.taken && (
                <Button size="sm" onClick={() => dispatch(markTaken(dose.id))}>
                  Mark Taken
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">7-Day Adherence</h2>
        <div className="flex gap-2">
          {[100, 100, 85, 100, 100, 70, 100].map((rate, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="h-32 bg-gray-200 rounded relative">
                <div className={`absolute bottom-0 w-full rounded ${rate === 100 ? 'bg-green-500' : rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ height: `${rate}%` }}></div>
              </div>
              <div className="text-xs text-gray-600 mt-2">Day {i + 1}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
