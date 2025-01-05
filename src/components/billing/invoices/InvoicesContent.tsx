import React, { useState } from 'react';
import InvoiceTable from './InvoiceTable';
import InvoiceFilters from './InvoiceFilters';
import { useInvoices } from '../../../hooks/useInvoices.ts';

const InvoicesContent = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState('');
  
  const { invoices, isLoading } = useInvoices();

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.number.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status ? invoice.status === status : true;
    // Add date range filtering logic here
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <InvoiceFilters
        search={search}
        status={status}
        dateRange={dateRange}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onDateRangeChange={setDateRange}
      />
      
      <div className="bg-white shadow-sm rounded-lg border">
        <InvoiceTable invoices={filteredInvoices} />
      </div>
    </div>
  );
};

export default InvoicesContent;