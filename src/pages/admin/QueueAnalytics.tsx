import React, { useState } from 'react';
import { Card } from '../../components';
import { KPICard } from '../../components/KPICard';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, Users, TrendingUp, AlertCircle } from 'lucide-react';

export const QueueAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('today');

  const kpiData = [
    { title: 'Avg Wait Time', value: '23 min', change: 12, changeType: 'decrease' as const, icon: <Clock className="w-6 h-6" />, color: 'blue' as const },
    { title: 'Patients Served', value: '156', change: 8, changeType: 'increase' as const, icon: <Users className="w-6 h-6" />, color: 'green' as const },
    { title: 'Peak Hour Load', value: '42', change: 5, changeType: 'increase' as const, icon: <TrendingUp className="w-6 h-6" />, color: 'yellow' as const },
    { title: 'No-Shows', value: '8', change: 3, changeType: 'decrease' as const, icon: <AlertCircle className="w-6 h-6" />, color: 'red' as const }
  ];

  const hourlyData = [
    { hour: '8AM', patients: 12, avgWait: 15 },
    { hour: '9AM', patients: 28, avgWait: 22 },
    { hour: '10AM', patients: 35, avgWait: 28 },
    { hour: '11AM', patients: 42, avgWait: 32 },
    { hour: '12PM', patients: 38, avgWait: 25 },
    { hour: '1PM', patients: 30, avgWait: 20 },
    { hour: '2PM', patients: 33, avgWait: 23 },
    { hour: '3PM', patients: 40, avgWait: 30 },
    { hour: '4PM', patients: 25, avgWait: 18 },
    { hour: '5PM', patients: 15, avgWait: 12 }
  ];

  const departmentData = [
    { name: 'Cardiology', value: 45, color: '#3b82f6' },
    { name: 'Orthopedics', value: 32, color: '#10b981' },
    { name: 'Pediatrics', value: 28, color: '#f59e0b' },
    { name: 'Neurology', value: 25, color: '#8b5cf6' },
    { name: 'Other', value: 26, color: '#6b7280' }
  ];

  const waitTimeData = [
    { range: '0-10 min', count: 45 },
    { range: '10-20 min', count: 62 },
    { range: '20-30 min', count: 38 },
    { range: '30-45 min', count: 18 },
    { range: '45+ min', count: 8 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor queue performance and patient flow</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Patient Flow */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Patient Flow</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="patients" fill="#3b82f6" name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Average Wait Time Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Wait Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgWait" stroke="#f59e0b" name="Avg Wait (min)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patients by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Wait Time Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wait Time Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waitTimeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="range" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-md">
            <p className="text-sm text-green-800 font-medium mb-1">✓ Improved Efficiency</p>
            <p className="text-xs text-green-700">Wait times reduced by 12% compared to last week</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800 font-medium mb-1">⚠ Peak Hour Alert</p>
            <p className="text-xs text-yellow-700">11AM shows highest congestion - consider staff adjustment</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800 font-medium mb-1">ℹ Recommendation</p>
            <p className="text-xs text-blue-700">Add 2 more check-in counters during 10AM-12PM</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
