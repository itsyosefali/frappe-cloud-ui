import React from 'react';
import RecurringCharges from './RecurringCharges';
import PaymentDetails from './PaymentDetails';

const BillingOverview = () => {
  return (
    <div className="space-y-6">
      <RecurringCharges />
      <PaymentDetails />
    </div>
  );
};

export default BillingOverview;