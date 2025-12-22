import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { restockItem, dismissAlert } from '../../store/inventorySlice';
import { addNotification } from '../../store/notificationSlice';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';

const Package = ({ className }: { className?: string }) => <span className={className}>📦</span>;
const AlertTriangle = ({ className }: { className?: string }) => <span className={className}>⚠️</span>;
const Plus = ({ className }: { className?: string }) => <span className={className}>➕</span>;
const Search = ({ className }: { className?: string }) => <span className={className}>🔍</span>;

export const InventoryManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { items, alerts } = useSelector((state: RootState) => state.inventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showRestockModal, setShowRestockModal] = useState<string | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(0);

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item: typeof items[0]) => {
    if (item.currentStock <= 5) return { status: 'critical', color: 'text-red-600 bg-red-50' };
    if (item.currentStock <= item.minStock) return { status: 'low', color: 'text-yellow-600 bg-yellow-50' };
    if (item.currentStock >= item.maxStock * 0.8) return { status: 'high', color: 'text-blue-600 bg-blue-50' };
    return { status: 'normal', color: 'text-green-600 bg-green-50' };
  };

  const handleRestock = (itemId: string) => {
    if (restockQuantity > 0) {
      dispatch(restockItem({ itemId, quantity: restockQuantity }));
      dispatch(addNotification({
      type: 'success',
      title: 'Stock Updated',
      message: 'Added ${restockQuantity} units to inventory',
      priority: 'medium',
      category: 'system'
    }));
      setShowRestockModal(null);
      setRestockQuantity(0);
    }
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const lowStockItems = items.filter(i => i.currentStock <= i.minStock).length;
  const expiringItems = items.filter(i => {
    if (!i.expiryDate) return false;
    const expiry = new Date(i.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  }).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
              <p className="text-sm text-gray-600">Critical Alerts</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
              <p className="text-sm text-gray-600">Low Stock</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-orange-600">{expiringItems}</p>
              <p className="text-sm text-gray-600">Expiring Soon</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Alerts</h2>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg flex justify-between items-center ${
                alert.severity === 'critical' ? 'bg-red-50 border border-red-200' :
                alert.severity === 'high' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center">
                  <AlertTriangle className={`w-4 h-4 mr-2 ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'high' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <span className="text-sm">{alert.message}</span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => dispatch(dismissAlert(alert.id))}
                >
                  Dismiss
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pharmacist-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pharmacist-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Batch: {item.batchNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.currentStock} {item.unit}</p>
                        <p className="text-xs text-gray-500">Min: {item.minStock} | Max: {item.maxStock}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.expiryDate || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => setShowRestockModal(item.id)}
                        >
                          Restock
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Restock Item</h3>
              <div className="space-y-4">
                <Input
                  label="Quantity to Add"
                  type="number"
                  value={restockQuantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRestockQuantity(parseInt(e.target.value) || 0)}
                  min="1"
                />
                <div className="flex gap-3">
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowRestockModal(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => handleRestock(showRestockModal)}
                    className="flex-1"
                  >
                    Add Stock
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};