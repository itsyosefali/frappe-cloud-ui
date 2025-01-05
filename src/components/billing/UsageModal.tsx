import React from 'react';
import { X } from 'lucide-react';

interface UsageModalProps {
  onClose: () => void;
}

const UsageModal = ({ onClose }: UsageModalProps) => {
  const usageData = [
    { description: 'Compute Hours', rate: '$0.12/hour', quantity: '240', amount: '$28.80' },
    { description: 'Storage', rate: '$0.05/GB', quantity: '500', amount: '$25.00' },
    { description: 'Data Transfer', rate: '$0.10/GB', quantity: '139.8', amount: '$13.98' },
  ];

  const total = usageData.reduce((sum, item) => sum + parseFloat(item.amount.replace('$', '')), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Total Usage for This Month</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usageData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.rate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Grand Total</p>
            <p className="text-xl font-semibold">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageModal;