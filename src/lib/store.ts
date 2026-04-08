/**
 * store.ts — InvoiceIQ Central Data Store
 *
 * All persistent application data (invoices, clients, profile, settings)
 * is stored in localStorage via this module.
 *
 * Structure:
 *  invoiceiq:invoices  → Invoice[]
 *  invoiceiq:clients   → Client[]
 *  invoiceiq:profile   → UserProfile
 *  invoiceiq:settings  → AppSettings
 */

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

export interface InvoiceItem {
    id: string;
    description: string;
    rate: number;
    quantity: number;
}

export interface Invoice {
    id: string;
    clientName: string;
    clientEmail: string;
    project: string;
    items: InvoiceItem[];
    amount: number;
    currency: string;
    dueDate: string;
    issuedDate: string;
    status: InvoiceStatus;
    stellarWallet?: string;
    notes?: string;
    createdAt: string;
}

export interface Client {
    id: string;
    name: string;
    email: string;
    stellarWallet?: string;
    company?: string;
    phone?: string;
    createdAt: string;
}

export interface UserProfile {
    name: string;
    email: string;
    stellarWallet?: string;
    businessName?: string;
    currency: string;
}

export interface AppSettings {
    defaultCurrency: string;
    defaultDueDays: number;
    autoConnectWallet: boolean;
    preferUSDC: boolean;
}

const KEYS = {
    invoices: 'invoiceiq:invoices',
    clients: 'invoiceiq:clients',
    profile: 'invoiceiq:profile',
    settings: 'invoiceiq:settings',
};

function read<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function write<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
}

// ─── Invoices ────────────────────────────────────────────────────────────────

export function getInvoices(): Invoice[] {
    return read<Invoice[]>(KEYS.invoices, []);
}

export function saveInvoice(invoice: Invoice): void {
    const all = getInvoices();
    const idx = all.findIndex(i => i.id === invoice.id);
    if (idx >= 0) {
        all[idx] = invoice;
    } else {
        all.unshift(invoice);
    }
    write(KEYS.invoices, all);
}

export function deleteInvoice(id: string): void {
    write(KEYS.invoices, getInvoices().filter(i => i.id !== id));
}

export function updateInvoiceStatus(id: string, status: InvoiceStatus): void {
    const all = getInvoices();
    const inv = all.find(i => i.id === id);
    if (inv) {
        inv.status = status;
        write(KEYS.invoices, all);
    }
}

export function nextInvoiceId(): string {
    const all = getInvoices();
    const nums = all
        .map(i => parseInt(i.id.replace('INV-', ''), 10))
        .filter(n => !isNaN(n));
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `INV-${String(next).padStart(3, '0')}`;
}

// ─── Clients ─────────────────────────────────────────────────────────────────

export function getClients(): Client[] {
    return read<Client[]>(KEYS.clients, []);
}

export function saveClient(client: Client): void {
    const all = getClients();
    const idx = all.findIndex(c => c.id === client.id);
    if (idx >= 0) {
        all[idx] = client;
    } else {
        all.unshift(client);
    }
    write(KEYS.clients, all);
}

export function deleteClient(id: string): void {
    write(KEYS.clients, getClients().filter(c => c.id !== id));
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export function getProfile(): UserProfile {
    return read<UserProfile>(KEYS.profile, {
        name: '',
        email: '',
        currency: 'XLM',
        businessName: '',
    });
}

export function saveProfile(profile: UserProfile): void {
    write(KEYS.profile, profile);
}

// ─── Settings ────────────────────────────────────────────────────────────────

export function getSettings(): AppSettings {
    return read<AppSettings>(KEYS.settings, {
        defaultCurrency: 'XLM',
        defaultDueDays: 30,
        autoConnectWallet: true,
        preferUSDC: false,
    });
}

export function saveSettings(settings: AppSettings): void {
    write(KEYS.settings, settings);
}

// ─── Derived Analytics ───────────────────────────────────────────────────────

export interface DashboardStats {
    totalEarned: number;
    pendingAmount: number;
    overdueAmount: number;
    paidCount: number;
    pendingCount: number;
    overdueCount: number;
    draftCount: number;
    totalInvoices: number;
    healthScore: number;
    recentInvoices: Invoice[];
    clientStats: { name: string; totalPaid: number; invoiceCount: number }[];
    earningTrend: { month: string; amount: number }[];
}

export function getDashboardStats(): DashboardStats {
    const invoices = getInvoices();

    const paid = invoices.filter(i => i.status === 'paid');
    const pending = invoices.filter(i => i.status === 'pending');
    const overdue = invoices.filter(i => i.status === 'overdue');

    const totalEarned = paid.reduce((s, i) => s + i.amount, 0);
    const pendingAmount = pending.reduce((s, i) => s + i.amount, 0);
    const overdueAmount = overdue.reduce((s, i) => s + i.amount, 0);

    // Client stats from real invoices
    const clientMap: Record<string, { totalPaid: number; invoiceCount: number }> = {};
    for (const inv of invoices) {
        if (!clientMap[inv.clientName]) {
            clientMap[inv.clientName] = { totalPaid: 0, invoiceCount: 0 };
        }
        clientMap[inv.clientName].invoiceCount += 1;
        if (inv.status === 'paid') {
            clientMap[inv.clientName].totalPaid += inv.amount;
        }
    }
    const clientStats = Object.entries(clientMap)
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.totalPaid - a.totalPaid)
        .slice(0, 5);

    // Earning trend — last 6 months from real data
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return {
            month: d.toLocaleString('default', { month: 'short' }),
            year: d.getFullYear(),
            monthNum: d.getMonth(),
        };
    });
    const earningTrend = months.map(m => {
        const amount = paid
            .filter(inv => {
                const d = new Date(inv.issuedDate);
                return d.getFullYear() === m.year && d.getMonth() === m.monthNum;
            })
            .reduce((s, inv) => s + inv.amount, 0);
        return { month: m.month, amount };
    });

    // Health score: based on paid rate, diversity, no overdue
    const total = invoices.length;
    const paidRate = total > 0 ? paid.length / total : 1;
    const diversity = Math.min(clientStats.length / 5, 1);
    const overdueRatio = total > 0 ? 1 - overdue.length / total : 1;
    const healthScore = Math.round((paidRate * 50 + diversity * 30 + overdueRatio * 20) * 100) / 100;

    return {
        totalEarned,
        pendingAmount,
        overdueAmount,
        paidCount: paid.length,
        pendingCount: pending.length,
        overdueCount: overdue.length,
        draftCount: invoices.filter(i => i.status === 'draft').length,
        totalInvoices: invoices.length,
        healthScore: Math.min(Math.round(healthScore), 100),
        recentInvoices: invoices.slice(0, 5),
        clientStats,
        earningTrend,
    };
}
