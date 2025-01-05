import React,{useState} from 'react';
import { Calendar, CreditCard } from 'lucide-react';
import UsageModal from './UsageModal';
const RecurringCharges = () => {
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recurring Charges</h3>
      
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
        <span>Next charge date — Dec 31, 2024</span>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center text-sm gap-1">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-gray-600">Current billing amount so far is</span>
          </div>
          <span className="font-medium text-gray-900 text-lg sm:ml-1">$ 74.52</span>
        </div>
        <button   onClick={() => setIsUsageModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          View Invoice
        </button>
      </div>
      {isUsageModalOpen && (
        <UsageModal onClose={() => setIsUsageModalOpen(false)} />
      )}
    </div>
  );
};

export default RecurringCharges;