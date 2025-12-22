import React from 'react';
import { Card } from '../../../components';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const UtilizationReports: React.FC = () => {
  const roomUtilization = [
    { name: 'ICU', utilization: 95 },
    { name: 'General', utilization: 78 },
    { name: 'Private', utilization: 65 },
    { name: 'Operating', utilization: 88 },
    { name: 'Emergency', utilization: 72 }
  ];

  const equipmentUsage = [
    { month: 'Jan', xray: 145, ultrasound: 98, ct: 67 },
    { month: 'Feb', xray: 152, ultrasound: 105, ct: 72 },
    { month: 'Mar', xray: 168, ultrasound: 112, ct: 78 },
    { month: 'Apr', xray: 175, ultrasound: 118, ct: 85 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Utilization Reports</h1>
        <p className="text-gray-600 mt-1">Resource usage analytics and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Avg Room Utilization</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">79.6%</p>
          <p className="text-sm text-green-600 mt-1">↑ 5% from last month</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Equipment Usage</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,245</p>
          <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Peak Hours</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">10-14</p>
          <p className="text-sm text-gray-600 mt-1">Highest demand period</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Utilization by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomUtilization}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Usage Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={equipmentUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="xray" stroke="#3b82f6" name="X-Ray" />
              <Line type="monotone" dataKey="ultrasound" stroke="#10b981" name="Ultrasound" />
              <Line type="monotone" dataKey="ct" stroke="#f59e0b" name="CT Scan" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
