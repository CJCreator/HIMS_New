import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
// Icons as simple components
const Package = ({ className }: { className?: string }) => <span className={className}>📦</span>;
const Clock = ({ className }: { className?: string }) => <span className={className}>🕐</span>;
const CheckCircle = ({ className }: { className?: string }) => <span className={className}>✅</span>;
const AlertTriangle = ({ className }: { className?: string }) => <span className={className}>⚠️</span>;
const Users = ({ className }: { className?: string }) => <span className={className}>👥</span>;
const TrendingUp = ({ className }: { className?: string }) => <span className={className}>📈</span>;
const Pill = ({ className }: { className?: string }) => <span className={className}>💊</span>;
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface PendingPrescription {
  id: string;
  patientName: string;
  doctorName: string;
  medications: number;
  priority: 'low' | 'medium' | 'high';
  timeAgo: string;
}

const pendingPrescriptions: PendingPrescription[] = [
  {
    id: 'RX001',
    patientName: 'John Smith',
    doctorName: 'Dr. Wilson',
    medications: 3,
    priority: 'high',
    timeAgo: '15 min ago'
  },
  {
    id: 'RX002',
    patientName: 'Sarah Johnson',
    doctorName: 'Dr. Brown',
    medications: 2,
    priority: 'medium',
    timeAgo: '32 min ago'
  },
  {
    id: 'RX003',
    patientName: 'Michael Davis',
    doctorName: 'Dr. Wilson',
    medications: 1,
    priority: 'low',
    timeAgo: '1 hour ago'
  }
];

export const PharmacyDashboard: React.FC = () => {
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const { requests } = useSelector((state: RootState) => state.medication);
  
  const pendingPrescriptionsCount = prescriptions.filter(p => p.status === 'pending').length;
  const completedToday = prescriptions.filter(p => p.status === 'dispensed').length;
  const pendingMedicationRequests = requests.filter(r => r.status === 'request' || r.status === 'pending').length;
  
  const metrics: MetricCard[] = [
    {
      title: 'Pending Prescriptions',
      value: pendingPrescriptionsCount.toString(),
      change: '+3 from yesterday',
      trend: 'up',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-orange-600'
    },
    {
      title: 'Medication Requests',
      value: pendingMedicationRequests.toString(),
      change: 'From nurses',
      trend: 'up',
      icon: <Pill className="w-6 h-6" />,
      color: 'text-blue-600'
    },
    {
      title: 'Completed Today',
      value: completedToday.toString(),
      change: '+12% from yesterday',
      trend: 'up',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Low Stock Items',
      value: '8',
      change: '2 critical',
      trend: 'down',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pharmacy Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your pharmacy overview for today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">View Inventory</Button>
          <Button variant="primary">Process Prescription</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div className={metric.color}>
                {metric.icon}
              </div>
              <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Prescriptions */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pending Prescriptions</h2>
              <Button variant="secondary" size="sm">View All</Button>
            </div>
            
            <div className="space-y-4">
              {pendingPrescriptions.map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{prescription.patientName}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        prescription.priority === 'high' ? 'bg-red-100 text-red-800' :
                        prescription.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {prescription.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Prescribed by {prescription.doctorName}</p>
                    <p className="text-sm text-gray-500">{prescription.medications} medications • {prescription.timeAgo}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">View</Button>
                    <Button variant="primary" size="sm">Process</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <Package className="w-4 h-4 mr-3" />
                Check Inventory
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-3" />
                Prescription Queue
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Pill className="w-4 h-4 mr-3" />
                Medication Requests
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Users className="w-4 h-4 mr-3" />
                Patient Records
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <AlertTriangle className="w-4 h-4 mr-3" />
                Stock Alerts
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Alerts</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">Paracetamol 500mg</p>
                  <p className="text-sm text-red-600">Only 5 units left</p>
                </div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Critical</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">Amoxicillin 250mg</p>
                  <p className="text-sm text-yellow-600">15 units remaining</p>
                </div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Low</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">Ibuprofen 400mg</p>
                  <p className="text-sm text-orange-600">22 units remaining</p>
                </div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Low</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};