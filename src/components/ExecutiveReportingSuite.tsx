import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Input } from '@/components';
import { InteractiveChart } from './charts/InteractiveChart';
import { HeatmapChart } from './charts/HeatmapChart';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw,
  Share,
  Printer
} from 'lucide-react';

interface KPI {
  id: string;
  name: string;
  value: number | string;
  target?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  category: 'clinical' | 'operational' | 'financial' | 'patient-experience';
  description: string;
  benchmark?: number;
}

interface ReportSection {
  id: string;
  title: string;
  description: string;
  kpis: KPI[];
  charts: any[];
  insights: string[];
}

interface ExecutiveReportingSuiteProps {
  userRole: 'ceo' | 'cmo' | 'cfo' | 'coo' | 'department-head';
  timeRange: 'month' | 'quarter' | 'year';
  department?: string;
  customFilters?: Record<string, any>;
}

export function ExecutiveReportingSuite({
  userRole,
  timeRange,
  department,
  customFilters
}: ExecutiveReportingSuiteProps) {
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [reportFilters, setReportFilters] = useState({
    dateRange: timeRange,
    department: department || 'all',
    metricType: 'all',
    ...customFilters
  });

  // Comprehensive KPI data based on role
  const kpis = useMemo((): KPI[] => {
    const baseKPIs: KPI[] = [
      {
        id: 'patient-satisfaction',
        name: 'Patient Satisfaction Score',
        value: 4.7,
        target: 4.5,
        unit: '/5',
        trend: 'up',
        status: 'excellent',
        category: 'patient-experience',
        description: 'Overall patient satisfaction from HCAHPS surveys',
        benchmark: 4.2
      },
      {
        id: 'readmission-rate',
        name: '30-Day Readmission Rate',
        value: 12.3,
        target: 15,
        unit: '%',
        trend: 'down',
        status: 'good',
        category: 'clinical',
        description: 'Percentage of patients readmitted within 30 days',
        benchmark: 15.5
      },
      {
        id: 'average-length-of-stay',
        name: 'Average Length of Stay',
        value: 4.2,
        target: 4.5,
        unit: 'days',
        trend: 'down',
        status: 'excellent',
        category: 'operational',
        description: 'Average hospital stay duration',
        benchmark: 4.8
      },
      {
        id: 'operating-margin',
        name: 'Operating Margin',
        value: 8.7,
        target: 7,
        unit: '%',
        trend: 'up',
        status: 'good',
        category: 'financial',
        description: 'Operating profit as percentage of revenue',
        benchmark: 6.2
      },
      {
        id: 'employee-satisfaction',
        name: 'Employee Satisfaction',
        value: 4.1,
        target: 4.0,
        unit: '/5',
        trend: 'stable',
        status: 'good',
        category: 'operational',
        description: 'Staff satisfaction and engagement score',
        benchmark: 3.8
      },
      {
        id: 'infection-rate',
        name: 'Hospital-Acquired Infection Rate',
        value: 0.8,
        target: 1.0,
        unit: '%',
        trend: 'down',
        status: 'excellent',
        category: 'clinical',
        description: 'Rate of hospital-acquired infections',
        benchmark: 1.2
      }
    ];

    // Role-specific KPIs
    if (userRole === 'cmo') {
      return [
        ...baseKPIs,
        {
          id: 'mortality-rate',
          name: 'Risk-Adjusted Mortality Rate',
          value: 8.2,
          target: 9.0,
          unit: '%',
          trend: 'down',
          status: 'excellent',
          category: 'clinical',
          description: 'Risk-adjusted mortality rate',
          benchmark: 9.5
        },
        {
          id: 'patient-safety-score',
          name: 'Patient Safety Score',
          value: 95,
          target: 90,
          unit: '/100',
          trend: 'up',
          status: 'excellent',
          category: 'clinical',
          description: 'Composite patient safety indicator',
          benchmark: 88
        }
      ];
    }

    if (userRole === 'cfo') {
      return [
        ...baseKPIs,
        {
          id: 'revenue-per-patient',
          name: 'Revenue per Patient',
          value: 12450,
          target: 12000,
          unit: '$',
          trend: 'up',
          status: 'good',
          category: 'financial',
          description: 'Average revenue generated per patient',
          benchmark: 11500
        },
        {
          id: 'cost-per-case',
          name: 'Cost per Case',
          value: 8750,
          target: 9000,
          unit: '$',
          trend: 'down',
          status: 'excellent',
          category: 'financial',
          description: 'Average cost per treated case',
          benchmark: 9200
        }
      ];
    }

    return baseKPIs;
  }, [userRole]);

  // Report sections based on role
  const reportSections = useMemo((): ReportSection[] => {
    const sections: ReportSection[] = [
      {
        id: 'overview',
        title: 'Executive Overview',
        description: 'High-level performance summary and key metrics',
        kpis: kpis.slice(0, 6),
        charts: [],
        insights: [
          'Patient satisfaction improved by 4.2% this quarter',
          'Operating margin exceeded target by 24%',
          'Readmission rates below national benchmark',
          'Staff satisfaction stable with room for improvement'
        ]
      },
      {
        id: 'clinical',
        title: 'Clinical Performance',
        description: 'Quality of care and clinical outcomes',
        kpis: kpis.filter(k => k.category === 'clinical'),
        charts: [],
        insights: [
          'Mortality rates improved by 8% year-over-year',
          'Infection rates well below national average',
          'Patient safety indicators at 95th percentile',
          'Length of stay reduced by 6% through efficiency improvements'
        ]
      },
      {
        id: 'operational',
        title: 'Operational Efficiency',
        description: 'Process efficiency and resource utilization',
        kpis: kpis.filter(k => k.category === 'operational'),
        charts: [],
        insights: [
          'Average wait times reduced by 15 minutes',
          'Bed utilization improved to 87%',
          'Staff productivity increased by 8%',
          'Supply chain costs reduced by 12%'
        ]
      },
      {
        id: 'financial',
        title: 'Financial Performance',
        description: 'Revenue, costs, and financial health',
        kpis: kpis.filter(k => k.category === 'financial'),
        charts: [],
        insights: [
          'Revenue growth of 12% exceeds budget by 3%',
          'Operating expenses contained at 2.1% growth',
          'Profit margins improved to 8.7%',
          'Return on assets at 6.4%, above industry average'
        ]
      },
      {
        id: 'patient-experience',
        title: 'Patient Experience',
        description: 'Patient satisfaction and experience metrics',
        kpis: kpis.filter(k => k.category === 'patient-experience'),
        charts: [],
        insights: [
          'HCAHPS scores improved across all domains',
          'Patient complaints reduced by 18%',
          'Communication scores at 92%',
          'Discharge process satisfaction at 88%'
        ]
      }
    ];

    return sections;
  }, [kpis]);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingReport(false);
    // In real implementation, this would generate and download a PDF report
    console.log('Report generated for', userRole, timeRange);
  };

  const getKPIStatusColor = (status: KPI['status']) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getKPIStatusIcon = (status: KPI['status']) => {
    switch (status) {
      case 'excellent': return <Award className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: KPI['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const selectedSectionData = reportSections.find(s => s.id === selectedSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Reporting Suite</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive performance analytics and KPIs for {userRole.replace('-', ' ').toUpperCase()} review
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleString()}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLastUpdated(new Date())}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGeneratingReport ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={reportFilters.dateRange}
              onChange={(e) => setReportFilters(prev => ({ ...prev, dateRange: e.target.value as 'month' | 'quarter' | 'year' }))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={reportFilters.department}
              onChange={(e) => setReportFilters(prev => ({ ...prev, department: e.target.value }))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Departments</option>
              <option value="cardiology">Cardiology</option>
              <option value="emergency">Emergency</option>
              <option value="surgery">Surgery</option>
              <option value="medicine">Internal Medicine</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Section Navigation */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {reportSections.map(section => (
          <button
            key={section.id}
            onClick={() => setSelectedSection(section.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedSection === section.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Section Content */}
      {selectedSectionData && (
        <div className="space-y-6">
          {/* Section Header */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedSectionData.title}</h2>
            <p className="text-gray-600">{selectedSectionData.description}</p>
          </Card>

          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSectionData.kpis.map(kpi => (
              <Card key={kpi.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{kpi.name}</h3>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(kpi.trend)}
                    <Badge className={getKPIStatusColor(kpi.status)} size="sm">
                      {getKPIStatusIcon(kpi.status)}
                      <span className="ml-1">{kpi.status}</span>
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {typeof kpi.value === 'number' && kpi.value > 1000
                        ? `${(kpi.value / 1000).toFixed(1)}k`
                        : kpi.value
                      }
                    </span>
                    <span className="text-lg text-gray-600">{kpi.unit}</span>
                  </div>

                  {kpi.target && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Target:</span>
                      <span className={`font-medium ${
                        (typeof kpi.value === 'number' ? kpi.value : 0) >= kpi.target ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {kpi.target}{kpi.unit}
                      </span>
                      <Target className={`w-3 h-3 ${
                        (typeof kpi.value === 'number' ? kpi.value : 0) >= kpi.target ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                  )}

                  {kpi.benchmark && (
                    <div className="text-xs text-gray-500">
                      Benchmark: {kpi.benchmark}{kpi.unit}
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mt-2">{kpi.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveChart
              data={getKPITrendData(selectedSectionData.kpis)}
              type="line"
              title={`${selectedSectionData.title} Trends`}
              xAxisKey="month"
              yAxisKeys={selectedSectionData.kpis.map(k => k.id)}
              height={300}
            />

            <InteractiveChart
              data={getKPIPerformanceData(selectedSectionData.kpis)}
              type="bar"
              title="Performance vs Target"
              xAxisKey="kpi"
              yAxisKeys={['actual', 'target']}
              height={300}
            />
          </div>

          {/* Key Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-3">
              {selectedSectionData.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-900">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Benchmark Comparison */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benchmark Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">KPI</th>
                    <th className="text-right py-2">Our Performance</th>
                    <th className="text-right py-2">Target</th>
                    <th className="text-right py-2">National Avg</th>
                    <th className="text-right py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSectionData.kpis.map(kpi => (
                    <tr key={kpi.id} className="border-b border-gray-100">
                      <td className="py-3 font-medium">{kpi.name}</td>
                      <td className="text-right py-3">
                        {kpi.value}{kpi.unit}
                      </td>
                      <td className="text-right py-3">
                        {kpi.target}{kpi.unit}
                      </td>
                      <td className="text-right py-3">
                        {kpi.benchmark}{kpi.unit}
                      </td>
                      <td className="text-right py-3">
                        <Badge className={getKPIStatusColor(kpi.status)} size="sm">
                          {kpi.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Export Options */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Share className="w-4 h-4 mr-2" />
          Share Report
        </Button>
        <Button variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}

// Mock data functions
function getKPITrendData(kpis: KPI[]) {
  return [
    { month: 'Jan', ...Object.fromEntries(kpis.map(k => [k.id, Math.random() * 100])) },
    { month: 'Feb', ...Object.fromEntries(kpis.map(k => [k.id, Math.random() * 100])) },
    { month: 'Mar', ...Object.fromEntries(kpis.map(k => [k.id, Math.random() * 100])) },
    { month: 'Apr', ...Object.fromEntries(kpis.map(k => [k.id, Math.random() * 100])) },
    { month: 'May', ...Object.fromEntries(kpis.map(k => [k.id, Math.random() * 100])) },
    { month: 'Jun', ...Object.fromEntries(kpis.map(k => [k.id, Math.random() * 100])) }
  ];
}

function getKPIPerformanceData(kpis: KPI[]) {
  return kpis.map(kpi => ({
    kpi: kpi.name.length > 20 ? kpi.name.substring(0, 20) + '...' : kpi.name,
    actual: typeof kpi.value === 'number' ? kpi.value : 0,
    target: kpi.target || 0
  }));
}