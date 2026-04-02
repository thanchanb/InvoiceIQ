'use client';

import React, { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Wallet,
    Check,
    CreditCard,
    ExternalLink,
    Lock,
    Eye,
    Moon,
    Globe,
    Cpu,
    Fingerprint,
    Key
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: '1200px' }}>
            <header>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Terminal Preferences</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Configure your professional nodes and cryptographic identites.</p>
            </header>

            <div style={{ display: 'flex', gap: '4rem' }}>
                {/* Navigation Tabs (Neo Inset) */}
                <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="neo-inset p-4">
                    <TabItem icon={<User size={18} />} label="Identiy" active />
                    <TabItem icon={<Wallet size={18} />} label="Vault" />
                    <TabItem icon={<Bell size={18} />} label="Transmissions" />
                    <TabItem icon={<Shield size={18} />} label="Encryption" />
                    <TabItem icon={<Cpu size={18} />} label="Nodes" />
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    {/* Identity Section */}
                    <section className="neo-raised" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div className="neo-raised" style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: 'var(--accent-green)',
                                position: 'relative'
                            }}>
                                R
                                <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '12px', height: '12px', background: 'var(--accent-green)', borderRadius: '50%', border: '2px solid var(--surface-color)', boxShadow: '0 0 10px var(--accent-green)' }} />
                            </div>
                            <div>
                                <h3 className="mono" style={{ fontSize: '1.25rem', fontWeight: 600 }}>USER_0xRAHUL</h3>
                                <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>UUID: 459032...NET_NODE_01</p>
                                <button className="neo-button" style={{ marginTop: '1rem', fontSize: '0.75rem', padding: '0.5rem 1rem' }}>Update Protocols</button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <FormGroup label="Full Name" value="Rahul" />
                            <FormGroup label="Root Email" value="testnet@invoiceiq.dev" />
                            <FormGroup label="Node Location" value="Global / Decentralized" />
                            <FormGroup label="Encryption Level" value="256-bit AES" />
                        </div>
                    </section>

                    {/* Vault Section */}
                    <section className="neo-raised" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Key size={20} color="var(--accent-amber)" />
                                Stellar Vault Access
                            </h3>
                            <span className="badge-neo badge-paid">CONNECTED</span>
                        </div>

                        <div className="neo-inset" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                            <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 800 }}>PAYOUT_ADDRESS_HASH</p>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div className="mono" style={{
                                    flex: 1,
                                    fontSize: '0.85rem',
                                    color: 'var(--accent-green)',
                                    wordBreak: 'break-all'
                                }}>
                                    GA7...XLMTEST459032...NET_0xc0ffee
                                </div>
                                <button className="neo-button" style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--accent-red)',
                                    padding: '0.5rem 1rem'
                                }}>Purge</button>
                            </div>
                        </div>
                    </section>

                    {/* Preferences */}
                    <section className="neo-raised" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Node Permissions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <ToggleGroup label="Auto-Connect Vault on Initialization" active />
                            <ToggleGroup label="Prioritize stablecoin (USDC) settlements" active />
                            <ToggleGroup label="Execute hardware signing (FIDO2)" />
                        </div>
                    </section>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', marginTop: '2rem' }}>
                        <button className="neo-button">Abort</button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            style={{
                                width: '200px',
                                background: saved ? 'var(--accent-green)' : 'var(--surface-color)',
                                color: saved ? 'var(--bg-color)' : 'var(--text-primary)',
                                fontWeight: 800
                            }}
                            className="neo-button"
                        >
                            {saved ? 'INITIALIZED ✓' : 'SYNC_NODE'}
                        </motion.button>
                    </div>

                </div>
            </div>
        </div>
    );
}

function TabItem({ icon, label, active = false }: any) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '12px',
            color: active ? 'var(--accent-green)' : 'var(--text-secondary)',
            fontWeight: active ? 700 : 400,
            textShadow: active ? '0 0 10px rgba(0, 255, 178, 0.4)' : 'none'
        }} className={active ? 'neo-inset' : ''}>
            {icon}
            <span style={{ fontSize: '0.95rem' }} className={active ? 'mono' : ''}>{label}</span>
        </div>
    );
}

function FormGroup({ label, value }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="mono" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{label.toUpperCase()}</label>
            <input
                type="text"
                defaultValue={value}
                className="mono"
                style={{ fontSize: '0.9rem' }}
            />
        </div>
    );
}

function ToggleGroup({ label, active = false }: any) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
            <div
                className="neo-inset"
                style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '100px',
                    position: 'relative',
                    cursor: 'pointer',
                    padding: '3px'
                }}
            >
                <motion.div
                    initial={false}
                    animate={{ x: active ? 20 : 0 }}
                    style={{
                        width: '18px',
                        height: '18px',
                        background: active ? 'var(--accent-green)' : 'var(--text-muted)',
                        borderRadius: '50%',
                        boxShadow: active ? '0 0 8px var(--accent-green)' : 'none'
                    }}
                />
            </div>
        </div>
    );
}
