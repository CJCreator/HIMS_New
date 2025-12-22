import React, { useState } from 'react';
import { Card, Button } from '../../../components';
import { Download, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export const FinancialReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'receivables' | 'insurance' | 'daily'>('revenue');

  const tabs = [
    { id: 'revenue', label: 'Revenue by Service' },
    { id: 'receivables', label: 'Receivables Aging' },
    { id: 'insurance', label: 'Insurance Claims' },
    { id: 'daily', label: 'Daily Collections' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <Button variant="primary">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$328,450</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                12.5% vs last month
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">$45,230</p>
              <p className="text-sm text-yellow-600">15 overdue accounts</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Collection Rate</p>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
              <p className="text-sm text-green-600">Above target</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
      </div>

      <div className="flex space-x-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="p-6">
        {activeTab === 'revenue' && <RevenueByServiceContent />}
        {activeTab === 'receivables' && <ReceivablesAgingContent />}
        {activeTab === 'insurance' && <InsuranceClaimsContent />}
        {activeTab === 'daily' && <DailyCollectionContent />}
      </Card>
    </div>
  );
};

const RevenueByServiceContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Revenue Breakdown by Service</h2>
    {[
      { service: 'Consultations', revenue: 125000, percentage: 38 },
      { service: 'Laboratory Tests', revenue: 85000, percentage: 26 },
      { service: 'Procedures', revenue: 68000, percentage: 21 },
      { service: 'Medications', revenue: 50450, percentage: 15 }
    ].map((item) => (
      <div key={item.service} className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">{item.service}</span>
          <span className="font-semibold">${item.revenue.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
        </div>
      </div>
    ))}
  </div>
);

const ReceivablesAgingContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Accounts Receivable Aging</h2>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Age</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Accounts</th>
          </tr>
        </thead>
        <tbody>
          {[
            { age: '0-30 days', amount: 15230, accounts: 45 },
            { age: '31-60 days', amount: 12450, accounts: 28 },
            { age: '61-90 days', amount: 8900, accounts: 15 },
            { age: '90+ days', amount: 8650, accounts: 12 }
          ].map((item) => (
            <tr key={item.age} className="border-t">
              <td className="px-4 py-3">{item.age}</td>
              <td className="px-4 py-3 text-right font-medium">${item.amount.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">{item.accounts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const InsuranceClaimsContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Insurance Claims Status</h2>
    {[
      { status: 'Approved', count: 156, amount: 245000, color: 'green' },
      { status: 'Pending', count: 45, amount: 67000, color: 'yellow' },
      { status: 'Denied', count: 8, amount: 12000, color: 'red' }
    ].map((item) => (
      <div key={item.status} className="flex items-center justify-between p-4 bg-gray-50 rounded">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
          <span className="font-medium">{item.status}</span>
        </div>
        <div className="text-right">
          <p className="font-semibold">${item.amount.toLocaleString()}</p>
          <p className="text-sm text-gray-600">{item.count} claims</p>
        </div>
      </div>
    ))}
  </div>
);

const DailyCollectionContent = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold">Daily Collection Summary</h2>
    {[
      { date: '2024-01-15', cash: 5200, card: 8900, insurance: 12300, total: 26400 },
      { date: '2024-01-14', cash: 4800, card: 9200, insurance: 11800, total: 25800 },
      { date: '2024-01-13', cash: 5500, card: 8700, insurance: 13100, total: 27300 }
    ].map((item) => (
      <div key={item.date} className="p-4 bg-gray-50 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">{item.date}</span>
          <span className="text-lg font-bold">${item.total.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Cash</p>
            <p className="font-medium">${item.cash.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Card</p>
            <p className="font-medium">${item.card.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Insurance</p>
            <p className="font-medium">${item.insurance.toLocaleString()}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);