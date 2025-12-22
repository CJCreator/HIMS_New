import { differenceInDays } from 'date-fns';

interface ExpiryWarningBadgeProps {
  expiryDate: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ExpiryWarningBadge({ expiryDate, size = 'md' }: ExpiryWarningBadgeProps) {
  const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date());
  
  const getExpiryStatus = () => {
    if (daysUntilExpiry < 0) {
      return { label: 'Expired', color: 'bg-error text-error-900 border-error-300', icon: '⛔' };
    } else if (daysUntilExpiry <= 30) {
      return { label: `${daysUntilExpiry}d left`, color: 'bg-error-50 text-error-700 border-error-200', icon: '🚨' };
    } else if (daysUntilExpiry <= 90) {
      return { label: `${daysUntilExpiry}d left`, color: 'bg-warning-50 text-warning-700 border-warning-200', icon: '⚠️' };
    } else if (daysUntilExpiry <= 180) {
      return { label: `${Math.floor(daysUntilExpiry / 30)}mo left`, color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '⏰' };
    }
    return { label: 'Good', color: 'bg-success-50 text-success-700 border-success-200', icon: '✓' };
  };

  const status = getExpiryStatus();
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${status.color} ${sizeClasses[size]}`}>
      <span>{status.icon}</span>
      <span>{status.label}</span>
    </span>
  );
}
