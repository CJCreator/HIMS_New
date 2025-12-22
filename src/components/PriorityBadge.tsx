import React from 'react';
import { AlertTriangle, Clock, Zap } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md'
}) => {
  const getConfig = () => {
    switch (priority) {
      case 'emergency':
        return {
          icon: <Zap className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />,
          className: 'bg-red-600 text-white',
          label: 'EMERGENCY'
        };
      case 'urgent':
        return {
          icon: <AlertTriangle className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />,
          className: 'bg-red-100 text-red-800 border border-red-200',
          label: 'Urgent'
        };
      case 'high':
        return {
          icon: <AlertTriangle className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />,
          className: 'bg-orange-100 text-orange-800 border border-orange-200',
          label: 'High'
        };
      case 'low':
        return {
          icon: <Clock className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />,
          className: 'bg-gray-100 text-gray-800 border border-gray-200',
          label: 'Low'
        };
      default:
        return {
          icon: <Clock className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />,
          className: 'bg-blue-100 text-blue-800 border border-blue-200',
          label: 'Normal'
        };
    }
  };

  const config = getConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center space-x-1 rounded-full font-medium ${config.className} ${sizeClasses[size]}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};