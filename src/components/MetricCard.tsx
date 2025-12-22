import { Card } from './Card';

interface MetricCardProps {
  icon: string;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
  trendIndicator?: {
    value: number;
    label: string;
  };
}

export function MetricCard({ icon, value, label, trend, trendUp, trendIndicator }: MetricCardProps) {
  return (
    <Card className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-h2 text-neutral-900 mb-1">{value}</div>
      <div className="text-body text-neutral-600 mb-2">{label}</div>
      {trend && (
        <div className="text-body-sm text-neutral-600 mb-1">
          {trend}
        </div>
      )}
      {trendIndicator && (
        <div className={`text-body-sm flex items-center justify-center gap-1 ${
          trendIndicator.value >= 0 ? 'text-success' : 'text-error'
        }`}>
          <span>{trendIndicator.value >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trendIndicator.value)}%</span>
          <span className="text-neutral-500">{trendIndicator.label}</span>
        </div>
      )}
      {!trendIndicator && trend && (
        <div className={`text-body-sm ${trendUp ? 'text-success' : 'text-error'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
    </Card>
  );
}