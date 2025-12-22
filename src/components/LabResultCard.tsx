import { Badge } from './Badge';
import { format } from 'date-fns';
import { LabResult } from '@/store/labResultsSlice';

interface LabResultCardProps {
  result: LabResult;
  onClick?: () => void;
}

export function LabResultCard({ result, onClick }: LabResultCardProps) {
  const getStatusColor = () => {
    switch (result.status) {
      case 'normal':
        return 'bg-success-50 border-success-200';
      case 'abnormal':
        return 'bg-warning-50 border-warning-200';
      case 'critical':
        return 'bg-error-50 border-error-200';
    }
  };

  const getStatusBadge = () => {
    switch (result.status) {
      case 'normal':
        return <Badge status="delivered">Normal</Badge>;
      case 'abnormal':
        return <Badge status="pending">Abnormal</Badge>;
      case 'critical':
        return <Badge status="error">Critical</Badge>;
    }
  };

  const isOutOfRange = result.value < result.normalMin || result.value > result.normalMax;

  return (
    <div
      onClick={onClick}
      className={`p-4 border-2 rounded-lg transition-all cursor-pointer hover:shadow-md ${getStatusColor()}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">{result.testName}</h3>
          <p className="text-xs text-neutral-600">{result.testCode}</p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className={`text-2xl font-bold ${isOutOfRange ? 'text-error-700' : 'text-neutral-900'}`}>
          {result.value}
        </span>
        <span className="text-sm text-neutral-600">{result.unit}</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-600 mb-2">
        <span>Normal Range:</span>
        <span className="font-medium">
          {result.normalMin} - {result.normalMax} {result.unit}
        </span>
      </div>

      <div className="flex justify-between items-center text-xs text-neutral-500 pt-2 border-t border-neutral-200">
        <span>{format(new Date(result.resultDate), 'MMM dd, yyyy')}</span>
        <span>Dr. {result.orderedBy}</span>
      </div>

      {result.notes && (
        <p className="text-xs text-neutral-700 mt-2 italic">{result.notes}</p>
      )}
    </div>
  );
}
