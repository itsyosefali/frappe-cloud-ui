import React,{useState} from 'react';
import { CreditCard as CardIcon } from 'lucide-react';
import PaymentMethodModal from './PaymentMethodModal';
const PaymentDetails = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Active Card</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Card ending in •••• 8428
            </span>
          </div>
          <button onClick={() => setIsPaymentModalOpen(true)} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Change card
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Mode of Payment</h3>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="monthly"
            name="payment-mode"
            className="text-blue-600 focus:ring-blue-500"
            checked
            readOnly
          />
          <label htmlFor="monthly" className="text-sm text-gray-600 dark:text-gray-300">
            Your card will be charged for monthly subscription
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Credit Balance</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
            <span className="mr-1">+</span> Add credit
          </button>
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">$ 0.00</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Billing Address</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
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