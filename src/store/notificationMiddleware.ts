import { Middleware } from '@reduxjs/toolkit';
import { addRoleNotification } from './notificationSlice';


export const notificationMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Trigger notifications based on actions
  switch (action.type) {
    case 'inventory/updateStock':
      const { itemId, newStock } = action.payload;
      const state = store.getState();
      const item = state.inventory.items.find((i: any) => i.id === itemId);
      
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
        message: `Request for ${action.payload.medication} from Room ${action.payload.roomNumber}`,
        category: 'medication',
        priority: action.payload.urgency === 'high' ? 'urgent' : 'medium'
      }));
      break;
      
    case 'prescriptions/updatePrescriptionStatus':
      if (action.payload.status === 'ready') {
        store.dispatch(addRoleNotification({
          role: 'receptionist',
          type: 'success',
          title: 'Prescription Ready',
          message: `Prescription ${action.payload.id} is ready for pickup`,
          category: 'medication',
          priority: 'medium'
        }));
      }
      break;
      
    case 'lab/addLabOrder':
      store.dispatch(addRoleNotification({
        role: 'admin', // In real app, this would be 'lab_technician'
        type: 'info',
        title: 'New Lab Order',
        message: `Lab tests ordered for ${action.payload.patientName}`,
        category: 'lab',
        priority: action.payload.priority === 'stat' ? 'urgent' : 'medium'
      }));
      break;
  }
  
  return result;
};