'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, LayoutGrid } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background-color)' }}>
            <Sidebar />

            <main style={{ flex: 1, marginLeft: '280px', padding: '2rem 3rem', minHeight: '100vh', position: 'relative' }}>
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: '280px',
                    right: 0,
                    height: '80px',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(12, 12, 14, 0.7)',
                    borderBottom: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 3rem',
                    zIndex: 10
                }}>
                    <div style={{ position: 'relative', width: '320px' }}>
                        <Search
                            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
                            size={18}
                        />
                        <input
                            className="glass"
                            placeholder="Search invoices, clients..."
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem 0.8rem 3rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Bell size={20} style={{ opacity: 0.6 }} />
                            <div style={{
                                position: 'absolute',
                                top: '-3px',
                                right: '-3px',
                                width: '8px',
                                height: '8px',
                                background: 'var(--primary-color)',
                                borderRadius: '50%',
                                border: '2px solid var(--background-color)'
                            }}></div>
                        </div>

                        <div className="glass" style={{
                            padding: '0.5rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            borderRadius: '100px',
                            cursor: 'pointer'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <User size={18} color="white" />
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Testnet User #1</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '80px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
