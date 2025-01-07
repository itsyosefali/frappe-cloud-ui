import React, { useState } from 'react';
import BillingTabs from '../components/billing/BillingTabs';
import BillingOverview from '../components/billing/BillingOverview';
import InvoicesContent from '../components/billing/invoices/InvoicesContent';

const Billing = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <BillingOverview />;
      case 'invoices':
        return <InvoicesContent/>;
      case 'balance':
        return <div>Balance Content</div>;
      case 'payment-methods':
        return <div>Payment Methods Content</div>;
      case 'marketplace':
        return <div>Marketplace Payouts Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Billing</h1>
      <BillingTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Billing;