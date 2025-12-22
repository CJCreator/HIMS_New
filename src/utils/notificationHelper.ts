// Helper function to ensure all notifications have required fields
export const createNotification = (notification: {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'medication' | 'appointment' | 'lab' | 'patient' | 'system' | 'inventory';
}) => ({
  ...notification,
  priority: notification.priority || 'medium',
  category: notification.category || 'system'
});