import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { addLabOrder } from '../../../store/labSlice';
import { addNotification } from '../../../store/notificationSlice';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';

const Search = ({ className }: { className?: string }) => <span className={className}>🔍</span>;
const Plus = ({ className }: { className?: string }) => <span className={className}>➕</span>;
const Minus = ({ className }: { className?: string }) => <span className={className}>➖</span>;

interface LabTestOrdersProps {
  patientName: string;
  patientId: string;
  onNext: () => void;
  onPrevious: () => void;
}

export const LabTestOrders: React.FC<LabTestOrdersProps> = ({ 
  patientName, 
  patientId, 
  onNext, 
  onPrevious 
}) => {
  const dispatch = useDispatch();
  const { availableTests } = useSelector((state: RootState) => state.lab);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(availableTests.map(test => test.category)))];
  
  const filteredTests = availableTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTest = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSubmit = () => {
    if (selectedTests.length === 0) {
      dispatch(addNotification({
      type: 'warning',
      title: 'No Tests Selected',
      message: 'Please select at least one lab test to order',
      priority: 'medium',
      category: 'system'
    }));
      return;
    }

    const testsToOrder = availableTests.filter(test => selectedTests.includes(test.id));
    
    dispatch(addLabOrder({
      patientName,
      patientId,
      doctorName: 'Dr. Wilson',
      tests: testsToOrder,
      priority,
      notes: notes || undefined
    }));

    dispatch(addNotification({
      type: 'success',
      title: 'Lab Tests Ordered',
      message: '${selectedTests.length} lab test(s) ordered for ${patientName}',
      priority: 'medium',
      category: 'system'
    }));

    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Lab Test Orders</h2>
          <p className="text-gray-600">Select lab tests to order for {patientName}</p>
        </div>
        <div className="text-sm text-gray-500">
          Step 10 of 13
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Selection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                placeholder="Search lab tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTests.map((test) => (
              <Card 
                key={test.id} 
                className={`p-4 cursor-pointer transition-all ${
                  selectedTests.includes(test.id) 
                    ? 'ring-2 ring-doctor-500 bg-doctor-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleTest(test.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-500">{test.category}</p>
                    {test.normalRange && (
                      <p className="text-xs text-gray-400">
                        Normal: {test.normalRange} {test.unit}
                      </p>
                    )}
                  </div>
                  <div className="ml-3">
                    {selectedTests.includes(test.id) ? (
                      <Minus className="w-5 h-5 text-doctor-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Selected Tests ({selectedTests.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedTests.map(testId => {
                const test = availableTests.find(t => t.id === testId);
                return test ? (
                  <div key={testId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-900">{test.name}</span>
                    <button
                      onClick={() => toggleTest(testId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Order Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="stat">STAT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Clinical indication for tests..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-doctor-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="secondary" onClick={onPrevious}>
          Previous
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Order Tests & Continue
        </Button>
      </div>
    </div>
  );
};