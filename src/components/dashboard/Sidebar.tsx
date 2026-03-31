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
    FilePlus,
    MessageSquareShare
} from 'lucide-react';

const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Invoices', icon: FileText, href: '/dashboard/invoices' },
    { name: 'Clients', icon: Users, href: '/dashboard/clients' },
    { name: 'Analytics', icon: TrendingUp, href: '/dashboard/analytics' },
    { name: 'Feedback', icon: MessageSquareShare, href: '/dashboard/feedback' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="glass-dark" style={{
            width: '280px',
            height: '100vh',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            borderRight: '1px solid var(--glass-border)',
            borderRadius: 0
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
                <div style={{
                    background: 'var(--primary-color)',
                    padding: '0.4rem',
                    borderRadius: '8px',
                    display: 'flex'
                }}>
                    <FileText size={20} color="white" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                    InvoiceIQ
                </span>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.9rem 1.25rem',
                            borderRadius: '12px',
                            color: isActive ? 'white' : 'var(--text-secondary)',
                            background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                            fontWeight: isActive ? 600 : 500,
                            border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                            transition: 'var(--transition-fast)'
                        }}>
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(99, 102, 241, 0.05)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Stellar Wallet</p>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        wordBreak: 'break-all',
                        fontFamily: 'monospace',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '0.5rem',
                        borderRadius: '6px'
                    }}>
                        G...XLMTEST
                    </div>
                </div>

                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    color: 'var(--danger-color)',
                    fontWeight: 600,
                    opacity: 0.8
                }}>
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );
}
