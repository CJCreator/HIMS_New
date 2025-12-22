import React, { useState } from 'react';
import { Card, Button } from '../../components';
import { DollarSign, CreditCard, Download } from 'lucide-react';

interface Bill {
  id: string;
  description: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate?: string;
}

export const MyBills: React.FC = () => {
  const [bills] = useState<Bill[]>([
    { id: '1', description: 'Consultation - Dr. Smith', date: '2024-01-15', amount: 150, status: 'paid' },
    { id: '2', description: 'Lab Tests - Complete Blood Count', date: '2024-01-18', amount: 85, status: 'pending', dueDate: '2024-02-01' },
    { id: '3', description: 'Prescription Medications', date: '2024-01-10', amount: 45, status: 'paid' }
  ]);

  const totalPending = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Bills & Payments</h1>

      {totalPending > 0 && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-700">Outstanding Balance</p>
              <p className="text-3xl font-bold text-blue-900">${totalPending.toFixed(2)}</p>
            </div>
            <Button variant="primary">
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {bills.map((bill) => (
          <Card key={bill.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <DollarSign className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">{bill.description}</h3>
                  <p className="text-sm text-gray-600">Date: {bill.date}</p>
                  {bill.dueDate && <p className="text-sm text-gray-600">Due: {bill.dueDate}</p>}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">${bill.amount.toFixed(2)}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getStatusColor(bill.status)}`}>
                  {bill.status}
                </span>
                {bill.status === 'paid' && (
                  <Button variant="secondary" size="sm" className="mt-2">
                    <Download className="w-4 h-4 mr-1" />
                    Receipt
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};