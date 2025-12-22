import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Cardiology', value: 245, color: '#3b82f6' },
  { name: 'Orthopedics', value: 198, color: '#10b981' },
  { name: 'Pediatrics', value: 167, color: '#f59e0b' },
  { name: 'Neurology', value: 142, color: '#8b5cf6' },
  { name: 'Emergency', value: 312, color: '#ef4444' },
  { name: 'Other', value: 156, color: '#6b7280' }
];

export const DepartmentChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
