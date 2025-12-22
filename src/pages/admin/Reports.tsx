import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { sanitizer } from '@/utils/sanitizer';

const BarChart = ({ className }: { className?: string }) => <span className={className}>📊</span>;
const Download = ({ className }: { className?: string }) => <span className={className}>⬇️</span>;
const Calendar = ({ className }: { className?: string }) => <span className={className}>📅</span>;
const Users = ({ className }: { className?: string }) => <span className={className}>👥</span>;
const Activity = ({ className }: { className?: string }) => <span className={className}>📈</span>;

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');

  const reportData = {
    overview: {
      totalPatients: 1247,
      totalAppointments: 856,
      totalRevenue: 125400,
      occupancyRate: 78
    },
    appointments: [
      { doctor: 'Dr. Wilson', count: 45, revenue: 6750 },
      { doctor: 'Dr. Brown', count: 38, revenue: 5700 },
      { doctor: 'Dr. Davis', count: 32, revenue: 4800 }
    ],
    departments: [
      { name: 'Cardiology', patients: 156, revenue: 23400 },
      { name: 'General Medicine', patients: 234, revenue: 18720 },
      { name: 'Pediatrics', patients: 89, revenue: 8900 }
    ]
  };

  const handleExportReport = (format: string) => {
    const sanitizedFormat = sanitizer.alphanumeric(format);
    const sanitizedReportType = sanitizer.alphanumeric(reportType);
    console.log(`Exporting ${sanitizer.forLog(sanitizedReportType)} report as ${sanitizer.forLog(sanitizedFormat)}`);
    alert(`Report exported as ${sanitizedFormat.toUpperCase()}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reports Dashboard</h1>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => handleExportReport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="secondary" onClick={() => handleExportReport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-500 focus:border-transparent"
          >
            <option value="overview">Overview</option>
            <option value="appointments">Appointments</option>
            <option value="departments">Departments</option>
            <option value="financial">Financial</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalPatients}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalAppointments}</p>
              <p className="text-sm text-gray-600">Appointments</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">${reportData.overview.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <BarChart className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.occupancyRate}%</p>
              <p className="text-sm text-gray-600">Occupancy Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Report Content */}
      {reportType === 'appointments' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Doctor Performance Report</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg per Appointment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.appointments.map((doctor, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 font-medium text-gray-900">{doctor.doctor}</td>
                    <td className="px-6 py-4 text-gray-900">{doctor.count}</td>
                    <td className="px-6 py-4 text-gray-900">${doctor.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-900">${(doctor.revenue / doctor.count).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {reportType === 'departments' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Performance Report</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg per Patient</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.departments.map((dept, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 font-medium text-gray-900">{dept.name}</td>
                    <td className="px-6 py-4 text-gray-900">{dept.patients}</td>
                    <td className="px-6 py-4 text-gray-900">${dept.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-900">${(dept.revenue / dept.patients).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {reportType === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Consultation Fees</span>
                <span className="font-medium">$85,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Procedures</span>
                <span className="font-medium">$28,400</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pharmacy</span>
                <span className="font-medium">$11,800</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total Revenue</span>
                <span>${reportData.overview.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Cash</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credit Card</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance</span>
                <span className="font-medium">20%</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};