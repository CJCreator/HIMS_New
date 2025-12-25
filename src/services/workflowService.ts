import { store } from '@/store';
import { addNotification } from '@/store/notificationSlice';

export type WorkflowStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface WorkflowStep {
  id: string;
  name: string;
  role: string;
  status: WorkflowStatus;
  completedAt?: string;
}

export interface Workflow {
  id: string;
  type: 'consultation' | 'prescription' | 'lab-test' | 'appointment';
  patientId: string;
  steps: WorkflowStep[];
  currentStep: number;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
}

class WorkflowService {
  private workflows: Map<string, Workflow> = new Map();

  createWorkflow(type: Workflow['type'], patientId: string, steps: Omit<WorkflowStep, 'status' | 'completedAt'>[]): Workflow {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      patientId,
      steps: steps.map(step => ({ ...step, status: 'pending' })),
      currentStep: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  completeStep(workflowId: string, stepId: string): void {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return;

    const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;

    workflow.steps[stepIndex].status = 'completed';
    workflow.steps[stepIndex].completedAt = new Date().toISOString();
    workflow.updatedAt = new Date().toISOString();

    // Move to next step
    if (stepIndex === workflow.currentStep && stepIndex < workflow.steps.length - 1) {
      workflow.currentStep = stepIndex + 1;
      workflow.steps[stepIndex + 1].status = 'in-progress';

      // Notify next role
      const nextStep = workflow.steps[stepIndex + 1];
      store.dispatch(addNotification({
        id: `notif-${Date.now()}`,
        type: 'info',
        title: `New Task: ${nextStep.name}`,
        message: `Workflow step ready for ${nextStep.role}`,
        priority: 'medium',
        role: nextStep.role as any,
        timestamp: new Date().toISOString(),
        read: false,
      }));
    }

    // Check if workflow is complete
    if (workflow.steps.every(s => s.status === 'completed')) {
      workflow.status = 'completed';
    }

    this.workflows.set(workflowId, workflow);
  }

  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  getWorkflowsByPatient(patientId: string): Workflow[] {
    return Array.from(this.workflows.values()).filter(w => w.patientId === patientId);
  }

  getActiveWorkflows(): Workflow[] {
    return Array.from(this.workflows.values()).filter(w => w.status !== 'completed' && w.status !== 'failed');
  }
}

export const workflowService = new WorkflowService();
