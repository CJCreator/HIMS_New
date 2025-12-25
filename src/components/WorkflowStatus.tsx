import { Workflow, WorkflowStep } from '@/services/workflowService';

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
    </svg>
  );
}

interface WorkflowStatusProps {
  workflow: Workflow;
}

export function WorkflowStatus({ workflow }: WorkflowStatusProps) {
  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <ClockIcon className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />;
    }
  };

  const getStepColor = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          {workflow.type.charAt(0).toUpperCase() + workflow.type.slice(1)} Workflow
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          workflow.status === 'completed' ? 'bg-green-100 text-green-800' :
          workflow.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
          workflow.status === 'failed' ? 'bg-red-100 text-red-800' :
          'bg-neutral-100 text-neutral-600'
        }`}>
          {workflow.status}
        </span>
      </div>

      <div className="space-y-3">
        {workflow.steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getStepIcon(step)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-900">{step.name}</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStepColor(step)}`}>
                  {step.role}
                </span>
              </div>
              {step.completedAt && (
                <p className="text-xs text-neutral-500 mt-1">
                  Completed: {new Date(step.completedAt).toLocaleString()}
                </p>
              )}
            </div>
            {index < workflow.steps.length - 1 && (
              <div className="absolute left-[10px] top-8 w-0.5 h-8 bg-neutral-200" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>Progress: {workflow.steps.filter(s => s.status === 'completed').length} / {workflow.steps.length}</span>
          <span>Updated: {new Date(workflow.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
