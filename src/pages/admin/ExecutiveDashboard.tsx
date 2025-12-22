import React from 'react';
import { KPICard } from '../../components/KPICard';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { PatientVolumeChart } from '../../components/charts/PatientVolumeChart';
import { DepartmentChart } from '../../components/charts/DepartmentChart';
import { OccupancyChart } from '../../components/charts/OccupancyChart';
import { AppointmentChart } from '../../components/charts/AppointmentChart';
import { PeakHoursHeatmap } from '../../components/charts/PeakHoursHeatmap';
import { DateRangePicker } from '../../components/DateRangePicker';
import { Users, DollarSign, Calendar, Activity, Download } from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
        <div className="flex space-x-3">
          <DateRangePicker />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value="$328,000"
          change={12.5}
          changeType="increase"
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
        />
        <KPICard
          title="Total Patients"
          value="1,247"
          change={8.2}
          changeType="increase"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <KPICard
          title="Appointments"
          value="892"
          change={-3.1}
          changeType="decrease"
          icon={<Calendar className="w-6 h-6" />}
          color="yellow"
        />
        <KPICard
          title="Bed Occupancy"
          value="87%"
          change={5.4}
          changeType="increase"
          icon={<Activity className="w-6 h-6" />}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <RevenueChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Volume</h3>
          <PatientVolumeChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <DepartmentChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bed Occupancy Rate</h3>
          <OccupancyChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Trends</h3>
          <AppointmentChart />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours Heatmap</h3>
          <PeakHoursHeatmap />
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
        <div className="space-y-4">
          {[
            { dept: 'Emergency', patients: 156, revenue: 45000, efficiency: 92 },
            { dept: 'Cardiology', patients: 89, revenue: 67000, efficiency: 88 },
            { dept: 'Orthopedics', patients: 124, revenue: 52000, efficiency: 95 },
            { dept: 'Pediatrics', patients: 78, revenue: 28000, efficiency: 90 }
          ].map((dept) => (
            <div key={dept.dept} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{dept.dept}</h4>
                <p className="text-sm text-gray-600">{dept.patients} patients this month</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${dept.revenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{dept.efficiency}% efficiency</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};