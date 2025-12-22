import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  targetRole?: 'doctor' | 'nurse' | 'pharmacy' | 'receptionist' | 'admin';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'medication' | 'appointment' | 'lab' | 'patient' | 'system' | 'inventory';
  relatedId?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    addRoleNotification: (state, action: PayloadAction<{
      role: 'doctor' | 'nurse' | 'pharmacy' | 'receptionist' | 'admin';
      type: 'info' | 'success' | 'warning' | 'error';
      title: string;
      message: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      category?: 'medication' | 'appointment' | 'lab' | 'patient' | 'system' | 'inventory';
      relatedId?: string;
    }>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        targetRole: action.payload.role,
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        priority: action.payload.priority || 'medium',
        category: action.payload.category || 'system',
        relatedId: action.payload.relatedId,
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { 
  addNotification, 
  addRoleNotification,
  markAsRead, 
  markAllAsRead, 
  removeNotification, 
  clearAllNotifications 
} = notificationSlice.actions;

export default notificationSlice.reducer;