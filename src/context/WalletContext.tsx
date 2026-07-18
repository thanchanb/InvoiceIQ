'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet } from '@/lib/stellar';

interface WalletContextType {
    address: string | null;
    network: 'TESTNET' | 'MAINNET';
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
    setNetwork: (network: 'TESTNET' | 'MAINNET') => void;
}

const WalletContext = createContext<WalletContextType>({
    address: null,
    network: 'TESTNET',
    isConnected: false,
    connect: async () => { },
    disconnect: () => { },
    setNetwork: () => { },
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [network, setNetworkState] = useState<'TESTNET' | 'MAINNET'>('TESTNET');

    useEffect(() => {
        // Auto-connect if already authorized in previous session
        const stored = localStorage.getItem('stellar_address');
        if (stored) setAddress(stored);

        // Load network settings
        const rawSettings = localStorage.getItem('invoiceiq:settings');
        if (rawSettings) {
            try {
                const settings = JSON.parse(rawSettings);
                if (settings.network) {
                    setNetworkState(settings.network);
                }
            } catch {}
        }
    }, []);

    const connect = async () => {
        const wallet = await connectWallet();
        if (wallet.address) {
            setAddress(wallet.address);
            localStorage.setItem('stellar_address', wallet.address);
        }
        if (wallet.network) {
            setNetworkState(wallet.network as 'TESTNET' | 'MAINNET');
        }
    };

    const disconnect = () => {
        setAddress(null);
        localStorage.removeItem('stellar_address');
    };

    const setNetwork = (net: 'TESTNET' | 'MAINNET') => {
        setNetworkState(net);
        const rawSettings = localStorage.getItem('invoiceiq:settings');
        try {
            const settings = rawSettings ? JSON.parse(rawSettings) : {};
            settings.network = net;
            localStorage.setItem('invoiceiq:settings', JSON.stringify(settings));
        } catch {
            localStorage.setItem('invoiceiq:settings', JSON.stringify({ network: net }));
        }
        // Force trigger storage event for active tabs
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <WalletContext.Provider value={{ address, network, isConnected: !!address, connect, disconnect, setNetwork }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
