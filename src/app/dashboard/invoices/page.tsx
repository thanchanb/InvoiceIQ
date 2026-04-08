'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, Search, Filter, MoreHorizontal, Download, Mail,
    Copy, Activity, CheckCircle2, FileText, RefreshCw, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyPayment } from '@/lib/stellar';
import {
    getInvoices, deleteInvoice, updateInvoiceStatus,
    type Invoice, type InvoiceStatus
} from '@/lib/store';

const STATUS_TAB = ['all', 'paid', 'pending', 'overdue', 'draft'] as const;

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [verifying, setVerifying] = useState<string | null>(null);

    const load = useCallback(() => setInvoices(getInvoices()), []);

    useEffect(() => {
        load();
        window.addEventListener('storage', load);
        return () => window.removeEventListener('storage', load);
    }, [load]);

    const handleVerify = async (inv: Invoice) => {
        if (!inv.stellarWallet) return;
        setVerifying(inv.id);
        const isPaid = await verifyPayment(inv.id, inv.stellarWallet);
        if (isPaid) {
            updateInvoiceStatus(inv.id, 'paid');
            load();
        }
        setVerifying(null);
        if (!isPaid) {
            alert(`No transaction with memo "${inv.id}" found for wallet ${inv.stellarWallet.slice(0, 8)}...`);
        }
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete this invoice? This cannot be undone.')) return;
        deleteInvoice(id);
        load();
    };

    const handleMarkPaid = (id: string) => {
        updateInvoiceStatus(id, 'paid');
        load();
    };

    const filtered = invoices
        .filter(inv => filter === 'all' || inv.status === filter)
        .filter(inv =>
            search === '' ||
            inv.id.toLowerCase().includes(search.toLowerCase()) ||
            inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
            inv.project.toLowerCase().includes(search.toLowerCase())
        );

    const counts = {
        all: invoices.length,
        paid: invoices.filter(i => i.status === 'paid').length,
        pending: invoices.filter(i => i.status === 'pending').length,
        overdue: invoices.filter(i => i.status === 'overdue').length,
        draft: invoices.filter(i => i.status === 'draft').length,
    };

    const isEmpty = invoices.length === 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Invoices</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isEmpty ? 'No invoices yet.' : `${invoices.length} total · ${counts.paid} paid · ${counts.pending} pending`}
                    </p>
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
                    boxShadow: '0 8px 20px -4px rgba(99,102,241,0.35)',
                }}>
                    <Plus size={20} strokeWidth={3} /> Create New
                </Link>
            </header>

            {/* Empty state */}
            <AnimatePresence>
                {isEmpty && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="neo-raised"
                        style={{
                            padding: '5rem 3rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1.5rem',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)' }}>
                            <FileText size={36} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No invoices yet</h2>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                                Start by creating your first invoice. It will appear here once saved.
                            </p>
                        </div>
                        <Link
                            href="/dashboard/invoices/new"
                            style={{
                                padding: '0.85rem 2rem',
                                background: 'var(--primary-color)',
                                color: 'white',
                                borderRadius: '12px',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                            }}
                        >
                            <Plus size={18} /> Create Invoice
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isEmpty && (
                <>
                    {/* Filter + Search Bar */}
                    <div className="glass" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {STATUS_TAB.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    style={{
                                        padding: '0.45rem 1rem',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                        background: filter === f ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                                        color: filter === f ? 'var(--primary-color)' : 'var(--text-secondary)',
                                        border: `1px solid ${filter === f ? 'rgba(99, 102, 241, 0.25)' : 'transparent'}`,
                                        transition: 'var(--transition-fast)',
                                    }}
                                >
                                    {f} {counts[f as keyof typeof counts] > 0 && (
                                        <span style={{ marginLeft: '0.35rem', padding: '0.1rem 0.45rem', borderRadius: '100px', fontSize: '0.7rem', background: filter === f ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)' }}>
                                            {counts[f as keyof typeof counts]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} size={16} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    padding: '0.6rem 1rem 0.6rem 2.5rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '10px',
                                    fontSize: '0.875rem',
                                    width: '240px',
                                    color: 'var(--text-primary)',
                                }}
                                placeholder="Search by ID, client, project..."
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="glass" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
                                    {['INVOICE ID', 'CLIENT / PROJECT', 'AMOUNT', 'ISSUE DATE', 'DUE DATE', 'STATUS', 'ACTIONS'].map(h => (
                                        <th key={h} style={{ padding: h === 'INVOICE ID' || h === 'ACTIONS' ? '1.25rem 2rem' : '1.25rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filtered.map((inv) => (
                                        <motion.tr
                                            key={inv.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <td style={{ padding: '1.25rem 2rem', fontSize: '0.9rem', fontWeight: 700 }} className="mono">{inv.id}</td>
                                            <td style={{ padding: '1.25rem' }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{inv.clientName}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.project}</div>
                                            </td>
                                            <td style={{ padding: '1.25rem' }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{inv.amount.toLocaleString()}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.currency}</div>
                                            </td>
                                            <td style={{ padding: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{inv.issuedDate}</td>
                                            <td style={{ padding: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{inv.dueDate}</td>
                                            <td style={{ padding: '1.25rem' }}>
                                                <StatusBadge status={inv.status} />
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                                                    {inv.status === 'pending' && inv.stellarWallet && (
                                                        <button
                                                            onClick={() => handleVerify(inv)}
                                                            disabled={verifying === inv.id}
                                                            title="Verify on Stellar"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', cursor: verifying === inv.id ? 'wait' : 'pointer' }}
                                                        >
                                                            {verifying === inv.id ? <RefreshCw size={13} className="animate-spin" /> : <Activity size={13} />}
                                                            VERIFY
                                                        </button>
                                                    )}
                                                    {(inv.status === 'pending' || inv.status === 'draft') && (
                                                        <button
                                                            onClick={() => handleMarkPaid(inv.id)}
                                                            title="Mark as Paid"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)', background: 'rgba(0,255,178,0.07)', border: '1px solid rgba(0,255,178,0.15)' }}
                                                        >
                                                            <CheckCircle2 size={13} /> PAID
                                                        </button>
                                                    )}
                                                    <button title="Delete" onClick={() => handleDelete(inv.id)} style={{ color: 'var(--text-muted)' }}>
                                                        <Trash2 size={17} />
                                                    </button>
                                                    <button title="Copy ID" onClick={() => navigator.clipboard.writeText(inv.id)} style={{ color: 'var(--text-muted)' }}>
                                                        <Copy size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filtered.length === 0 && (
                            <div style={{ padding: '3rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No invoices match your filters.</p>
                            </div>
                        )}

                        <div style={{ padding: '1rem 2rem', borderTop: '1px solid var(--glass-border)' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                Showing {filtered.length} of {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
    const colors: Record<InvoiceStatus, { bg: string; color: string; border: string }> = {
        paid: { bg: 'rgba(16,185,129,0.1)', color: 'var(--secondary-color)', border: 'rgba(16,185,129,0.2)' },
        pending: { bg: 'rgba(245,158,11,0.1)', color: 'var(--accent-color)', border: 'rgba(245,158,11,0.2)' },
        overdue: { bg: 'rgba(239,68,68,0.1)', color: 'var(--danger-color)', border: 'rgba(239,68,68,0.2)' },
        draft: { bg: 'rgba(100,116,139,0.1)', color: 'var(--text-secondary)', border: 'rgba(100,116,139,0.2)' },
    };
    const c = colors[status];
    return (
        <span style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
            {status}
        </span>
    );
}
