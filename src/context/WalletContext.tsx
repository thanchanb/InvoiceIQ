'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet } from '@/lib/stellar';

interface WalletContextType {
    address: string | null;
    isConnected: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
    address: null,
    isConnected: false,
    connect: async () => { },
    disconnect: () => { },
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        // Auto-connect if already authorized in previous session
        const stored = localStorage.getItem('stellar_address');
         
        if (stored) setAddress(stored);
    }, []);

    const connect = async () => {
        const wallet = await connectWallet();
        if (wallet.address) {
            setAddress(wallet.address);
            localStorage.setItem('stellar_address', wallet.address);
        }
    };

    const disconnect = () => {
        setAddress(null);
        localStorage.removeItem('stellar_address');
    };

    return (
        <WalletContext.Provider value={{ address, isConnected: !!address, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
