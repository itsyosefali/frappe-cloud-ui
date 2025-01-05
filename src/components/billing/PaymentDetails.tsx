import React,{useState} from 'react';
import { CreditCard as CardIcon } from 'lucide-react';
import PaymentMethodModal from './PaymentMethodModal';
const PaymentDetails = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Card</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
            <span className="text-sm text-gray-600">
              Card ending in •••• 8428
            </span>
          </div>
          <button onClick={() => setIsPaymentModalOpen(true)} className="text-sm text-blue-600 hover:text-blue-700">
            Change card
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Mode of Payment</h3>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="monthly"
            name="payment-mode"
            className="text-blue-600 focus:ring-blue-500"
            checked
            readOnly
          />
          <label htmlFor="monthly" className="text-sm text-gray-600">
            Your card will be charged for monthly subscription
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Credit Balance</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
            <span className="mr-1">+</span> Add credit
          </button>
        </div>
        <p className="text-2xl font-semibold text-gray-900">$ 0.00</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Gulam Gaus Mohamed Ismail<br />
          Sharjah, Sharjah, United Arab Emirates, 1234
        </p>
      </div>
      {isPaymentModalOpen && (
        <PaymentMethodModal onClose={() => setIsPaymentModalOpen(false)} />
      )}
    </div>
  );
};

export default PaymentDetails;