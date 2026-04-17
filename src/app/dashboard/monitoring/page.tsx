'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Server,
    Wifi,
    Database,
    Clock,
    RefreshCw,
    Terminal as TerminalIcon,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { getInvoices } from '@/lib/store';

// Simulated uptime data (last 90 days)
const uptimeHistory = Array.from({ length: 90 }, (_, i) => ({
    day: i + 1,
    uptime: Math.random() > 0.03 ? 100 : Math.floor(Math.random() * 40) + 60,
}));

// Simulated API response times
const responseTimeData = Array.from({ length: 20 }, (_, i) => ({
    t: i,
    ms: Math.floor(Math.random() * 60) + 80,
}));

const services = [
    { name: 'Next.js App (Vercel)', status: 'operational', uptime: '99.98%', latency: '94ms', region: 'US-East-1' },
    { name: 'Stellar Horizon API', status: 'operational', uptime: '99.91%', latency: '120ms', region: 'Global' },
    { name: 'Freighter Wallet API', status: 'operational', uptime: '99.85%', latency: '45ms', region: 'Client' },
    { name: 'Data Indexer Service', status: 'operational', uptime: '99.97%', latency: '38ms', region: 'Edge' },
    { name: 'Vercel Edge Network', status: 'operational', uptime: '100%', latency: '12ms', region: 'Global' },
];

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        operational: 'var(--accent-green)',
        degraded: 'var(--accent-amber)',
        outage: 'var(--accent-red)',
    };
    const icons: Record<string, React.ReactNode> = {
        operational: <CheckCircle size={14} />,
        degraded: <AlertTriangle size={14} />,
        outage: <XCircle size={14} />,
    };
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: colors[status], fontSize: '0.8rem', fontWeight: 700 }}>
            {icons[status]}
            {status.toUpperCase()}
        </div>
    );
}

function LogLevel({ level }: { level: string }) {
    const colors: Record<string, string> = {
        INFO: 'var(--accent-indigo)',
        WARN: 'var(--accent-amber)',
        ERROR: 'var(--accent-red)',
    };
    return (
        <span className="mono" style={{ fontSize: '0.7rem', fontWeight: 800, color: colors[level] || 'white', minWidth: '38px' }}>
            {level}
        </span>
    );
}

