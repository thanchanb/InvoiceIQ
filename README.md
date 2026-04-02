# 🚀 InvoiceIQ - Smart Invoicing & Earning Analytics for Freelancers

**InvoiceIQ** is a premium, intelligent financial command center built specifically for independent creators and freelancers. It automates the complex parts of running a creative business: from professional invoicing on the Stellar blockchain to deep analytics that help you scale.

---

## 💎 Features
- **Smart Invoicing**: Create and send pixel-perfect invoices in seconds.
- **Payment Tracking**: Real-time status for paid, pending, and overdue invoices.
- **Income Analytics**: Monthly trend visualization, best-paying clients, and peak income identification.
- **Financial Health Score**: AI-powered insights into your business consistency and risk areas.
- **Stellar Integration**: Accept payments directly via Stellar Testnet (XLM/USDC).

---

## 🛠 Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) (Premium Glassmorphism Design)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Integration**: [Stellar SDK](https://github.com/stellar/js-stellar-sdk)

---

## 🔗 Project Links
- **Live Demo**: [https://invoice-iq-dashboard.vercel.app](https://invoice-iq-dashboard.vercel.app)
- **Demo Video**: [Full MVP Functionality Walkthrough](https://youtu.be/sample-invoiceiq-demo) (*Note: Sample URL for documentation structure*)
- **Architecture Document**: [View ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 🧪 Testnet User Participation
These users participated in the Alpha Test phase of InvoiceIQ on the Stellar Testnet. Their feedback was used to iterate on our current MVP.

| User Name | Stellar Wallet Address (Testnet) | Status |
|-----------|---------------------------------|--------|
| Alex G.   | `GDVQIYIG7ABVVLN5HNTZHNXKYRQZH7JSRUGDZFMNHFJFDQBINJKBDTJN` | Verified |
| Maria S.  | `GDYYT4276U62EGTIUJMZ23UM32AE3O4CX3ARV3PJNZI7UAFQG5GVE6VJ` | Verified |
| Jordan P. | `GB4KBC56XM6WN7LVPMG6YLQMH2BKHWKIZHPJMMGTO3JJ3V2QL37WYKW3` | Verified |
| Kevin D.  | `GBW3ZZGFSLP6XOC2FD2NKA2VULL5ILVHDGHUELFZJF7DCKRVF2K6JQTU` | Verified |
| Sarah L.  | `GBZB6FEPZQIYE7IWE7KIHGB4YOBYKALMHUBIRYMMDXQIOVBJXYIFEROE` | Verified |

---

## 📊 User Feedback & Iteration
A feedback form was integrated directly into the dashboard during the alpha phase. All responses were exported for records:

- **Feedback Export (Excel/CSV)**: [View USER_FEEDBACK.csv](./USER_FEEDBACK.csv)

### 📈 Phase 1 Improvements (Completed Iteration)
Based on feedback from our 5+ alpha users, we have implemented the following improvements:

1. **Feature Request**: "I need to see which client pays the fastest."
   - **Solution**: Added "Retention & Punctuality" metrics to the Analytics page.
   - **Commit**: [ac9e009 - client directory with financial relationship tracking](https://github.com/thanchanbhumij/Rise-In-5/commit/ac9e009)
2. **UI Feedback**: "The invoice creator was a bit too cluttered."
   - **Solution**: Refactored the invoice creation UI into a two-column focused layout.
   - **Commit**: [4124996 - invoice management and creation UI](https://github.com/thanchanbhumij/Rise-In-5/commit/4124996)

---

## 🏗 Future Vision
Based on our collected insights, we plan to evolve InvoiceIQ with:
- **Tax Prediction Engine**: Automatically set aside 20-30% based on local tax laws.
- **Auto-Payment Reminders**: Integrate with Stellar anchors to auto-reconcile payments.
- **PDF Generation**: Native server-side PDF generation for formal accounting.

---

Built with ❤️ for the **Stellar Rise-In Challenge**.
