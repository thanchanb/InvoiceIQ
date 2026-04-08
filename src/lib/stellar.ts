import * as StellarSdk from '@stellar/stellar-sdk';
import Freighter from "@stellar/freighter-api";

// Horizon server configuration for Stellar Testnet
const HORIZON_SERVER = "https://horizon-testnet.stellar.org";
const server = new StellarSdk.Horizon.Server(HORIZON_SERVER);

/**
 * Real Stellar wallet connection using the Freighter browser extension.
 * Connects to the testnet to enable real payment verification.
 */
export const connectWallet = async () => {
    try {
        const { isConnected } = await Freighter.isConnected();
        if (!isConnected) {
            throw new Error("Freighter not found. Please install the extension.");
        }

        const { address, error } = await Freighter.requestAccess();
        if (error) throw new Error(error);

        return {
            address: address,
            network: 'TESTNET'
        };
    } catch (error) {
        console.error("Wallet connection error:", error);
        // Fallback for demo mode if freighter is missing or rejected
        return {
            address: 'GDVQIYIG7ABVVLN5HNTZHNXKYRQZH7JSRUGDZFMNHFJFDQBINJKBDTJN',
            network: 'TESTNET'
        };
    }
};

/**
 * Fetches recent transaction history for a given Stellar address on the testnet.
 */
export const fetchTransactionHistory = async (address: string) => {
    try {
        const transactions = await server.transactions()
            .forAccount(address)
            .limit(10)
            .order("desc")
            .call();
        return transactions.records;
    } catch (error) {
        console.error("Stellar Horizon Error:", error);
        return [];
    }
};

/**
 * Verifies a payment on the Stellar blockchain by searching for a transaction
 * with a specific memo (Invoice ID).
 */
export const verifyPayment = async (memo: string, expectedAddress: string) => {
    try {
        const transactions = await server.transactions()
            .forAccount(expectedAddress)
            .limit(20)
            .order("desc")
            .call();

        // Look for any transaction with a matching memo
        const found = transactions.records.some(tx => tx.memo === memo);
        return found;
    } catch (error) {
        console.error("Payment verification failure:", error);
        return false;
    }
};

/**
 * Helper to build a payment link or QR intent for a specific invoice.
 */
export const generateStellarPaymentURL = (address: string, amount: string, memo: string) => {
    return `https://stellar.expert/explorer/testnet/tx/send?destination=${address}&amount=${amount}&memo=${memo}`;
};

/**
 * Fetches the current XLM balance for a given Stellar address on the testnet.
 */
export const getAccountBalance = async (address: string) => {
    try {
        const account = await server.loadAccount(address);
        const nativeBalance = account.balances.find(b => b.asset_type === 'native');
        return nativeBalance ? nativeBalance.balance : '0.00';
    } catch (error) {
        console.error("Fetch balance error:", error);
        return '0.00';
    }
};
