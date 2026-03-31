'use client';

import React, { useState } from 'react';
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate submission
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
            <header>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Feedback</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Help us improve InvoiceIQ. Part of the Stellar Rise-In Challenge requirements.
                </p>
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
                        />
                    </FormGroup>
                    <FormGroup label="Email Address" icon={<MessageSquare size={16} />}>
                        <input
                            required
                            type="email"
                            className="glass"
                            style={inputStyle}
                            placeholder="e.g. satoshi@stellar.org"
                        />
                    </FormGroup>
                </div>

                <FormGroup label="Stellar Wallet Address" icon={<Wallet size={16} />}>
                    <input
                        required
                        className="glass"
                        style={inputStyle}
                        placeholder="G..."
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
