import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';

interface InvoiceFiltersProps {
  search: string;
  status: string;
  dateRange: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
}

const InvoiceFilters = ({
  search,
  status,
  dateRange,
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
}: InvoiceFiltersProps) => {
  return (
    <div className="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:w-auto md:flex md:space-x-4">
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full md:w-40"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </Select>

        <div className="relative">
          <Select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full md:w-48 pl-9"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </Select>
          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default InvoiceFilters;