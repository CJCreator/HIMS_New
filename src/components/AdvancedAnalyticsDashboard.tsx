import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Input } from '@/components';
import { InteractiveChart } from './charts/InteractiveChart';
import { HeatmapChart } from './charts/HeatmapChart';
import { SankeyChart } from './charts/SankeyChart';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';

interface AnalyticsMetric {
  id: string;
  label: string;
  value: number | string;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
  unit?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

interface PredictiveInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'forecast' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  data?: any;
}

interface AdvancedAnalyticsDashboardProps {
  role: 'admin' | 'doctor' | 'manager';
  timeRange: 'day' | 'week' | 'month' | 'quarter' | 'year';
  department?: string;
  realTime?: boolean;
}

export function AdvancedAnalyticsDashboard({
  role,
  timeRange,
  department,
  realTime = true
}: AdvancedAnalyticsDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'predictive' | 'operational' | 'financial'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    department: department || 'all',
    dateRange: timeRange,
    metricType: 'all'
  });

  // Mock analytics data - in real implementation, this would come from APIs
  const metrics = useMemo((): AnalyticsMetric[] => {
    const baseMetrics: AnalyticsMetric[] = [
      {
        id: 'patient-volume',
        label: 'Patient Volume',
        value: 1247,
        previousValue: 1189,
        change: 4.9,
        changeType: 'increase',
        unit: 'patients',
        icon: <Users className="w-5 h-5" />,
        color: 'text-blue-600',
        trend: 'up'
      },
      {
        id: 'avg-wait-time',
        label: 'Avg Wait Time',
        value: 23,
        previousValue: 28,
        change: -17.9,
        changeType: 'decrease',
        unit: 'minutes',
        icon: <Clock className="w-5 h-5" />,
        color: 'text-green-600',
        trend: 'down'
      },
      {
        id: 'revenue',
        label: 'Revenue',
        value: 456780,
        previousValue: 423450,
        change: 7.9,
        changeType: 'increase',
        unit: '$',
        icon: <DollarSign className="w-5 h-5" />,
        color: 'text-emerald-600',
        trend: 'up'
      },
      {
        id: 'satisfaction',
        label: 'Patient Satisfaction',
        value: 4.6,
        previousValue: 4.4,
        change: 4.5,
        changeType: 'increase',
        unit: '/5',
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'text-purple-600',
        trend: 'up'
      }
    ];

    // Role-specific metrics
    if (role === 'doctor') {
      return [
        ...baseMetrics,
        {
          id: 'consultation-time',
          label: 'Avg Consultation',
          value: 18,
          previousValue: 22,
          change: -18.2,
          changeType: 'decrease',
          unit: 'minutes',
          icon: <Activity className="w-5 h-5" />,
          color: 'text-indigo-600',
          trend: 'down'
        }
      ];
    }

    return baseMetrics;
  }, [role]);

  const predictiveInsights = useMemo((): PredictiveInsight[] => [
    {
      id: 'peak-hours',
      type: 'forecast',
      title: 'Peak Hours Forecast',
      description: 'Patient volume expected to increase by 35% between 2-4 PM tomorrow',
      confidence: 89,
      impact: 'high',
      actionable: true,
      data: { predictedIncrease: 35, timeSlot: '2-4 PM' }
    },
    {
      id: 'staffing-alert',
      type: 'recommendation',
      title: 'Staffing Optimization',
      description: 'Consider adding 2 nurses during evening shift based on admission trends',
      confidence: 76,
      impact: 'medium',
      actionable: true,
      data: { recommendedStaff: 2, shift: 'evening' }
    },
    {
      id: 'readmission-risk',
      type: 'anomaly',
      title: 'Readmission Risk Alert',
      description: 'Cardiology patients showing 15% higher readmission rate this month',
      confidence: 92,
      impact: 'high',
      actionable: true,
      data: { department: 'cardiology', increase: 15 }
    },
    {
      id: 'efficiency-trend',
      type: 'trend',
      title: 'Efficiency Improvement',
      description: 'Overall patient processing time decreased by 12% this quarter',
      confidence: 95,
      impact: 'medium',
      actionable: false,
      data: { improvement: 12, period: 'quarter' }
    }
  ], []);

  // Auto-refresh for real-time data
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In real implementation, fetch new data here
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [realTime]);

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    // Mock export functionality
    console.log(`Exporting dashboard as ${format}`);
    // In real implementation, generate and download the file
  };

  const getInsightIcon = (type: PredictiveInsight['type']) => {
    switch (type) {
      case 'forecast': return <TrendingUp className="w-4 h-4" />;
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />;
      case 'recommendation': return <Target className="w-4 h-4" />;
      case 'trend': return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getInsightColor = (impact: PredictiveInsight['impact']) => {
    switch (impact) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time insights and predictive analytics for {role} operations
          </p>
        </div>

        <div className="flex items-center gap-4">
          {realTime && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm">Live Data</span>
            </div>
          )}

          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLastUpdated(new Date())}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(metric => (
          <Card key={metric.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${metric.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof metric.value === 'number' && metric.value > 1000
                      ? `${(metric.value / 1000).toFixed(1)}k`
                      : metric.value
                    }
                    {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                  </p>
                </div>
              </div>

              {metric.change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${
                  metric.changeType === 'increase' ? 'text-green-600' :
                  metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : metric.changeType === 'decrease' ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : null}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'predictive', label: 'Predictive Insights', icon: Zap },
          { id: 'operational', label: 'Operations', icon: Activity },
          { id: 'financial', label: 'Financial', icon: DollarSign }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
              selectedTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              data={getPatientVolumeData()}
              type="line"
              title="Patient Volume Trends"
              xAxisKey="date"
              yAxisKeys={['patients', 'predicted']}
              realTime={realTime}
              height={300}
            />

            <InteractiveChart
              data={getDepartmentUtilizationData()}
              type="bar"
              title="Department Utilization"
              xAxisKey="department"
              yAxisKeys={['utilization']}
              height={300}
            />

            <div className="lg:col-span-2">
              <HeatmapChart
                data={getAppointmentHeatmapData()}
                xCategories={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                yCategories={['9AM', '10AM', '11AM', '2PM', '3PM', '4PM']}
                title="Appointment Density Heatmap"
                width={800}
                height={300}
              />
            </div>
          </div>
        )}

        {selectedTab === 'predictive' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Volume Forecast</h3>
                <InteractiveChart
                  data={getForecastData()}
                  type="area"
                  title="7-Day Forecast"
                  xAxisKey="date"
                  yAxisKeys={['actual', 'predicted', 'upperBound', 'lowerBound']}
                  height={250}
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Needs Prediction</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Nursing Staff</p>
                      <p className="text-sm text-blue-700">Peak demand: 2-4 PM</p>
                    </div>
                    <Badge status="info">+2 needed</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Consultation Rooms</p>
                      <p className="text-sm text-green-700">85% utilization expected</p>
                    </div>
                    <Badge status="success">Optimal</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">Emergency Capacity</p>
                      <p className="text-sm text-yellow-700">Monitor weekend surge</p>
                    </div>
                    <Badge status="warning">Monitor</Badge>
                  </div>
                </div>
              </Card>
            </div>

            {/* Predictive Insights */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Insights</h3>
              <div className="space-y-4">
                {predictiveInsights.map(insight => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${getInsightColor(insight.impact)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{insight.title}</h4>
                          <Badge
                            status={insight.confidence > 80 ? 'success' : 'warning'}
                            size="sm"
                          >
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{insight.description}</p>
                        {insight.actionable && (
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {selectedTab === 'operational' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              data={getWaitTimeData()}
              type="line"
              title="Wait Time Trends"
              xAxisKey="time"
              yAxisKeys={['waitTime']}
              height={300}
            />

            <InteractiveChart
              data={getStaffUtilizationData()}
              type="bar"
              title="Staff Utilization by Department"
              xAxisKey="department"
              yAxisKeys={['utilization']}
              height={300}
            />

            <div className="lg:col-span-2">
              <SankeyChart
                nodes={getPatientFlowNodes()}
                links={getPatientFlowLinks()}
                title="Patient Flow Analysis"
                width={800}
                height={400}
              />
            </div>
          </div>
        )}

        {selectedTab === 'financial' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              data={getRevenueData()}
              type="area"
              title="Revenue Trends"
              xAxisKey="month"
              yAxisKeys={['revenue', 'target']}
              height={300}
            />

            <InteractiveChart
              data={getCostAnalysisData()}
              type="pie"
              title="Cost Breakdown"
              xAxisKey="category"
              yAxisKeys={['amount']}
              height={300}
            />

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial KPIs</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Revenue per Patient</span>
                  <span className="font-bold text-green-600">$387</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Cost per Patient</span>
                  <span className="font-bold text-blue-600">$234</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Profit Margin</span>
                  <span className="font-bold text-purple-600">39.5%</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => handleExport('csv')}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button variant="outline" onClick={() => handleExport('pdf')}>
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}

// Mock data functions
function getPatientVolumeData() {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    patients: Math.floor(80 + Math.random() * 40),
    predicted: Math.floor(85 + Math.random() * 35)
  }));
}

function getDepartmentUtilizationData() {
  return [
    { department: 'ER', utilization: 92 },
    { department: 'Cardiology', utilization: 78 },
    { department: 'Orthopedics', utilization: 65 },
    { department: 'Pediatrics', utilization: 55 },
    { department: 'Oncology', utilization: 88 }
  ];
}

function getAppointmentHeatmapData() {
  const data = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['9AM', '10AM', '11AM', '2PM', '3PM', '4PM'];

  for (let day = 0; day < days.length; day++) {
    for (let hour = 0; hour < hours.length; hour++) {
      data.push({
        x: days[day],
        y: hours[hour],
        value: Math.floor(Math.random() * 20) + 5
      });
    }
  }

  return data;
}

function getForecastData() {
  return Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    actual: i < 3 ? Math.floor(90 + Math.random() * 30) : null,
    predicted: Math.floor(95 + Math.random() * 25),
    upperBound: Math.floor(110 + Math.random() * 20),
    lowerBound: Math.floor(80 + Math.random() * 15)
  }));
}

function getWaitTimeData() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    waitTime: Math.floor(10 + Math.random() * 30)
  }));
}

function getStaffUtilizationData() {
  return [
    { department: 'Nursing', utilization: 87 },
    { department: 'Medical Staff', utilization: 92 },
    { department: 'Administration', utilization: 78 },
    { department: 'Support Staff', utilization: 65 }
  ];
}

function getPatientFlowNodes() {
  return [
    { id: 'registration', name: 'Registration', color: '#2196F3' },
    { id: 'triage', name: 'Triage', color: '#FF9800' },
    { id: 'consultation', name: 'Consultation', color: '#4CAF50' },
    { id: 'lab', name: 'Lab Tests', color: '#9C27B0' },
    { id: 'pharmacy', name: 'Pharmacy', color: '#FF5722' },
    { id: 'discharge', name: 'Discharge', color: '#607D8B' }
  ];
}

function getPatientFlowLinks() {
  return [
    { source: 'registration', target: 'triage', value: 100 },
    { source: 'triage', target: 'consultation', value: 85 },
    { source: 'consultation', target: 'lab', value: 45 },
    { source: 'consultation', target: 'pharmacy', value: 60 },
    { source: 'lab', target: 'consultation', value: 45 },
    { source: 'pharmacy', target: 'discharge', value: 55 },
    { source: 'consultation', target: 'discharge', value: 25 }
  ];
}

function getRevenueData() {
  return [
    { month: 'Jan', revenue: 420000, target: 400000 },
    { month: 'Feb', revenue: 445000, target: 420000 },
    { month: 'Mar', revenue: 468000, target: 440000 },
    { month: 'Apr', revenue: 452000, target: 460000 },
    { month: 'May', revenue: 478000, target: 470000 },
    { month: 'Jun', revenue: 492000, target: 480000 }
  ];
}

function getCostAnalysisData() {
  return [
    { category: 'Staff Salaries', amount: 45 },
    { category: 'Medical Supplies', amount: 25 },
    { category: 'Equipment', amount: 15 },
    { category: 'Facilities', amount: 10 },
    { category: 'Other', amount: 5 }
  ];
}