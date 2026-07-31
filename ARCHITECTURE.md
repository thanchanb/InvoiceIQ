# InvoiceIQ — System Architecture (Level 7 Mainnet Production)

## Overview
InvoiceIQ is a Web3 financial management and smart invoicing platform for independent freelancers on the Stellar blockchain. It enables non-custodial payment requests, real-time Horizon transaction indexing, gasless fee sponsorship, and automated PDF export.

```
[ Next.js 16 Client (Vercel) ] ──> [ Freighter Browser Wallet ] ──> [ Stellar Mainnet Ledger ]
             │                                                                 │
             ├──> [ PDF Exporter (jsPDF) ]                                     │
             ├──> [ Horizon Indexer (Polling) ] ◄──────────────────────────────┘
             └──> [ CAP-0015 Fee-Bump Sponsor ] ──> [ Wraps & Pays Fee (~0.00003 XLM) ]
```

## Technology Stack
- **Frontend Framework**: Next.js 16 (App Router + React 19 + Edge Runtime)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Vanilla CSS with Neomorphic Dark Design System
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Blockchain Core**: `@stellar/stellar-sdk` v15 + `@stellar/freighter-api` v6
- **Smart Contract Engine**: Soroban Rust SDK (`contracts/invoice_contract`)
- **PDF Engine**: `jsPDF` + `jspdf-autotable`
- **Deployment & Edge CDN**: Vercel (Edge Network)

## Core Subsystems

### 1. Dynamic Network Switching (`src/lib/stellar.ts`)
- Dynamically routes requests between Stellar Mainnet (`horizon.stellar.org`) and Testnet (`horizon-testnet.stellar.org`) based on user setting.
- Exposes `getActiveNetwork()`, `getServer()`, and `generateStellarPaymentURL()`.

### 2. Gasless Payment Sponsorship (`src/lib/gasless.ts`)
- Implements CAP-0015 Fee Bump envelope wrapping.
- Allows clients to execute payment transactions without needing XLM for network fees.

### 3. Horizon Transaction Indexer (`src/lib/indexer.ts`)
- Continuous Horizon ledger polling indexer tracking accounts and invoice memo references.
- Matches payments to open invoices in < 3 seconds with zero third-party database dependency.

### 4. PDF Invoice Generator (`src/lib/pdf.ts`)
- Client-side rendering of invoice receipts with embedded Stellar transaction hashes, memo references, and verification QR URLs.

### 5. Production Analytics & Health Monitoring (`/dashboard/metrics` & `/dashboard/monitoring`)
- Real-time DAU, MAU, retention cohorts, session tracking, uptime metrics, and API latency logging.

## Security Architecture (`SECURITY.md`)
- Non-custodial key management (Freighter API).
- TLS 1.3 encryption & HTTP security headers (`X-Frame-Options`, `Content-Security-Policy`, `X-Content-Type-Options`).
- Automated CI/CD build gates via GitHub Actions.
