import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, Button, Input, EmptyState } from '@/components';
import { ExpiryWarningBadge } from '@/components/ExpiryWarningBadge';
import { differenceInDays, format } from 'date-fns';

export function ExpiryAlerts() {
  const { items } = useSelector((state: RootState) => state.inventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expiryFilter, setExpiryFilter] = useState<string>('all');

  const getExpiryCategory = (expiryDate: string) => {
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return 'expired';
    if (days <= 30) return 'critical';
    if (days <= 90) return 'warning';
    if (days <= 180) return 'attention';
    return 'good';
  };

  const filteredItems = items.filter(item => {
    if (!item.expiryDate) return false;
    
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const expiryCategory = getExpiryCategory(item.expiryDate);
    const matchesExpiry = expiryFilter === 'all' || expiryCategory === expiryFilter;
    
    return matchesSearch && matchesCategory && matchesExpiry;
  }).sort((a, b) => {
    const daysA = differenceInDays(new Date(a.expiryDate!), new Date());
    const daysB = differenceInDays(new Date(b.expiryDate!), new Date());
    return daysA - daysB;
  });

  const stats = {
    expired: items.filter(i => i.expiryDate && getExpiryCategory(i.expiryDate) === 'expired').length,
    critical: items.filter(i => i.expiryDate && getExpiryCategory(i.expiryDate) === 'critical').length,
    warning: items.filter(i => i.expiryDate && getExpiryCategory(i.expiryDate) === 'warning').length,
    attention: items.filter(i => i.expiryDate && getExpiryCategory(i.expiryDate) === 'attention').length,
  };

  const categories = [...new Set(items.map(i => i.category))];

  const handleExportReport = () => {
    alert('Export expiry report - integrate with backend');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Medication Expiry Alerts</h1>
          <p className="text-sm text-neutral-600 mt-1">Monitor and manage expiring medications</p>
        </div>
        <Button onClick={handleExportReport} className="flex items-center gap-2">
          <span>📊</span>
          Export Report
        </Button>
      </div>

      {(stats.expired > 0 || stats.critical > 0) && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <p className="text-sm font-medium text-error-900">Urgent Action Required</p>
              <p className="text-sm text-error-700 mt-1">
                {stats.expired > 0 && `${stats.expired} expired medication${stats.expired > 1 ? 's' : ''}`}
                {stats.expired > 0 && stats.critical > 0 && ' and '}
                {stats.critical > 0 && `${stats.critical} expiring within 30 days`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Expired</p>
              <p className="text-3xl font-semibold text-error">{stats.expired}</p>
            </div>
            <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⛔</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Critical (≤30d)</p>
              <p className="text-3xl font-semibold text-error-600">{stats.critical}</p>
            </div>
            <div className="w-12 h-12 bg-error-50 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Warning (≤90d)</p>
              <p className="text-3xl font-semibold text-warning">{stats.warning}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Attention (≤180d)</p>
              <p className="text-3xl font-semibold text-yellow-600">{stats.attention}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by medication or batch..."
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
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="expired">Expired</option>
            <option value="critical">Critical (≤30d)</option>
            <option value="warning">Warning (≤90d)</option>
            <option value="attention">Attention (≤180d)</option>
          </select>
        </div>

        {filteredItems.length === 0 ? (
          <EmptyState
            icon="✅"
            title="No expiry alerts"
            description={searchTerm || categoryFilter !== 'all' || expiryFilter !== 'all'
              ? "Try adjusting your filters"
              : "All medications are within safe expiry dates"}
          />
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const daysUntilExpiry = differenceInDays(new Date(item.expiryDate!), new Date());
              const isExpired = daysUntilExpiry < 0;
              
              return (
                <div
                  key={item.id}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    isExpired ? 'border-error-300 bg-error-50' :
                    daysUntilExpiry <= 30 ? 'border-error-200 bg-error-50' :
                    daysUntilExpiry <= 90 ? 'border-warning-200 bg-warning-50' :
                    'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-neutral-900">{item.name}</h3>
                        <ExpiryWarningBadge expiryDate={item.expiryDate!} size="sm" />
                      </div>
                      <p className="text-sm text-neutral-600">
                        Batch: {item.batchNumber} • Category: {item.category}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-neutral-600">Expiry Date</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {format(new Date(item.expiryDate!), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Current Stock</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {item.currentStock} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Supplier</p>
                      <p className="text-sm font-medium text-neutral-900">{item.supplier}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Value at Risk</p>
                      <p className="text-sm font-medium text-neutral-900">
                        ${(item.currentStock * item.costPerUnit).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-neutral-200">
                    {isExpired ? (
                      <>
                        <Button size="sm" className="bg-error hover:bg-error-600">
                          Mark for Disposal
                        </Button>
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </>
                    ) : daysUntilExpiry <= 90 ? (
                      <>
                        <Button size="sm">Return to Supplier</Button>
                        <Button variant="secondary" size="sm">
                          Discount Sale
                        </Button>
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </>
                    ) : (
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
