import { Middleware } from '@reduxjs/toolkit';
import { addRoleNotification } from './notificationSlice';

interface ActionWithPayload {
  type: string;
  payload: any;
}

export const notificationMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const typedAction = action as ActionWithPayload;
  
  // Trigger notifications based on actions
  switch (typedAction.type) {
    case 'inventory/updateStock':
      const { itemId, newStock } = typedAction.payload;
      const state = store.getState() as any;
      const item = state.inventory?.items?.find((i: any) => i.id === itemId);
      
      if (item && newStock <= item.minStock) {
        store.dispatch(addRoleNotification({
          role: 'pharmacy',
          type: newStock <= 5 ? 'error' : 'warning',
          title: 'Low Stock Alert',
          message: `${item.name} is ${newStock <= 5 ? 'critically' : ''} low (${newStock} units remaining)`,
          category: 'inventory',
          priority: newStock <= 5 ? 'urgent' : 'high'
        }));
      }
      break;
      
    case 'medication/addMedicationRequest':
      store.dispatch(addRoleNotification({
        role: 'pharmacy',
        type: 'info',
        title: 'New Medication Request',
        message: `Request for ${typedAction.payload.medication} from Room ${typedAction.payload.roomNumber}`,
        category: 'medication',
        priority: typedAction.payload.urgency === 'high' ? 'urgent' : 'medium'
      }));
      break;
      
    case 'prescriptions/updatePrescriptionStatus':
      if (typedAction.payload.status === 'ready') {
        store.dispatch(addRoleNotification({
          role: 'receptionist',
          type: 'success',
          title: 'Prescription Ready',
          message: `Prescription ${typedAction.payload.id} is ready for pickup`,
          category: 'medication',
          priority: 'medium'
        }));
      }
      break;
      
    case 'lab/addLabOrder':
      store.dispatch(addRoleNotification({
        role: 'admin',
        type: 'info',
        title: 'New Lab Order',
        message: `Lab tests ordered for ${typedAction.payload.patientName}`,
        category: 'lab',
        priority: typedAction.payload.priority === 'stat' ? 'urgent' : 'medium'
      }));
      break;
  }
  
  return result;
};