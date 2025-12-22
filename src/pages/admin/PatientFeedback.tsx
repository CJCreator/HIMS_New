import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, Input, Badge } from '@/components';
import { NPSChart } from '@/components/NPSChart';
import { format } from 'date-fns';

export function PatientFeedback() {
  const { feedbacks, npsScore } = useSelector((state: RootState) => state.feedback);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesSearch = fb.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || fb.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    promoters: feedbacks.filter(f => f.category === 'promoter').length,
    passives: feedbacks.filter(f => f.category === 'passive').length,
    detractors: feedbacks.filter(f => f.category === 'detractor').length,
    avgWaitTime: (feedbacks.reduce((sum, f) => sum + f.aspects.waitTime, 0) / feedbacks.length).toFixed(1),
    avgDoctorCare: (feedbacks.reduce((sum, f) => sum + f.aspects.doctorCare, 0) / feedbacks.length).toFixed(1),
    avgOverall: (feedbacks.reduce((sum, f) => sum + f.aspects.overall, 0) / feedbacks.length).toFixed(1)
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'promoter':
        return <Badge status="delivered">Promoter</Badge>;
      case 'passive':
        return <Badge status="pending">Passive</Badge>;
      case 'detractor':
        return <Badge status="error">Detractor</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Patient Feedback</h1>
        <p className="text-sm text-neutral-600 mt-1">Monitor patient satisfaction and NPS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <NPSChart
            promoters={stats.promoters}
            passives={stats.passives}
            detractors={stats.detractors}
            npsScore={npsScore}
          />
        </Card>

        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Average Ratings</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <p className="text-3xl font-semibold text-primary-700">{stats.avgWaitTime}</p>
              <p className="text-sm text-neutral-600 mt-1">Wait Time</p>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <p className="text-3xl font-semibold text-success-700">{stats.avgDoctorCare}</p>
              <p className="text-sm text-neutral-600 mt-1">Doctor Care</p>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <p className="text-3xl font-semibold text-warning-700">{stats.avgOverall}</p>
              <p className="text-sm text-neutral-600 mt-1">Overall</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by patient or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            <option value="promoter">Promoters</option>
            <option value="passive">Passives</option>
            <option value="detractor">Detractors</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{feedback.patientName}</p>
                  <p className="text-xs text-neutral-600">
                    Dr. {feedback.doctorName} • {format(new Date(feedback.submittedAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getCategoryBadge(feedback.category)}
                  <span className="text-lg font-bold text-primary-600">{feedback.rating}/10</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mb-3">
                {Object.entries(feedback.aspects).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs text-neutral-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-sm font-medium text-neutral-900">{'★'.repeat(value)}</p>
                  </div>
                ))}
              </div>

              {feedback.comments && (
                <p className="text-sm text-neutral-700 italic bg-neutral-50 p-3 rounded">
                  "{feedback.comments}"
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
