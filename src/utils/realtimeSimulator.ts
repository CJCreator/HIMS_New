import { mockDataService } from '@/services/mockDataService';

class RealtimeSimulator {
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: Set<() => void> = new Set();
  private isRunning = false;

  start(intervalMs: number = 8000) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.simulateUpdates();
      this.notifyListeners();
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
    }
  }

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  private simulateUpdates() {
    const patients = mockDataService.getPatients();
    if (patients.length === 0) return;

    // Randomly update 1-2 patients
    const updateCount = Math.random() > 0.5 ? 1 : 2;
    for (let i = 0; i < updateCount; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      this.updatePatientStatus(patient);
    }

    // Occasionally add a notification
    if (Math.random() > 0.7) {
      this.generateNotification(patients);
    }
  }

  private updatePatientStatus(patient: any) {
    const stages = ['Check-in', 'Vitals Recording', 'Waiting Room', 'Consultation', 'Lab Tests', 'Pharmacy', 'Billing'];
    const statuses = ['ready', 'in-progress', 'waiting'];
    
    const currentIndex = stages.indexOf(patient.currentStage);
    if (currentIndex < stages.length - 1 && Math.random() > 0.6) {
      mockDataService.updatePatient(patient.id, {
        currentStage: stages[currentIndex + 1],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        waitTime: Math.floor(Math.random() * 20) + 1
      });
    } else {
      mockDataService.updatePatient(patient.id, {
        waitTime: Math.max(1, patient.waitTime + Math.floor(Math.random() * 3) - 1)
      });
    }
  }

  private generateNotification(patients: any[]) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const types = ['urgent', 'info', 'warning'];
    const messages = [
      { title: 'Patient Ready', message: `${patient.name} vitals complete`, fromRole: 'Nurse', toRole: 'Doctor' },
      { title: 'Lab Results', message: `Results available for ${patient.name}`, fromRole: 'Lab', toRole: 'Doctor' },
      { title: 'Prescription Ready', message: `Prescription ready for ${patient.name}`, fromRole: 'Doctor', toRole: 'Pharmacy' }
    ];
    
    const msg = messages[Math.floor(Math.random() * messages.length)];
    mockDataService.addNotification({
      type: types[Math.floor(Math.random() * types.length)],
      ...msg,
      patientId: patient.id,
      patientName: patient.name,
      priority: Math.random() > 0.7 ? 'high' : 'medium'
    });
  }
}

export const realtimeSimulator = new RealtimeSimulator();
