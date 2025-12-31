import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/notificationSlice';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Input } from '../../../components/Input';
import { CreditCard, DollarSign, FileText } from 'lucide-react';

interface PaymentCollectionProps {
  patientName: string;
  totalAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentCollection: React.FC<PaymentCollectionProps> = ({ 
  patientName, 
  totalAmount, 
  onClose, 
  onSuccess 
}) => {
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'insurance' | 'check'>('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    cashAmount: totalAmount,
    checkNumber: '',
    insuranceClaim: ''
  });
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      dispatch(addNotification({
      type: 'success',
      title: 'Payment Processed',
      message: 'Payment of $${totalAmount.toFixed(2)} processed successfully',
      priority: 'medium',
      category: 'system'
    }));
      
      // Generate receipt
      setTimeout(() => {
        dispatch(addNotification({
      type: 'info',
      title: 'Receipt Generated',
      message: 'Payment receipt has been generated and can be printed',
      priority: 'medium',
      category: 'system'
    }));
      }, 500);
      
      onSuccess();
    } else {
      dispatch(addNotification({
      type: 'error',
      title: 'Payment Failed',
      message: 'Payment could not be processed. Please try again.',
      priority: 'urgent',
      category: 'system'
    }));
    }
    
    setProcessing(false);
  };

  const validatePayment = () => {
    switch (paymentMethod) {
      case 'card':
        return paymentData.cardNumber && paymentData.expiryDate && paymentData.cvv;
      case 'cash':
        return paymentData.cashAmount >= totalAmount;
      case 'check':
        return paymentData.checkNumber;
      case 'insurance':
        return paymentData.insuranceClaim;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Payment Collection</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          {/* Payment Summary */}
          <Card className="p-4 mb-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900">Patient: {patientName}</h3>
                <p className="text-sm text-gray-600">Total Amount Due</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'card', label: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
                { value: 'cash', label: 'Cash', icon: <DollarSign className="w-5 h-5" /> },
                { value: 'check', label: 'Check', icon: <FileText className="w-5 h-5" /> },
                { value: 'insurance', label: 'Insurance', icon: <FileText className="w-5 h-5" /> }
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setPaymentMethod(value as any)}
                  className={`p-3 rounded-lg border text-center ${
                    paymentMethod === value
                      ? 'border-receptionist-500 bg-receptionist-50 text-receptionist-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {icon}
                    <span className="text-sm mt-1">{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <Card className="p-6 mb-6">
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Card Details</h4>
                <Input
                  label="Card Number"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                    placeholder="MM/YY"
                  />
                  <Input
                    label="CVV"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                    placeholder="123"
                  />
                </div>
                <Input
                  label="Cardholder Name"
                  value={paymentData.cardholderName}
                  onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Cash Payment</h4>
                <Input
                  label="Amount Received"
                  type="number"
                  step="0.01"
                  value={paymentData.cashAmount}
                  onChange={(e) => setPaymentData({...paymentData, cashAmount: parseFloat(e.target.value)})}
                />
                {paymentData.cashAmount > totalAmount && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700">
                      Change Due: ${(paymentData.cashAmount - totalAmount).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'check' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Check Payment</h4>
                <Input
                  label="Check Number"
                  value={paymentData.checkNumber}
                  onChange={(e) => setPaymentData({...paymentData, checkNumber: e.target.value})}
                  placeholder="1001"
                />
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    Please verify check details before processing
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'insurance' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Insurance Claim</h4>
                <Input
                  label="Claim Number"
                  value={paymentData.insuranceClaim}
                  onChange={(e) => setPaymentData({...paymentData, insuranceClaim: e.target.value})}
                  placeholder="INS-2024-001"
                />
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    Insurance claim will be submitted for processing
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary">
                <FileText className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
              <Button 
                variant="primary" 
                onClick={handlePayment}
                disabled={!validatePayment() || processing}
              >
                {processing ? 'Processing...' : `Process Payment ($${totalAmount.toFixed(2)})`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};