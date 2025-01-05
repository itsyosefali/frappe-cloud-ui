import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface PaymentMethodModalProps {
  onClose: () => void;
}

const PaymentMethodModal = ({ onClose }: PaymentMethodModalProps) => {
  const [showAddCard, setShowAddCard] = useState(false);

  const savedCards = [
    { id: 1, holder: 'John Doe', number: '4242', expiry: '12/24', isActive: true },
    { id: 2, holder: 'John Doe', number: '5555', expiry: '09/25', isActive: false },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {showAddCard ? 'Add New Card' : 'Choose Payment Method'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!showAddCard ? (
          <>
            <div className="space-y-4">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`p-4 border rounded-lg ${
                    card.isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Card ending in {card.number}</p>
                      <p className="text-sm text-gray-500">
                        {card.holder} • Expires {card.expiry}
                      </p>
                    </div>
                    {card.isActive ? (
                      <span className="text-sm font-medium text-blue-600">Active</span>
                    ) : (
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        Make Active
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAddCard(true)}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Card
            </button>
          </>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cardholder Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="4242 4242 4242 4242"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="123"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowAddCard(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Card
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodModal;