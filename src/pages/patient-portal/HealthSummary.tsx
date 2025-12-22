import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card } from '../../components/Card';

const statusColors: Record<string, string> = { normal: 'green', warning: 'yellow', critical: 'red' };
const trendIcons: Record<string, string> = { up: '↑', down: '↓', stable: '→' };

export default function HealthSummary() {
  const { metrics, healthScore, recentActivity, recommendations } = useSelector((state: RootState) => state.healthSummary);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Health Summary</h1>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="p-6 col-span-1">
          <div className="text-center">
            <div className="text-6xl font-bold text-green-600 mb-2">{healthScore}</div>
            <div className="text-sm text-gray-600">Health Score</div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: `${healthScore}%` }}></div>
            </div>
          </div>
        </Card>

        <div className="col-span-2 grid grid-cols-2 gap-4">
          {Object.entries(metrics).map(([key, data]: [string, any]) => (
            <Card key={key} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="text-2xl font-bold">{data.value}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${data.status === 'normal' ? 'bg-green-100 text-green-800' : data.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {data.status}
                  </span>
                  <div className="text-2xl mt-1">{data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '→'}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium">{activity.description}</div>
                  <div className="text-sm text-gray-500">{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Health Recommendations</h2>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                <div className="text-blue-600 text-xl">💡</div>
                <div className="text-sm">{rec}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
