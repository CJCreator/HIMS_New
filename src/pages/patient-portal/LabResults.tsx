import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { selectResult, LabResult } from '@/store/labResultsSlice';
import { Card, Button, Input, Modal, EmptyState } from '@/components';
import { LabResultCard } from '@/components/LabResultCard';
import { LabTrendChart } from '@/components/LabTrendChart';

export function LabResults() {
  const dispatch = useDispatch();
  const { results, selectedResult } = useSelector((state: RootState) => state.labResults);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTrendModal, setShowTrendModal] = useState(false);

  const patientResults = results.filter(r => r.patientId === user?.id || true);

  const filteredResults = patientResults.filter(result => {
    const matchesSearch = result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || result.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleResultClick = (result: LabResult) => {
    dispatch(selectResult(result));
    setShowDetailModal(true);
  };

  const handleViewTrend = (testName: string) => {
    setShowTrendModal(true);
  };

  const handleDownloadPDF = () => {
    alert('PDF download functionality - integrate with backend');
  };

  const getTrendData = (testName: string) => {
    return patientResults.filter(r => r.testName === testName);
  };

  const criticalCount = filteredResults.filter(r => r.status === 'critical').length;
  const abnormalCount = filteredResults.filter(r => r.status === 'abnormal').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Lab Results</h1>
          <p className="text-sm text-neutral-600 mt-1">View your test results and trends</p>
        </div>
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <span>📄</span>
          Download All
        </Button>
      </div>

      {(criticalCount > 0 || abnormalCount > 0) && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-medium text-warning-900">Attention Required</p>
              <p className="text-sm text-warning-700 mt-1">
                {criticalCount > 0 && `${criticalCount} critical result${criticalCount > 1 ? 's' : ''}`}
                {criticalCount > 0 && abnormalCount > 0 && ' and '}
                {abnormalCount > 0 && `${abnormalCount} abnormal result${abnormalCount > 1 ? 's' : ''}`}
                {' '}found. Please consult your doctor.
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by test name or code..."
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
            <option value="hematology">Hematology</option>
            <option value="biochemistry">Biochemistry</option>
            <option value="microbiology">Microbiology</option>
            <option value="pathology">Pathology</option>
            <option value="radiology">Radiology</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="normal">Normal</option>
            <option value="abnormal">Abnormal</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {filteredResults.length === 0 ? (
          <EmptyState
            icon="🔬"
            title="No lab results found"
            description={searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' 
              ? "Try adjusting your filters" 
              : "Your lab results will appear here once available"}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((result) => (
              <LabResultCard
                key={result.id}
                result={result}
                onClick={() => handleResultClick(result)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Lab Result Details"
        size="lg"
      >
        {selectedResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-600">Test Name</p>
                <p className="text-sm font-medium text-neutral-900">{selectedResult.testName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Test Code</p>
                <p className="text-sm font-medium text-neutral-900">{selectedResult.testCode}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Result</p>
                <p className="text-lg font-bold text-neutral-900">
                  {selectedResult.value} {selectedResult.unit}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Status</p>
                <p className={`text-sm font-medium capitalize ${
                  selectedResult.status === 'normal' ? 'text-success' :
                  selectedResult.status === 'abnormal' ? 'text-warning' : 'text-error'
                }`}>
                  {selectedResult.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Normal Range</p>
                <p className="text-sm font-medium text-neutral-900">
                  {selectedResult.normalMin} - {selectedResult.normalMax} {selectedResult.unit}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Category</p>
                <p className="text-sm font-medium text-neutral-900 capitalize">{selectedResult.category}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Ordered By</p>
                <p className="text-sm font-medium text-neutral-900">Dr. {selectedResult.orderedBy}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-600">Result Date</p>
                <p className="text-sm font-medium text-neutral-900">
                  {new Date(selectedResult.resultDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedResult.notes && (
              <div className="p-3 bg-neutral-50 rounded-lg">
                <p className="text-xs text-neutral-600 mb-1">Notes</p>
                <p className="text-sm text-neutral-900">{selectedResult.notes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => handleViewTrend(selectedResult.testName)}
                className="flex-1"
              >
                View Trend
              </Button>
              <Button onClick={handleDownloadPDF} className="flex-1">
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Trend Modal */}
      <Modal
        isOpen={showTrendModal}
        onClose={() => setShowTrendModal(false)}
        title="Result Trend"
        size="xl"
      >
        {selectedResult && (
          <LabTrendChart
            results={getTrendData(selectedResult.testName)}
            testName={selectedResult.testName}
          />
        )}
      </Modal>
    </div>
  );
}
