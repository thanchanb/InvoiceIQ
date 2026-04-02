'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Bell, Search, Moon, Sun, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
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
                            <span style={{ color: 'var(--text-secondary)' }}>Good morning, Rahul</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 400 }}>— {currentTime}</span>
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                        {/* Neomorphic Light/Dark Toggle */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem',
                            borderRadius: '100px',
                            background: 'var(--surface-color)',
                            boxShadow: 'inset 4px 4px 8px var(--shadow-dark), inset -4px -4px 8px var(--shadow-light)'
                        }}>
                            <motion.div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent-amber)',
                                    background: 'var(--surface-color)',
                                    boxShadow: '4px 4px 8px var(--shadow-dark), -4px -4px 8px var(--shadow-light)'
                                }}
                            >
                                <Moon size={16} fill="currentColor" />
                            </motion.div>
                        </div>

                        {/* Search Bar (Inset) */}
                        <div style={{
                            position: 'relative',
                            width: '320px',
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
                                    height: '44px',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}
                                className="neo-button"
                            >
                                <Bell size={20} strokeWidth={2.5} />
                                <span style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    width: '8px',
                                    height: '8px',
                                    background: 'var(--accent-red)',
                                    borderRadius: '50%',
                                    border: '2px solid var(--bg-color)',
                                    boxShadow: '0 0 10px var(--accent-red)'
                                }}></span>
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
