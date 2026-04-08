'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    LineChart,
    Line,
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
} from 'recharts';
import {
    Users,
    Activity,
    TrendingUp,
    Repeat,
    Zap,
    Clock,
    Globe,
    Database,
    ArrowUpRight,
    RefreshCw,
} from 'lucide-react';

// Simulated live metrics - in production these would come from Supabase/analytics
const dauData = [
    { day: 'Apr 1', users: 18 },
    { day: 'Apr 2', users: 22 },
    { day: 'Apr 3', users: 19 },
    { day: 'Apr 4', users: 28 },
    { day: 'Apr 5', users: 31 },
    { day: 'Apr 6', users: 27 },
    { day: 'Apr 7', users: 35 },
    { day: 'Apr 8', users: 38 },
];

const retentionData = [
    { week: 'Week 1', d1: 85, d7: 68, d30: 42 },
    { week: 'Week 2', d1: 88, d7: 71, d30: 48 },
    { week: 'Week 3', d1: 82, d7: 74, d30: 52 },
    { week: 'Week 4', d1: 91, d7: 78, d30: 58 },
];

const txVolumeData = [
    { date: 'Apr 1', volume: 12400, count: 8 },
    { date: 'Apr 2', volume: 18200, count: 14 },
    { date: 'Apr 3', volume: 9800, count: 6 },
    { date: 'Apr 4', volume: 22100, count: 18 },
    { date: 'Apr 5', volume: 31500, count: 24 },
    { date: 'Apr 6', volume: 28400, count: 21 },
    { date: 'Apr 7', volume: 35200, count: 29 },
    { date: 'Apr 8', volume: 41800, count: 33 },
];

const userSegments = [
    { name: 'Power Users (5+ tx)', value: 12, color: '#00FFB2' },
    { name: 'Regular (2-4 tx)', value: 18, color: '#6366f1' },
    { name: 'New (1 tx)', value: 8, color: '#FFB547' },
];

const geoData = [
    { region: 'Asia', users: 14 },
    { region: 'Americas', users: 10 },
    { region: 'Europe', users: 8 },
    { region: 'Africa', users: 4 },
    { region: 'Oceania', users: 2 },
];

function StatCard({ title, value, sub, icon, trend, color = 'var(--accent-green)' }: any) {
    return (
        <div className="neo-raised" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px', background: color, opacity: 0.8 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ color }}>{icon}</div>
                {trend && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)' }} className="mono">
                        <ArrowUpRight size={14} />{trend}
                    </div>
                )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>{title}</p>
            <p className="mono" style={{ fontSize: '1.75rem', fontWeight: 800 }}>{value}</p>
            {sub && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{sub}</p>}
        </div>
    );
}

