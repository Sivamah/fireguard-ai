import React from 'react';
import { Flame, Shield, Building2, BrainCircuit, MessageSquareText, ClipboardCheck, CheckCircle, Zap, ArrowRight, Star, TrendingUp, Users, Database, Lock } from 'lucide-react';

const features = [
  { icon: Building2, title: 'Manage Buildings', description: 'Centralize all building data, floors, contacts, and safety specifications in one unified platform.', color: '#3B82F6', bg: '#EFF6FF' },
  { icon: Flame, title: 'Track Extinguishers', description: 'Monitor every fire extinguisher with expiry alerts, service history, and automated replacement reminders.', color: '#F59E0B', bg: '#FFFBEB' },
  { icon: ClipboardCheck, title: 'Conduct Audits', description: 'Schedule, execute, and document fire safety audits with digital checklists and instant report generation.', color: '#22C55E', bg: '#F0FDF4' },
  { icon: BrainCircuit, title: 'AI Risk Analysis', description: 'Our AI engine continuously analyzes data to compute risk scores, identify vulnerabilities, and recommend actions.', color: '#8B5CF6', bg: '#F5F3FF' },
  { icon: MessageSquareText, title: 'AI Assistant', description: 'Get instant answers about compliance status, risk levels, and regulatory requirements through natural conversation.', color: '#06B6D4', bg: '#ECFEFF' },
  { icon: Shield, title: 'Compliance Tracking', description: 'Ensure regulatory compliance with automated tracking, deadline alerts, and certificate management.', color: '#EF4444', bg: '#FEF2F2' },
];

const steps = [
  { num: 1, title: 'Collect Data', desc: 'Input building details, extinguisher records, and safety documentation.', icon: Database },
  { num: 2, title: 'Store Securely', desc: 'Data encrypted at rest and in transit with enterprise-grade security.', icon: Lock },
  { num: 3, title: 'AI Analyzes', desc: 'Our ML models compute risk scores and detect compliance gaps.', icon: BrainCircuit },
  { num: 4, title: 'Get Insights', desc: 'Receive actionable reports, alerts, and prioritized recommendations.', icon: Zap },
  { num: 5, title: 'Take Action', desc: 'Execute remediation plans and track resolution progress.', icon: CheckCircle },
];

const benefits = [
  { stat: '64%', label: 'Reduction in compliance violations', icon: TrendingUp },
  { stat: '3.2×', label: 'Faster audit completion time', icon: Zap },
  { stat: '99.2%', label: 'Platform uptime SLA', icon: Shield },
  { stat: '500+', label: 'Enterprise buildings managed', icon: Building2 },
];

const chatDemo = [
  { role: 'user', text: 'Which building has the highest risk?' },
  { role: 'ai', text: 'Prism Corporate Center (BLD-003) has the highest risk score of 84/100 — Critical level. Key issues: 12 expired extinguishers, audit overdue by 172 days, and missed sprinkler inspection.' },
  { role: 'user', text: 'Generate a compliance summary report' },
  { role: 'ai', text: 'Portfolio compliance summary generated. Average score: 74.7% across 8 buildings. 4 buildings compliant (≥80%), 2 require urgent attention. Downloading PDF...' },
];

export default function About() {
  const primaryColor = '#1F6F50';
  const secondaryColor = '#4F8F74';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Hero */}
      <div className="hero-about">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Flame size={26} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.7, letterSpacing: '2px', textTransform: 'uppercase' }}>
                Enterprise Platform
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                FireGuard AI
              </div>
            </div>
          </div>

          <div style={{ fontSize: 15, opacity: 0.85, maxWidth: 700, lineHeight: 1.7, marginBottom: 32 }}>
            FireGuard AI is an intelligent fire safety management platform that helps organizations manage fire safety, ensure regulatory compliance, and systematically reduce risk across all buildings and facilities.
            Built for enterprise teams, powered by AI, and designed for the real-world complexity of large building portfolios.
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{
              padding: '12px 28px', borderRadius: 'var(--radius-md)', border: 'none',
              background: 'white', color: primaryColor, fontWeight: 700, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
            }}>
              Get Started <ArrowRight size={16} />
            </button>
            <button style={{
              padding: '12px 28px', borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)',
              color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer'
            }}>
              View Demo
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Stats */}
      <div className="grid grid-4" style={{ gap: 20 }}>
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="card" style={{ padding: '28px 24px', textAlign: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary-ultra-light)', margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={20} color="var(--color-primary)" />
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>
                {b.stat}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.4 }}>
                {b.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* What it does */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>What FireGuard AI Does</h2>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, maxWidth: 500, margin: '8px auto 0' }}>
            A complete suite of tools for enterprise fire safety management
          </div>
        </div>
        <div className="grid grid-3" style={{ gap: 20 }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                  <Icon size={24} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="card" style={{ padding: '48px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>How It Works</h2>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>From data collection to actionable insights in 5 steps</div>
        </div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 24, left: '10%', right: '10%', height: 2,
            background: 'var(--border-color)', zIndex: 0
          }} />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'var(--color-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  border: '3px solid var(--bg-card)'
                }}>
                  {step.num}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-ultra-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={18} color="var(--color-primary)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: 140 }}>{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Assistant Demo */}
      <div className="grid grid-2" style={{ gap: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>AI Assistant Demo</h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
            Our intelligent assistant understands fire safety context and provides instant, accurate answers about your portfolio's compliance status, risk levels, and recommended actions.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Natural language queries', 'Portfolio-aware responses', 'Instant report generation', 'Proactive risk insights'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={16} color="var(--status-success)" />
                <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{
          background: 'linear-gradient(135deg, #1E3A28, #2D5A3D)',
          border: 'none', overflow: 'hidden'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>FireGuard AI Assistant</span>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {chatDemo.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'ai' ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white'
                }}>
                  {msg.role === 'ai' ? <Zap size={12} /> : 'AK'}
                </div>
                <div style={{
                  maxWidth: '75%', padding: '10px 14px', borderRadius: msg.role === 'ai' ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                  background: msg.role === 'ai' ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1F6F50, #4F8F74)',
        borderRadius: 'var(--radius-xl)', padding: '48px', textAlign: 'center', color: 'white'
      }}>
        <div style={{ fontSize: 11, opacity: 0.6, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>
          Enterprise Fire Safety
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 12, color: 'white' }}>
          Ready to Secure Your Buildings?
        </h2>
        <p style={{ fontSize: 14, opacity: 0.8, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
          Join 200+ enterprise organizations using FireGuard AI to manage fire safety compliance across thousands of buildings.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button style={{
            padding: '13px 32px', borderRadius: 'var(--radius-md)', border: 'none',
            background: 'white', color: '#1F6F50',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
          }}>
            Request a Demo <ArrowRight size={16} />
          </button>
          <button style={{
            padding: '13px 32px', borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)',
            color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer'
          }}>
            View Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
