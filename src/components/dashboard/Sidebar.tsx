'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Users,
    TrendingUp,
    Settings,
    LogOut,
    Hexagon,
    MessageSquareShare,
    BarChart2,
    Activity,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const mainMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Invoices', icon: FileText, href: '/dashboard/invoices' },
    { name: 'Clients', icon: Users, href: '/dashboard/clients' },
    { name: 'Analytics', icon: TrendingUp, href: '/dashboard/analytics' },
    { name: 'Metrics', icon: BarChart2, href: '/dashboard/metrics' },
    { name: 'Monitoring', icon: Activity, href: '/dashboard/monitoring' },
    { name: 'Security', icon: ShieldCheck, href: '/dashboard/security' },
    { name: 'Gasless', icon: Zap, href: '/dashboard/gasless' },
    { name: 'Feedback', icon: MessageSquareShare, href: '/dashboard/feedback' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div style={{
            width: '72px',
            height: '100vh',
            padding: '1.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'fixed',
            left: 0,
            top: 0,
            background: 'var(--bg-color)',
            zIndex: 100,
            borderRight: '0.5px solid rgba(255, 255, 255, 0.05)'
        }}>
            {/* Logo: geometric mark with glow */}
            <div style={{
                marginBottom: '3rem',
                color: 'var(--accent-green)',
                filter: 'drop-shadow(0 0 8px rgba(0, 255, 178, 0.4))'
            }}>
                <Hexagon size={32} strokeWidth={2.5} fill="rgba(0, 255, 178, 0.1)" />
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {mainMenuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`neo-sidebar-item ${isActive ? 'active' : ''}`}
                            style={{ position: 'relative' }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sideglow"
                                    style={{
                                        position: 'absolute',
                                        left: '-12px',
                                        width: '4px',
                                        height: '24px',
                                        background: 'var(--accent-green)',
                                        borderRadius: '0 4px 4px 0',
                                        boxShadow: '0 0 10px var(--accent-green)'
                                    }}
                                />
                            )}
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </Link>
                    );
                })}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                <Link href="/" className="neo-sidebar-item" style={{ color: 'var(--accent-red)' }}>
                    <LogOut size={22} />
                </Link>

                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--surface-color)',
                        boxShadow: '4px 4px 8px var(--shadow-dark), -4px -4px 8px var(--shadow-light)',
                        border: '0.5px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)'
                    }}>
                        R
                    </div>
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '8px',
                        height: '8px',
                        background: 'var(--accent-green)',
                        borderRadius: '50%',
                        border: '2px solid var(--bg-color)',
                        boxShadow: '0 0 5px var(--accent-green)'
                    }} />
                </div>
            </div>
        </div>
    );
}
