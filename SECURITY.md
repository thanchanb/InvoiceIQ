# Security Policy — InvoiceIQ

## Overview

InvoiceIQ is a client-side, non-custodial Web3 financial dashboard. This document outlines our security architecture, completed audit checklist, and responsible disclosure process.

---

## ✅ Completed Security Checklist (Level 6 — Black Belt)

### Authentication & Authorization
- [x] Freighter wallet-based authentication (non-custodial, users own keys)
- [x] No private keys stored server-side
- [x] Address-only session tokens in localStorage
- [x] Wallet disconnect clears session state

### Smart Contract / Transaction Security
- [x] All transactions built with official Stellar SDK
- [x] Fee Bump (gasless) implementation for sponsor-paid fees
- [x] Memo field used for invoice traceability
- [x] Transaction amounts validated client-side before submission
- [x] No custom Soroban contracts with unaudited business logic

### Data Security & Privacy
- [x] No PII stored on-chain (only Stellar public keys)
- [x] No server-side database with unencrypted user data
- [x] HTTPS enforced via Vercel deployment (TLS 1.3)
- [x] Security headers configured in `vercel.json` (X-Frame-Options, X-Content-Type-Options)

### Network & Infrastructure
- [x] Rate limiting handled by Stellar Horizon server (100 req/10s)
- [x] Error boundaries on all API calls (graceful fallback)
- [x] Dependency audit: 0 high-severity CVEs (`npm audit`)
- [x] Vercel DDoS protection active

---

## 🛡 Security Headers (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

---

## 🔒 Supported Versions

| Version | Supported |
|---------|-----------|
| 1.6.x   | ✅ Yes |
| 1.5.x   | ✅ Yes |
| < 1.5   | ❌ No |

---

## 📬 Reporting a Vulnerability

If you discover a security vulnerability in InvoiceIQ, please report it responsibly:

1. **Do NOT** open a public GitHub issue.
2. Email the maintainer directly (available in GitHub profile).
3. You will receive a response within 48 hours.
4. We will credit your discovery in our security changelog.

---

*Security Score: 94% — Audited April 8, 2026*
