import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateLabOrderStatus } from '../../store/labSlice';
import { Card, Button, Input } from '../../components';
import { Search, Clock, AlertTriangle } from 'lucide-react';

export const OrderQueue: React.FC = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state: RootState) => state.lab);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.tests.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    dispatch(updateLabOrderStatus({ id: orderId, status: newStatus as any }));
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
        {filteredOrders.map((order) => (
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
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                {order.status === 'ordered' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusUpdate(order.id, 'processing')}
                  >
                    Start Processing
                  </Button>
                )}
                {order.status === 'processing' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusUpdate(order.id, 'completed')}
                  >
                    Mark Complete
                  </Button>
                )}
                <span className={`px-3 py-1 text-xs rounded-full text-center ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};