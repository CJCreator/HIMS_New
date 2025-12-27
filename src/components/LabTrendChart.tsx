import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import type { LabResult } from '@/store/labResultsSlice';

interface LabTrendChartProps {
  results: LabResult[];
  testName: string;
}

export function LabTrendChart({ results, testName }: LabTrendChartProps) {
  const sortedResults = [...results].sort((a, b) => 
    new Date(a.resultDate).getTime() - new Date(b.resultDate).getTime()
  );

  const chartData = sortedResults.map(result => ({
    date: format(new Date(result.resultDate), 'MMM dd'),
    value: result.value,
    normalMin: result.normalMin,
    normalMax: result.normalMax
  }));

  const unit = results[0]?.unit || '';
  const normalMin = results[0]?.normalMin || 0;
  const normalMax = results[0]?.normalMax || 0;

  return (
    <div className="w-full h-80 p-4 bg-white rounded-lg border border-neutral-200">
      <h3 className="text-base font-semibold text-neutral-900 mb-4">{testName} Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: unit, angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ fontSize: 12 }}
            formatter={(value: any) => value !== undefined ? [`${value} ${unit}`, 'Value'] : ['', 'Value']}
          />
          <Legend />
          <ReferenceLine 
            y={normalMin} 
            stroke="#10b981" 
            strokeDasharray="3 3" 
            label={{ value: 'Min', fontSize: 10 }}
          />
          <ReferenceLine 
            y={normalMax} 
            stroke="#10b981" 
            strokeDasharray="3 3" 
            label={{ value: 'Max', fontSize: 10 }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
