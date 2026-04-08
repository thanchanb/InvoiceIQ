'use client';

import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Wallet, Check, Key, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProfile, saveProfile, getSettings, saveSettings, type UserProfile, type AppSettings } from '@/lib/store';
import { useWallet } from '@/context/WalletContext';

const TABS = [
    { id: 'identity', icon: <User size={18} />, label: 'Identity' },
    { id: 'vault', icon: <Wallet size={18} />, label: 'Vault' },
    { id: 'preferences', icon: <Cpu size={18} />, label: 'Preferences' },
];

export default function SettingsPage() {
    const { address, isConnected } = useWallet();
    const [tab, setTab] = useState('identity');
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({ name: '', email: '', currency: 'XLM', businessName: '', stellarWallet: '' });
    const [settings, setSettings] = useState<AppSettings>({ defaultCurrency: 'XLM', defaultDueDays: 30, autoConnectWallet: true, preferUSDC: false });

    useEffect(() => {
        setProfile(getProfile());
        setSettings(getSettings());
    }, []);

    // Sync connected wallet address into profile
    useEffect(() => {
        if (isConnected && address && !profile.stellarWallet) {
            setProfile(p => ({ ...p, stellarWallet: address }));
        }
    }, [isConnected, address, profile.stellarWallet]);

    const handleSave = () => {
        saveProfile(profile);
        saveSettings(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1100px' }}>
            <header>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 700 }}>Settings</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Manage your profile, connected wallet, and application preferences.</p>
            </header>

            <div style={{ display: 'flex', gap: '3rem' }}>
                {/* Tabs */}
                <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.9rem 1.25rem', borderRadius: '12px',
                                color: tab === t.id ? 'var(--accent-green)' : 'var(--text-secondary)',
                                fontWeight: tab === t.id ? 700 : 500,
                                textAlign: 'left',
                            }}
                            className={tab === t.id ? 'neo-inset' : ''}
                        >
                            {t.icon}<span>{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {tab === 'identity' && (
                        <section className="neo-raised" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
                                <div className="neo-raised" style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                                    {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                                    <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '10px', height: '10px', background: isConnected ? 'var(--accent-green)' : 'var(--text-muted)', borderRadius: '50%', border: '2px solid var(--surface-color)' }} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{profile.name || 'Your Name'}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{profile.email || 'your@email.com'}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <Field label="Full Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="John Doe" />
                                <Field label="Email" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} placeholder="you@email.com" type="email" />
                                <Field label="Business / Freelance Name" value={profile.businessName ?? ''} onChange={v => setProfile(p => ({ ...p, businessName: v }))} placeholder="My Studio" />
                                <Field label="Default Currency" value="" onChange={() => { }} type="select">
                                    <select value={profile.currency} onChange={e => setProfile(p => ({ ...p, currency: e.target.value }))} style={inputSt}>
                                        {['XLM', 'USDC', 'USD', 'EUR', 'GBP'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </Field>
                            </div>
                        </section>
                    )}

                    {tab === 'vault' && (
                        <section className="neo-raised" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Key size={20} color="var(--accent-amber)" /> Stellar Vault
                                </h3>
                                <span style={{ padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 800, background: isConnected ? 'rgba(0,255,178,0.1)' : 'rgba(100,116,139,0.1)', color: isConnected ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                                    {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                                </span>
                            </div>

                            <div className="neo-inset" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                                <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 800 }}>CONNECTED_ADDRESS</p>
                                <p className="mono" style={{ fontSize: '0.85rem', color: isConnected ? 'var(--accent-green)' : 'var(--text-muted)', wordBreak: 'break-all' }}>
                                    {isConnected && address ? address : 'Not connected — click "Connect Wallet" in the top bar.'}
                                </p>
                            </div>

                            <Field
                                label="Payout Wallet (override)"
                                value={profile.stellarWallet ?? ''}
                                onChange={v => setProfile(p => ({ ...p, stellarWallet: v }))}
                                placeholder="GABC... (leave blank to use connected wallet)"
                                mono
                            />

                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                Your payout wallet address is embedded as a memo on invoices so clients know where to send payments.
                                This is your <strong>public key only</strong> — never share private keys.
                            </p>
                        </section>
                    )}

                    {tab === 'preferences' && (
                        <section className="neo-raised" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>Application Preferences</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <Field label="Default Due Days" value="" onChange={() => { }} type="select">
                                    <select value={settings.defaultDueDays} onChange={e => setSettings(s => ({ ...s, defaultDueDays: parseInt(e.target.value) }))} style={inputSt}>
                                        {[7, 15, 30, 60, 90].map(d => <option key={d} value={d}>{d} Days</option>)}
                                    </select>
                                </Field>
                                <Field label="Default Currency" value="" onChange={() => { }} type="select">
                                    <select value={settings.defaultCurrency} onChange={e => setSettings(s => ({ ...s, defaultCurrency: e.target.value }))} style={inputSt}>
                                        {['XLM', 'USDC', 'USD', 'EUR'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </Field>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <Toggle label="Auto-connect wallet on startup" checked={settings.autoConnectWallet} onChange={v => setSettings(s => ({ ...s, autoConnectWallet: v }))} />
                                <Toggle label="Prefer USDC settlements over XLM" checked={settings.preferUSDC} onChange={v => setSettings(s => ({ ...s, preferUSDC: v }))} />
                            </div>
                        </section>
                    )}

                    {/* Save Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button className="neo-button" style={{ padding: '0.8rem 1.75rem' }} onClick={() => { setProfile(getProfile()); setSettings(getSettings()); }}>
                            Reset
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleSave}
                            style={{ padding: '0.85rem 2rem', background: saved ? 'var(--accent-green)' : 'var(--primary-color)', color: saved ? '#0a0a0a' : 'white', fontWeight: 800, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 8px 20px -4px rgba(99,102,241,0.3)', transition: 'background 0.3s' }}
                        >
                            <Check size={18} />
                            {saved ? 'Saved!' : 'Save Settings'}
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, placeholder = '', type = 'text', mono = false, children }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; mono?: boolean; children?: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
            {children ?? (
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ ...inputSt, fontFamily: mono ? 'JetBrains Mono, monospace' : undefined }}
                />
            )}
        </div>
    );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</span>
            <button onClick={() => onChange(!checked)} style={{ width: '44px', height: '24px', borderRadius: '100px', position: 'relative', padding: '3px', background: checked ? 'rgba(0,255,178,0.2)' : 'rgba(255,255,255,0.05)', border: '0.5px solid ' + (checked ? 'rgba(0,255,178,0.3)' : 'rgba(255,255,255,0.1)'), transition: 'all 0.3s' }}>
                <motion.div animate={{ x: checked ? 20 : 0 }} transition={{ type: 'spring', stiffness: 300 }} style={{ width: '18px', height: '18px', borderRadius: '50%', background: checked ? 'var(--accent-green)' : 'var(--text-muted)', boxShadow: checked ? '0 0 8px var(--accent-green)' : 'none' }} />
            </button>
        </div>
    );
}

const inputSt: React.CSSProperties = {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.02)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    width: '100%',
};
