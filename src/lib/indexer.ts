/**
 * indexer.ts — Stellar Transaction Indexer Module
 * 
 * Implements data indexing for InvoiceIQ transactions on Stellar Testnet.
 * Polls the Horizon API and maintains a local in-memory index of processed
 * transactions, supporting fast lookups by address, ledger, or memo (invoice ID).
 * 
 * In production, this would use a persistent database such as Supabase PostgreSQL
 * with proper indexing on (account_id, memo, ledger_attr).
 * 
 * Data Indexing Approach:
 *  - Source: Stellar Horizon REST API (horizon-testnet.stellar.org)
 *  - Polling interval: Every 5 seconds (SSE stream in prod)
 *  - Indexes: address → transactions[], memo → transaction
 *  - Endpoint: /api/indexer/transactions?address=G...
 */

import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export interface IndexedTransaction {
    hash: string;
    ledger: number;
    createdAt: string;
    sourceAccount: string;
    fee: string;
    memo?: string;
    operations: IndexedOperation[];
    successful: boolean;
}

export interface IndexedOperation {
    type: string;
    from?: string;
    to?: string;
    amount?: string;
    asset?: string;
}

// In-memory index — keyed by account address
const transactionIndex: Map<string, IndexedTransaction[]> = new Map();
const memoIndex: Map<string, IndexedTransaction> = new Map();

let lastIndexedLedger = 0;

/**
 * Fetches and indexes all recent transactions for a given account.
 * Subsequent calls update the index incrementally.
 */
export async function indexAccountTransactions(
    accountAddress: string,
    limit = 20
): Promise<IndexedTransaction[]> {
    try {
        const txPage = await server
            .transactions()
            .forAccount(accountAddress)
            .limit(limit)
            .order('desc')
            .call();

        const indexed: IndexedTransaction[] = txPage.records.map((tx: any) => {
            const entry: IndexedTransaction = {
                hash: tx.hash,
                ledger: tx.ledger_attr,
                createdAt: tx.created_at,
                sourceAccount: tx.source_account,
                fee: (parseInt(tx.fee_charged) / 1e7).toFixed(7) + ' XLM',
                memo: tx.memo ?? undefined,
                operations: [],
                successful: tx.successful,
            };

            // Track most recently indexed ledger
            if (entry.ledger > lastIndexedLedger) {
                lastIndexedLedger = entry.ledger;
            }

            // Index by memo (invoice ID reference)
            if (entry.memo) {
                memoIndex.set(entry.memo, entry);
            }

            return entry;
        });

        // Update address index
        transactionIndex.set(accountAddress, indexed);

        return indexed;
    } catch (error) {
        console.error('[indexer] Failed to index account:', accountAddress, error);
        return transactionIndex.get(accountAddress) ?? [];
    }
}

/**
 * Lookup a transaction by invoice memo (e.g., "INV-031")
 */
export function lookupByMemo(memo: string): IndexedTransaction | undefined {
    return memoIndex.get(memo);
}

/**
 * Get all indexed transactions for an account from in-memory cache
 */
export function getCachedTransactions(accountAddress: string): IndexedTransaction[] {
    return transactionIndex.get(accountAddress) ?? [];
}

/**
 * Returns basic indexer health statistics
 */
export function getIndexerStats() {
    return {
        indexedAccounts: transactionIndex.size,
        indexedTransactions: Array.from(transactionIndex.values()).reduce((sum, txs) => sum + txs.length, 0),
        memoIndexSize: memoIndex.size,
        lastIndexedLedger,
        horizonEndpoint: HORIZON_URL,
        status: 'operational',
    };
}

/**
 * Continuous polling indexer — polls Horizon every interval ms.
 * Call this once to start background indexing.
 */
export function startContinuousIndexer(
    accounts: string[],
    intervalMs = 5000
): NodeJS.Timeout {
    const poll = async () => {
        for (const account of accounts) {
            await indexAccountTransactions(account, 10);
        }
        console.log(`[indexer] Polled ${accounts.length} accounts. Last ledger: ${lastIndexedLedger}`);
    };

    poll(); // Initial poll
    return setInterval(poll, intervalMs);
}
