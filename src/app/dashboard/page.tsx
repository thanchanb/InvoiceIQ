'use client';

import React from 'react';
import {
    DollarSign,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Activity,
    Zap,
    Target,
    ShieldCheck
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

const mockEarningData = [
    { month: 'Oct', amount: 3200 },
    { month: 'Nov', amount: 4800 },
    { month: 'Dec', amount: 4100 },
    { month: 'Jan', amount: 5600 },
    { month: 'Feb', amount: 6200 },
    { month: 'Mar', amount: 7500 },
];

const mockRecentInvoices = [
    { id: 'INV-001', client: 'Acme Corp', initials: 'AC', date: 'Mar 24', amount: 3500, status: 'paid' },
    { id: 'INV-002', client: 'Stellar Labs', initials: 'SL', date: 'Mar 28', amount: 5000, status: 'pending' },
    { id: 'INV-003', client: 'Nebula UI', initials: 'NU', date: 'Mar 15', amount: 2200, status: 'overdue' },
    { id: 'INV-004', client: 'Web3 Ventures', initials: 'WV', date: 'Mar 30', amount: 7500, status: 'paid' },
];

export default function DashboardOverview() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

            {/* 4 Hero Metric Cards (Mono Numbers) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                <HeroCard
                    title="Total Earned"
                    value="$42,500.00"
                    trend="+12.5%"
                    isPositive={true}
                    icon={<DollarSign size={22} />}
                />
                <HeroCard
                    title="Invoices Paid"
                    value="24"
                    trend="+4"
                    isPositive={true}
                    icon={<CheckCircle size={22} />}
                    hasSparkline={true}
                />
                <HeroCard
                    title="Overdue"
                    value="03"
                    trend="+1"
                    isPositive={false}
                    icon={<AlertCircle size={22} />}
                    isPulsing={true}
                />
                <HeroCard
                    title="Health Score"
                    value="84"
                    trend="Steady"
                    isPositive={null}
                    icon={<Activity size={22} />}
                    isGauge={true}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '3rem' }}>
                {/* Financial Health Panel (Arc Gauge) */}
                <section className="neo-raised" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Protocol Health Score</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Audit of your financial velocity and diversification.</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)' }}>84</span>
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
                                animate={{ strokeDashoffset: '50' }} // ~84%
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

                    <div style={{ padding: '1.2rem 1.5rem', background: 'var(--surface-color)', borderRadius: '12px', border: '0.5px solid rgba(245, 166, 35, 0.2)' }} className="neo-inset">
                        <p style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Zap size={16} fill="var(--accent-amber)" />
                            <span>Smart Tip: You rely on 1 client for 80% of income — time to diversify.</span>
                        </p>
                    </div>
                </section>

                {/* Best Clients (Ranked List) */}
                <section className="neo-raised" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>Terminal Top Clients</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <ClientRank name="Acme Corp" amount={24500} percent={85} />
                        <ClientRank name="Stellar Labs" amount={18200} percent={65} />
                        <ClientRank name="Web3 Ventures" amount={12400} percent={45} />
                        <ClientRank name="Digital Nomads" amount={8900} percent={30} />
                    </div>
                </section>
            </div>

            {/* Earnings Chart (Smooth Area Chart) */}
            <section className="neo-raised" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Revenue Terminal</h3>
                    <div className="neo-inset mono" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                        TOTAL_VOLUME_6M: <span style={{ color: 'var(--accent-green)' }}>$31,400.00</span>
                    </div>
                </div>
                <div style={{ width: '100%', height: '320px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockEarningData}>
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                            />
                            <YAxis
                                hide
                            />
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
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="var(--accent-green)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAmt)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Inset Table: Recent Invoices */}
            <section className="neo-inset" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Latest Transmissions</h3>
                    <Link href="/dashboard/invoices" style={{ fontSize: '0.85rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        VIEW_ALL_RECORDS <ChevronRight size={14} />
                    </Link>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <th style={{ paddingBottom: '1.2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="mono">ENTITY</th>
                            <th style={{ paddingBottom: '1.2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="mono">UID</th>
                            <th style={{ paddingBottom: '1.2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="mono">TIMESTAMP</th>
                            <th style={{ paddingBottom: '1.2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="mono">VOLUME</th>
                            <th style={{ paddingBottom: '1.2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="mono">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockRecentInvoices.map(invoice => (
                            <tr key={invoice.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                <td style={{ padding: '1.5rem 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'var(--surface-color)',
                                            boxShadow: '4px 4px 8px var(--shadow-dark), -4px -4px 8px var(--shadow-light)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>
                                            {invoice.initials}
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{invoice.client}</span>
                                    </div>
                                </td>
                                <td className="mono" style={{ padding: '1.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{invoice.id}</td>
                                <td className="mono" style={{ padding: '1.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{invoice.date}</td>
                                <td className="mono" style={{ padding: '1.5rem 0', fontSize: '0.9rem', fontWeight: 700 }}>${invoice.amount.toLocaleString()}</td>
                                <td style={{ padding: '1.5rem 0' }}>
                                    <span className={`badge-neo badge-${invoice.status}`}>
                                        {invoice.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

        </div>
    );
}

function HeroCard({ title, value, trend, isPositive, icon, isPulsing = false, hasSparkline = false, isGauge = false }: any) {
    return (
        <div className={`neo-raised ${isPulsing ? 'glow-red' : ''}`} style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Active Glow Bar */}
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px', background: isPositive ? 'var(--accent-green)' : (isPositive === false ? 'var(--accent-red)' : 'var(--accent-indigo)'), boxShadow: `0 0 10px ${isPositive ? 'var(--accent-green)' : 'var(--text-muted)'}`, opacity: 0.8 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                    color: isPositive === null ? 'var(--accent-indigo)' : (isPositive ? 'var(--accent-green)' : 'var(--accent-red)'),
                }}>
                    {icon}
                </div>
                {trend && (
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isPositive === null ? 'var(--text-muted)' : (isPositive ? 'var(--accent-green)' : 'var(--accent-red)'),
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                    }} className="mono">
                        {isPositive !== null && (isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />)}
                        {trend}
                    </div>
                )}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>{title}</p>
            <p className="mono" style={{ fontSize: '1.75rem', fontWeight: 800 }}>{value}</p>

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

function InsightChip({ icon, label }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--text-secondary)' }} className="neo-inset">
            {icon}
            {label}
        </div>
    );
}

function ClientRank({ name, amount, percent }: any) {
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
                    style={{ height: '100%', borderRadius: '100px', background: 'var(--accent-green)', boxShadow: '0 0 8px rgba(0, 255, 178, 0.3)' }}
                />
            </div>
        </div>
    );
}
