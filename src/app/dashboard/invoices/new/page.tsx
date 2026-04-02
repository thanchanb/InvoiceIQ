'use client';

import React, { useState } from 'react';
import {
    X,
    Save,
    Send,
    Plus,
    Trash2,
    Calendar,
    DollarSign,
    User,
    Briefcase,
    ChevronLeft,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewInvoicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [invoiceItems, setInvoiceItems] = useState([
        { id: '1', description: 'Initial Setup & Design', rate: 1200, quantity: 1 }
    ]);

    const addItem = () => {
        setInvoiceItems([...invoiceItems, { id: Math.random().toString(), description: '', rate: 0, quantity: 1 }]);
    };

    const removeItem = (id: string) => {
        setInvoiceItems(invoiceItems.filter(item => item.id !== id));
    };

    const calculateSubtotal = () => {
        return invoiceItems.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 2000);
    };

    if (submitted) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 200px)' }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        width: '100px',
                        height: '100px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                        color: 'var(--primary-color)'
                    }}
                >
                    <CheckCircle2 size={50} />
                </motion.div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Invoice Sent!</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We've sent a notification to your client and logged the transaction.</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/dashboard/invoices" className="glass" style={{ padding: '0.75rem 2rem' }}>View All Invoices</Link>
                    <button onClick={() => setSubmitted(false)} className="glass" style={{ padding: '0.75rem 2rem', background: 'var(--primary-color)', color: 'white' }}>Create Another</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => router.back()} className="glass" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Create New Invoice</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Professional invoicing for your next project.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>

                    <div className="glass" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Invoice Details</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Invoice Number</label>
                                <input style={inputStyle} defaultValue="INV-2026-006" disabled className="glass" />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Project Name</label>
                                <input style={inputStyle} placeholder="e.g. Website Overhaul" className="glass" required />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '1.5rem' }}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Invoice Date</label>
                                <input style={inputStyle} type="date" defaultValue="2026-04-01" className="glass" />
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Due In</label>
                                <select style={inputStyle} className="glass">
                                    <option>15 Days</option>
                                    <option>30 Days</option>
                                    <option>Net 60</option>
                                    <option>Custom</option>
                                </select>
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Currency</label>
                                <select style={inputStyle} className="glass">
                                    <option>XLM (Stellar)</option>
                                    <option>USDC (Stellar)</option>
                                    <option>USD (International)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 0.5fr', gap: '1rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800 }}>
                                <span>DESCRIPTION</span>
                                <span>RATE</span>
                                <span>QTY</span>
                                <span>TOTAL</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {invoiceItems.map((item, index) => (
                                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 0.5fr', gap: '1rem', alignItems: 'center' }}>
                                        <input
                                            style={inputStyle}
                                            placeholder="Service description..."
                                            className="glass"
                                            value={item.description}
                                            onChange={(e) => {
                                                const newItems = [...invoiceItems];
                                                newItems[index].description = e.target.value;
                                                setInvoiceItems(newItems);
                                            }}
                                        />
                                        <input
                                            style={inputStyle}
                                            type="number"
                                            placeholder="0.00"
                                            className="glass"
                                            value={item.rate || ''}
                                            onChange={(e) => {
                                                const newItems = [...invoiceItems];
                                                newItems[index].rate = parseFloat(e.target.value) || 0;
                                                setInvoiceItems(newItems);
                                            }}
                                        />
                                        <input
                                            style={inputStyle}
                                            type="number"
                                            placeholder="1"
                                            className="glass"
                                            value={item.quantity || ''}
                                            onChange={(e) => {
                                                const newItems = [...invoiceItems];
                                                newItems[index].quantity = parseFloat(e.target.value) || 0;
                                                setInvoiceItems(newItems);
                                            }}
                                        />
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, width: '60px' }}>
                                            ${(item.rate * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addItem}
                                style={{
                                    marginTop: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--primary-color)',
                                    fontWeight: 700,
                                    fontSize: '0.875rem'
                                }}
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        </div>
                    </div>

                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem' }}>Client Information</h3>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Select Client</label>
                                <select className="glass" style={inputStyle}>
                                    <option>Acme Corp</option>
                                    <option>Stellar Labs</option>
                                    <option>Nebula UI</option>
                                    <option>+ Add New Client</option>
                                </select>
                            </div>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Client Email</label>
                                <input style={inputStyle} placeholder="billing@client.com" className="glass" type="email" />
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '2rem', background: 'rgba(99, 102, 241, 0.05)' }}>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                                    <span style={{ fontWeight: 600 }}>${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Taxes (0%)</span>
                                    <span style={{ fontWeight: 600 }}>$0.00</span>
                                </div>
                                <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.5rem 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
                                    <span style={{ fontWeight: 800 }}>Total</span>
                                    <span style={{ fontWeight: 800, color: 'var(--primary-color)' }}>
                                        ${calculateSubtotal().toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    borderRadius: '14px',
                                    padding: '1.25rem',
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    fontSize: '1rem',
                                    boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)'
                                }}
                            >
                                {loading ? 'Processing...' : (
                                    <><Send size={20} /> Finalize & Send</>
                                )}
                            </button>
                            <button type="button" className="glass" style={{ padding: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Save size={18} /> Save as Draft
                            </button>
                        </div>
                    </aside>

                </div>
            </form>
        </div>
    );
}

const formGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
};

const labelStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
};

const inputStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '0.95rem',
    width: '100%',
    outline: 'none'
};
