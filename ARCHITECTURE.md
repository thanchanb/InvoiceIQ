# InvoiceIQ Architecture

## Overview
InvoiceIQ is a smart invoicing and financial analytics SaaS platform designed for the modern freelancer. It provides a seamless experience for managing clients, tracking earnings, and verifying payments on the Stellar blockchain.

## Technology Stack
- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with Design Tokens (Globals.css)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Blockchain**: Stellar SDK (@stellar/stellar-sdk)
- **Deployment**: Vercel / Netlify

## Core Components
### 1. Unified Dashboard
- **Real-time Stats**: Aggregates total earnings, pending payments, and overdue invoices.
- **Revenue Trends**: Visualization of monthly income growth using Area Charts.
- **Financial Health Score**: An AI-modeled score (mocked for MVP) that assesses income diversity and consistency.

### 2. Invoicing System
- **Dynamic Invoice Creator**: Allows on-the-fly addition of services/items.
- **Automatic Calculations**: Handles subtotals, taxes, and totals in real-time.
- **Multicurrency**: Supports USD, XLM (Stellar native), and USDC.

### 3. Analytics Engine
- **Client Revenue Distribution**: Horizontal bar charts showing client value.
- **Strategic Insights**: Actionable tips based on client concentration and monthly peaks.

### 4. Stellar Integration
- **Transaction History**: Directly fetches the last 5 transactions for a connected wallet using Stellar Horizon server.
- **Memo-based Verification**: Every invoice generated is tagged with a unique ID for payment verification on-chain.

### 5. Feedback System
- **Testnet Onboarding**: Collects wallet addresses and product feedback directly in-app.
- **Data Export**: Architecture supports exporting feedback to Excel (using CSV/XLSX libraries) for the Rise-In challenge review.

## User Flow
1. **Landing**: User arrives and sees high-level features.
2. **Dashboard**: User views overall financial health.
3. **Invoice Creation**: User creates an invoice, choosing between USD or Stellar assets.
4. **Analytics**: User analyzes client diversity to improve business resilience.
5. **Feedback**: Participating testnet users submit their data for the challenge rewards.

## Future Roadmap (Phase 2)
- **Stellar Anchor Integration**: Support for more stablecoins.
- **Automated PDF Generation**: Server-side generation of professional invoice PDFs.
- **Email Automation**: Integration with SendGrid/Resend for automated due-date reminders.
- **Tax Prediction**: AI-powered tax estimatation based on project geography.
