import * as StellarSdk from 'stellar-sdk';

// This is for demonstration in the Rise-In Level 4 challenge
// In a real production app, we would use Freighter or Albedo for wallet connection

export const connectWallet = async () => {
    // Mock wallet connection for the MVP
    return {
        address: 'GDVQIYIG7ABVVLN5HNTZHNXKYRQZH7JSRUGDZFMNHFJFDQBINJKBDTJN',
        network: 'TESTNET'
    };
};

export const fetchTransactionHistory = async (address: string) => {
    try {
        const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
        const transactions = await server.transactions()
            .forAccount(address)
            .limit(5)
            .order("desc")
            .call();
        return transactions.records;
    } catch (error) {
        console.error("Stellar Horizon Error:", error);
        return [];
    }
};

export const verifyPayment = async (memo: string) => {
    // Logic to search for a transaction with a specific memo (invoice ID)
    // to confirm a payment has been made via Stellar
    return true; // Simplified for MVP
};
