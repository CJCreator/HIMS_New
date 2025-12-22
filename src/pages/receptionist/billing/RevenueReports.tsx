import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';

export default function RevenueReports() {
  const { summary, paymentMethods } = useSelector((state: RootState) => state.revenue);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Revenue Reports</h1>
        <Button>Export Report</Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-600">${(summary.daily / 1000).toFixed(1)}K</div>
          <div className="text-sm text-gray-600">Today's Revenue</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-blue-600">${(summary.monthly / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600">Monthly Revenue</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-purple-600">${(summary.collected / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600">Collected</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-600">${(summary.outstanding / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600">Outstanding</div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Methods Breakdown</h2>
        <div className="space-y-4">
          {paymentMethods.map(pm => (
            <div key={pm.method}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{pm.method}</span>
                <span className="text-gray-600">${(pm.amount / 1000).toFixed(0)}K ({pm.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-3">
                <div className="bg-blue-500 h-3 rounded" style={{ width: `${pm.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
