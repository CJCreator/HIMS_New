import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { BadgeStatus } from '@/types';

interface BadgeProps {
  status: BadgeStatus;
  children: ReactNode;
  className?: string;
}

export function Badge({ status, children, className }: BadgeProps) {
  const statusClasses: Record<BadgeStatus, string> = {
    request: 'bg-neutral-100 text-neutral-800',
    pending: 'bg-warning/10 text-warning',
    sent: 'bg-info/10 text-info',
    dispatched: 'bg-primary-100 text-primary-800',
    received: 'bg-success/10 text-success',
    delivered: 'bg-success text-white',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-small text-body-sm font-medium',
      statusClasses[status],
      className
    )}>
      {children}
    </span>
  );
}