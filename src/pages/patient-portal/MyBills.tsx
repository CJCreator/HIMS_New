import React from 'react';
import { Card, Button } from '@/components';
import { CreditCard, Download, DollarSign } from 'lucide-react';

export const MyBills: React.FC = () => {
  const bills = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Annual Physical Exam',
      amount: 250.00,
      status: 'Paid',
      dueDate: '2024-01-30'
    },
    {
      id: '2',
      date: '2024-01-10',
      description: 'Lab Work - Blood Panel',
      amount: 125.00,
      status: 'Pending',
      dueDate: '2024-01-25'
    },
    {
      id: '3',
      date: '2024-01-05',
      description: 'Prescription Medications',
      amount: 45.00,
      status: 'Overdue',
      dueDate: '2024-01-20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bills & Payments</h1>
          <p className="text-gray-600">Manage your medical bills and payment history</p>
        </div>
        <Button variant="primary">
          <CreditCard className="w-4 h-4 mr-2" />
          Make Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-xl font-semibold text-gray-900">$250.00</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <DollarSign className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-semibold text-gray-900">$125.00</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <DollarSign className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-xl font-semibold text-gray-900">$45.00</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bills List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bills</h2>
        <div className="space-y-4">
          {bills.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{bill.description}</h3>
                <p className="text-sm text-gray-600">Date: {bill.date} • Due: {bill.dueDate}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${bill.amount.toFixed(2)}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bill.status)}`}>
                    {bill.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  {bill.status !== 'Paid' && (
                    <Button variant="primary" size="sm">
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};