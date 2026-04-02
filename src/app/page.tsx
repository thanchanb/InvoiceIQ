'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  BarChart3,
  Clock,
  Wallet
} from 'lucide-react';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="hero-gradient" />

      {/* Navigation */}
      <nav className="glass" style={{
        margin: '1.5rem auto',
        maxWidth: '1200px',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: '1.5rem',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--primary-color)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>
            Invoice<span style={{ color: 'var(--primary-color)' }}>IQ</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="#features" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Features</Link>
          <Link href="#about" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>About</Link>
          <Link href="/dashboard" className="glass" style={{
            padding: '0.6rem 1.5rem',
            fontWeight: 600,
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '12px'
          }}>
            Go to Alpha Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container" style={{ padding: '8rem 0 4rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '100px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: 'var(--primary-color)',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <Zap size={14} />
            <span>Now Integrated with Stellar Testnet</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Smart Invoicing for the <br />
            <span style={{
              background: 'linear-gradient(to right, #6366f1, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Modern Freelancer</span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: 1.6
          }}>
            Stop chasing payments and start understanding your growth.
            Automated invoicing, real-time analytics, and financial health scores
            tailored for independent creators.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/dashboard" style={{
              padding: '1rem 2.5rem',
              background: 'var(--primary-color)',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '1.125rem',
              color: 'white',
              boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Launch InvoiceIQ App <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ marginTop: '5rem', position: 'relative' }}
        >
          <div className="glass" style={{
            minHeight: '440px',
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            overflow: 'hidden',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            position: 'relative',
            zIndex: 1,
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>Revenue Pulse</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Automated tracking of your Stellar-based income.</p>
              </div>
              <div className="glass" style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--secondary-color)',
                fontWeight: 700,
                fontSize: '1.125rem'
              }}>
                +12.5% vs Prev Month
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', flex: 1 }}>
              {/* Chart Section */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', height: '100%' }}>
                {[40, 65, 30, 85, 55, 95, 70, 80].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    style={{
                      flex: 1,
                      background: i === 5
                        ? 'linear-gradient(to top, var(--primary-color), #a855f7)'
                        : 'rgba(255,255,255,0.05)',
                      borderRadius: '8px 8px 4px 4px',
                      position: 'relative'
                    }}
                  >
                    {i === 5 && (
                      <div style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: 'var(--primary-color)',
                        whiteSpace: 'nowrap'
                      }}>Peak Month</div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Sidebar Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="glass" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>UPCOMING SETTLEMENT</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>3,250 USDC</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>From Stellar Labs • 2 days left</p>
                </div>
                <div className="glass" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>CLIENT DIVERSITY</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                      <div style={{ width: '84%', height: '100%', background: 'var(--secondary-color)', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>84%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '-20px',
            right: '10%',
            width: '240px',
            height: '240px',
            background: 'var(--primary-color)',
            borderRadius: '50%',
            filter: 'blur(120px)',
            opacity: 0.2,
            zIndex: 0
          }}></div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container" style={{ padding: '8rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Built for how you work.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>The only command center you need for your creative business.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <FeatureCard
            icon={<Zap color="var(--primary-color)" />}
            title="Instant Invoicing"
            desc="Create professional invoices in seconds with pre-built templates for creators."
          />
          <FeatureCard
            icon={<TrendingUp color="#10b981" />}
            title="Income Analytics"
            desc="Visualize your earnings patterns, best clients, and peak income months."
          />
          <FeatureCard
            icon={<ShieldCheck color="#f59e0b" />}
            title="Financial Health Score"
            desc="AI-driven insights to help you diversify income and improve consistency."
          />
          <FeatureCard
            icon={<Clock color="#06b6d4" />}
            title="Payment Reminders"
            desc="Automated tracking of overdue payments with smart due date reminders."
          />
          <FeatureCard
            icon={<Wallet color="#ec4899" />}
            title="Stellar Ready"
            desc="Accept payments via Stellar network and track them directly in your dash."
          />
          <FeatureCard
            icon={<BarChart3 color="#6366f1" />}
            title="Project Insights"
            desc="See which projects are actually profitable and worth your precious time."
          />
        </div>
      </section>

      {/* Realistic Technical Specs Section */}
      <section style={{ background: 'rgba(255,255,255,0.02)', padding: '6rem 0', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '4rem',
          textAlign: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>Stellar Core</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Decentralized Settlements</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Native support for XLM and USDC on the Stellar Testnet.</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--secondary-color)', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>Phase 1</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Active Alpha Release</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Currently open for the first 100 independent creators.</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>0% Fees</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>During Alpha Period</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Direct peer-to-peer payments with zero platform markup.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container" style={{ padding: '6rem 0 4rem', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <FileText size={24} color="var(--primary-color)" />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit' }}>Invoice<span style={{ color: 'var(--primary-color)' }}>IQ</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px', lineHeight: 1.6 }}>
              The intelligent financial command center for the modern independent workforce.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Project of Rise-In</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 2 }}>
              © 2026 InvoiceIQ. All Rights Reserved. <br />
              <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Powered by Stellar Testnet</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="glass"
      style={{ padding: '2.5rem', transition: 'var(--transition-base)' }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        border: '1px solid var(--glass-border)'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
    </motion.div>
  );
}
