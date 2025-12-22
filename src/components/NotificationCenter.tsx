import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Icons as simple components
const Bell = ({ className }: { className?: string }) => <span className={className}>🔔</span>;
const X = ({ className }: { className?: string }) => <span className={className}>❌</span>;
const CheckCircle = ({ className }: { className?: string }) => <span className={className}>✅</span>;
const AlertTriangle = ({ className }: { className?: string }) => <span className={className}>⚠️</span>;
const Info = ({ className }: { className?: string }) => <span className={className}>ℹ️</span>;
const AlertCircle = ({ className }: { className?: string }) => <span className={className}>⚠️</span>;
import { RootState } from '../store';
import { markAsRead, removeNotification, markAllAsRead } from '../store/notificationSlice';

import { Button } from './Button';

interface NotificationCenterProps {
  userRole?: 'doctor' | 'nurse' | 'pharmacy' | 'receptionist' | 'admin';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ userRole }) => {
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<'all' | 'medication' | 'appointment' | 'lab' | 'patient' | 'system'>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');

  // Filter notifications by role and filters
  const filteredNotifications = notifications.filter(notification => {
    const roleMatch = !userRole || !notification.targetRole || notification.targetRole === userRole;
    const categoryMatch = filter === 'all' || notification.category === filter;
    const priorityMatch = priorityFilter === 'all' || notification.priority === priorityFilter;
    return roleMatch && categoryMatch && priorityMatch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleRemove = (id: string) => {
    dispatch(removeNotification(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              
              {/* Filters */}
              <div className="flex gap-2 mb-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="all">All Categories</option>
                  <option value="medication">Medication</option>
                  <option value="appointment">Appointments</option>
                  <option value="lab">Lab Results</option>
                  <option value="patient">Patients</option>
                  <option value="system">System</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900 text-sm">
                                {notification.title}
                              </p>
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <p className="text-xs text-gray-500">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                              {notification.category && (
                                <span className="text-xs text-gray-400 capitalize">
                                  • {notification.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemove(notification.id)}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};