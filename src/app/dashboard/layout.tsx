'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Bell, Search, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { address, isConnected, connect, disconnect } = useWallet();
    const [currentTime, setCurrentTime] = useState('09:41 AM');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        const timer = setInterval(updateTime, 1000);
        updateTime();
        return () => clearInterval(timer);
    }, []);

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
            <Sidebar />

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                position: 'relative',
                marginLeft: '72px'
            }}>
                {/* Top Bar */}
                <header style={{
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 4rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90,
                    background: 'var(--bg-color)',
                    borderBottom: '0.5px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Welcome to Terminal</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 400 }}>— {currentTime}</span>
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        {/* Search Bar (Inset) */}
                        <div style={{
                            position: 'relative',
                            width: '280px',
                            display: 'flex',
                            alignItems: 'center'
                        }} className="neo-inset">
                            <Search
                                style={{ position: 'absolute', left: '1.2rem', opacity: 0.4 }}
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search terminal..."
                                style={{
                                    width: '100%',
                                    background: 'none',
                                    boxShadow: 'none',
                                    paddingLeft: '3.2rem',
                                    paddingRight: '1rem',
                                    height: '42px',
                                    fontSize: '0.85rem'
                                }}
                            />
                        </div>

                        {/* Wallet Area */}
                        {isConnected ? (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={disconnect}
                                    style={{
                                        padding: '0.6rem 1.25rem',
                                        borderRadius: '12px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        color: 'var(--accent-green)',
                                        border: '1px solid rgba(0, 255, 178, 0.2)',
                                        background: 'rgba(0, 255, 178, 0.03)'
                                    }}
                                    className="mono"
                                >
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 10px var(--accent-green)' }} />
                                    {truncateAddress(address!)}
                                </motion.button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={connect}
                                style={{
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.3)'
                                }}
                            >
                                <Wallet size={16} />
                                CONNECT WALLET
                            </motion.button>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                className="neo-button"
                            >
                                <Bell size={18} strokeWidth={2.5} />
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ padding: '4rem', flex: 1 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
