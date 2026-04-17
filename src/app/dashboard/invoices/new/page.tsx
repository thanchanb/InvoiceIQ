'use client';

import React, { useState, useEffect } from 'react';
import {
    Save, Send, Plus, Trash2, ChevronLeft, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    saveInvoice, nextInvoiceId, getClients, getInvoices,
    type Invoice, type InvoiceItem, type Client
} from '@/lib/store';
import { useWallet } from '@/context/WalletContext';
import { generateInvoicePDF } from '@/lib/pdf';

function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

export default function NewInvoicePage() {
    const router = useRouter();
    const { address } = useWallet();
    const [submitted, setSubmitted] = useState(false);
    const [savedId, setSavedId] = useState('');
    const [clients, setClients] = useState<Client[]>([]);

    const today = new Date().toISOString().split('T')[0];
    const invoiceId = nextInvoiceId();

    const [form, setForm] = useState({
        clientName: '',
        clientEmail: '',
        stellarWallet: '',
        project: '',
        issuedDate: today,
        dueDays: '30',
        currency: 'XLM',
        notes: '',
    });

    const [items, setItems] = useState<InvoiceItem[]>([
        { id: generateId(), description: '', rate: 0, quantity: 1 },
    ]);

    useEffect(() => {
        setClients(getClients());
    }, []);

    const addItem = () =>
        setItems([...items, { id: generateId(), description: '', rate: 0, quantity: 1 }]);

    const removeItem = (id: string) =>
        setItems(items.filter(i => i.id !== id));

    const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const subtotal = items.reduce((s, i) => s + i.rate * i.quantity, 0);

    const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const name = e.target.value;
        if (name === '__new') { setForm(f => ({ ...f, clientName: '', clientEmail: '', stellarWallet: '' })); return; }
        const c = clients.find(c => c.name === name);
        if (c) setForm(f => ({ ...f, clientName: c.name, clientEmail: c.email, stellarWallet: c.stellarWallet ?? '' }));
        else setForm(f => ({ ...f, clientName: name }));
    };

    const computeDueDate = () => {
        const d = new Date(form.issuedDate);
        d.setDate(d.getDate() + parseInt(form.dueDays, 10));
        return d.toISOString().split('T')[0];
    };

    const persist = (status: 'pending' | 'draft') => {
        if (!form.clientName.trim() || !form.project.trim()) {
            alert('Please fill in client name and project name.');
            return;
        }
        const invoice: Invoice = {
            id: invoiceId,
            clientName: form.clientName.trim(),
            clientEmail: form.clientEmail.trim(),
            stellarWallet: form.stellarWallet.trim() || address || undefined,
            project: form.project.trim(),
            items,
            amount: subtotal,
            currency: form.currency,
            issuedDate: form.issuedDate,
            dueDate: computeDueDate(),
            status,
            notes: form.notes.trim() || undefined,
            createdAt: new Date().toISOString(),
        };
        saveInvoice(invoice);
        setSavedId(invoice.id);
        setSubmitted(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        persist('pending');
    };

    if (submitted) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 200px)', gap: '2rem' }}>
                <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    style={{
                        width: '100px', height: '100px',
                        background: 'rgba(0,255,178,0.08)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent-green)',
                        boxShadow: '0 0 40px rgba(0,255,178,0.15)',
                    }}
                >
                    <CheckCircle2 size={52} />
                </motion.div>
                <h1 style={{ fontSize: '2rem' }}>Invoice Created!</h1>
                <p className="mono" style={{ color: 'var(--accent-green)', fontSize: '1rem' }}>{savedId}</p>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '380px' }}>
                    The invoice has been saved. You can view and manage it from the Invoices page.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => {
                            const inv = getInvoices().find(i => i.id === savedId);
                            if (inv) generateInvoicePDF(inv);
                        }}
                        style={{ padding: '0.75rem 2rem', background: 'var(--primary-color)', color: 'white', borderRadius: '12px', fontWeight: 800 }}
                    >
                        Download PDF
                    </button>
                    <Link href="/dashboard/invoices" style={{ padding: '0.75rem 2rem', background: 'rgba(0,255,178,0.1)', color: 'var(--accent-green)', borderRadius: '12px', fontWeight: 800, border: '1px solid rgba(0,255,178,0.2)' }}>
                        View List
                    </Link>
                    <button onClick={() => { setSubmitted(false); setItems([{ id: generateId(), description: '', rate: 0, quantity: 1 }]); setForm(f => ({ ...f, clientName: '', clientEmail: '', project: '', notes: '' })); }} style={{ padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 700 }} className="neo-button">
                        Create Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => router.back()} className="neo-button" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem' }}>Create Invoice <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{invoiceId}</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fill in the details below. Data is saved to your browser.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>

                    {/* Main form */}
                    <div className="glass" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Invoice Details</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <Field label="Invoice Number">
                                <input style={inputStyle} value={invoiceId} disabled className="glass mono" />
                            </Field>
                            <Field label="Project Name *">
                                <input
                                    style={inputStyle}
                                    placeholder="e.g. Website Redesign"
                                    className="glass"
                                    required
                                    value={form.project}
                                    onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
                                />
                            </Field>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '1.5rem' }}>
                            <Field label="Invoice Date">
                                <input
                                    style={inputStyle}
                                    type="date"
                                    className="glass"
                                    value={form.issuedDate}
                                    onChange={e => setForm(f => ({ ...f, issuedDate: e.target.value }))}
                                />
                            </Field>
                            <Field label="Due In">
                                <select
                                    style={inputStyle}
                                    className="glass"
                                    value={form.dueDays}
                                    onChange={e => setForm(f => ({ ...f, dueDays: e.target.value }))}
                                >
                                    <option value="7">7 Days</option>
                                    <option value="15">15 Days</option>
                                    <option value="30">30 Days</option>
                                    <option value="60">Net 60</option>
                                    <option value="90">Net 90</option>
                                </select>
                            </Field>
                            <Field label="Currency">
                                <select
                                    style={inputStyle}
                                    className="glass"
                                    value={form.currency}
                                    onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                                >
                                    <option value="XLM">XLM (Stellar)</option>
                                    <option value="USDC">USDC (Stellar)</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </Field>
                        </div>

                        {/* Line items */}
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr auto', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800 }}>
                                <span>DESCRIPTION</span>
                                <span>RATE</span>
                                <span>QTY</span>
                                <span>TOTAL</span>
                            </div>

                            {items.map((item) => (
                                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr auto', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                                    <input
                                        style={inputStyle}
                                        placeholder="Service or deliverable..."
                                        className="glass"
                                        value={item.description}
                                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                                    />
                                    <input
                                        style={inputStyle}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="glass"
                                        value={item.rate || ''}
                                        onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                    />
                                    <input
                                        style={inputStyle}
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        className="glass"
                                        value={item.quantity || ''}
                                        onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, width: '70px', textAlign: 'right' }}>
                                            {(item.rate * item.quantity).toFixed(2)}
                                        </span>
                                        {items.length > 1 && (
                                            <button type="button" onClick={() => removeItem(item.id)} style={{ color: 'var(--text-muted)' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addItem}
                                style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.875rem' }}
                            >
                                <Plus size={16} /> Add Line Item
                            </button>
                        </div>

                        <Field label="Notes (optional)">
                            <textarea
                                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                placeholder="Payment terms, special instructions..."
                                className="glass"
                                value={form.notes}
                                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                            />
                        </Field>
                    </div>

                    {/* Sidebar */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Client */}
                        <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <h3 style={{ fontSize: '1.05rem' }}>Client Information</h3>

                            {clients.length > 0 && (
                                <Field label="Select Existing Client">
                                    <select className="glass" style={inputStyle} onChange={handleClientSelect} defaultValue="">
                                        <option value="" disabled>— pick a client —</option>
                                        {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        <option value="__new">+ New client (type below)</option>
                                    </select>
                                </Field>
                            )}

                            <Field label={`Client Name${clients.length === 0 ? ' *' : ''}`}>
                                <input
                                    style={inputStyle}
                                    placeholder="Acme Corp"
                                    className="glass"
                                    required
                                    value={form.clientName}
                                    onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                                />
                            </Field>
                            <Field label="Client Email">
                                <input
                                    style={inputStyle}
                                    placeholder="billing@client.com"
                                    className="glass"
                                    type="email"
                                    value={form.clientEmail}
                                    onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
                                />
                            </Field>
                            <Field label="Stellar Wallet (G...)">
                                <input
                                    style={inputStyle}
                                    placeholder="GABC... (optional)"
                                    className="glass mono"
                                    value={form.stellarWallet}
                                    onChange={e => setForm(f => ({ ...f, stellarWallet: e.target.value }))}
                                />
                            </Field>
                        </div>

                        {/* Summary */}
                        <div className="glass" style={{ padding: '2rem', background: 'rgba(99,102,241,0.04)' }}>
                            <h3 style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <Row label="Subtotal" val={`${subtotal.toFixed(2)} ${form.currency}`} />
                                <Row label="Tax (0%)" val="—" />
                                <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.5rem 0' }} />
                                <Row label="Total" val={`${subtotal.toFixed(2)} ${form.currency}`} big />
                                <Row label="Due Date" val={computeDueDate()} mono />
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    padding: '1.1rem',
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    fontWeight: 800,
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    fontSize: '1rem',
                                    boxShadow: '0 10px 20px -5px rgba(99,102,241,0.4)',
                                }}
                            >
                                <Send size={20} /> Finalize & Send
                            </motion.button>
                            <button
                                type="button"
                                onClick={() => persist('draft')}
                                className="neo-button"
                                style={{ padding: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Save size={18} /> Save as Draft
                            </button>
                        </div>
                    </aside>
                </div>
            </form>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
            {children}
        </div>
    );
}

function Row({ label, val, big = false, mono = false }: { label: string; val: string; big?: boolean; mono?: boolean }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: big ? '1.1rem' : '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: big ? 800 : 500 }}>{label}</span>
            <span style={{ fontWeight: big ? 800 : 600, color: big ? 'var(--primary-color)' : undefined }} className={mono ? 'mono' : ''}>{val}</span>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    padding: '0.7rem 1rem',
    borderRadius: '10px',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    width: '100%',
    outline: 'none',
};
