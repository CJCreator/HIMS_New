import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jan 1', icu: 92, general: 78, private: 65 },
  { date: 'Jan 8', icu: 95, general: 82, private: 68 },
  { date: 'Jan 15', icu: 88, general: 75, private: 62 },
  { date: 'Jan 22', icu: 94, general: 85, private: 72 },
  { date: 'Jan 29', icu: 97, general: 88, private: 75 }
];

export const OccupancyChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="icu" stackId="1" stroke="#ef4444" fill="#ef4444" name="ICU" />
        <Area type="monotone" dataKey="general" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="General" />
        <Area type="monotone" dataKey="private" stackId="1" stroke="#10b981" fill="#10b981" name="Private" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
