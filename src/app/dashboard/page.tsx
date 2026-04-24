'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    DollarSign,
    CheckCircle,
    AlertCircle,
    Activity,
    Zap,
    Target,
    ShieldCheck,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    ExternalLink,
    Plus,
    FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { getAccountBalance, fetchTransactionHistory } from '@/lib/stellar';
import { getDashboardStats, type DashboardStats } from '@/lib/store';

export default function DashboardOverview() {
    const { address, isConnected } = useWallet();
    const [balance, setBalance] = useState('0.00');
    const [transactions, setTransactions] = useState<Array<{ id: string; hash: string; ledger_attr: number; created_at: string; fee_charged: string | number }>>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    // Load real data from store
    const loadStats = useCallback(() => {
        setStats(getDashboardStats());
    }, []);

    useEffect(() => {
        loadStats();
        // Re-sync if localStorage changes in another tab
        window.addEventListener('storage', loadStats);
        return () => window.removeEventListener('storage', loadStats);
    }, [loadStats]);

    // Load Stellar on-chain data when wallet connected
    useEffect(() => {
        if (!isConnected || !address) return;

        setLoading(true);
        Promise.all([getAccountBalance(address), fetchTransactionHistory(address)])
            .then(([bal, txs]) => { setBalance(bal); setTransactions(txs); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [address, isConnected]);

    if (!stats) return null;

    const displayBalance = isConnected
        ? `${parseFloat(balance).toFixed(2)} XLM`
        : stats.totalEarned > 0 ? `$${stats.totalEarned.toLocaleString()}` : '—';

    const hasInvoices = stats.totalInvoices > 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

            {/* Empty state CTA */}
            {!hasInvoices && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="neo-raised"
                    style={{
                        padding: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        textAlign: 'center',
                        borderTop: '2px solid rgba(99,102,241,0.3)',
                    }}
                >
                    <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)' }}>
                        <FileText size={32} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome to InvoiceIQ</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px' }}>
                            You have no invoices yet. Create your first invoice to start tracking your freelance income.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/invoices/new"
                        style={{
                            padding: '0.9rem 2rem',
                            background: 'var(--primary-color)',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            boxShadow: '0 10px 30px -5px rgba(99,102,241,0.35)',
                        }}
                    >
                        <Plus size={18} /> Create First Invoice
                    </Link>
                </motion.div>
            )}

            {/* 4 Hero Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                <HeroCard
                    title={isConnected ? 'Testnet Balance' : 'Total Earned'}
                    value={displayBalance}
                    trend={stats.totalEarned > 0 ? null : null}
                    isPositive={true}
                    icon={loading
                        ? <RefreshCw className="animate-spin" size={22} />
                        : isConnected ? <RefreshCw size={22} /> : <DollarSign size={22} />}
                    isLive={isConnected}
                />
                <HeroCard
                    title="Invoices Paid"
                    value={String(stats.paidCount)}
                    trend={stats.paidCount > 0 ? `${stats.paidCount} total` : null}
                    isPositive={true}
                    icon={<CheckCircle size={22} />}
                />
                <HeroCard
                    title="Overdue"
                    value={String(stats.overdueCount).padStart(2, '0')}
                    trend={stats.overdueCount > 0 ? `+${stats.overdueCount}` : null}
                    isPositive={false}
                    icon={<AlertCircle size={22} />}
                    isPulsing={stats.overdueCount > 0}
                />
                <HeroCard
                    title="Health Score"
                    value={hasInvoices ? String(stats.healthScore) : '—'}
                    trend={hasInvoices ? 'Calculated' : 'No data yet'}
                    isPositive={null}
                    icon={<Activity size={22} />}
                />
            </div>

            {hasInvoices && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '3rem' }}>
                        {/* Health Score */}
                        <section className="neo-raised" style={{ padding: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Protocol Health Score</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Based on your real invoice & payment data.</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)' }}>{stats.healthScore}</span>
                                    <span className="mono" style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/100</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: '180px', marginBottom: '2.5rem' }}>
                                <svg width="240" height="150" viewBox="0 0 240 120">
                                    <path d="M 20 110 A 90 90 0 0 1 220 110" fill="none" stroke="var(--shadow-dark)" strokeWidth="18" strokeLinecap="round" />
                                    <motion.path
                                        d="M 20 110 A 90 90 0 0 1 220 110"
                                        fill="none"
                                        stroke="url(#healthGradient)"
                                        strokeWidth="18"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: '314 314', strokeDashoffset: '314' }}
                                        animate={{ strokeDashoffset: String(314 - (314 * stats.healthScore) / 100) }}
                                        transition={{ duration: 1.5, ease: 'easeOut' }}
                                    />
                                    <defs>
                                        <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="var(--accent-red)" />
                                            <stop offset="50%" stopColor="var(--accent-amber)" />
                                            <stop offset="100%" stopColor="var(--accent-green)" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '1.5rem' }}>
                                    <InsightChip icon={<Target size={14} />} label="Income Consistency" />
                                    <InsightChip icon={<ShieldCheck size={14} />} label="Client Diversity" />
                                </div>
                            </div>
                            <div className="neo-inset" style={{ padding: '1.2rem 1.5rem', background: 'var(--surface-color)', borderRadius: '12px' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Zap size={16} fill="var(--accent-amber)" />
                                    <span>
                                        {stats.overdueCount > 0
                                            ? `${stats.overdueCount} overdue invoice${stats.overdueCount > 1 ? 's' : ''} — follow up to improve your score.`
                                            : stats.clientStats.length < 3
                                                ? 'Diversify your client base to improve your health score.'
                                                : 'Great work! Keep invoicing regularly to maintain your score.'}
                                    </span>
                                </p>
                            </div>
                        </section>

                        {/* Top Clients */}
                        <section className="neo-raised" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>Top Clients</h3>
                            {stats.clientStats.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '3rem' }}>No client data yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {stats.clientStats.map((c) => (
                                        <ClientRank
                                            key={c.name}
                                            name={c.name}
                                            amount={c.totalPaid}
                                            percent={stats.clientStats[0].totalPaid > 0
                                                ? Math.round((c.totalPaid / stats.clientStats[0].totalPaid) * 100)
                                                : 0}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Earnings Chart */}
                    <section className="neo-raised" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>Revenue Terminal</h3>
                            <div className="neo-inset mono" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                                TOTAL_EARNED: <span style={{ color: 'var(--accent-green)' }}>${stats.totalEarned.toLocaleString()}</span>
                            </div>
                        </div>
                        {stats.earningTrend.every(d => d.amount === 0) ? (
                            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mark invoices as paid to see your revenue trend.</p>
                            </div>
                        ) : (
                            <div style={{ width: '100%', height: '280px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.earningTrend}>
                                        <defs>
                                            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'var(--surface-color)',
                                                boxShadow: '8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light)',
                                                border: '0.5px solid rgba(0, 255, 178, 0.2)',
                                                borderRadius: '12px',
                                                color: 'var(--text-primary)',
                                                fontFamily: 'JetBrains Mono'
                                            }}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="var(--accent-green)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" animationDuration={2000} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </section>
                </>
            )}

            {/* Recent invoices / on-chain activity */}
            <section className="neo-inset" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{isConnected ? 'On-Chain Activity' : 'Latest Invoices'}</h3>
                    <Link href="/dashboard/invoices" style={{ fontSize: '0.85rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        VIEW_ALL <ChevronRight size={14} />
                    </Link>
                </div>

                {isConnected && transactions.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {['HASH', 'LEDGER', 'TIMESTAMP', 'FEE', 'ACTION'].map(h => (
                                    <th key={h} style={{ paddingBottom: '1.2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="mono">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td className="mono" style={{ padding: '1.5rem 0', fontSize: '0.85rem', color: 'var(--accent-green)' }}>{tx.hash.slice(0, 8)}...</td>
                                    <td className="mono" style={{ padding: '1.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>#{tx.ledger_attr}</td>
                                    <td className="mono" style={{ padding: '1.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(tx.created_at).toLocaleDateString()}</td>
                                    <td className="mono" style={{ padding: '1.5rem 0', fontSize: '0.9rem', fontWeight: 700 }}>{tx.fee_charged} XLM</td>
                                    <td style={{ padding: '1.5rem 0' }}>
                                        <a href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`} target="_blank" className="badge-neo badge-paid" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', width: 'fit-content' }}>
                                            DETAILS <ExternalLink size={12} />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : !hasInvoices ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No invoices yet. <Link href="/dashboard/invoices/new" style={{ color: 'var(--accent-indigo)' }}>Create one →</Link></p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {['ENTITY', 'UID', 'TIMESTAMP', 'VOLUME', 'STATUS'].map(h => (
                                    <th key={h} style={{ paddingBottom: '1.2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="mono">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentInvoices.map((inv) => (
                                <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '1.5rem 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, boxShadow: '4px 4px 8px var(--shadow-dark), -4px -4px 8px var(--shadow-light)' }}>
                                                {inv.clientName.charAt(0)}
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{inv.clientName}</span>
                                        </div>
                                    </td>
                                    <td className="mono" style={{ padding: '1.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{inv.id}</td>
                                    <td className="mono" style={{ padding: '1.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{inv.issuedDate}</td>
                                    <td className="mono" style={{ padding: '1.5rem 0', fontSize: '0.9rem', fontWeight: 700 }}>{inv.amount.toLocaleString()} {inv.currency}</td>
                                    <td style={{ padding: '1.5rem 0' }}>
                                        <span className={`badge-neo badge-${inv.status}`}>{inv.status.toUpperCase()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

function HeroCard({ title, value, trend, isPositive, icon, isPulsing = false, isLive = false }: {
    title: string; value: string; trend?: string | null; isPositive: boolean | null; icon: React.ReactNode; isPulsing?: boolean; isLive?: boolean;
}) {
    return (
        <div className={`neo-raised ${isPulsing ? 'glow-red' : ''} ${isLive ? 'glow-green' : ''}`} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px', background: isLive ? 'var(--accent-green)' : (isPositive ? 'var(--accent-green)' : (isPositive === false ? 'var(--accent-red)' : 'var(--accent-indigo)')), opacity: 0.8 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ color: isLive ? 'var(--accent-green)' : (isPositive === null ? 'var(--accent-indigo)' : (isPositive ? 'var(--accent-green)' : 'var(--accent-red)')) }}>
                    {icon}
                </div>
                {trend && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '0.2rem' }} className="mono">
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend}
                    </div>
                )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>{title}</p>
            <p className="mono" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{value}</p>
            {isPulsing && (
                <motion.div
                    animate={{ opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: '8px', height: '8px', background: 'var(--accent-red)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-red)' }}
                />
            )}
        </div>
    );
}

function InsightChip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--text-secondary)' }} className="neo-inset">
            {icon}{label}
        </div>
    );
}

function ClientRank({ name, amount, percent }: { name: string; amount: number; percent: number }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                <span>{name}</span>
                <span className="mono" style={{ color: 'var(--text-secondary)' }}>${amount.toLocaleString()}</span>
            </div>
            <div style={{ width: '100%', height: '8px', borderRadius: '100px' }} className="neo-inset">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: '100px', background: 'var(--accent-green)', boxShadow: '0 0 8px rgba(0,255,178,0.3)' }}
                />
            </div>
        </div>
    );
}
