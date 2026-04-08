import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InvoiceIQ | Smart Invoicing & Earning Analytics',
  description: 'The intelligent financial command center for freelancers. Track income, send invoices, and analyze your growth on the Stellar network.',
  keywords: 'invoicing, stellar, freelancers, analytics, finance, crypto payments',
  authors: [{ name: 'InvoiceIQ Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Providers>
          <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
