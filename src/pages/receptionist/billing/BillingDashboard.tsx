import { useState } from 'react';
import { Card, Button, Input, Badge, Table } from '@/components';

const invoices = [
  { id: 'INV-001', patient: 'John Smith', amount: 250.00, status: 'paid', date: '2024-01-15', services: 'Consultation, Lab Tests' },
  { id: 'INV-002', patient: 'Sarah Johnson', amount: 180.00, status: 'pending', date: '2024-01-14', services: 'Follow-up Visit' },
  { id: 'INV-003', patient: 'Mike Davis', amount: 320.00, status: 'overdue', date: '2024-01-10', services: 'Consultation, X-Ray' },
];

const services = [
  { id: '1', name: 'General Consultation', price: 100.00 },
  { id: '2', name: 'Follow-up Visit', price: 75.00 },
  { id: '3', name: 'Lab Tests (Basic)', price: 150.00 },
  { id: '4', name: 'X-Ray', price: 200.00 },
  { id: '5', name: 'ECG', price: 120.00 },
];

export function BillingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'id', header: 'Invoice ID' },
    { key: 'patient', header: 'Patient' },
    { key: 'services', header: 'Services' },
    { key: 'amount', header: 'Amount', render: (amount: number) => `$${amount.toFixed(2)}` },
    { key: 'date', header: 'Date' },
    {
      key: 'status',
      header: 'Status',
      render: (status: string) => (
        <Badge status={status === 'paid' ? 'delivered' : status === 'pending' ? 'pending' : 'error'}>
          {status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, invoice: any) => (
        <div className="flex space-x-2">
          <Button variant="tertiary" size="sm">View</Button>
          <Button variant="tertiary" size="sm">Print</Button>
          {invoice.status === 'pending' && (
            <Button variant="tertiary" size="sm" className="text-success">
              Collect
            </Button>
          )}
        </div>
      )
    },
  ];

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Billing Dashboard</h1>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <div className="text-h2 text-success">${totalRevenue.toFixed(2)}</div>
            <div className="text-body text-neutral-600">Total Revenue</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-warning">${pendingAmount.toFixed(2)}</div>
            <div className="text-body text-neutral-600">Pending Payments</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-error">${overdueAmount.toFixed(2)}</div>
            <div className="text-body text-neutral-600">Overdue Amount</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-receptionist">{invoices.length}</div>
            <div className="text-body text-neutral-600">Total Invoices</div>
          </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-h4 text-neutral-900">Invoice Management</h3>
              <p className="text-body text-neutral-600">Manage patient billing and payments</p>
            </div>
            <Button onClick={() => setShowInvoiceModal(true)}>
              + Create Invoice
            </Button>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Search invoices by patient name or invoice ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <Table columns={columns} data={filteredInvoices} />
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Service Pricing</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex justify-between items-center p-3 bg-neutral-50 rounded-small">
                  <span className="text-body">{service.name}</span>
                  <span className="text-body font-medium">${service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full mt-4">
              Manage Pricing
            </Button>
          </Card>

          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="secondary" className="justify-start">
                💰 Process Payment
              </Button>
              <Button variant="secondary" className="justify-start">
                📧 Send Invoice
              </Button>
              <Button variant="secondary" className="justify-start">
                📊 Payment Report
              </Button>
              <Button variant="secondary" className="justify-start">
                🔍 Outstanding Bills
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}