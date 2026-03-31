'use client';

import React from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Clock,
    CheckCircle2,
    ChevronRight,
    Plus,
    ArrowUpRight,
    Heart
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { mockUserStats, mockEarningTrends, mockInvoices } from '@/lib/mockData';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's how your creative business is performing.</p>
                </div>
                <Link href="/dashboard/invoices/new" style={{
                    background: 'var(--primary-color)',
                    padding: '0.75rem 1.75rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: 'white',
                    boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.3)'
                }}>
                    <Plus size={20} strokeWidth={3} /> Create Invoice
                </Link>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem'
            }}>
                <StatCard
                    title="Total Earnings"
                    value={`$${mockUserStats.totalEarnings.toLocaleString()}`}
                    trend={`${mockUserStats.monthlyGrowth}%`}
                    isPositive={true}
                    icon={<DollarSign color="var(--primary-color)" size={20} />}
                />
                <StatCard
                    title="Pending Payments"
                    value={`$${mockUserStats.pendingAmount.toLocaleString()}`}
                    trend="2 active"
                    isPositive={null}
                    icon={<Clock color="var(--accent-color)" size={20} />}
                />
                <StatCard
                    title="Overdue"
                    value={`$${mockUserStats.overdueAmount.toLocaleString()}`}
                    trend="1 critical"
                    isPositive={false}
                    icon={<TrendingDown color="var(--danger-color)" size={20} />}
                />
                <HealthScoreCard score={mockUserStats.healthScore} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Revenue Chart */}
                <div className="glass" style={{ padding: '2rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>Revenue Trends</h3>
                        <select className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)' }}>
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>

                    <div style={{ flex: 1, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockEarningTrends}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(23, 23, 26, 0.95)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        color: 'white'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="var(--primary-color)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Invoices */}
                <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>Recent Activity</h3>
                        <Link href="/dashboard/invoices" style={{ fontSize: '0.875rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {mockInvoices.slice(0, 4).map((invoice) => (
                            <div key={invoice.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: invoice.status === 'paid' ? 'var(--secondary-color)' : (invoice.status === 'overdue' ? 'var(--danger-color)' : 'var(--accent-color)')
                                    }}></div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{invoice.clientName}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{invoice.project}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>${invoice.amount}</p>
                                    <p style={{ fontSize: '0.7rem', color: invoice.status === 'paid' ? 'var(--secondary-color)' : 'var(--text-muted)' }}>
                                        {invoice.status.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="glass" style={{
                        marginTop: 'auto',
                        padding: '1.25rem',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.1)',
                        borderRadius: '16px'
                    }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <ArrowUpRight size={16} color="var(--secondary-color)" />
                            Upcoming Payment
                        </p>
                        <p style={{ fontSize: '1.125rem', fontWeight: 700 }}>$5,000 Expected</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From Stellar Labs in 10 days</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, isPositive, icon }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass"
            style={{ padding: '1.5rem', transition: 'var(--transition-base)' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                    {icon}
                </div>
                {isPositive !== null && (
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isPositive ? 'var(--secondary-color)' : 'var(--danger-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trend}
                    </div>
                )}
                {isPositive === null && trend && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{trend}</div>
                )}
            </div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</h4>
            <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{value}</p>
        </motion.div>
    );
}

function HealthScoreCard({ score }: { score: number }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass"
            style={{
                padding: '1.5rem',
                transition: 'var(--transition-base)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.2)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--primary-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Heart size={20} color="white" />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)' }}>Good Health</div>
            </div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Health Score</h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{score}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>/ 100</p>
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '0.75rem' }}>
                <div style={{ width: `${score}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '2px' }} />
            </div>
        </motion.div>
    );
}
