import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addNotification } from '@/store/notificationSlice';
import { Card, Button, Input, Badge, Table, Modal } from '@/components';
import { toast } from 'sonner';

const services = [
  { id: '1', name: 'General Consultation', price: 100.00 },
  { id: '2', name: 'Follow-up Visit', price: 75.00 },
  { id: '3', name: 'Lab Tests (Basic)', price: 150.00 },
  { id: '4', name: 'X-Ray', price: 200.00 },
  { id: '5', name: 'ECG', price: 120.00 },
];

export function BillingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { appointments } = useSelector((state: RootState) => state.appointments);

  const invoices = useMemo(() => {
    return appointments.map(apt => ({
      id: `INV-${apt.id}`,
      appointmentId: apt.id,
      patient: apt.patientName,
      amount: 150.00,
      status: apt.status === 'completed' ? 'paid' : apt.status === 'cancelled' ? 'cancelled' : 'pending',
      date: apt.date,
      services: apt.type || 'Consultation',
    }));
  }, [appointments]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice =>
      invoice.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [invoices, searchTerm]);

  const stats = useMemo(() => ({
    totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
    overdueAmount: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0),
    totalInvoices: invoices.length,
  }), [invoices]);

  const handleCollectPayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.amount.toString());
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter valid payment amount');
      return;
    }

    setIsLoading(true);
    try {
      dispatch(addNotification({
        type: 'success',
        title: 'Payment Collected',
        message: `Payment of $${paymentAmount} collected from ${selectedInvoice.patient}`,
        priority: 'medium',
        category: 'billing'
      }));

      toast.success('Payment processed successfully');
      setShowPaymentModal(false);
      setSelectedInvoice(null);
      setPaymentAmount('');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintInvoice = (invoice: any) => {
    toast.info('Printing invoice...');
    dispatch(addNotification({
      type: 'info',
      title: 'Invoice Printed',
      message: `Invoice ${invoice.id} printed`,
      priority: 'low',
      category: 'billing'
    }));
  };

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
          <Button variant="tertiary" size="sm" onClick={() => handlePrintInvoice(invoice)}>Print</Button>
          {invoice.status === 'pending' && (
            <Button variant="tertiary" size="sm" className="text-success" onClick={() => handleCollectPayment(invoice)}>
              Collect
            </Button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Billing Dashboard</h1>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <div className="text-h2 text-success">${stats.totalRevenue.toFixed(2)}</div>
            <div className="text-body text-neutral-600">Total Revenue</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-warning">${stats.pendingAmount.toFixed(2)}</div>
            <div className="text-body text-neutral-600">Pending Payments</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-error">${stats.overdueAmount.toFixed(2)}</div>
            <div className="text-body text-neutral-600">Overdue Amount</div>
          </Card>
          <Card className="text-center">
            <div className="text-h2 text-receptionist">{stats.totalInvoices}</div>
            <div className="text-body text-neutral-600">Total Invoices</div>
          </Card>
        </div>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-h4 text-neutral-900">Invoice Management</h3>
              <p className="text-body text-neutral-600">Manage patient billing and payments</p>
            </div>
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
          </Card>

          <Card>
            <h3 className="text-h4 text-neutral-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="secondary" className="justify-start" onClick={() => toast.info('Feature coming soon')}>
                💰 Process Payment
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => toast.info('Feature coming soon')}>
                📧 Send Invoice
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => toast.info('Feature coming soon')}>
                📊 Payment Report
              </Button>
              <Button variant="secondary" className="justify-start" onClick={() => toast.info('Feature coming soon')}>
                🔍 Outstanding Bills
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment Collection Modal */}
      {selectedInvoice && (
        <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Collect Payment" size="md">
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-small">
              <h4 className="font-medium text-neutral-900 mb-2">Invoice Details</h4>
              <p className="text-body-sm text-neutral-600">Invoice ID: {selectedInvoice.id}</p>
              <p className="text-body-sm text-neutral-600">Patient: {selectedInvoice.patient}</p>
              <p className="text-body-sm text-neutral-600">Services: {selectedInvoice.services}</p>
              <p className="text-body-sm text-neutral-600">Amount Due: ${selectedInvoice.amount.toFixed(2)}</p>
            </div>

            <Input
              label="Payment Amount *"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter amount"
            />

            <div>
              <label className="block text-body font-medium text-neutral-700 mb-1">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal text-body focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="insurance">Insurance</option>
                <option value="check">Check</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
              <Button onClick={handleProcessPayment} loading={isLoading}>Process Payment</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
