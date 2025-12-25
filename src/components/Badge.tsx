import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { BadgeStatus } from '@/types';
import { AlertTriangle, Clock, Zap, AlertCircle } from 'lucide-react';

interface BadgeProps {
  status?: BadgeStatus;
  variant?: 'default' | 'priority' | 'expiry' | 'status';
  priority?: 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function Badge({ 
  status, 
  priority, 
  severity,
  children, 
  className,
  showIcon = false 
}: BadgeProps) {
  const statusClasses: Record<BadgeStatus, string> = {
    request: 'bg-neutral-100 text-neutral-800',
    pending: 'bg-warning/10 text-warning',
    sent: 'bg-info/10 text-info',
    dispatched: 'bg-primary-100 text-primary-800',
    received: 'bg-success/10 text-success',
    delivered: 'bg-success text-white',
    error: 'bg-red-100 text-red-800',
  };

  const priorityClasses = {
    emergency: 'bg-red-600 text-white',
    urgent: 'bg-red-100 text-red-800 border border-red-200',
    high: 'bg-orange-100 text-orange-800 border border-orange-200',
    normal: 'bg-blue-100 text-blue-800 border border-blue-200',
    low: 'bg-gray-100 text-gray-800 border border-gray-200'
  };

  const severityClasses = {
    critical: 'bg-error/20 text-error border border-error/30',
    high: 'bg-error/10 text-error',
    medium: 'bg-warning/20 text-warning border border-warning/30',
    low: 'bg-neutral-100 text-neutral-600'
  };

  const getIcon = () => {
    if (!showIcon) return null;
    
    if (priority === 'emergency') return <Zap className="w-3 h-3" />;
    if (priority === 'urgent' || priority === 'high') return <AlertTriangle className="w-3 h-3" />;
    if (severity === 'critical' || severity === 'high') return <AlertCircle className="w-3 h-3" />;
    return <Clock className="w-3 h-3" />;
  };

  const getClasses = () => {
    if (status) return statusClasses[status];
    if (priority) return priorityClasses[priority];
    if (severity) return severityClasses[severity];
    return 'bg-neutral-100 text-neutral-800';
  };

  return (
    <span className={clsx(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-small text-body-sm font-medium',
      getClasses(),
      className
    )}>
      {getIcon()}
      {children}
    </span>
  );
}