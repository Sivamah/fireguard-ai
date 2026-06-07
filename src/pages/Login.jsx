import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Flame, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDemo, setSelectedDemo] = useState(null);

  const DEMO = [
    { label: 'Admin', email: 'admin@fireguard.ai', password: 'admin123', color: '#1F6F50', desc: 'Full access' },
    { label: 'Analyst', email: 'analyst@fireguard.ai', password: 'analyst123', color: '#3B82F6', desc: 'View & analyze' },
    { label: 'Auditor', email: 'auditor@fireguard.ai', password: 'auditor123', color: '#F59E0B', desc: 'Audit management' },
  ];

  const fillDemo = (d) => {
    setEmail(d.email);
    setPassword(d.password);
    setSelectedDemo(d.label);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Abstract Background Decoration */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(31,111,80,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)',
        }} />
      </div>

      <div className="login-card animate-scale" style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #22C55E, #1F6F50)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(31,111,80,0.25)'
          }}>
            <Flame size={28} color="white" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            FireGuard AI
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            Enterprise Fire Safety Intelligence
          </p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Welcome back</h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>Sign in to continue to your dashboard</p>
        </div>



        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="input"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPw ? 'text' : 'password'}
                className="input"
                style={{ paddingRight: 44 }}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{
                  position: 'absolute', right: 12, background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4
                }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="animate-fade" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderRadius: 'var(--radius-sm)',
              background: 'var(--status-danger-bg)', border: '1px solid #FECACA',
              fontSize: 13, color: 'var(--status-danger-text)'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="typing-dot" style={{ background: 'white' }} />
                <span className="typing-dot" style={{ background: 'white' }} />
                <span className="typing-dot" style={{ background: 'white' }} />
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Sign In <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        {/* Security notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 32, justifyContent: 'center', color: 'var(--text-muted)' }}>
          <ShieldCheck size={14} color="var(--status-success)" />
          <span style={{ fontSize: 11.5 }}>Enterprise-grade encryption</span>
        </div>
      </div>
    </div>
  );
}
