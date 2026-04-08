'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Users, Search, Plus, MoreVertical, Mail, ExternalLink,
    DollarSign, Trash2, Edit2, X, Check, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getClients, saveClient, deleteClient, getInvoices,
    type Client, type Invoice
} from '@/lib/store';
import Link from 'next/link';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#f97316'];

function initials(name: string) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function generateId() {
    return 'cli_' + Math.random().toString(36).substr(2, 9);
}

type EditableClient = Omit<Client, 'id' | 'createdAt'>;

const BLANK: EditableClient = { name: '', email: '', stellarWallet: '', company: '', phone: '' };

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<EditableClient>(BLANK);

    const load = useCallback(() => {
        setClients(getClients());
        setInvoices(getInvoices());
    }, []);

    useEffect(() => {
        load();
        window.addEventListener('storage', load);
        return () => window.removeEventListener('storage', load);
    }, [load]);

    const openAdd = () => { setEditingId(null); setForm(BLANK); setShowModal(true); };
    const openEdit = (c: Client) => {
        setEditingId(c.id);
        setForm({ name: c.name, email: c.email, stellarWallet: c.stellarWallet ?? '', company: c.company ?? '', phone: c.phone ?? '' });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!form.name.trim()) { alert('Name is required.'); return; }
        if (editingId) {
            saveClient({ ...form, id: editingId, createdAt: clients.find(c => c.id === editingId)!.createdAt });
        } else {
            saveClient({ ...form, id: generateId(), createdAt: new Date().toISOString() });
        }
        load();
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete this client?')) return;
        deleteClient(id);
        load();
    };

    const clientStats = (name: string) => {
        const related = invoices.filter(i => i.clientName === name);
        const totalPaid = related.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
        return { invoiceCount: related.length, totalPaid };
    };

    const filtered = clients.filter(c =>
        search === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.stellarWallet ?? '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Client Directory</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {clients.length === 0 ? 'No clients yet.' : `${clients.length} client${clients.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <button onClick={openAdd} style={{
                    background: 'var(--primary-color)', padding: '0.75rem 1.75rem',
                    borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center',
                    gap: '0.6rem', color: 'white', boxShadow: '0 8px 20px -4px rgba(99,102,241,0.3)',
                }}>
                    <Plus size={20} strokeWidth={3} /> Add Client
                </button>
            </header>

            {/* Search */}
            <div className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} size={18} />
                    <input
                        className="glass"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                        placeholder="Search by name, email, or wallet..."
                    />
                </div>
            </div>

            {/* Empty state */}
            <AnimatePresence>
                {clients.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="neo-raised"
                        style={{ padding: '5rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}
                    >
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-indigo)' }}>
                            <Users size={36} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No clients yet</h2>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '380px' }}>
                                Add your first client to quickly fill in their details when creating invoices.
                            </p>
                        </div>
                        <button onClick={openAdd} style={{ padding: '0.85rem 2rem', background: 'var(--primary-color)', color: 'white', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Plus size={18} /> Add First Client
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid */}
            {filtered.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map((client, i) => {
                        const { invoiceCount, totalPaid } = clientStats(client.name);
                        return (
                            <motion.div
                                key={client.id}
                                whileHover={{ y: -4 }}
                                className="glass"
                                style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{
                                            width: '50px', height: '50px', borderRadius: '14px',
                                            background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[i % COLORS.length]}40)`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.1rem', fontWeight: 800, color: 'white',
                                        }}>
                                            {initials(client.name)}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{client.name}</h3>
                                            {client.company && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{client.company}</p>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => openEdit(client)} style={{ color: 'var(--text-muted)' }}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(client.id)} style={{ color: 'var(--text-muted)' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="glass" style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)' }}>
                                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Total Paid</p>
                                        <p style={{ fontWeight: 800, color: 'var(--secondary-color)', fontSize: '0.95rem' }}>
                                            {totalPaid > 0 ? totalPaid.toLocaleString() : '—'}
                                        </p>
                                    </div>
                                    <div className="glass" style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)' }}>
                                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Invoices</p>
                                        <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>{invoiceCount || 0}</p>
                                    </div>
                                </div>

                                {client.stellarWallet && (
                                    <div style={{ padding: '0.6rem 0.9rem', borderRadius: '8px', background: 'rgba(0,255,178,0.05)', border: '0.5px solid rgba(0,255,178,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Wallet size={12} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                                        <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--accent-green)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {client.stellarWallet}
                                        </p>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    {client.email && (
                                        <a href={`mailto:${client.email}`} style={btnSmall}><Mail size={14} /> Email</a>
                                    )}
                                    {client.stellarWallet && (
                                        <a href={`https://stellar.expert/explorer/testnet/account/${client.stellarWallet}`} target="_blank" style={btnSmall}>
                                            <ExternalLink size={14} /> Explorer
                                        </a>
                                    )}
                                    <Link href={`/dashboard/invoices/new`} style={{ ...btnSmall, marginLeft: 'auto', background: 'rgba(99,102,241,0.08)', color: 'var(--primary-color)', border: '1px solid rgba(99,102,241,0.12)' }}>
                                        <DollarSign size={14} /> New Invoice
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* No search results */}
            {clients.length > 0 && filtered.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No clients match &quot;{search}&quot;.</p>
                </div>
            )}

            {/* Add / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 99 }}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 24 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 24 }}
                            transition={{ type: 'spring', damping: 25 }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '520px', maxWidth: '95vw',
                                background: 'var(--surface-color)',
                                borderRadius: '20px',
                                padding: '2.5rem',
                                zIndex: 100,
                                boxShadow: '20px 20px 40px var(--shadow-dark), -10px -10px 30px var(--shadow-light)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.3rem' }}>{editingId ? 'Edit Client' : 'Add Client'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
                            </div>

                            {[
                                { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'e.g. John Doe' },
                                { label: 'Email', key: 'email', type: 'email', placeholder: 'billing@company.com' },
                                { label: 'Company', key: 'company', type: 'text', placeholder: 'Acme Corp (optional)' },
                                { label: 'Phone', key: 'phone', type: 'text', placeholder: '+1 555 0100 (optional)' },
                                { label: 'Stellar Wallet (G...)', key: 'stellarWallet', type: 'text', placeholder: 'GABC... (optional)' },
                            ].map(({ label, key, type, placeholder }) => (
                                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</label>
                                    <input
                                        type={type}
                                        placeholder={placeholder}
                                        value={(form as any)[key]}
                                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                        style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: key === 'stellarWallet' ? 'JetBrains Mono, monospace' : undefined }}
                                    />
                                </div>
                            ))}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button onClick={() => setShowModal(false)} className="neo-button" style={{ flex: 1, padding: '0.9rem' }}>Cancel</button>
                                <button onClick={handleSave} style={{ flex: 1, padding: '0.9rem', background: 'var(--primary-color)', color: 'white', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <Check size={18} /> {editingId ? 'Save Changes' : 'Add Client'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

const btnSmall: React.CSSProperties = {
    padding: '0.5rem 0.85rem',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
};