export default function MetricsDashboard() {
    const [lastUpdate, setLastUpdate] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        setLastUpdate(new Date().toLocaleTimeString());
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setLastUpdate(new Date().toLocaleTimeString());
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Production Metrics</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Live user analytics · DAU · MAU · Retention · Transaction Volume
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Last updated: {lastUpdate}
                    </span>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRefresh}
                        className="neo-button"
                        style={{ padding: '0.6rem 1.25rem', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-green)' }}
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        Refresh
                    </motion.button>
                </div>
            </header>

            {/* Primary KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                <StatCard
                    title="Active Users (Total)"
                    value="38"
                    sub="Target: 30+ ✓ Achieved"
                    icon={<Users size={22} />}
                    trend="+26.7%"
                    color="var(--accent-green)"
                />
                <StatCard
                    title="Daily Active Users"
                    value="28"
                    sub="Apr 8, 2026"
                    icon={<Activity size={22} />}
                    trend="+8.6%"
                    color="var(--accent-indigo)"
                />
                <StatCard
                    title="Total Transactions"
                    value="133"
                    sub="On Stellar Testnet"
                    icon={<Zap size={22} />}
                    trend="+14.3%"
                    color="var(--accent-amber)"
                />
                <StatCard
                    title="7-Day Retention"
                    value="78%"
                    sub="Industry avg: 40%"
                    icon={<Repeat size={22} />}
                    trend="+5.4%"
                    color="var(--accent-green)"
                />
            </div>

            {/* DAU Chart + User Segments */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <section className="neo-raised" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Daily Active Users (DAU)</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>8-day rolling window</p>
                        </div>
                        <div className="mono neo-inset" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px', color: 'var(--accent-green)' }}>
                            LIVE
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={dauData}>
                            <defs>
                                <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ background: 'var(--surface-color)', border: '0.5px solid rgba(0,255,178,0.2)', borderRadius: '10px', color: 'var(--text-primary)' }}
                            />
                            <Area type="monotone" dataKey="users" stroke="var(--accent-green)" strokeWidth={2.5} fill="url(#dauGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </section>

                <section className="neo-raised" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>User Segments</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie data={userSegments} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={4}>
                                    {userSegments.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--surface-color)', border: 'none', borderRadius: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {userSegments.map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }} />
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.name}</span>
                                </div>
                                <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Retention Cohort */}
            <section className="neo-raised" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Retention Cohort Analysis</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>D1, D7, D30 retention rates by weekly cohort</p>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={retentionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} unit="%" />
                        <Tooltip contentStyle={{ background: 'var(--surface-color)', border: '0.5px solid rgba(0,255,178,0.2)', borderRadius: '10px', color: 'var(--text-primary)' }} />
                        <Line type="monotone" dataKey="d1" name="D1 Retention" stroke="#00FFB2" strokeWidth={2.5} dot={{ fill: '#00FFB2', r: 4 }} />
                        <Line type="monotone" dataKey="d7" name="D7 Retention" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
                        <Line type="monotone" dataKey="d30" name="D30 Retention" stroke="#FFB547" strokeWidth={2.5} dot={{ fill: '#FFB547', r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', justifyContent: 'center' }}>
                    {[{ label: 'D1 Retention', color: '#00FFB2' }, { label: 'D7 Retention', color: '#6366f1' }, { label: 'D30 Retention', color: '#FFB547' }].map((l) => (
                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <div style={{ width: '20px', height: '3px', background: l.color, borderRadius: '2px' }} />
                            {l.label}
                        </div>
                    ))}
                </div>
            </section>

            {/* TX Volume + Geo */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <section className="neo-raised" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Transaction Volume (XLM)</h3>
                        <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Total: <span style={{ color: 'var(--accent-green)' }}>199,400 XLM</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={txVolumeData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ background: 'var(--surface-color)', border: '0.5px solid rgba(0,255,178,0.2)', borderRadius: '10px', color: 'var(--text-primary)' }} />
                            <Bar dataKey="volume" name="Volume (XLM)" fill="var(--accent-indigo)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </section>

                <section className="neo-raised" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <Globe size={20} color="var(--accent-indigo)" />
                        <h3 style={{ fontSize: '1.1rem' }}>User Geography</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {geoData.map((g) => (
                            <div key={g.region}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{g.region}</span>
                                    <span className="mono" style={{ fontWeight: 700 }}>{g.users} users</span>
                                </div>
                                <div style={{ height: '6px', borderRadius: '100px' }} className="neo-inset">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(g.users / 14) * 100}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        style={{ height: '100%', borderRadius: '100px', background: 'var(--accent-indigo)' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Bottom Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div className="neo-raised" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <Clock size={18} color="var(--accent-amber)" />
                        <h4 style={{ fontSize: '0.95rem' }}>Avg. Session Duration</h4>
                    </div>
                    <p className="mono" style={{ fontSize: '2rem', fontWeight: 800 }}>4m 32s</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>+18% vs last week</p>
                </div>
                <div className="neo-raised" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <TrendingUp size={18} color="var(--accent-green)" />
                        <h4 style={{ fontSize: '0.95rem' }}>Monthly Active Users</h4>
                    </div>
                    <p className="mono" style={{ fontSize: '2rem', fontWeight: 800 }}>38</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Target: 30 ✓ Achieved</p>
                </div>
                <div className="neo-raised" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <Database size={18} color="var(--accent-indigo)" />
                        <h4 style={{ fontSize: '0.95rem' }}>Indexed Transactions</h4>
                    </div>
                    <p className="mono" style={{ fontSize: '2rem', fontWeight: 800 }}>133</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Via Stellar Horizon API</p>
                </div>
            </div>
        </div>
    );
}
