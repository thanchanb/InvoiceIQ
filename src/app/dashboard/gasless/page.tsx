'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    CheckCircle2,
    AlertCircle,
    Info,
    ExternalLink,
    Copy,
    ArrowRight,
    Shield,
} from 'lucide-react';
// gasless library available at @/lib/gasless

interface StepState {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
    txHash?: string;
}

function CodeBlock({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div style={{ position: 'relative' }}>
            <pre className="mono" style={{
                background: 'var(--bg-color)',
                padding: '1.5rem',
                borderRadius: '12px',
                fontSize: '0.78rem',
                color: 'var(--accent-green)',
                lineHeight: 1.7,
                overflowX: 'auto',
                border: '0.5px solid rgba(0,255,178,0.1)',
            }}>
                <code>{code}</code>
            </pre>
            <button
                onClick={handleCopy}
                style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(0,255,178,0.1)',
                    border: '0.5px solid rgba(0,255,178,0.2)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                }}
            >
                <Copy size={12} />{copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
}

const feeBumpCode = `// Gasless Transaction via Fee Bump (Fee Sponsorship)
// The SPONSOR pays the XLM transaction fee on behalf of the user.

import * as StellarSdk from '@stellar/stellar-sdk';

export async function buildFeeBumpTransaction(
  innerTxXDR: string,
  sponsorSecretKey: string, // Platform's fee bot key
  feePerOp: number = 300   // stroops (~0.00003 XLM)
): Promise<string> {

  const server = new StellarSdk.Horizon.Server(
    'https://horizon-testnet.stellar.org'
  );

  // 1. Deserialize the user's signed inner transaction
  const innerTx = StellarSdk.TransactionBuilder
    .fromXDR(innerTxXDR, StellarSdk.Networks.TESTNET);

  // 2. Wrap it in a Fee Bump transaction
  const sponsorKeypair = StellarSdk.Keypair
    .fromSecret(sponsorSecretKey);

  const feeBumpTx = StellarSdk.TransactionBuilder
    .buildFeeBumpTransaction(
      sponsorKeypair,          // fee source account
      feePerOp,                // max fee per op in stroops
      innerTx,                 // wrapped inner tx
      StellarSdk.Networks.TESTNET
    );

  // 3. Sponsor signs the Fee Bump envelope
  feeBumpTx.sign(sponsorKeypair);

  // 4. Submit the Fee Bump to Horizon
  const result = await server.submitTransaction(feeBumpTx);
  return result.hash; // Returns the outer fee bump TX hash
}`;

export default function GaslessPage() {
    const [form, setForm] = useState({ destination: '', amount: '', memo: '' });
    const [stepState, setStepState] = useState<StepState>({ status: 'idle', message: '' });
    const [step, setStep] = useState(0); // 0=form, 1=simulating, 2=done

    const handleSimulate = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep(1);
        setStepState({ status: 'loading', message: 'Building inner payment transaction...' });

        await new Promise(r => setTimeout(r, 900));
        setStepState({ status: 'loading', message: 'Signing inner transaction with user wallet (Freighter)...' });

        await new Promise(r => setTimeout(r, 1000));
        setStepState({ status: 'loading', message: 'Wrapping in Fee Bump — Sponsor pays the fee...' });

        await new Promise(r => setTimeout(r, 1200));
        setStepState({ status: 'loading', message: 'Submitting Fee Bump to Stellar Horizon Testnet...' });

        await new Promise(r => setTimeout(r, 900));

        const mockHash = Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
        setStepState({
            status: 'success',
            message: 'Fee Bump transaction confirmed! User paid 0 XLM in fees.',
            txHash: mockHash,
        });
        setStep(2);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Header */}
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(0,255,178,0.1)', borderRadius: '10px', color: 'var(--accent-green)' }}>
                        <Zap size={22} />
                    </div>
                    <h1 style={{ fontSize: '2rem' }}>Gasless Transactions</h1>
                    <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-indigo)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>
                        ADVANCED FEATURE
                    </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginLeft: '3.5rem' }}>
                    Fee Sponsorship — Users send transactions without needing XLM for fees.
                    A platform-controlled fee-bot pays on their behalf using Stellar&apos;s Fee Bump envelope.
                </p>
            </header>

            {/* How it works */}
            <section className="neo-raised" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Info size={18} color="var(--accent-indigo)" /> How Fee Bump Works
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {[
                        { num: '01', title: 'User Signs', desc: 'User builds & signs an inner payment transaction using Freighter. Zero fees set on inner tx.' },
                        { num: '02', title: 'Sponsor Wraps', desc: "InvoiceIQ's fee-bot wraps the signed inner tx in a Fee Bump envelope." },
                        { num: '03', title: 'Sponsor Pays', desc: 'The fee-bot signs and pays the transaction fee (as low as 0.00001 XLM).' },
                        { num: '04', title: 'Confirmed', desc: "Horizon processes the Fee Bump. User's payment settles with 0 XLM fee cost." },
                    ].map((s) => (
                        <div key={s.num} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)', opacity: 0.4 }}>{s.num}</div>
                            <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.title}</h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</p>
                            {s.num !== '04' && <ArrowRight size={16} color="var(--text-muted)" style={{ marginTop: 'auto' }} />}
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {[
                    { icon: <Zap size={20} />, title: 'Zero UX Friction', desc: 'New users don\'t need XLM to start using InvoiceIQ — no "buy crypto first" onboarding barrier.', color: 'var(--accent-green)' },
                    { icon: <Shield size={20} />, title: 'Non-Custodial', desc: 'The sponsor never controls user funds. Inner transactions are user-signed first.', color: 'var(--accent-indigo)' },
                    { icon: <CheckCircle2 size={20} />, title: 'SEP-0023 Compliant', desc: 'Built on the official Stellar Fee Bump transaction spec. Production-battle-tested.', color: 'var(--accent-amber)' },
                ].map((b) => (
                    <div key={b.title} className="neo-raised" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px', background: b.color }} />
                        <div style={{ color: b.color, marginBottom: '1rem' }}>{b.icon}</div>
                        <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{b.title}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{b.desc}</p>
                    </div>
                ))}
            </div>

            {/* Code Implementation */}
            <section className="neo-raised" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Implementation — <code className="mono" style={{ fontSize: '0.9rem', color: 'var(--accent-green)' }}>lib/gasless.ts</code></h3>
                <CodeBlock code={feeBumpCode} />
            </section>

            {/* Live Demo Sandbox */}
            <section className="neo-raised" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Live Demo Sandbox</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                    Simulate a gasless invoice payment. The transaction will be built but only simulated (no real XLM sent).
                </p>

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.form key="form" onSubmit={handleSimulate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '600px' }}>
                            {[
                                { label: 'Recipient Address (G...)', key: 'destination', placeholder: 'GDVQIYIG7ABVVLN5HN...' },
                                { label: 'Amount (XLM)', key: 'amount', placeholder: '100' },
                                { label: 'Invoice Memo (optional)', key: 'memo', placeholder: 'INV-031' },
                            ].map(({ label, key, placeholder }) => (
                                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</label>
                                    <input
                                        placeholder={placeholder}
                                        value={(form as any)[key]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        required={key !== 'memo'}
                                        style={{ padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem' }}
                                    />
                                </div>
                            ))}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    padding: '0.9rem 2rem',
                                    background: 'var(--accent-green)',
                                    color: '#0a0a0a',
                                    fontWeight: 800,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    width: 'fit-content',
                                    boxShadow: '0 10px 30px -5px rgba(0,255,178,0.25)',
                                }}
                            >
                                <Zap size={18} /> Simulate Gasless Transaction
                            </motion.button>
                        </motion.form>
                    )}

                    {step === 1 && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                    <Zap size={22} color="var(--accent-green)" />
                                </motion.div>
                                <p style={{ fontWeight: 600 }}>{stepState.message}</p>
                            </div>
                            <div style={{ height: '4px', borderRadius: '2px', background: 'var(--shadow-dark)', overflow: 'hidden' }}>
                                <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ height: '100%', width: '40%', background: 'var(--accent-green)', borderRadius: '2px' }} />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && stepState.status === 'success' && (
                        <motion.div key="success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--accent-green)' }}>
                                <CheckCircle2 size={28} />
                                <div>
                                    <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{stepState.message}</p>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Fee Bump confirmed — sponsor paid ~0.00003 XLM, user paid 0 XLM</p>
                                </div>
                            </div>
                            <div className="neo-inset" style={{ padding: '1rem 1.25rem', borderRadius: '12px' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }} className="mono">TX HASH (FEE BUMP ENVELOPE)</p>
                                <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-green)', wordBreak: 'break-all' }}>{stepState.txHash}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <a
                                    href={`https://stellar.expert/explorer/testnet/tx/${stepState.txHash}`}
                                    target="_blank"
                                    style={{ padding: '0.6rem 1.25rem', background: 'rgba(0,255,178,0.08)', color: 'var(--accent-green)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(0,255,178,0.15)' }}
                                >
                                    <ExternalLink size={14} /> View on Explorer (demo)
                                </a>
                                <button onClick={() => { setStep(0); setStepState({ status: 'idle', message: '' }); }} style={{ padding: '0.6rem 1.25rem', color: 'var(--text-secondary)', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }} className="neo-button">
                                    Try Another
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Reference */}
            <div className="neo-inset" style={{ padding: '1.25rem 1.5rem', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Built on <strong style={{ color: 'var(--text-primary)' }}>CAP-0015 (Fee Bump Transactions)</strong> — official Stellar Core Advancement Proposal
                </p>
                <a href="https://stellar.org/blog/developers/fee-bump-transactions" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 700 }}>
                    Read Spec <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}
