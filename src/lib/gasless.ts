/**
 * gasless.ts — Fee Bump Transaction (Fee Sponsorship) Module
 * 
 * Advanced Feature: Gasless UX for InvoiceIQ users.
 * The fee-bot (platform account) wraps user-signed transactions in a
 * Fee Bump envelope and pays the XLM fee on their behalf.
 * 
 * Reference: CAP-0015 (Stellar Core Advancement Proposal)
 * https://stellar.org/blog/developers/fee-bump-transactions
 */

import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

/**
 * Wraps a user-signed inner transaction in a Fee Bump envelope.
 * The fee source (sponsor) pays the network fee instead of the inner signer.
 * 
 * @param innerTxXDR - Base64-encoded XDR of the signed inner transaction
 * @param sponsorSecret - Secret key of the platform fee-bot account
 * @param feePerOp - Max fee per operation in stroops (default: 300 = 0.00003 XLM)
 * @returns The submitted Fee Bump transaction hash
 */
export async function buildFeeBumpTransaction(
    innerTxXDR: string,
    sponsorSecret: string,
    feePerOp: number = 300
): Promise<string> {
    try {
        // 1. Deserialize the user's signed inner transaction from XDR
        const innerTx = StellarSdk.TransactionBuilder.fromXDR(
            innerTxXDR,
            StellarSdk.Networks.TESTNET
        ) as StellarSdk.Transaction;

        // 2. Build the Fee Bump envelope with the sponsor as fee source
        const sponsorKeypair = StellarSdk.Keypair.fromSecret(sponsorSecret);

        const feeBumpTx = StellarSdk.TransactionBuilder.buildFeeBumpTransaction(
            sponsorKeypair,             // fee source: the sponsor account
            feePerOp.toString(),        // max fee per operation (in stroops)
            innerTx,                    // the inner transaction to wrap
            StellarSdk.Networks.TESTNET
        );

        // 3. Sponsor signs the outer Fee Bump envelope
        feeBumpTx.sign(sponsorKeypair);

        // 4. Submit the full Fee Bump transaction to Horizon
        const result = await server.submitTransaction(feeBumpTx);

        return result.hash;
    } catch (error: any) {
        console.error('[gasless] Fee Bump submission failed:', error?.response?.data?.extras?.result_codes ?? error.message);
        throw error;
    }
}

/**
 * Builds a simple XLM payment transaction that the user signs with Freighter.
 * This inner transaction is then wrapped in a Fee Bump by the sponsor.
 * 
 * @param sourceAddress - Stellar address of the user (payment sender)
 * @param destinationAddress - Stellar address of the recipient
 * @param amount - Amount in XLM (as string)
 * @param memo - Optional memo (invoice ID)
 * @returns Base64-encoded XDR of the unsigned inner transaction
 */
export async function buildInnerPaymentTransaction(
    sourceAddress: string,
    destinationAddress: string,
    amount: string,
    memo?: string
): Promise<string> {
    const sourceAccount = await server.loadAccount(sourceAddress);

    const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: '0',   // Inner tx fee is 0 — sponsor will pay via Fee Bump
        networkPassphrase: StellarSdk.Networks.TESTNET,
    })
        .addOperation(
            StellarSdk.Operation.payment({
                destination: destinationAddress,
                asset: StellarSdk.Asset.native(),
                amount: amount,
            })
        )
        .setTimeout(180);

    if (memo) {
        txBuilder.addMemo(StellarSdk.Memo.text(memo));
    }

    const tx = txBuilder.build();

    // Return XDR for user to sign via Freighter
    return tx.toXDR();
}

/**
 * Simulate a gasless round-trip (for demo / testing purposes).
 * Returns a mock fee bump hash without hitting the real testnet.
 */
export async function simulateGaslessTransaction(
    destinationAddress: string,
    amount: string,
    memo?: string
): Promise<{ success: boolean; hash: string; feesPaidBySponsor: string }> {
    await new Promise(r => setTimeout(r, 2000));

    const mockHash = Array.from({ length: 64 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');

    return {
        success: true,
        hash: mockHash,
        feesPaidBySponsor: '0.00003 XLM',
    };
}
