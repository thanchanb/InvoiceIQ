'use client';

import React, { useState, useEffect } from 'react';
import {
    Send,
    Star,
    MessageSquare,
    Wallet,
    Tag,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedbackList, setFeedbackList] = useState<any[]>([]);

    const [form, setForm] = useState({
        name: '',
        email: '',
        wallet: '',
        feedback: ''
    });

    useEffect(() => {
        const saved = localStorage.getItem('invoice_iq_feedback');
        if (saved) setFeedbackList(JSON.parse(saved));
    }, []);

    const handleExport = () => {
        const headers = ["Timestamp", "Full Name", "Email", "Stellar Wallet Address", "Rating (1-5)", "Feedback"];
        const rows = feedbackList.map(f => [
            f.timestamp,
            f.name,
            f.email,
            f.wallet,
            f.rating,
            f.feedback
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "USER_FEEDBACK_EXPORT.csv");
        document.body.appendChild(link);
        link.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newFeedback = {
            ...form,
            rating,
            timestamp: new Date().toLocaleString()
        };

        const updatedList = [...feedbackList, newFeedback];
        setFeedbackList(updatedList);
        localStorage.setItem('invoice_iq_feedback', JSON.stringify(updatedList));

        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100vh - 200px)',
                textAlign: 'center'
            }}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        color: 'var(--secondary-color)'
                    }}
                >
                    <CheckCircle2 size={40} />
                </motion.div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Feedback Received!</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', fontSize: '1.125rem' }}>
                    Thank you for being one of our alpha testers. Your feedback is being processed and will be exported for the Stellar Rise-In challenge review.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="glass"
                    style={{ padding: '0.75rem 2rem', marginTop: '2rem', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}
                >
                    Submit Another Feedback
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Feedback</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Help us improve InvoiceIQ. Part of the Stellar Rise-In Challenge requirements.
                    </p>
                </div>
                {feedbackList.length > 0 && (
                    <button
                        onClick={handleExport}
                        className="glass"
                        style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-color)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    >
                        <Tag size={16} /> EXPORT CSV ({feedbackList.length})
                    </button>
                )}
            </header>

            <motion.form
                onSubmit={handleSubmit}
                className="glass"
                style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <FormGroup label="Full Name" icon={<Tag size={16} />}>
                        <input
                            required
                            className="glass"
                            style={inputStyle}
                            placeholder="e.g. Satoshi Nakamoto"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup label="Email Address" icon={<MessageSquare size={16} />}>
                        <input
                            required
                            type="email"
                            className="glass"
                            style={inputStyle}
                            placeholder="e.g. satoshi@stellar.org"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </FormGroup>
                </div>

                <FormGroup label="Stellar Wallet Address" icon={<Wallet size={16} />}>
                    <input
                        required
                        className="glass"
                        style={inputStyle}
                        placeholder="G..."
                        value={form.wallet}
                        onChange={(e) => setForm({ ...form, wallet: e.target.value })}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        We'll use this to verify you as a testnet participant for the Rise-In challenge.
                    </p>
                </FormGroup>

                <FormGroup label="Overall Experience">
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setRating(s)}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    background: s <= rating ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                    border: s <= rating ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid var(--glass-border)',
                                    color: s <= rating ? 'var(--accent-color)' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'var(--transition-fast)'
                                }}
                            >
                                <Star size={20} fill={s <= rating ? 'var(--accent-color)' : 'transparent'} />
                            </button>
                        ))}
                    </div>
                </FormGroup>

                <FormGroup label="What features would you like to see next?">
                    <textarea
                        required
                        className="glass"
                        style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                        placeholder="e.g. Auto-export to PDF, Tax estimates..."
                        value={form.feedback}
                        onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                    />
                </FormGroup>

                <div style={{
                    background: 'rgba(99, 102, 241, 0.05)',
                    padding: '1.5rem',
                    borderRadius: '14px',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start'
                }}>
                    <AlertCircle color="var(--primary-color)" size={24} style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        By submitting this form, you participate in the <strong>InvoiceIQ Alpha Test Program</strong>.
                        All sessions are on Stellar Testnet only.
                    </p>
                </div>

                <button
                    disabled={loading || rating === 0}
                    type="submit"
                    className="glass"
                    style={{
                        padding: '1rem',
                        background: rating > 0 ? 'var(--primary-color)' : 'rgba(99, 102, 241, 0.1)',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1rem',
                        marginTop: '1rem',
                        opacity: rating > 0 ? 1 : 0.5,
                        cursor: rating > 0 ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        border: 'none',
                        borderRadius: '14px',
                        boxShadow: rating > 0 ? '0 10px 20px -5px rgba(99, 102, 241, 0.3)' : 'none'
                    }}
                >
                    {loading ? 'Submitting...' : (
                        <><Send size={20} /> Submit Feedback</>
                    )}
                </button>
            </motion.form>

            {feedbackList.length > 0 && (
                <section style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Recent Activity ({feedbackList.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {feedbackList.slice().reverse().map((f, i) => (
                            <div key={i} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{f.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.timestamp} • {f.wallet.slice(0, 8)}...</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.2rem' }}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={14} fill={s <= f.rating ? 'var(--accent-color)' : 'transparent'} color={s <= f.rating ? 'var(--accent-color)' : 'var(--text-muted)'} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function FormGroup({ label, children, icon }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {icon} {label}
            </label>
            {children}
        </div>
    );
}

const inputStyle = {
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '0.875rem 1rem',
    borderRadius: '10px',
    border: '1px solid var(--glass-border)',
    color: 'white',
    fontSize: '1rem',
    width: '100%',
    transition: 'var(--transition-fast)'
};
