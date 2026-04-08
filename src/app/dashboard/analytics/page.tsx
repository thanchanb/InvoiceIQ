'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp, BarChart2, PieChart as PieIcon, DollarSign, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Link from 'next/link';
import { getDashboardStats, getInvoices, type Invoice } from '@/lib/store';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

export default function AnalyticsPage() {
    const [stats, setStats] = useState<ReturnType<typeof getDashboardStats> | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const load = useCallback(() => {
        setStats(getDashboardStats());
        setInvoices(getInvoices());
    }, []);

    useEffect(() => {
        load();
        window.addEventListener('storage', load);
        return () => window.removeEventListener('storage', load);
    }, [load]);

    if (!stats) return null;

    const hasData = invoices.length > 0;
    const statusDist = [
        { name: 'Paid', value: stats.paidCount, color: '#10b981' },
        { name: 'Pending', value: stats.pendingCount, color: '#f59e0b' },
        { name: 'Overdue', value: stats.overdueCount, color: '#ef4444' },
        { name: 'Draft', value: stats.draftCount, color: '#94a3b8' },
    ].filter(d => d.value > 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Analytics</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {hasData
                        ? `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} · all figures derived from your real data`
                        : 'Your analytics will appear here once you create invoices.'}
                </p>
            </header>

            {/* Empty state */}
            {!hasData && (
                <div className="neo-raised" style={{ padding: '5rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)' }}>
                        <TrendingUp size={36} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No data yet</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                            Create and manage invoices to see your financial analytics here.
                        </p>
                    </div>
                    <Link href="/dashboard/invoices/new" style={{ padding: '0.85rem 2rem', background: 'var(--primary-color)', color: 'white', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={18} /> Create First Invoice
                    </Link>
                </div>
            )}

            {hasData && (
                <>
                    {/* KPI Strip */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {[
                            { label: 'Total Invoiced', value: (stats.totalEarned + stats.pendingAmount + stats.overdueAmount).toLocaleString(), suffix: '', icon: <DollarSign size={18} />, color: 'var(--accent-indigo)' },
                            { label: 'Total Collected', value: stats.totalEarned.toLocaleString(), suffix: '', icon: <TrendingUp size={18} />, color: 'var(--accent-green)' },
                            { label: 'Pending', value: stats.pendingAmount.toLocaleString(), suffix: '', icon: <BarChart2 size={18} />, color: 'var(--accent-amber)' },
                            { label: 'Health Score', value: String(stats.healthScore), suffix: '/100', icon: <PieIcon size={18} />, color: stats.healthScore >= 70 ? 'var(--accent-green)' : 'var(--accent-amber)' },
                        ].map(kpi => (
                            <div key={kpi.label} className="neo-raised" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px', background: kpi.color }} />
                                <div style={{ color: kpi.color, marginBottom: '1rem' }}>{kpi.icon}</div>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>{kpi.label}</p>
                                <p className="mono" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                                    {kpi.value}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '2px' }}>{kpi.suffix}</span>
                                </p>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        {/* Revenue trend */}
                        <section className="neo-raised" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.75rem' }}>Revenue by Month (Paid Invoices)</h3>
                            {stats.earningTrend.every(d => d.amount === 0) ? (
                                <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                                        Mark invoices as <strong>paid</strong> to see your revenue trend.
                                    </p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={stats.earningTrend}>
                                        <defs>
                                            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                        <YAxis hide />
                                        <Tooltip contentStyle={{ background: 'var(--surface-color)', border: '0.5px solid rgba(99,102,241,0.2)', borderRadius: '10px', color: 'var(--text-primary)' }} />
                                        <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fill="url(#rev)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </section>

                        {/* Status distribution */}
                        <section className="neo-raised" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.75rem' }}>Invoice Status</h3>
                            {statusDist.length === 0 ? (
                                <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No invoices yet.</p>
                                </div>
                            ) : (
                                <>
                                    <ResponsiveContainer width="100%" height={180}>
                                        <PieChart>
                                            <Pie data={statusDist} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                                                {statusDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip contentStyle={{ background: 'var(--surface-color)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                                        {statusDist.map(d => (
                                            <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color }} />
                                                    {d.name}
                                                </div>
                                                <span style={{ fontWeight: 700 }}>{d.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>
                    </div>

                    {/* Top clients bar chart */}
                    {stats.clientStats.length > 0 && (
                        <section className="neo-raised" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.75rem' }}>Top Clients by Revenue Collected</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={stats.clientStats} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ background: 'var(--surface-color)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--text-primary)' }} />
                                    <Bar dataKey="totalPaid" name="Revenue" radius={[0, 6, 6, 0]}>
                                        {stats.clientStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
