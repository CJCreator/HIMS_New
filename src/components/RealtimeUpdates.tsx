import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addRoleNotification } from '../store/notificationSlice';
import { updateMedicationStatus } from '../store/medicationSlice';
import { updatePrescriptionStatus } from '../store/prescriptionSlice';
import { updateLabOrderStatus } from '../store/labSlice';

interface RealTimeUpdatesProps {
  userRole: 'doctor' | 'nurse' | 'pharmacy' | 'receptionist' | 'admin';
}

export const RealTimeUpdates: React.FC<RealTimeUpdatesProps> = ({ userRole }) => {
  const dispatch = useDispatch();


  useEffect(() => {
    // Simulate real-time updates with polling
    const interval = setInterval(() => {
      // Mock real-time events based on role
      const events = generateMockEvents(userRole);
      
      events.forEach(event => {
        switch (event.type) {
          case 'medication_status_update':
            if (event.data) {
              dispatch(updateMedicationStatus({
                id: event.relatedId!,
                status: event.data.status as any,
                processedBy: event.data.processedBy
              }));
            }
            dispatch(addRoleNotification({
              role: event.targetRole,
              type: 'info',
              title: event.title,
              message: event.message,
              category: 'medication',
              priority: event.priority,
              relatedId: event.relatedId
            }));
            break;
            
          case 'prescription_ready':
            dispatch(updatePrescriptionStatus({
              id: event.relatedId!,
              status: 'ready',
              processedBy: 'Pharmacist John'
            }));
            dispatch(addRoleNotification({
              role: event.targetRole,
              type: 'success',
              title: event.title,
              message: event.message,
              category: 'medication',
              priority: event.priority,
              relatedId: event.relatedId
            }));
            break;
            
          case 'lab_results_ready':
            dispatch(updateLabOrderStatus({
              id: event.relatedId!,
              status: 'completed',
              completedDate: new Date().toISOString()
            }));
            dispatch(addRoleNotification({
              role: event.targetRole,
              type: 'info',
              title: event.title,
              message: event.message,
              category: 'lab',
              priority: event.priority,
              relatedId: event.relatedId
            }));
            break;
            
          case 'patient_arrived':
            dispatch(addRoleNotification({
              role: event.targetRole,
              type: 'info',
              title: event.title,
              message: event.message,
              category: 'appointment',
              priority: event.priority,
              relatedId: event.relatedId
            }));
            break;
            
          case 'emergency_alert':
            dispatch(addRoleNotification({
              role: event.targetRole,
              type: 'error',
              title: event.title,
              message: event.message,
              category: 'patient',
              priority: 'urgent',
              relatedId: event.relatedId
            }));
            break;
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch, userRole]);

  // Component doesn't render anything - it's just for side effects
  return null;
};

function generateMockEvents(userRole: string) {
  const events = [];
  const random = Math.random();
  
  // Generate events based on role and random chance
  if (random < 0.1) { // 10% chance of event
    switch (userRole) {
      case 'nurse':
        if (Math.random() < 0.5) {
          events.push({
            type: 'medication_status_update',
            targetRole: 'nurse' as const,
            title: 'Medication Dispatched',
            message: 'Paracetamol for John Smith has been dispatched from pharmacy',
            priority: 'medium' as const,
            relatedId: 'MR001',
            data: { status: 'dispatched', processedBy: 'Pharmacist John' }
          });
        } else {
          events.push({
            type: 'patient_arrived',
            targetRole: 'nurse' as const,
            title: 'Patient Arrived',
            message: 'Sarah Johnson has arrived for her appointment',
            priority: 'medium' as const,
            relatedId: 'P002'
          });
        }
        break;
        
      case 'doctor':
        if (Math.random() < 0.5) {
          events.push({
            type: 'lab_results_ready',
            targetRole: 'doctor' as const,
            title: 'Lab Results Available',
            message: 'CBC results for John Smith are ready for review',
            priority: 'high' as const,
            relatedId: 'LAB001'
          });
        } else {
          events.push({
            type: 'patient_arrived',
            targetRole: 'doctor' as const,
            title: 'Patient Ready',
            message: 'Michael Davis is ready for consultation in Room 3',
            priority: 'medium' as const,
            relatedId: 'P003'
          });
        }
        break;
        
      case 'pharmacy':
        events.push({
          type: 'prescription_ready',
          targetRole: 'pharmacy' as const,
          title: 'New Prescription',
          message: 'New prescription from Dr. Wilson requires processing',
          priority: 'medium' as const,
          relatedId: 'RX003'
        });
        break;
        
      case 'receptionist':
        events.push({
          type: 'patient_arrived',
          targetRole: 'receptionist' as const,
          title: 'Patient Check-in',
          message: 'Emma Wilson has arrived for her 2:00 PM appointment',
          priority: 'medium' as const,
          relatedId: 'P004'
        });
        break;
        
      case 'admin':
        if (Math.random() < 0.3) {
          events.push({
            type: 'emergency_alert',
            targetRole: 'admin' as const,
            title: 'System Alert',
            message: 'Server response time is above normal threshold',
            priority: 'urgent' as const,
            relatedId: 'SYS001'
          });
        }
        break;
    }
  }
  
  return events;
}