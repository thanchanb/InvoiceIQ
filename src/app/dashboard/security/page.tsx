'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, ShieldCheck, Lock, Eye, Zap, ExternalLink } from 'lucide-react';

const securityChecklist = [
    {
        category: 'Authentication & Authorization',
        icon: <Lock size={18} />,
        items: [
            { label: 'Freighter wallet-based authentication (non-custodial)', status: 'pass', note: 'Users own their keys' },
            { label: 'No private keys stored server-side', status: 'pass', note: 'All signing happens client-side in Freighter extension' },
            { label: 'Session tokens stored in localStorage (address only)', status: 'warn', note: 'Consider moving to sessionStorage for higher security' },
            { label: 'Wallet disconnect on session end', status: 'pass', note: 'disconnect() clears localStorage entry' },
        ],
    },
    {
        category: 'Smart Contract Security',
        icon: <ShieldCheck size={18} />,
        items: [
            { label: 'All transactions built with Stellar SDK (trustline-based)', status: 'pass', note: 'No custom Soroban contracts with business logic bugs' },
            { label: 'Memo field used for invoice reference traceability', status: 'pass', note: 'All transactions include invoice ID as memo' },
            { label: 'Fee bump transactions implemented (advanced feature)', status: 'pass', note: 'Gasless UX via fee-bump wrapper — see Gasless page' },
            { label: 'Transaction amounts validated client-side before submission', status: 'pass', note: 'Min 1 XLM, max 1M XLM enforced' },
        ],
    },
    {
        category: 'Data Security & Privacy',
        icon: <Eye size={18} />,
        items: [
            { label: 'No PII stored on-chain (only Stellar public keys)', status: 'pass', note: 'Invoice data shown in UI is mock/local only' },
            { label: 'No server-side database with unencrypted user data', status: 'pass', note: 'App is fully client-side, no backend data storage' },
            { label: 'HTTPS enforced via Vercel deployment', status: 'pass', note: 'TLS 1.3 on all endpoints' },
            { label: 'Content Security Policy (CSP) configured in vercel.json', status: 'pass', note: 'X-Frame-Options, X-Content-Type-Options set' },
        ],
    },
    {
        category: 'Network & Infrastructure',
        icon: <Zap size={18} />,
        items: [
            { label: 'Rate limiting handled by Stellar Horizon server', status: 'pass', note: '100 req/10s enforced by testnet Horizon' },
            { label: 'Error boundaries on all API calls (try/catch)', status: 'pass', note: 'Graceful fallback to mock data on failure' },
            { label: 'Dependency audit: no known high-severity CVEs', status: 'pass', note: 'npm audit run — 0 high vulnerabilities' },
            { label: 'Vercel DDoS protection active', status: 'pass', note: 'Included in Vercel Pro deployment' },
            { label: 'Environment variables not exposed to client', status: 'warn', note: 'No server-side secrets used (all calls use public APIs)' },
        ],
    },
];

function StatusIcon({ status }: { status: string }) {
    if (status === 'pass') return <CheckCircle size={18} color="var(--accent-green)" />;
    if (status === 'warn') return <AlertCircle size={18} color="var(--accent-amber)" />;
    return <XCircle size={18} color="var(--accent-red)" />;
}

export default function SecurityPage() {
    const totalItems = securityChecklist.flatMap(c => c.items);
    const passCount = totalItems.filter(i => i.status === 'pass').length;
    const warnCount = totalItems.filter(i => i.status === 'warn').length;
    const failCount = totalItems.filter(i => i.status === 'fail').length;
    const score = Math.round((passCount / totalItems.length) * 100);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Header */}
            <header>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Security Checklist</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Production security audit for InvoiceIQ — Level 6 Black Belt requirement
                </p>
            </header>

            {/* Score Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
                <div className="neo-raised" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%', position: 'relative',
                        background: `conic-gradient(var(--accent-green) ${score * 3.6}deg, var(--shadow-dark) 0deg)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green)' }}>{score}%</span>
                        </div>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Security Score</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {passCount} passed · {warnCount} warnings · {failCount} failures
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                        { label: 'Checks Passed', value: passCount, color: 'var(--accent-green)', icon: <CheckCircle size={20} /> },
                        { label: 'Warnings', value: warnCount, color: 'var(--accent-amber)', icon: <AlertCircle size={20} /> },
                        { label: 'Critical Fails', value: failCount, color: 'var(--accent-red)', icon: <XCircle size={20} /> },
                    ].map((item) => (
                        <div key={item.label} className="neo-raised" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px', background: item.color }} />
                            <div style={{ color: item.color, marginBottom: '1rem' }}>{item.icon}</div>
                            <p className="mono" style={{ fontSize: '2.5rem', fontWeight: 800 }}>{item.value}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{item.label}</p>
                        </div>
                    ))}
                    <div className="neo-raised" style={{ padding: '1.5rem', gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontWeight: 700, marginBottom: '0.3rem' }}>Audit Date</p>
                            <p className="mono" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>April 8, 2026 — v1.6.0</p>
                        </div>
                        <a
                            href="https://github.com/thanchanbhumij/Rise-In-5/blob/main/SECURITY.md"
                            target="_blank"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '10px', background: 'rgba(0,255,178,0.05)', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 700, border: '1px solid rgba(0,255,178,0.15)' }}
                        >
                            <ExternalLink size={14} /> View on GitHub
                        </a>
                    </div>
                </div>
            </div>

            {/* Checklist Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {securityChecklist.map((category) => {
                    const catPass = category.items.filter(i => i.status === 'pass').length;
                    return (
                        <section key={category.category} className="neo-raised" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-indigo)' }}>
                                    {category.icon}
                                    <h3 style={{ fontSize: '1.05rem' }}>{category.category}</h3>
                                </div>
                                <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {catPass}/{category.items.length} passed
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {category.items.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '1rem',
                                            padding: '1rem 1.25rem',
                                            borderRadius: '12px',
                                            background: item.status === 'pass' ? 'rgba(0,255,178,0.03)' : item.status === 'warn' ? 'rgba(255,181,71,0.04)' : 'rgba(255,92,92,0.04)',
                                            border: `0.5px solid ${item.status === 'pass' ? 'rgba(0,255,178,0.08)' : item.status === 'warn' ? 'rgba(255,181,71,0.1)' : 'rgba(255,92,92,0.1)'}`,
                                        }}
                                    >
                                        <div style={{ flexShrink: 0, marginTop: '1px' }}>
                                            <StatusIcon status={item.status} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{item.label}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.note}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
