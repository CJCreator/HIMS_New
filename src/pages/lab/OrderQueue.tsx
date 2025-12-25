import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateLabOrderStatus } from '@/store/labSlice';
import { addNotification, addRoleNotification } from '@/store/notificationSlice';
import { Card, Button, Input, Modal, Badge } from '@/components';
import { Search, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const OrderQueue = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state: RootState) => state.lab);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.tests.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: 'ordered' | 'processing' | 'completed') => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setIsLoading(true);
    try {
      dispatch(updateLabOrderStatus({ id: orderId, status: newStatus }));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Order Status Updated',
        message: `Order ${orderId} status changed to ${newStatus}`,
        priority: 'medium',
        category: 'lab'
      }));

      if (newStatus === 'completed') {
        dispatch(addRoleNotification({
          role: 'doctor',
          type: 'info',
          title: 'Lab Results Ready',
          message: `Lab results for ${order.patientName} are ready for review`,
          priority: 'high',
          category: 'lab'
        }));
      }

      toast.success(`Order ${newStatus}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectSample = (order: any) => {
    setSelectedOrder(order);
    setShowSampleModal(true);
  };

  const confirmSampleCollection = () => {
    if (selectedOrder) {
      handleStatusUpdate(selectedOrder.id, 'processing');
      toast.success('Sample collected');
    }
    setShowSampleModal(false);
  };

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getPriorityIcon = (priority: string) => {
    return priority === 'urgent' ? 
      <AlertTriangle className="w-4 h-4 text-red-500" /> : 
      <Clock className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lab Order Queue</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="ordered">Ordered</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getPriorityIcon(order.priority)}
                    <h3 className="font-semibold text-gray-900">{order.patientName}</h3>
                    <span className="text-sm text-gray-500">#{order.id}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Tests</p>
                      <p className="font-medium">{order.tests.map(t => t.name).join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Ordered Date</p>
                      <p className="font-medium">{order.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Doctor</p>
                      <p className="font-medium">{order.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Priority</p>
                      <Badge status={order.priority === 'urgent' ? 'error' : 'pending'}>
                        {order.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => viewOrderDetails(order)}
                  >
                    View Details
                  </Button>
                  {order.status === 'ordered' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCollectSample(order)}
                      loading={isLoading}
                    >
                      Collect Sample
                    </Button>
                  )}
                  {order.status === 'processing' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, 'completed')}
                      loading={isLoading}
                    >
                      Mark Complete
                    </Button>
                  )}
                  <Badge status={
                    order.status === 'completed' ? 'delivered' :
                    order.status === 'processing' ? 'sent' : 'pending'
                  }>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Order Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium">{selectedOrder.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{selectedOrder.doctorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{selectedOrder.orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <Badge status={selectedOrder.priority === 'urgent' ? 'error' : 'pending'}>
                  {selectedOrder.priority}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge status={
                  selectedOrder.status === 'completed' ? 'delivered' :
                  selectedOrder.status === 'processing' ? 'sent' : 'pending'
                }>
                  {selectedOrder.status}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Ordered Tests</p>
              <div className="space-y-2">
                {selectedOrder.tests.map((test: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{test.name}</p>
                    {test.instructions && (
                      <p className="text-sm text-gray-600 mt-1">{test.instructions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Sample Collection Modal */}
      {selectedOrder && (
        <Modal
          isOpen={showSampleModal}
          onClose={() => setShowSampleModal(false)}
          title="Collect Sample"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-body">Confirm sample collection for {selectedOrder.patientName}?</p>
            <div className="p-4 bg-neutral-50 rounded-small">
              <p className="text-body-sm text-neutral-600">Order ID: {selectedOrder.id}</p>
              <p className="text-body-sm text-neutral-600">Tests: {selectedOrder.tests.map((t: any) => t.name).join(', ')}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowSampleModal(false)}>Cancel</Button>
              <Button onClick={confirmSampleCollection} loading={isLoading}>Confirm Collection</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
