export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

export interface Invoice {
    id: string;
    clientName: string;
    clientEmail: string;
    project: string;
    amount: number;
    currency: string;
    dueDate: string;
    issuedDate: string;
    status: InvoiceStatus;
    stellarWallet?: string;
    notes?: string;
}

export interface UserStats {
    totalEarnings: number;
    pendingAmount: number;
    overdueAmount: number;
    paidInvoices: number;
    monthlyGrowth: number;
    healthScore: number;
}

export interface EarningTrend {
    month: string;
    amount: number;
}

export interface ClientStats {
    name: string;
    totalPaid: number;
    invoiceCount: number;
}
