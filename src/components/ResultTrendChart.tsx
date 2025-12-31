import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ResultTrendChartProps {
  testName: string;
  data: Array<{
    date: string;
    value: number;
  }>;
  normalRange: { min: number; max: number };
  unit: string;
}

export const ResultTrendChart: React.FC<ResultTrendChartProps> = ({
  testName,
  data,
  normalRange,
  unit
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900">{testName} Trend</h3>
        <p className="text-sm text-gray-600">
          Normal Range: {normalRange.min}-{normalRange.max} {unit}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: unit, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <ReferenceLine y={normalRange.max} stroke="#ef4444" strokeDasharray="3 3" label="Upper Limit" />
          <ReferenceLine y={normalRange.min} stroke="#ef4444" strokeDasharray="3 3" label="Lower Limit" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            name={testName}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-gray-600">Latest</p>
          <p className="font-semibold text-gray-900">
            {data[data.length - 1]?.value} {unit}
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-gray-600">Average</p>
          <p className="font-semibold text-gray-900">
            {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)} {unit}
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-gray-600">Trend</p>
          <p className={`font-semibold flex items-center gap-1 ${
            data[data.length - 1]?.value > data[0]?.value ? 'text-red-600' : 'text-green-600'
          }`}>
            {data[data.length - 1]?.value > data[0]?.value ? (
              <><TrendingUp className="w-4 h-4" /> Increasing</>
            ) : (
              <><TrendingDown className="w-4 h-4" /> Decreasing</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
