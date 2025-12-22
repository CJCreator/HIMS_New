import { useState } from 'react';
import { Card, Button, Input } from '@/components';

interface InvoiceItem {
  service: string;
  quantity: number;
  price: number;
}

const availableServices = [
  { id: '1', name: 'General Consultation', price: 100.00 },
  { id: '2', name: 'Follow-up Visit', price: 75.00 },
  { id: '3', name: 'Lab Tests (Basic)', price: 150.00 },
  { id: '4', name: 'X-Ray', price: 200.00 },
  { id: '5', name: 'ECG', price: 120.00 },
  { id: '6', name: 'Blood Test', price: 80.00 },
];

export function InvoiceGeneration() {
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { service: '', quantity: 1, price: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  const addItem = () => {
    setItems([...items, { service: '', quantity: 1, price: 0 }]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index: number, serviceId: string) => {
    const service = availableServices.find(s => s.id === serviceId);
    if (service) {
      updateItem(index, 'service', service.name);
      updateItem(index, 'price', service.price);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleGenerateInvoice = () => {
    const invoiceData = {
      patient: { name: patientName, id: patientId },
      items,
      subtotal,
      discount,
      discountAmount,
      total,
      notes,
      date: new Date().toISOString(),
    };
    console.log('Generating invoice:', invoiceData);
    alert('Invoice generated successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Generate Invoice</h1>
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <h2 className="text-h4 text-neutral-900 mb-6">Patient Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Patient Name *"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
            />
            <Input
              label="Patient ID *"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
            />
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-h4 text-neutral-900">Services & Charges</h2>
            <Button variant="secondary" onClick={addItem}>
              + Add Service
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="p-4 border border-neutral-200 rounded-small">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-body font-medium text-neutral-700 mb-1">
                      Service
                    </label>
                    <select
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select service</option>
                      {availableServices.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - ${service.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  />
                  <Input
                    label="Unit Price ($)"
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="text-body font-medium">
                      Total: ${(item.quantity * item.price).toFixed(2)}
                    </div>
                    {items.length > 1 && (
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-error"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-h4 text-neutral-900 mb-6">Invoice Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-body">Subtotal:</span>
              <span className="text-body font-medium">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-body">Discount:</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-20"
                />
                <span className="text-body">%</span>
              </div>
              <span className="text-body font-medium">-${discountAmount.toFixed(2)}</span>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-h4 text-neutral-900">Total Amount:</span>
                <span className="text-h4 text-receptionist">${total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-body font-medium text-neutral-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes or payment terms..."
                className="block w-full px-3 py-2 border border-neutral-300 rounded-minimal shadow-sm text-body focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <Button variant="secondary">
                Save as Draft
              </Button>
              <Button variant="secondary">
                Preview Invoice
              </Button>
              <Button 
                onClick={handleGenerateInvoice}
                disabled={!patientName || !patientId || items.some(item => !item.service)}
              >
                Generate Invoice
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}