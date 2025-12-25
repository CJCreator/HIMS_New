import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';

export default function DoctorPerformance() {
  const navigate = useNavigate();
  const { performance, monthlyData } = useSelector((state: RootState) => state.doctorAnalytics);

  // Enhanced KPIs
  const kpis = [
    {
      label: 'Total Consultations',
      value: performance.consultations,
      icon: '👥',
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Avg Consultation Duration',
      value: '18 min',
      icon: '⏱️',
      color: 'green',
      change: '-3 min',
      changeType: 'positive'
    },
    {
      label: 'Time Saved vs Traditional',
      value: '45%',
      icon: '⚡',
      color: 'purple',
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Prescription Volume',
      value: performance.prescriptions,
      icon: '💊',
      color: 'indigo',
      change: '+15%',
      changeType: 'positive'
    },
    {
      label: 'Follow-up Completion',
      value: '87%',
      icon: '✅',
      color: 'teal',
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'Patient Satisfaction',
      value: `${performance.patientSatisfaction}%`,
      icon: '⭐',
      color: 'yellow',
      change: '+2%',
      changeType: 'positive'
    },
    {
      label: 'Average Rating',
      value: performance.avgRating,
      icon: '🌟',
      color: 'orange',
      change: '+0.2',
      changeType: 'positive'
    },
    {
      label: 'Revenue Generated',
      value: `$${(performance.revenue / 1000).toFixed(0)}K`,
      icon: '💰',
      color: 'green',
      change: '+18%',
      changeType: 'positive'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Track your key performance indicators and metrics</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/doctor/dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const colors = getColorClasses(kpi.color);
          return (
            <Card key={index} className={`p-5 border-2 ${colors.border} ${colors.bg}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{kpi.icon}</div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  kpi.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className={`text-3xl font-bold ${colors.text} mb-1`}>{kpi.value}</div>
              <div className="text-sm text-gray-600">{kpi.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultation Efficiency */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            ⏱️ Consultation Efficiency
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Average Duration</span>
              <span className="text-base font-semibold text-gray-900">18 minutes</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Fastest Consultation</span>
              <span className="text-base font-semibold text-gray-900">8 minutes</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Traditional Flow Avg</span>
              <span className="text-base font-semibold text-gray-900">32 minutes</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-green-700">Time Saved Per Patient</span>
              <span className="text-base font-bold text-green-700">14 minutes</span>
            </div>
          </div>
        </Card>

        {/* Patient Outcomes */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🎯 Patient Outcomes
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Follow-up Scheduled</span>
              <span className="text-base font-semibold text-gray-900">92%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Follow-up Completed</span>
              <span className="text-base font-semibold text-gray-900">87%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Treatment Adherence</span>
              <span className="text-base font-semibold text-gray-900">89%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-700">Patient Satisfaction</span>
              <span className="text-base font-bold text-blue-700">{performance.patientSatisfaction}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Performance Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          📊 Monthly Performance Trend
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {monthlyData.map(m => (
            <div key={m.month} className="flex-1 min-w-[120px] text-center">
              <div className="h-48 bg-gray-100 rounded-lg relative overflow-hidden">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded transition-all hover:from-blue-600 hover:to-blue-500" 
                  style={{ height: `${(m.consultations / 60) * 100}%` }}
                >
                  <div className="absolute top-2 left-0 right-0 text-white font-bold text-sm">
                    {m.consultations}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="font-semibold text-gray-900">{m.month}</div>
                <div className="text-xs text-gray-600 mt-1">{m.consultations} visits</div>
                <div className="text-xs text-gray-600">${(m.revenue / 1000).toFixed(0)}K</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Prescription Analytics */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          💊 Prescription Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="text-2xl font-bold text-indigo-600">{performance.prescriptions}</div>
            <div className="text-sm text-gray-600 mt-1">Total Prescriptions</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">3.2</div>
            <div className="text-sm text-gray-600 mt-1">Avg Medications/Rx</div>
          </div>
          <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
            <div className="text-2xl font-bold text-pink-600">94%</div>
            <div className="text-sm text-gray-600 mt-1">E-Signed</div>
          </div>
          <div className="text-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <div className="text-2xl font-bold text-cyan-600">12</div>
            <div className="text-sm text-gray-600 mt-1">Refill Requests</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
