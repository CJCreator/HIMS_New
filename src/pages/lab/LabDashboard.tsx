import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { Card, Button, NotificationDetailModal } from '@/components';
import { TestTube, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Notification } from '@/types';

export const LabDashboard = () => {
  const navigate = useNavigate();
  const { orders } = useSelector((state: RootState) => state.lab);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const stats = useMemo(() => ({
    pending: orders.filter(o => o.status === 'ordered').length,
    inProgress: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    critical: orders.filter(o => o.priority === 'urgent').length
  }), [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Laboratory Dashboard</h1>
        <Button onClick={() => navigate('/lab/orders')}>View All Orders</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending Orders</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <TestTube className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed Today</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
              <p className="text-sm text-gray-600">Critical Results</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-body-sm text-neutral-500 text-center py-8">No orders available</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/lab/orders')}>
                  <div>
                    <p className="font-medium text-gray-900">{order.patientName}</p>
                    <p className="text-sm text-gray-600">{order.tests.map(t => t.name).join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{order.orderDate}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-h4 text-neutral-900 mb-4">Recent Notifications</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.slice(0, 5).map(notif => (
              <div 
                key={notif.id} 
                className="p-3 bg-neutral-50 rounded-small cursor-pointer hover:bg-neutral-100"
                onClick={() => setSelectedNotification(notif)}
              >
                <p className="text-body-sm font-medium">{notif.title}</p>
                <p className="text-body-sm text-neutral-600">{notif.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-h4 text-neutral-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/lab/orders')}>
            📋 Order Queue
          </Button>
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/lab/results')}>
            ✍️ Enter Results
          </Button>
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/lab/verification')}>
            ✅ Verify Results
          </Button>
          <Button variant="secondary" className="justify-start" onClick={() => navigate('/lab/reports')}>
            📊 Reports
          </Button>
        </div>
      </Card>

      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};
