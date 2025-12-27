import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Button, Badge } from '@/components';
import { useConsultationState } from '@/hooks/useConsultationState';
import { useAutoSave } from '@/hooks/useAutoSave';
import { CheckCircle, Clock, AlertTriangle, Zap, SkipForward, ArrowRight } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  dependencies: string[]; // Steps that must be completed before this one
  optional: boolean; // Can be skipped
  estimatedTime: number; // in minutes
  parallelGroup?: string; // Steps that can be done in parallel
  conditions?: {
    skipIf?: (data: any) => boolean;
    requiredIf?: (data: any) => boolean;
  };
}

interface ParallelTask {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
}

interface AdaptiveConsultationFlowProps {
  patientId: string;
  patientData?: any;
  onComplete?: (data: any) => void;
}

export function AdaptiveConsultationFlow({
  patientId,
  patientData,
  onComplete
}: AdaptiveConsultationFlowProps) {
  const { state, currentStep, updateStep, saveData } = useConsultationState(patientId, 'adaptive');
  const [parallelTasks, setParallelTasks] = useState<ParallelTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-save functionality
  const { getSaved } = useAutoSave({
    key: `consultation-autosave-${patientId}`,
    data: state,
    delay: 30000, // Auto-save every 30 seconds
    onSave: (data) => {
      saveData('', data);
    }
  });

  const savedData = getSaved() as any;
  const lastSaved = savedData?.timestamp || savedData?.data?.timestamp;
  const isDirty = true; // Simplified for this implementation

  // Define workflow steps with adaptive logic
  const workflowSteps: WorkflowStep[] = useMemo(() => [
    {
      id: 'patient-overview',
      name: 'Patient Overview',
      description: 'Review patient demographics and history',
      component: React.lazy(() => import('@/pages/doctor/consultation/PatientOverviewHub')),
      dependencies: [],
      optional: false,
      estimatedTime: 2,
      conditions: {
        skipIf: (data) => data.patientOverview?.reviewed && !isDirty
      }
    },
    {
      id: 'vitals-check',
      name: 'Vital Signs',
      description: 'Record current vital measurements',
      component: React.lazy(() => import('@/pages/doctor/consultation/VitalSigns')),
      dependencies: ['patient-overview'],
      optional: false,
      estimatedTime: 3,
      parallelGroup: 'assessment',
      conditions: {
        skipIf: (data) => data.vitals?.recorded && data.vitals.timestamp &&
                 (Date.now() - data.vitals.timestamp) < 24 * 60 * 60 * 1000 // Skip if recorded within 24 hours
      }
    },
    {
      id: 'symptoms-assessment',
      name: 'Symptoms Recording',
      description: 'Document patient symptoms and complaints',
      component: React.lazy(() => import('@/pages/doctor/consultation/SymptomsRecording')),
      dependencies: ['patient-overview'],
      optional: false,
      estimatedTime: 5,
      parallelGroup: 'assessment'
    },
    {
      id: 'medical-history',
      name: 'Medical History',
      description: 'Review and update medical history',
      component: React.lazy(() => import('@/pages/doctor/consultation/MedicalHistory')),
      dependencies: ['patient-overview'],
      optional: false,
      estimatedTime: 8,
      parallelGroup: 'assessment',
      conditions: {
        skipIf: (data) => data.medicalHistory?.reviewed && data.medicalHistory.lastUpdated &&
                 (Date.now() - data.medicalHistory.lastUpdated) < 30 * 24 * 60 * 60 * 1000 // Skip if reviewed within 30 days
      }
    },
    {
      id: 'physical-exam',
      name: 'Physical Examination',
      description: 'Perform physical examination',
      component: React.lazy(() => import('@/pages/doctor/consultation/PhysicalExamination')),
      dependencies: ['vitals-check', 'symptoms-assessment'],
      optional: false,
      estimatedTime: 15,
      conditions: {
        requiredIf: (data) => data.symptoms?.severity === 'high' || data.symptoms?.urgent
      }
    },
    {
      id: 'lab-orders',
      name: 'Lab Test Orders',
      description: 'Order necessary laboratory tests',
      component: React.lazy(() => import('@/pages/doctor/consultation/LabTestOrders')),
      dependencies: ['physical-exam'],
      optional: true,
      estimatedTime: 5,
      parallelGroup: 'diagnostics'
    },
    {
      id: 'diagnosis',
      name: 'Diagnosis',
      description: 'Formulate diagnosis based on findings',
      component: React.lazy(() => import('@/pages/doctor/consultation/Diagnosis')),
      dependencies: ['physical-exam', 'medical-history'],
      optional: false,
      estimatedTime: 10
    },
    {
      id: 'treatment-plan',
      name: 'Treatment Plan',
      description: 'Develop comprehensive treatment plan',
      component: React.lazy(() => import('@/pages/doctor/consultation/TreatmentPlan')),
      dependencies: ['diagnosis'],
      optional: false,
      estimatedTime: 12
    },
    {
      id: 'prescription',
      name: 'Prescription',
      description: 'Write prescriptions and medications',
      component: React.lazy(() => import('@/pages/doctor/consultation/Prescription')),
      dependencies: ['treatment-plan'],
      optional: false,
      estimatedTime: 8,
      parallelGroup: 'treatment'
    },
    {
      id: 'follow-up',
      name: 'Follow-up Scheduling',
      description: 'Schedule follow-up appointments',
      component: React.lazy(() => import('@/pages/doctor/consultation/FollowUpScheduling')),
      dependencies: ['treatment-plan'],
      optional: true,
      estimatedTime: 3,
      parallelGroup: 'treatment'
    },
    {
      id: 'final-review',
      name: 'Final Review',
      description: 'Review and finalize consultation',
      component: React.lazy(() => import('@/pages/doctor/consultation/FinalReviewStation')),
      dependencies: ['prescription'],
      optional: false,
      estimatedTime: 5
    }
  ], [isDirty]);

  // Calculate adaptive workflow
  const adaptiveWorkflow = useMemo(() => {
    const completedSteps = new Set(
      Object.keys(state).filter(key =>
        state[key as keyof typeof state] &&
        typeof state[key as keyof typeof state] === 'object' &&
        (state[key as keyof typeof state] as any)?.completed
      )
    );

    const skippableSteps = workflowSteps.filter(step =>
      step.conditions?.skipIf?.(state) ||
      (step.optional && !step.conditions?.requiredIf?.(state))
    );

    const requiredSteps = workflowSteps.filter(step =>
      !skippableSteps.includes(step) &&
      step.dependencies.every(dep => completedSteps.has(dep))
    );

    return {
      allSteps: workflowSteps,
      skippableSteps,
      requiredSteps,
      completedSteps,
      currentStepId: workflowSteps[currentStep - 1]?.id
    };
  }, [workflowSteps, state, currentStep]);

  // Handle step navigation with smart skipping
  const handleStepNavigation = useCallback((direction: 'next' | 'previous' | 'skip') => {
    const currentStepData = workflowSteps[currentStep - 1];
    let nextStepIndex = currentStep - 1;

    if (direction === 'next') {
      // Find next required step
      do {
        nextStepIndex++;
      } while (
        nextStepIndex < workflowSteps.length &&
        adaptiveWorkflow.skippableSteps.some(step => step.id === workflowSteps[nextStepIndex].id)
      );
    } else if (direction === 'previous') {
      nextStepIndex = Math.max(0, currentStep - 2);
    } else if (direction === 'skip' && currentStepData?.optional) {
      // Skip to next required step
      do {
        nextStepIndex++;
      } while (
        nextStepIndex < workflowSteps.length &&
        adaptiveWorkflow.skippableSteps.some(step => step.id === workflowSteps[nextStepIndex].id)
      );
    }

    if (nextStepIndex >= 0 && nextStepIndex < workflowSteps.length) {
      updateStep(nextStepIndex + 1);
    }
  }, [currentStep, workflowSteps, adaptiveWorkflow.skippableSteps, updateStep]);

  // Initialize parallel tasks
  useEffect(() => {
    const tasks: ParallelTask[] = [];

    // Add parallel tasks based on current step
    if (adaptiveWorkflow.currentStepId === 'physical-exam') {
      tasks.push({
        id: 'nurse-prep',
        name: 'Patient Preparation',
        status: 'pending',
        assignee: 'nurse',
        priority: 'high'
      });
    }

    if (adaptiveWorkflow.currentStepId === 'lab-orders') {
      tasks.push({
        id: 'lab-processing',
        name: 'Process Lab Orders',
        status: 'pending',
        assignee: 'lab-tech',
        priority: 'medium'
      });
    }

    setParallelTasks(tasks);
  }, [adaptiveWorkflow.currentStepId]);

  // Handle parallel task completion
  const handleParallelTaskComplete = useCallback((taskId: string) => {
    setParallelTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: 'completed' } : task
      )
    );
  }, []);

  const currentStepData = workflowSteps[currentStep - 1];
  const CurrentComponent = currentStepData?.component;

  const progressPercentage = (adaptiveWorkflow.completedSteps.size / workflowSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Adaptive Consultation Workflow</h2>
            <p className="text-sm text-gray-600 mt-1">
              Smart workflow adapting to patient needs • Auto-saving enabled
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Saved {new Date(lastSaved).toLocaleTimeString()}
              </div>
            )}
            <Badge status="info">
              {adaptiveWorkflow.completedSteps.size}/{workflowSteps.length} Steps
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Current Step Info */}
        {currentStepData && (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{currentStepData.name}</h3>
              <p className="text-sm text-gray-600">{currentStepData.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{currentStepData.estimatedTime}min</span>
            </div>
          </div>
        )}
      </Card>

      {/* Parallel Tasks Panel */}
      {parallelTasks.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Parallel Tasks
          </h3>
          <div className="space-y-2">
            {parallelTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <span className="font-medium">{task.name}</span>
                  {task.assignee && (
                    <Badge status="secondary" size="sm">{task.assignee}</Badge>
                  )}
                </div>
                {task.status !== 'completed' && (
                  <Button
                    size="sm"
                    onClick={() => handleParallelTaskComplete(task.id)}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Workflow Steps Overview */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {workflowSteps.map((step, index) => {
            const isCompleted = adaptiveWorkflow.completedSteps.has(step.id);
            const isCurrent = step.id === adaptiveWorkflow.currentStepId;
            const isSkipped = adaptiveWorkflow.skippableSteps.some(s => s.id === step.id);
            const canAccess = step.dependencies.every(dep => adaptiveWorkflow.completedSteps.has(dep));

            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all ${
                  isCompleted ? 'bg-green-50 border-green-200' :
                  isCurrent ? 'bg-blue-50 border-blue-200' :
                  isSkipped ? 'bg-gray-50 border-gray-200 opacity-50' :
                  canAccess ? 'bg-white border-gray-200 hover:border-blue-300' :
                  'bg-gray-50 border-gray-200 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-blue-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-3 h-3" /> : index + 1}
                  </div>
                  {isSkipped && <SkipForward className="w-4 h-4 text-gray-400" />}
                </div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">{step.name}</h4>
                <p className="text-xs text-gray-600">{step.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{step.estimatedTime}min</span>
                  {step.parallelGroup && (
                    <Badge status="secondary" size="sm">{step.parallelGroup}</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main Content Area */}
      <Card className="p-6">
        {CurrentComponent && (
          <React.Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <CurrentComponent
              patientId={patientId}
              data={state}
              onSave={(data: any) => saveData('', data)}
              onNext={() => handleStepNavigation('next')}
              onPrevious={() => handleStepNavigation('previous')}
              onSkip={currentStepData?.optional ? () => handleStepNavigation('skip') : undefined}
            />
          </React.Suspense>
        )}
      </Card>

      {/* Navigation Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => handleStepNavigation('previous')}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {currentStepData?.optional && (
              <Button
                variant="outline"
                onClick={() => handleStepNavigation('skip')}
                className="flex items-center gap-2"
              >
                <SkipForward className="w-4 h-4" />
                Skip Step
              </Button>
            )}

            <Button
              onClick={() => handleStepNavigation('next')}
              disabled={currentStep === workflowSteps.length}
              className="flex items-center gap-2"
            >
              {currentStep === workflowSteps.length ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}