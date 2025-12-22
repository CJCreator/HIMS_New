import React from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface WaitTimeEstimateProps {
  currentWait: number;
  averageWait: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

export const WaitTimeEstimate: React.FC<WaitTimeEstimateProps> = ({
  currentWait,
  averageWait,
  trend,
  confidence
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-red-600';
      case 'down': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">Wait Time Estimate</h3>
        </div>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trend === 'stable' ? 'Stable' : trend === 'up' ? 'Increasing' : 'Decreasing'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold text-gray-900">{currentWait} min</p>
          <p className="text-sm text-gray-600">Current estimate</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700">{averageWait} min</p>
          <p className="text-sm text-gray-600">Average today</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Confidence</span>
          <span className="text-sm font-medium text-gray-900">{confidence}%</span>
        </div>
        <div className="mt-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};