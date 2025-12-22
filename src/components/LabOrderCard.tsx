import React from 'react';
import { Card, Button } from './';
import { Clock, AlertTriangle, User } from 'lucide-react';

interface LabOrder {
  id: string;
  patientName: string;
  testType: string;
  priority: 'normal' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  orderedDate: string;
  doctorName: string;
}

interface LabOrderCardProps {
  order: LabOrder;
  onStatusUpdate: (orderId: string, status: string) => void;
  onViewDetails: (orderId: string) => void;
}

export const LabOrderCard: React.FC<LabOrderCardProps> = ({
  order,
  onStatusUpdate,
  onViewDetails
}) => {
  const getPriorityIcon = () => {
    return order.priority === 'urgent' ? 
      <AlertTriangle className="w-4 h-4 text-red-500" /> : 
      <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="w-8 h-8 text-gray-400" />
          <div>
            <div className="flex items-center space-x-2">
              {getPriorityIcon()}
              <h3 className="font-medium text-gray-900">{order.patientName}</h3>
            </div>
            <p className="text-sm text-gray-600">{order.testType}</p>
            <p className="text-xs text-gray-500">Dr. {order.doctorName} • {order.orderedDate}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor()}`}>
            {order.status.replace('_', ' ')}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(order.id)}
          >
            View
          </Button>
          {order.status === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStatusUpdate(order.id, 'in_progress')}
            >
              Start
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};