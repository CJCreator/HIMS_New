import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card } from '../../components/Card';

export default function InventoryAnalytics() {
  const { metrics, topMovers } = useSelector((state: RootState) => state.inventoryAnalytics);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Analytics</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-blue-600">{metrics.turnoverRate}x</div>
          <div className="text-sm text-gray-600">Turnover Rate</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-600">${(metrics.expiryWaste / 1000).toFixed(1)}K</div>
          <div className="text-sm text-gray-600">Expiry Waste</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-600">${(metrics.stockValue / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600">Stock Value</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-purple-600">{metrics.reorderOptimization}%</div>
          <div className="text-sm text-gray-600">Reorder Efficiency</div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Top Moving Items</h2>
        <div className="space-y-3">
          {topMovers.map((item, i) => (
            <div key={item.item} className="flex items-center gap-4 p-4 bg-gray-50 rounded">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{item.item}</div>
                <div className="text-sm text-gray-600">{item.units} units sold</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">${(item.value / 1000).toFixed(1)}K</div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
