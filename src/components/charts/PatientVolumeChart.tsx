import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', patients: 45 },
  { day: 'Tue', patients: 52 },
  { day: 'Wed', patients: 48 },
  { day: 'Thu', patients: 61 },
  { day: 'Fri', patients: 55 },
  { day: 'Sat', patients: 35 },
  { day: 'Sun', patients: 28 }
];

export const PatientVolumeChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Patient Volume</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="patients" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};