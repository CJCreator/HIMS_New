import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { createPO } from '../../store/reorderSlice';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';

export default function ReorderManagement() {
  const { items, purchaseOrders, suppliers } = useSelector((state: RootState) => state.reorder);
  const dispatch = useDispatch();
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const critical = items.filter(i => i.status === 'critical').length;
  const low = items.filter(i => i.status === 'low').length;

  const handleCreatePO = () => {
    if (!selectedItem) return;
    dispatch(createPO({
      id: `PO${Date.now()}`,
      supplier: selectedItem.supplier,
      items: [{ medication: selectedItem.medication, qty: selectedItem.reorderQty }],
      total: selectedItem.reorderQty * 5,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    }));
    setShowPOModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Stock Reorder Management</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-600">{critical}</div>
          <div className="text-sm text-gray-600">Critical Stock</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-orange-600">{low}</div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-blue-600">{purchaseOrders.filter(po => po.status === 'pending').length}</div>
          <div className="text-sm text-gray-600">Pending POs</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-600">{items.filter(i => i.status === 'ok').length}</div>
          <div className="text-sm text-gray-600">Adequate Stock</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Reorder Alerts</h2>
          <div className="space-y-3">
            {items.filter(i => i.status !== 'ok').map(item => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{item.medication}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${item.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Current: {item.currentStock} | Reorder Point: {item.reorderPoint}</p>
                    <p className="text-sm text-gray-500">Supplier: {item.supplier}</p>
                    <p className="text-sm text-gray-500">Last Ordered: {item.lastOrdered}</p>
                  </div>
                  <Button size="sm" onClick={() => { setSelectedItem(item); setShowPOModal(true); }}>
                    Create PO
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Purchase Orders</h2>
          <div className="space-y-3">
            {purchaseOrders.slice(0, 10).map(po => (
              <Card key={po.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{po.id}</h3>
                    <p className="text-sm text-gray-600">{po.supplier}</p>
                    <p className="text-sm text-gray-700">{po.items.map(i => `${i.medication} (${i.qty})`).join(', ')}</p>
                    <p className="text-sm text-gray-500">${po.total} • {po.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${po.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {po.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showPOModal} onClose={() => setShowPOModal(false)} title="Create Purchase Order">
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Medication</p>
              <p className="font-semibold">{selectedItem.medication}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Supplier</p>
              <p className="font-semibold">{selectedItem.supplier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quantity</p>
              <p className="font-semibold">{selectedItem.reorderQty} units</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Total</p>
              <p className="font-semibold">${selectedItem.reorderQty * 5}</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPOModal(false)}>Cancel</Button>
              <Button onClick={handleCreatePO}>Create PO</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
