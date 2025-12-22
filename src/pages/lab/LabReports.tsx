import React, { useState } from 'react';
import { Card, Button } from '../../components';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar } from 'lucide-react';

export const LabReports: React.FC = () => {
  const [reportType, setReportType] = useState('volume');

  const volumeData = [
    { month: 'Jan', tests: 450, critical: 12 },
    { month: 'Feb', tests: 480, critical: 15 },
    { month: 'Mar', tests: 520, critical: 10 },
    { month: 'Apr', tests: 495, critical: 18 }
  ];

  const turnaroundData = [
    { test: 'CBC', avgTime: 2.5, target: 3 },
    { test: 'Glucose', avgTime: 1.8, target: 2 },
    { test: 'Lipid Panel', avgTime: 4.2, target: 4 },
    { test: 'Thyroid', avgTime: 5.5, target: 6 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Reports</h1>
          <p className="text-gray-600 mt-1">Analytics and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <select className="px-3 py-2 border border-gray-300 rounded-md">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Tests</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,945</p>
          <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Avg Turnaround</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">3.5h</p>
          <p className="text-sm text-green-600 mt-1">↓ 8% improvement</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Critical Results</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">55</p>
          <p className="text-sm text-gray-600 mt-1">2.8% of total</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending Verification</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
          <p className="text-sm text-yellow-600 mt-1">Requires attention</p>
        </Card>
      </div>

      <div className="flex space-x-2">
        {['volume', 'turnaround', 'quality'].map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              reportType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Report
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Volume Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tests" stroke="#3b82f6" name="Total Tests" />
              <Line type="monotone" dataKey="critical" stroke="#ef4444" name="Critical Results" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Turnaround Time by Test</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={turnaroundData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="test" />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgTime" fill="#3b82f6" name="Actual" />
              <Bar dataKey="target" fill="#10b981" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
