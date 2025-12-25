import React from 'react';
import { FileX, Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  const defaultIcon = <FileX className="w-12 h-12 text-gray-400" />;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4">
        {icon || defaultIcon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            action.variant === 'secondary'
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// Predefined empty state variants
export const NoDataEmptyState: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => (
  <EmptyState
    icon={<FileX className="w-12 h-12 text-gray-400" />}
    title="No data available"
    description="There's no data to display at the moment."
    action={onRefresh ? { label: 'Refresh', onClick: onRefresh, variant: 'secondary' } : undefined}
  />
);

export const NoSearchResultsEmptyState: React.FC<{ onClear?: () => void }> = ({ onClear }) => (
  <EmptyState
    icon={<Search className="w-12 h-12 text-gray-400" />}
    title="No results found"
    description="Try adjusting your search criteria or filters."
    action={onClear ? { label: 'Clear filters', onClick: onClear, variant: 'secondary' } : undefined}
  />
);

export const CreateFirstEmptyState: React.FC<{ onCreate: () => void; itemName: string }> = ({ onCreate, itemName }) => (
  <EmptyState
    icon={<Plus className="w-12 h-12 text-gray-400" />}
    title={`No ${itemName} yet`}
    description={`Get started by creating your first ${itemName}.`}
    action={{ label: `Create ${itemName}`, onClick: onCreate }}
  />
);

export default EmptyState;