import { Invoice, EarningTrend, UserStats, ClientStats } from '@/types';

export const mockInvoices: Invoice[] = [
    {
        id: 'INV-001',
        clientName: 'Acme Corp',
        clientEmail: 'billing@acme.com',
        project: 'Website Redesign',
        amount: 3500,
        currency: 'USD',
        dueDate: '2026-04-15',
        issuedDate: '2026-03-25',
        status: 'paid',
        stellarWallet: 'GD...V2KJ',
    },
    {
        id: 'INV-002',
        clientName: 'Stellar Labs',
        clientEmail: 'payments@stellar.org',
        project: 'Smart Contract Audit',
        amount: 5000,
        currency: 'XLM',
        dueDate: '2026-04-10',
        issuedDate: '2026-03-20',
        status: 'pending',
        stellarWallet: 'GA...XLM1',
    },
    {
        id: 'INV-003',
        clientName: 'Nebula UI',
        clientEmail: 'contact@nebulaui.io',
        project: 'Component Library',
        amount: 2200,
        currency: 'USD',
        dueDate: '2026-03-05',
        issuedDate: '2026-02-15',
        status: 'overdue',
        notes: 'Awaiting signature from client side.',
    },
    {
        id: 'INV-004',
        clientName: 'Web3 Ventures',
        clientEmail: 'finance@web3v.com',
        project: 'Tokenomics Consulting',
        amount: 7500,
        currency: 'USDC',
        dueDate: '2026-04-20',
        issuedDate: '2026-03-28',
        status: 'paid',
    },
    {
        id: 'INV-005',
        clientName: 'Flash Feed',
        clientEmail: 'admin@flashfeed.co',
        project: 'Social Media Management',
        amount: 1200,
        currency: 'USD',
        dueDate: '2026-05-01',
        issuedDate: '2026-04-01',
        status: 'pending',
    }
];

export const mockEarningTrends: EarningTrend[] = [
    { month: 'Oct', amount: 4500 },
    { month: 'Nov', amount: 5200 },
    { month: 'Dec', amount: 3800 },
    { month: 'Jan', amount: 6500 },
    { month: 'Feb', amount: 4800 },
    { month: 'Mar', amount: 8200 },
    { month: 'Apr', amount: 9500 },
];

export const mockUserStats: UserStats = {
    totalEarnings: 42500,
    pendingAmount: 6200,
    overdueAmount: 2200,
    paidInvoices: 18,
    monthlyGrowth: 12.5,
    healthScore: 84
};

export const mockClientStats: ClientStats[] = [
    { name: 'Acme Corp', totalPaid: 15000, invoiceCount: 5 },
    { name: 'Web3 Ventures', totalPaid: 12500, invoiceCount: 3 },
    { name: 'Stellar Labs', totalPaid: 8000, invoiceCount: 2 },
    { name: 'Nebula UI', totalPaid: 4400, invoiceCount: 3 },
    { name: 'Flash Feed', totalPaid: 2600, invoiceCount: 5 },
];
