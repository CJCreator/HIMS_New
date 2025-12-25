import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addLabResults } from '@/store/labSlice';
import { addNotification, addRoleNotification } from '@/store/notificationSlice';
import { Card, Button, Input, Modal } from '@/components';
import { toast } from 'sonner';

interface TestResult {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'critical';
}

export const ResultEntry = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state: RootState) => state.lab);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);

  const processingOrders = useMemo(() => 
    orders.filter(o => o.status === 'processing'),
    [orders]
  );

  const selectedOrder = useMemo(() => 
    orders.find(o => o.id === selectedOrderId),
    [orders, selectedOrderId]
  );

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setResults(order.tests.map(test => ({
        name: test.name,
        value: '',
        unit: test.unit || 'units',
        normalRange: test.normalRange || 'N/A',
        status: 'normal' as const
      })));
    }
  };

  const updateResult = (index: number, value: string) => {
    const updated = [...results];
    updated[index].value = value;
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (updated[index].name.toLowerCase().includes('glucose') && numValue > 200) {
        updated[index].status = 'critical';
      } else if (updated[index].name.toLowerCase().includes('hemoglobin') && numValue < 8) {
        updated[index].status = 'critical';
      } else if (updated[index].name.toLowerCase().includes('wbc') && (numValue < 4 || numValue > 11)) {
        updated[index].status = 'abnormal';
      } else {
        updated[index].status = 'normal';
      }
    }
    
    setResults(updated);
  };

  const criticalValues = useMemo(() => 
    results.filter(r => r.status === 'critical' && r.value),
    [results]
  );

  const handleSubmit = async () => {
    if (!selectedOrderId) {
      toast.error('Please select an order');
      return;
    }

    if (!results.some(r => r.value)) {
      toast.error('Please enter at least one result');
      return;
    }

    if (criticalValues.length > 0) {
      setShowCriticalAlert(true);
      return;
    }

    await submitResults();
  };

  const submitResults = async () => {
    setIsLoading(true);
    try {
      const labResults = results
        .filter(r => r.value)
        .reduce((acc, r) => {
          acc[r.name] = { value: r.value, status: r.status };
          return acc;
        }, {} as { [key: string]: { value: string; status: 'normal' | 'abnormal' | 'critical' } });
      
      dispatch(addLabResults({
        orderId: selectedOrderId,
        results: labResults
      }));

      dispatch(addNotification({
        type: 'success',
        title: 'Results Submitted',
        message: `Lab results for order ${selectedOrderId} submitted successfully`,
        priority: 'medium',
        category: 'lab'
      }));

      if (criticalValues.length > 0) {
        dispatch(addRoleNotification({
          role: 'doctor',
          type: 'error',
          title: 'Critical Lab Results',
          message: `CRITICAL: ${selectedOrder?.patientName} has critical lab values requiring immediate attention`,
          priority: 'urgent',
          category: 'lab'
        }));
      }

      toast.success('Results submitted successfully');
      setSelectedOrderId('');
      setResults([]);
      setShowCriticalAlert(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Result Entry</h1>
          {selectedOrder && (
            <p className="text-gray-600">Order #{selectedOrder.id} - {selectedOrder.patientName}</p>
          )}
        </div>
      </div>

      {!selectedOrderId ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Order</h2>
          <div className="space-y-3">
            {processingOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No orders in processing status</p>
            ) : (
              processingOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleOrderSelect(order.id)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.patientName}</p>
                    <p className="text-sm text-gray-600">{order.tests.map(t => t.name).join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order: {order.id}</p>
                    <p className="text-sm text-gray-600">{order.orderDate}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      ) : (
        <>
          {criticalValues.length > 0 && (
            <Card className="p-4 bg-red-50 border border-red-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Critical Values Detected</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {criticalValues.map((cv, idx) => (
                      <p key={idx}>• {cv.name}: {cv.value} {cv.unit} (Normal: {cv.normalRange})</p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Test Results</h2>
              <Button variant="secondary" size="sm" onClick={() => setSelectedOrderId('')}>
                Change Order
              </Button>
            </div>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={result.name} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="font-medium text-gray-900">{result.name}</p>
                    <p className="text-sm text-gray-600">Normal: {result.normalRange}</p>
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={result.value}
                    onChange={(e) => updateResult(index, e.target.value)}
                    className={result.status === 'critical' ? 'border-red-500' : ''}
                  />
                  <span className="text-sm text-gray-600">{result.unit}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    result.status === 'critical' ? 'bg-red-100 text-red-800' :
                    result.status === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="secondary" onClick={() => setSelectedOrderId('')}>Cancel</Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                loading={isLoading}
                disabled={!results.some(r => r.value)}
              >
                Submit Results
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* Critical Value Confirmation Modal */}
      <Modal
        isOpen={showCriticalAlert}
        onClose={() => setShowCriticalAlert(false)}
        title="Critical Values Detected"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-body font-medium text-red-900 mb-2">The following critical values were detected:</p>
            {criticalValues.map((cv, idx) => (
              <p key={idx} className="text-body-sm text-red-800">
                • {cv.name}: {cv.value} {cv.unit} (Normal: {cv.normalRange})
              </p>
            ))}
          </div>
          <p className="text-body">Doctor will be notified immediately. Do you want to proceed?</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCriticalAlert(false)}>Cancel</Button>
            <Button onClick={submitResults} loading={isLoading}>Confirm & Submit</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
