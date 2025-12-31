import React, { useEffect, useState } from 'react';
import { trackWebVitals } from '../utils/performance';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);

  useEffect(() => {
    // Override the sendToAnalytics function to capture metrics
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      if (args[0] === 'Web Vital:') {
        const [, name, value] = args;
        const rating = getRating(name, value);
        setMetrics(prev => [...prev, {
          name,
          value,
          rating,
          timestamp: Date.now()
        }]);
      }
      originalConsoleLog(...args);
    };

    trackWebVitals();

    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds: Record<string, [number, number]> = {
      CLS: [0.1, 0.25],
      FCP: [1800, 3000],
      LCP: [2500, 4000],
      TTFB: [800, 1800]
    };

    const [good, poor] = thresholds[name] || [0, 0];
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
      
      {metrics.length === 0 ? (
        <p className="text-gray-500">Loading performance metrics...</p>
      ) : (
        <div className="space-y-2">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <span className="font-medium">{metric.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {metric.value.toFixed(2)}ms
                </span>
                <span className={`px-2 py-1 text-xs rounded ${getRatingColor(metric.rating)}`}>
                  {metric.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};