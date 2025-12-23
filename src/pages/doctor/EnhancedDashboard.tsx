import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components';
import { LoadingSkeleton, CardSkeleton } from '@/components/LoadingSkeleton';
import { NoDataEmptyState } from '@/components/EmptyState';
import { UnifiedPatientStatusDashboard } from '@/components/UnifiedPatientStatusDashboard';
import { SmartNotificationSystem } from '@/components/SmartNotificationSystem';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { mockDataService } from '@/services/mockDataService';
import { useRealtimeSimulation } from '@/hooks/useRealtimeSimulation';

export function EnhancedDoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState({ todayCompleted: 0, todayPending: 0 });
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(true);
  const { updateCount } = useRealtimeSimulation();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const patients = mockDataService.getPatients();
      const completed = patients.filter(p => p.status === 'waiting' && p.currentStage === 'Pharmacy').length;
      const pending = patients.filter(p => p.status === 'ready' || p.status === 'in-progress').length;
      
      setStats({ todayCompleted: completed, todayPending: pending });
      setHasData(patients.length > 0);
      setLoading(false);
    };
    
    loadData();
  }, [updateCount]);

  const performanceMetrics = {
    avgConsultationTime: 10,
    previousAvg: 18,
    improvement: 44,
    todayCompleted: 8,
    todayPending: 2,
    satisfaction: 4.8
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Enhanced Doctor Dashboard</h1>
          <p className="text-sm text-neutral-600 mt-1">Welcome back, {user?.name || 'Dr. Wilson'}</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-4">
              <CardSkeleton lines={2} />
            </Card>
          ))
        ) : !hasData ? (
          <div className="col-span-full">
            <NoDataEmptyState onRefresh={() => window.location.reload()} />
          </div>
        ) : (
          <>
            <Card className="p-4 bg-success/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Avg Consultation</p>
                  <p className="text-3xl font-semibold text-success">{performanceMetrics.avgConsultationTime}m</p>
                  <p className="text-xs text-success">↓ {performanceMetrics.improvement}% faster</p>
                </div>
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Completed Today</p>
                  <p className="text-3xl font-semibold text-doctor">{stats.todayCompleted}</p>
                </div>
                <div className="w-12 h-12 bg-doctor/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Pending</p>
                  <p className="text-3xl font-semibold text-warning">{stats.todayPending}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⏱</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Satisfaction</p>
                  <p className="text-3xl font-semibold text-neutral-900">{performanceMetrics.satisfaction}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {!hasData && !loading && (
        <Card className="p-6">
          <NoDataEmptyState onRefresh={() => window.location.reload()} />
        </Card>
      )}

      {/* Quick Access to Consultation Flows */}
      <Card className="p-6">
        <h2 className="text-h3 text-neutral-900 mb-4">Quick Access - Consultation Flows</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            variant="primary" 
            className="justify-start h-auto py-4"
            onClick={() => navigate('/doctor/consultation')}
          >
            <div className="text-left">
              <div className="font-semibold">Complete System</div>
              <div className="text-xs opacity-90">All features enabled</div>
            </div>
          </Button>
          <Button 
            variant="secondary" 
            className="justify-start h-auto py-4"
            onClick={() => navigate('/doctor/consultation-phase3')}
          >
            <div className="text-left">
              <div className="font-semibold">Phase 3</div>
              <div className="text-xs opacity-90">Workflow automation</div>
            </div>
          </Button>
          <Button 
            variant="secondary" 
            className="justify-start h-auto py-4"
            onClick={() => navigate('/doctor/consultation-phase2')}
          >
            <div className="text-left">
              <div className="font-semibold">Phase 2</div>
              <div className="text-xs opacity-90">AI & collaboration</div>
            </div>
          </Button>
          <Button 
            variant="secondary" 
            className="justify-start h-auto py-4"
            onClick={() => navigate('/doctor/consultation-phase1')}
          >
            <div className="text-left">
              <div className="font-semibold">Phase 1</div>
              <div className="text-xs opacity-90">5 unified dashboards</div>
            </div>
          </Button>
        </div>
        <div className="mt-3">
          <Button 
            variant="tertiary" 
            size="sm"
            onClick={() => navigate('/doctor/consultation-legacy')}
          >
            View Legacy Flow (14 steps)
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Status - 2 columns */}
        <div className="lg:col-span-2">
          <UnifiedPatientStatusDashboard />
        </div>

        {/* Smart Notifications - 1 column */}
        <div>
          <SmartNotificationSystem />
        </div>
      </div>

      {/* Comparison Card */}
      <Card className="p-6 bg-gradient-to-r from-primary-50 to-success-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-h4 text-neutral-900 mb-2">System Improvements</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-body-sm text-neutral-600">Time Saved</p>
                <p className="text-h3 text-success">8 min</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Steps Reduced</p>
                <p className="text-h3 text-primary">14 → 5</p>
              </div>
              <div>
                <p className="text-body-sm text-neutral-600">Efficiency</p>
                <p className="text-h3 text-success">+44%</p>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate('/admin/system-comparison')}>
            View Comparison
          </Button>
        </div>
      </Card>
    </div>
  );
}
