'use client';

import React from 'react';
import {
    Users,
    Search,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    DollarSign
} from 'lucide-react';
import { mockClientStats } from '@/lib/mockData';
import { motion } from 'framer-motion';

export default function ClientsPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Client Directory</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your client relationships and their total value.</p>
                </div>
                <button style={{
                    background: 'var(--primary-color)',
                    padding: '0.75rem 1.75rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: 'white'
                }}>
                    <Plus size={20} strokeWidth={3} /> Add Client
                </button>
            </header>

            <div className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search
                        style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
                        size={18}
                    />
                    <input
                        className="glass"
                        style={{
                            width: '100%',
                            padding: '0.8rem 1rem 0.8rem 3rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            fontSize: '0.9rem'
                        }}
                        placeholder="Search clients by name, email, or wallet..."
                    />
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem'
            }}>
                {mockClientStats.map((client, i) => (
                    <motion.div
                        key={client.name}
                        whileHover={{ y: -5 }}
                        className="glass"
                        style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '14px',
                                    background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, #ffffff20)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem',
                                    fontWeight: 800,
                                    color: 'white'
                                }}>
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{client.name}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>G...WALLET</p>
                                </div>
                            </div>
                            <button style={{ color: 'var(--text-muted)' }}><MoreVertical size={20} /></button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="glass" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Paid</p>
                                <p style={{ fontWeight: 800, color: 'var(--secondary-color)' }}>${client.totalPaid.toLocaleString()}</p>
                            </div>
                            <div className="glass" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Invoices</p>
                                <p style={{ fontWeight: 800 }}>{client.invoiceCount}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button style={btnSmallStyle}><Mail size={14} /> Email</button>
                            <button style={btnSmallStyle}><ExternalLink size={14} /> Profile</button>
                            <button style={{ ...btnSmallStyle, marginLeft: 'auto', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                <DollarSign size={14} /> New Invoice
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

const btnSmallStyle = {
    padding: '0.5rem 0.8rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-secondary)'
};
