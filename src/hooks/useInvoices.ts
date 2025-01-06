import { useState, useEffect } from 'react';
import { Invoice } from '../types/billing';

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-001',
    status: 'paid',
    date: '2024-03-01',
    total: 1299.99,
    amountPaid: 1299.99,
    amountDue: 0,
    downloadUrl: '#',
  },
  {
    id: '2',
    number: 'INV-002',
    status: 'pending',
    date: '2024-03-15',
    total: 899.99,
    amountPaid: 0,
    amountDue: 899.99,
    downloadUrl: '#',
  },
  {
    id: '3',
    number: 'INV-003',
    status: 'overdue',
    date: '2024-02-15',
    total: 1599.99,
    amountPaid: 800,
    amountDue: 799.99,
    downloadUrl: '#',
  },
];

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setInvoices(mockInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return { invoices, isLoading };
};