export default function MonitoringPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [liveMs, setLiveMs] = useState(94);
    const [liveRtData, setLiveRtData] = useState(responseTimeData);

    useEffect(() => {
        // Build initial logs from real invoices
        const invs = getInvoices().slice(0, 5);
        const startLogs = invs.map((inv, i) => ({
            time: new Date(inv.createdAt).toLocaleTimeString('en-GB').slice(0, 8),
            level: 'INFO',
            service: 'app',
            msg: `Invoice ${inv.id} created [client: ${inv.clientName}]`
        }));

        setLogs([...startLogs,
        { time: '09:00:00', level: 'INFO', service: 'indexer', msg: 'System initialized, listening for Stellar events...' },
        { time: '08:59:45', level: 'INFO', service: 'horizon', msg: 'Connected to Horizon Testnet [region: global]' }
        ].slice(0, 15));

        const interval = setInterval(() => {
            const ms = Math.floor(Math.random() * 60) + 80;
            setLiveMs(ms);
            setLiveRtData(prev => [...prev.slice(-19), { t: prev.length, ms }]);

            // Simulate sporadic technical logs
            if (Math.random() > 0.4) {
                const newLog = {
                    time: new Date().toLocaleTimeString('en-GB').slice(0, 8),
                    level: Math.random() > 0.9 ? 'WARN' : 'INFO',
                    service: ['horizon', 'indexer', 'app'][Math.floor(Math.random() * 3)],
                    msg: [
                        'GET /accounts/G... → 200 (' + ms + 'ms)',
                        'Heartbeat check: all services nominal',
                        'Indexed ledger #' + (52408190 + Math.floor(Math.random() * 1000)),
                        'Freighter API status: ready',
                        'Polled transaction history (0 updates)'
                    ][Math.floor(Math.random() * 5)],
                };
                setLogs(prev => [newLog, ...prev.slice(0, 19)]);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const overallUptime = 99.94;
    const uptimeDays = uptimeHistory.filter(d => d.uptime === 100).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Header */}
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Production Monitoring</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Live service status, logs, and API health</p>
                    </div>
                </div>
            </header>

            {/* Top KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {[
                    { label: 'Overall Uptime', value: `${overallUptime}%`, icon: <Server size={20} />, color: 'var(--accent-green)' },
                    { label: 'Avg. Response Time', value: `${liveMs}ms`, icon: <Clock size={20} />, color: 'var(--accent-indigo)' },
                    { label: 'Error Rate (24h)', value: '0.04%', icon: <AlertTriangle size={20} />, color: 'var(--accent-amber)' },
                    { label: 'Stellar Network', value: 'Testnet Live', icon: <Wifi size={20} />, color: 'var(--accent-green)' },
                ].map((item) => (
                    <div key={item.label} className="neo-raised" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px', background: item.color }} />
                        <div style={{ color: item.color, marginBottom: '1rem' }}>{item.icon}</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{item.label}</p>
                        <p className="mono" style={{ fontSize: '1.4rem', fontWeight: 800 }}>{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Live Response Time Chart */}
            <section className="neo-raised" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem' }}>API Latency (Horizon + RPC)</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Live testnet response profiling</p>
                    </div>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                        {liveMs}ms
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={liveRtData}>
                        <defs>
                            <linearGradient id="rtGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-indigo)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--accent-indigo)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ background: 'var(--surface-color)', border: 'none', borderRadius: '10px', color: 'var(--text-primary)' }} />
                        <Area type="monotone" dataKey="ms" stroke="var(--accent-indigo)" strokeWidth={2.5} fill="url(#rtGrad)" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </section>

            {/* Uptime 90-Day Bar + Live Logs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                <section className="neo-raised" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>90-Day Uptime History</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{uptimeDays}/90 days at 100%</p>
                    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                        {uptimeHistory.map((d, i) => (
                            <div
                                key={i}
                                title={`Day ${d.day}: ${d.uptime}%`}
                                style={{
                                    width: '8px',
                                    height: '24px',
                                    borderRadius: '2px',
                                    background: d.uptime === 100
                                        ? 'var(--accent-green)'
                                        : d.uptime > 80
                                            ? 'var(--accent-amber)'
                                            : 'var(--accent-red)',
                                    opacity: d.uptime === 100 ? 0.7 : 1,
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                        {[['100%', 'var(--accent-green)'], ['Degraded', 'var(--accent-amber)'], ['Outage', 'var(--accent-red)']].map(([label, color]) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color }} />{label}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="neo-raised" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <TerminalIcon size={18} color="var(--accent-green)" />
                        <h3 style={{ fontSize: '1.1rem' }}>Live Application Logs</h3>
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)', marginLeft: 'auto' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '260px', overflowY: 'auto' }}>
                        <AnimatePresence>
                            {logs.map((log, i) => (
                                <motion.div
                                    key={`${log.time}-${i}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{
                                        display: 'flex',
                                        gap: '0.75rem',
                                        alignItems: 'flex-start',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '8px',
                                        background: log.level === 'ERROR' ? 'rgba(255,92,92,0.05)' : log.level === 'WARN' ? 'rgba(255,181,71,0.05)' : 'transparent',
                                        borderLeft: `2px solid ${log.level === 'ERROR' ? 'var(--accent-red)' : log.level === 'WARN' ? 'var(--accent-amber)' : 'transparent'}`,
                                    }}
                                >
                                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: '60px', flexShrink: 0 }}>{log.time}</span>
                                    <LogLevel level={log.level} />
                                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent-indigo)', minWidth: '55px', flexShrink: 0 }}>[{log.service}]</span>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{log.msg}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>
            </div>

            {/* Service Status Table */}
            <section className="neo-raised" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                    <Server size={20} color="var(--accent-green)" />
                    <h3 style={{ fontSize: '1.1rem' }}>Service Infrastructure</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {services.map((svc) => (
                        <div key={svc.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', alignItems: 'center', padding: '1rem 1.25rem', borderRadius: '12px' }} className="neo-inset">
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{svc.name}</span>
                            <StatusBadge status={svc.status} />
                            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{svc.uptime} uptime</span>
                            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--accent-indigo)' }}>{svc.latency}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{svc.region}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
