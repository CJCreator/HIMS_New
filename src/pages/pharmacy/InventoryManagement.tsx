import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { restockItem, dismissAlert, addInventoryItem } from '@/store/inventorySlice';
import { addNotification } from '@/store/notificationSlice';
import { Button, Card, Input, Modal } from '@/components';
import { toast } from 'sonner';

export const InventoryManagement = () => {
  const dispatch = useDispatch();
  const { items, alerts } = useSelector((state: RootState) => state.inventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showRestockModal, setShowRestockModal] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: 'tablets',
    batchNumber: '',
    expiryDate: '',
  });

  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(items.map(item => item.category)))],
    [items]
  );
  
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, categoryFilter]);

  const stats = useMemo(() => ({
    criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
    lowStockItems: items.filter(i => i.currentStock <= i.minStock).length,
    expiringItems: items.filter(i => {
      if (!i.expiryDate) return false;
      const expiry = new Date(i.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiry <= thirtyDaysFromNow;
    }).length,
  }), [items, alerts]);

  const getStockStatus = (item: typeof items[0]) => {
    if (item.currentStock <= 5) return { status: 'critical', color: 'text-red-600 bg-red-50' };
    if (item.currentStock <= item.minStock) return { status: 'low', color: 'text-yellow-600 bg-yellow-50' };
    if (item.currentStock >= item.maxStock * 0.8) return { status: 'high', color: 'text-blue-600 bg-blue-50' };
    return { status: 'normal', color: 'text-green-600 bg-green-50' };
  };

  const handleRestock = async () => {
    if (!showRestockModal || restockQuantity <= 0) {
      toast.error('Please enter valid quantity');
      return;
    }

    setIsLoading(true);
    try {
      dispatch(restockItem({ itemId: showRestockModal, quantity: restockQuantity }));
      dispatch(addNotification({
        type: 'success',
        title: 'Stock Updated',
        message: `Added ${restockQuantity} units to inventory`,
        priority: 'medium',
        category: 'inventory'
      }));
      toast.success('Stock updated successfully');
      setShowRestockModal(null);
      setRestockQuantity(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category || newItem.currentStock < 0) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      dispatch(addInventoryItem(newItem));
      dispatch(addNotification({
        type: 'success',
        title: 'Item Added',
        message: `${newItem.name} added to inventory`,
        priority: 'medium',
        category: 'inventory'
      }));
      toast.success('Item added successfully');
      setShowAddModal(false);
      setNewItem({
        name: '',
        category: '',
        currentStock: 0,
        minStock: 0,
        maxStock: 0,
        unit: 'tablets',
        batchNumber: '',
        expiryDate: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissAlert = (alertId: string) => {
    dispatch(dismissAlert(alertId));
    toast.success('Alert dismissed');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          + Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-h2 text-blue-600">{items.length}</div>
          <div className="text-body text-neutral-600">Total Items</div>
        </Card>
        <Card className="p-4">
          <div className="text-h2 text-red-600">{stats.criticalAlerts}</div>
          <div className="text-body text-neutral-600">Critical Alerts</div>
        </Card>
        <Card className="p-4">
          <div className="text-h2 text-yellow-600">{stats.lowStockItems}</div>
          <div className="text-body text-neutral-600">Low Stock</div>
        </Card>
        <Card className="p-4">
          <div className="text-h2 text-orange-600">{stats.expiringItems}</div>
          <div className="text-body text-neutral-600">Expiring Soon</div>
        </Card>
      </div>

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
                <span className="text-sm">{alert.message}</span>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleDismissAlert(alert.id)}
                >
                  Dismiss
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex gap-4">
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pharmacist-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

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
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setShowRestockModal(item.id)}
                      >
                        Restock
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Restock Modal */}
      <Modal
        isOpen={!!showRestockModal}
        onClose={() => setShowRestockModal(null)}
        title="Restock Item"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Quantity to Add *"
            type="number"
            value={restockQuantity}
            onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
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
              onClick={handleRestock}
              loading={isLoading}
              className="flex-1"
            >
              Add Stock
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Item"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Item Name *"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <Input
              label="Category *"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            />
            <Input
              label="Current Stock *"
              type="number"
              value={newItem.currentStock}
              onChange={(e) => setNewItem({ ...newItem, currentStock: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Min Stock *"
              type="number"
              value={newItem.minStock}
              onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Max Stock *"
              type="number"
              value={newItem.maxStock}
              onChange={(e) => setNewItem({ ...newItem, maxStock: parseInt(e.target.value) || 0 })}
            />
            <div>
              <label className="block text-body font-medium text-neutral-700 mb-1">Unit *</label>
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="tablets">Tablets</option>
                <option value="capsules">Capsules</option>
                <option value="bottles">Bottles</option>
                <option value="boxes">Boxes</option>
                <option value="units">Units</option>
              </select>
            </div>
            <Input
              label="Batch Number"
              value={newItem.batchNumber}
              onChange={(e) => setNewItem({ ...newItem, batchNumber: e.target.value })}
            />
            <Input
              label="Expiry Date"
              type="date"
              value={newItem.expiryDate}
              onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddItem}
              loading={isLoading}
              className="flex-1"
            >
              Add Item
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
