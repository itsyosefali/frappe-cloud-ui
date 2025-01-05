export interface Invoice {
    id: string;
    number: string;
    status: 'paid' | 'pending' | 'overdue';
    date: string;
    total: number;
    amountPaid: number;
    amountDue: number;
    downloadUrl: string;
  }