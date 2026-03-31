'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import {
    mockClientStats,
    mockEarningTrends,
    mockUserStats
} from '@/lib/mockData';
import {
    TrendingUp,
    Users,
    Calendar,
    Award,
    ArrowUpRight,
    TrendingDown,
    Info
} from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

export default function AnalyticsPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Income Analytics</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Deep dive into your earning patterns and client performance.</p>
            </header>

            {/* Analytics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>

                {/* Client Performance */}
                <div className="glass" style={{ padding: '2rem', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Users size={20} color="var(--primary-color)" /> Client Revenue Distribution
                        </h3>
                    </div>

                    <div style={{ flex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockClientStats} layout="vertical" margin={{ left: 40, right: 40 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{
                                        background: 'rgba(23, 23, 26, 0.95)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        color: 'white'
                                    }}
                                />
                                <Bar
                                    dataKey="totalPaid"
                                    fill="var(--primary-color)"
                                    radius={[0, 10, 10, 0]}
                                    barSize={20}
                                >
                                    {mockClientStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Financial Health Score (Detailed) */}
                <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)' }}>
                    <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Award size={20} color="var(--accent-color)" /> Financial Health
                    </h3>

                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '8px solid rgba(255,255,255,0.03)',
                            borderTopColor: 'var(--primary-color)',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800 }}>84</span>
                            <span style={{ position: 'absolute', bottom: '-20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)' }}>OPTIMIZED</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <HealthMetric label="Income Diversity" score={92} />
                        <HealthMetric label="Payment Punctuality" score={78} />
                        <HealthMetric label="Project Profitability" score={88} />
                    </div>

                    <div className="glass" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Info size={16} /> Strategy Tip
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            Your reliance on 1 client (Acme Corp) is 35%. Good diversity, but try to find one more enterprise client this quarter.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                <div className="glass" style={{ padding: '2rem' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>Best Month</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <p style={{ fontSize: '2rem', fontWeight: 800 }}>APRIL</p>
                        <div style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary-color)', fontSize: '0.75rem', fontWeight: 700 }}>+24% vs avg</div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Consistent peak in Q2 each year.</p>
                </div>

                <div className="glass" style={{ padding: '2rem' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>Avg. Project Fee</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <p style={{ fontSize: '2rem', fontWeight: 800 }}>$3,840</p>
                        <div style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary-color)', fontSize: '0.75rem', fontWeight: 700 }}>+12% vs LY</div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Yielding highest per hour on Consulting.</p>
                </div>

                <div className="glass" style={{ padding: '2rem' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>Retention Rate</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <p style={{ fontSize: '2rem', fontWeight: 800 }}>92%</p>
                        <div style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary-color)', fontSize: '0.75rem', fontWeight: 700 }}>Excellent</div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>11/12 clients returned for new work.</p>
                </div>
            </div>
        </div>
    );
}

function HealthMetric({ label, score }: { label: string, score: number }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 700 }}>{score}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                    style={{ width: `${score}%`, height: '100%', background: score > 85 ? 'var(--secondary-color)' : 'var(--primary-color)', borderRadius: '3px' }}
                />
            </div>
        </div>
    );
}
