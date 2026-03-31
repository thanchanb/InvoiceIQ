'use client';

import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Download,
    ExternalLink,
    ChevronRight,
    ChevronLeft,
    Mail,
    Copy
} from 'lucide-react';
import { mockInvoices } from '@/lib/mockData';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function InvoicesPage() {
    const [filter, setFilter] = useState('all');

    const filteredInvoices = filter === 'all'
        ? mockInvoices
        : mockInvoices.filter(inv => inv.status === filter);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Invoices</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage and track your outgoing client invoices.</p>
                </div>
                <Link href="/dashboard/invoices/new" style={{
                    background: 'var(--primary-color)',
                    padding: '0.75rem 1.75rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: 'white'
                }}>
                    <Plus size={20} strokeWidth={3} /> Create New
                </Link>
            </header>

            {/* Filters Bar */}
            <div className="glass" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {['all', 'paid', 'pending', 'overdue'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.5rem 1.25rem',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                                background: filter === f ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                color: filter === f ? 'var(--primary-color)' : 'var(--text-secondary)',
                                border: `1px solid ${filter === f ? 'rgba(99, 102, 241, 0.2)' : 'transparent'}`,
                                transition: 'var(--transition-fast)'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search
                            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
                            size={16}
                        />
                        <input
                            style={{
                                padding: '0.6rem 1rem 0.6rem 2.5rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '10px',
                                fontSize: '0.875rem',
                                width: '240px'
                            }}
                            placeholder="Search by ID or client..."
                        />
                    </div>
                    <button className="glass" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="glass" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>INVOICE ID</th>
                            <th style={{ padding: '1.25rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>CLIENT / PROJECT</th>
                            <th style={{ padding: '1.25rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>AMOUNT</th>
                            <th style={{ padding: '1.25rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>ISSUE DATE</th>
                            <th style={{ padding: '1.25rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>DUE DATE</th>
                            <th style={{ padding: '1.25rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>STATUS</th>
                            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map((inv) => (
                            <tr key={inv.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'var(--transition-fast)' }} className="table-row-hover">
                                <td style={{ padding: '1.25rem 2rem', fontSize: '0.9rem', fontWeight: 700 }}>{inv.id}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{inv.clientName}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.project}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>${inv.amount.toLocaleString()}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.currency}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{inv.issuedDate}</td>
                                <td style={{ padding: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{inv.dueDate}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        background: inv.status === 'paid' ? 'rgba(16, 185, 129, 0.1)' : (inv.status === 'overdue' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'),
                                        color: inv.status === 'paid' ? 'var(--secondary-color)' : (inv.status === 'overdue' ? 'var(--danger-color)' : 'var(--accent-color)'),
                                        border: `1px solid ${inv.status === 'paid' ? 'rgba(16, 185, 129, 0.2)' : (inv.status === 'overdue' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)')}`
                                    }}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem 2rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button style={{ color: 'var(--text-muted)' }} title="Download PDF"><Download size={18} /></button>
                                        <button style={{ color: 'var(--text-muted)' }} title="Send Email"><Mail size={18} /></button>
                                        <button style={{ color: 'var(--text-muted)' }} title="Copy Invoice Link"><Copy size={18} /></button>
                                        <button style={{ color: 'var(--text-muted)' }} title="View Details"><MoreHorizontal size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Showing 1-5 of 12 invoices</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="glass" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronLeft size={16} />
                        </button>
                        <button className="glass" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-color)', color: 'white', border: 'none' }}>
                            1
                        </button>
                        <button className="glass" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            2
                        </button>
                        <button className="glass" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
        </div>
    );
}
