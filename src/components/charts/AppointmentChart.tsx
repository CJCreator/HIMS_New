import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', scheduled: 450, completed: 420, cancelled: 30 },
  { month: 'Feb', scheduled: 480, completed: 445, cancelled: 35 },
  { month: 'Mar', scheduled: 520, completed: 485, cancelled: 35 },
  { month: 'Apr', scheduled: 495, completed: 465, cancelled: 30 },
  { month: 'May', scheduled: 540, completed: 510, cancelled: 30 },
  { month: 'Jun', scheduled: 565, completed: 535, cancelled: 30 }
];

export const AppointmentChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="scheduled" stroke="#3b82f6" strokeWidth={2} name="Scheduled" />
        <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
        <Line type="monotone" dataKey="cancelled" stroke="#ef4444" strokeWidth={2} name="Cancelled" />
      </LineChart>
    </ResponsiveContainer>
  );
};
