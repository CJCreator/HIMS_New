import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { sanitizer } from '@/utils/sanitizer';

// Enhanced interfaces for new analytics
interface RevenueMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  avgRevenuePerPatient: number;
  revenueByDepartment: { department: string; revenue: number; percentage: number }[];
  equipmentRevenue: { equipment: string; revenue: number; downtime: number }[];
}

interface ReadmissionData {
  totalReadmissions: number;
  readmissionRate: number;
  avgDaysBetweenReadmission: number;
  readmissionsByDepartment: { department: string; rate: number; count: number }[];
}

interface StaffEfficiency {
  doctor: string;
  consultationsPerDay: number;
  avgConsultationTime: number;
  patientSatisfaction: number;
  efficiencyScore: number;
}

interface ComparativeMetrics {
  current: {
    bedUtilization: number;
    staffEfficiency: number;
    patientSatisfaction: number;
    revenue: number;
  };
  previous: {
    bedUtilization: number;
    staffEfficiency: number;
    patientSatisfaction: number;
    revenue: number;
  };
}

// Simple BarChart component for department data
const BarChart = ({ data, title }: { data: { label: string; value: number }[]; title: string }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-sm text-gray-600">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div 
                className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              >
                <span className="text-xs text-white font-medium">{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const TrendChart = ({ data, title, trend }: { data: { label: string; value: number }[]; title: string; trend: { value: number; label: string } }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const isPositive = trend.value >= 0;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className={`flex items-center gap-1 text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-gray-500">{trend.label}</span>
        </div>
      </div>
      <div className="h-40 flex items-end justify-between gap-2 border-b border-l border-gray-300 p-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div 
              className="bg-green-500 w-8 rounded-t"
              style={{ height: `${(item.value / maxValue) * 120}px` }}
            />
            <span className="text-xs text-gray-600 transform -rotate-45">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mock data for enhanced analytics
const mockRevenueMetrics: RevenueMetrics = {
  totalRevenue: 2850000,
  monthlyGrowth: 12.5,
  avgRevenuePerPatient: 2850,
  revenueByDepartment: [
    { department: 'Cardiology', revenue: 850000, percentage: 29.8 },
    { department: 'Emergency', revenue: 620000, percentage: 21.8 },
    { department: 'Surgery', revenue: 580000, percentage: 20.4 },
    { department: 'ICU', revenue: 450000, percentage: 15.8 },
    { department: 'Pediatrics', revenue: 350000, percentage: 12.3 }
  ],
  equipmentRevenue: [
    { equipment: 'MRI Machine', revenue: 450000, downtime: 2.5 },
    { equipment: 'CT Scanner', revenue: 320000, downtime: 1.2 },
    { equipment: 'X-Ray Unit', revenue: 180000, downtime: 8.7 },
    { equipment: 'Ultrasound', revenue: 120000, downtime: 0.8 }
  ]
};

const mockReadmissionData: ReadmissionData = {
  totalReadmissions: 127,
  readmissionRate: 8.3,
  avgDaysBetweenReadmission: 18.5,
  readmissionsByDepartment: [
    { department: 'Cardiology', rate: 12.1, count: 45 },
    { department: 'Emergency', rate: 9.8, count: 38 },
    { department: 'ICU', rate: 7.2, count: 23 },
    { department: 'Surgery', rate: 5.8, count: 15 },
    { department: 'Pediatrics', rate: 4.2, count: 6 }
  ]
};

const mockStaffEfficiency: StaffEfficiency[] = [
  { doctor: 'Dr. Smith', consultationsPerDay: 18, avgConsultationTime: 16, patientSatisfaction: 4.8, efficiencyScore: 94 },
  { doctor: 'Dr. Johnson', consultationsPerDay: 16, avgConsultationTime: 18, patientSatisfaction: 4.6, efficiencyScore: 89 },
  { doctor: 'Dr. Brown', consultationsPerDay: 14, avgConsultationTime: 22, patientSatisfaction: 4.9, efficiencyScore: 87 },
  { doctor: 'Dr. Wilson', consultationsPerDay: 20, avgConsultationTime: 15, patientSatisfaction: 4.7, efficiencyScore: 96 }
];

const mockComparativeMetrics: ComparativeMetrics = {
  current: {
    bedUtilization: 75.2,
    staffEfficiency: 91.5,
    patientSatisfaction: 4.7,
    revenue: 2850000
  },
  previous: {
    bedUtilization: 72.8,
    staffEfficiency: 89.2,
    patientSatisfaction: 4.5,
    revenue: 2530000
  }
};

export const Analytics: React.FC = () => {
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { patients } = useSelector((state: RootState) => state.patients);
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const { items } = useSelector((state: RootState) => state.inventory);
  
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending').length;
  const lowStockItems = items.filter(i => i.currentStock <= i.minStock).length;
  
  const patientData = [
    { label: 'Jan', value: 245 },
    { label: 'Feb', value: 289 },
    { label: 'Mar', value: 312 },
    { label: 'Apr', value: 278 },
    { label: 'May', value: 334 },
    { label: 'Jun', value: patients.length }
  ];

  const departmentData = [
    { label: 'Cardiology', value: 89 },
    { label: 'Neurology', value: 67 },
    { label: 'Orthopedics', value: 54 },
    { label: 'Pediatrics', value: 43 },
    { label: 'Emergency', value: 78 }
  ];

  const revenueData = [
    { label: 'Q1', value: 125000 },
    { label: 'Q2', value: 142000 },
    { label: 'Q3', value: 138000 },
    { label: 'Q4', value: 156000 }
  ];

  // Calculate bed utilization rate
  const bedUtilizationRate = 75.2; // Mock data - would come from bed management
  
  // Calculate comparative metrics
  const calculatePercentageChange = (current: number, previous: number): number => {
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  };

  const exportReport = (type: string) => {
    const sanitizedType = sanitizer.alphanumeric(type);
    const data = {
      patients: patientData,
      departments: departmentData,
      revenue: revenueData,
      revenueMetrics: mockRevenueMetrics,
      readmissionData: mockReadmissionData,
      staffEfficiency: mockStaffEfficiency,
      comparativeMetrics: mockComparativeMetrics,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hospital-analytics-${sanitizedType}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Hospital performance metrics and insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => exportReport('pdf')}>
            📄 Export PDF
          </Button>
          <Button variant="secondary" onClick={() => exportReport('excel')}>
            📊 Export Excel
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{patients.length}</div>
          <div className="text-sm text-gray-600">Total Patients</div>
          <div className="text-xs text-green-600 mt-1">Active in system</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{completedAppointments}</div>
          <div className="text-sm text-gray-600">Completed Appointments</div>
          <div className="text-xs text-gray-500 mt-1">{appointments.length} total</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{prescriptions.length}</div>
          <div className="text-sm text-gray-600">Total Prescriptions</div>
          <div className="text-xs text-yellow-600 mt-1">{pendingPrescriptions} pending</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">{lowStockItems}</div>
          <div className="text-sm text-gray-600">Low Stock Items</div>
          <div className="text-xs text-red-600 mt-1">Needs attention</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-center p-4 text-neutral-600">Chart placeholder</div>
        </Card>
        <Card className="p-6">
          <BarChart data={departmentData} title="Department Utilization" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Staff Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Dr. Smith</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                </div>
                <span className="text-xs text-gray-600">92%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Dr. Johnson</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }} />
                </div>
                <span className="text-xs text-gray-600">88%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Dr. Brown</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '76%' }} />
                </div>
                <span className="text-xs text-gray-600">76%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Equipment Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">MRI Machine</span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">CT Scanner</span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">X-Ray Unit</span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Maintenance</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ultrasound</span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Operational</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-gray-600">New patient registered</span>
              <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-600">Bed A-101 available</span>
              <span className="text-xs text-gray-500 ml-auto">5 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-gray-600">Medication request pending</span>
              <span className="text-xs text-gray-500 ml-auto">8 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-gray-600">Lab results ready</span>
              <span className="text-xs text-gray-500 ml-auto">12 min ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};