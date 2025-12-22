import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { createPlan, recordPayment } from '../../../store/paymentPlanSlice';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';

export default function PaymentPlans() {
  const { plans, payments } = useSelector((state: RootState) => state.paymentPlan);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [form, setForm] = useState({ patientName: '', totalAmount: '', downPayment: '', installments: '3' });

  const active = plans.filter(p => p.status === 'active').length;
  const overdue = plans.filter(p => {
    const monthsSinceStart = Math.floor((Date.now() - new Date(p.startDate).getTime()) / (30 * 86400000));
    const expectedPaid = p.downPayment + (monthsSinceStart * p.monthlyAmount);
    return p.paid < expectedPaid && p.status === 'active';
  }).length;

  const handleCreate = () => {
    const total = parseFloat(form.totalAmount);
    const down = parseFloat(form.downPayment);
    const inst = parseInt(form.installments);
    const monthly = (total - down) / inst;
    
    dispatch(createPlan({
      id: `PP${Date.now()}`,
      ...form,
      totalAmount: total,
      downPayment: down,
      installments: inst,
      monthlyAmount: monthly,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      paid: down,
    }));
    setShowModal(false);
    setForm({ patientName: '', totalAmount: '', downPayment: '', installments: '3' });
  };

  const handlePayment = () => {
    if (!selectedPlan) return;
    dispatch(recordPayment({
      id: `PAY${Date.now()}`,
      planId: selectedPlan.id,
      amount: selectedPlan.monthlyAmount,
      date: new Date().toISOString().split('T')[0],
      method: 'card',
      status: 'completed',
    }));
    setShowPayModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Plans</h1>
        <Button onClick={() => setShowModal(true)}>+ Create Plan</Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-3xl font-bold text-blue-600">{active}</div>
          <div className="text-sm text-gray-600">Active Plans</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-red-600">{overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-green-600">{plans.filter(p => p.status === 'completed').length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        <Card className="p-4">
          <div className="text-3xl font-bold text-gray-700">${plans.reduce((sum, p) => sum + p.totalAmount, 0)}</div>
          <div className="text-sm text-gray-600">Total Value</div>
        </Card>
      </div>

      <div className="space-y-3">
        {plans.map(plan => {
          const progress = (plan.paid / plan.totalAmount) * 100;
          return (
            <Card key={plan.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{plan.patientName}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">{plan.id}</span>
                    <span className={`px-2 py-1 rounded text-xs ${plan.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Total: ${plan.totalAmount} | Down: ${plan.downPayment} | Monthly: ${plan.monthlyAmount}</p>
                  <p className="text-sm text-gray-600">Paid: ${plan.paid} / ${plan.totalAmount} ({plan.installments} installments)</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div className="bg-blue-500 h-2 rounded" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
                {plan.status === 'active' && (
                  <Button size="sm" onClick={() => { setSelectedPlan(plan); setShowPayModal(true); }}>
                    Record Payment
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Payment Plan">
        <div className="space-y-4">
          <Input label="Patient Name" value={form.patientName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, patientName: e.target.value })} />
          <Input label="Total Amount" type="number" value={form.totalAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, totalAmount: e.target.value })} />
          <Input label="Down Payment" type="number" value={form.downPayment} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, downPayment: e.target.value })} />
          <Input label="Number of Installments" type="number" value={form.installments} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, installments: e.target.value })} />
          {form.totalAmount && form.downPayment && form.installments && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-800">
                Monthly Payment: ${((parseFloat(form.totalAmount) - parseFloat(form.downPayment)) / parseInt(form.installments)).toFixed(2)}
              </p>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Plan</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Record Payment">
        {selectedPlan && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Patient</p>
              <p className="font-semibold">{selectedPlan.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Amount</p>
              <p className="font-semibold">${selectedPlan.monthlyAmount}</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPayModal(false)}>Cancel</Button>
              <Button onClick={handlePayment}>Record Payment</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
