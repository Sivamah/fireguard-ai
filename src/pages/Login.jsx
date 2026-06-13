import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Flame, Mail, Lock, ShieldCheck, AlertCircle, ArrowRight, ArrowLeft, Eye, EyeOff, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Demo credential hints — shown as info, NOT auto-filled
const DEMO_HINTS = [
  { role: 'Super Admin',    email: 'siva@fireguard.ai',     color: '#1F6F50', bg: '#DFF3E8' },
  { role: 'Supplier',       email: 'supplier@abcfire.com',  color: '#7C3AED', bg: '#F3E8FF' },
  { role: 'Building Owner', email: 'owner@ngp.com',         color: '#0369A1', bg: '#E0F2FE' },
  { role: 'Auditor',        email: 'auditor@fireguard.ai',  color: '#B45309', bg: '#FEF3C7' },
];

export default function Login() {
  const { login, sendOtp, verifyOtp, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const [tab,       setTab]       = useState('password'); // 'password' | 'otp'
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [otp,       setOtp]       = useState(['', '', '', '', '', '']);
  const [otpStep,   setOtpStep]   = useState(1); // 1: email, 2: code
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [showHints, setShowHints] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (otpStep === 2 && otpRefs.current[0]) otpRefs.current[0].focus();
  }, [otpStep]);

  // ── Password Login ──
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true); setError('');
    try {
      await login(email.trim(), password, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  // ── OTP Flow ──
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true); setError('');
    try { await sendOtp(email); setOtpStep(2); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5 && otpRefs.current[index + 1]) otpRefs.current[index + 1].focus();
    if (value && index === 5 && newOtp.every(v => v !== '')) handleVerifyOtp(newOtp.join(''));
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs.current[index - 1])
      otpRefs.current[index - 1].focus();
  };

  const handleVerifyOtp = async (codeStr) => {
    const code = codeStr || otp.join('');
    if (code.length < 6) { setError('Please enter the 6-digit code.'); return; }
    setLoading(true); setError('');
    try {
      await verifyOtp(email, code);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      setOtp(['', '', '', '', '', '']);
      if (otpRefs.current[0]) otpRefs.current[0].focus();
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(31,111,80,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,204,113,0.05) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(31,111,80,0.03) 0%, transparent 70%)' }} />
      </div>

      <div className="login-card animate-scale" style={{ position: 'relative', zIndex: 1, padding: '40px 36px', maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, margin: '0 auto 16px', background: 'linear-gradient(135deg, #22C55E, #1F6F50)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 28px rgba(31,111,80,0.28)' }}>
            <Flame size={30} color="white" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.6px', lineHeight: 1.2 }}>FireGuard AI</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 5 }}>Enterprise Fire Safety Intelligence Platform</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: 4, marginBottom: 28 }}>
          {['password', 'otp'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setOtpStep(1); setOtp(['','','','','','']); }}
              style={{
                flex: 1, padding: '8px', border: 'none', borderRadius: 6,
                cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                background: tab === t ? 'var(--bg-card)' : 'transparent',
                color: tab === t ? 'var(--color-primary)' : 'var(--text-muted)',
                boxShadow: tab === t ? 'var(--shadow-xs)' : 'none',
              }}>
              {t === 'password' ? '🔐 Password' : '✉️ Magic Link'}
            </button>
          ))}
        </div>

        {/* === PASSWORD TAB === */}
        {tab === 'password' && (
          <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label htmlFor="login-email" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <div className="input-wrap">
                <Mail size={15} className="input-icon" />
                <input
                  type="email"
                  id="login-email"
                  className="input"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label htmlFor="login-password" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </div>
              <div className="input-wrap">
                <Lock size={15} className="input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  id="login-password"
                  className="input"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                id="login-remember"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Remember me for 60 minutes</span>
            </label>

            {error && <ErrorMsg message={error} />}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              id="login-submit"
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
              disabled={loading}>
              {loading ? <LoadingDots /> : <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Sign In <ArrowRight size={16} /></span>}
            </button>
          </form>
        )}

        {/* === OTP TAB === */}
        {tab === 'otp' && (
          <>
            {otpStep === 1 && (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>Email Address</label>
                  <div className="input-wrap">
                    <Mail size={15} className="input-icon" />
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
                {error && <ErrorMsg message={error} />}
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <LoadingDots /> : <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Send Secure Code <ArrowRight size={16} /></span>}
                </button>
              </form>
            )}
            {otpStep === 2 && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>6-digit code sent to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong></p>
                </div>
                <form onSubmit={e => { e.preventDefault(); handleVerifyOtp(); }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        style={{ width: 44, height: 52, textAlign: 'center', fontSize: 20, fontWeight: 700, borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--font)' }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={e => e.target.style.borderColor = digit ? 'var(--color-primary)' : 'var(--border)'}
                      />
                    ))}
                  </div>
                  {error && <ErrorMsg message={error} />}
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                    {loading ? <LoadingDots /> : 'Verify & Sign In'}
                  </button>
                </form>
                <button
                  onClick={() => { setOtpStep(1); setError(''); setOtp(['','','','','','']); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, margin: '16px auto 0' }}>
                  <ArrowLeft size={13} /> Back to email
                </button>
              </div>
            )}
          </>
        )}

        {/* Demo credentials hint — collapsible, not auto-fill */}
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
            <button
              type="button"
              onClick={() => setShowHints(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, padding: '2px 8px', borderRadius: 4, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              <Info size={12} />
              {showHints ? 'Hide' : 'Show'} Demo Credentials
            </button>
            <div style={{ flex: 1, height: 1, background: 'var(--border-light)' }} />
          </div>

          {showHints && (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{ fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 4 }}>
                All passwords: <strong style={{ color: 'var(--text-primary)' }}>demo123</strong> · OTP code: <strong style={{ color: 'var(--text-primary)' }}>123456</strong>
              </p>
              {DEMO_HINTS.map(hint => (
                <div key={hint.role} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: hint.bg, borderRadius: 'var(--radius-sm)', border: `1px solid ${hint.color}22` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: hint.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: hint.color }}>{hint.role}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)', marginLeft: 8 }}>{hint.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24, justifyContent: 'center' }}>
          <ShieldCheck size={13} color="var(--status-success)" />
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Protected by enterprise-grade security</span>
        </div>
      </div>
    </div>
  );
}

function ErrorMsg({ message }) {
  return (
    <div className="animate-fade" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--status-danger-bg)', border: '1px solid #FECACA', fontSize: 12.5, color: 'var(--status-danger-text)' }}>
      <AlertCircle size={15} style={{ flexShrink: 0 }} /> {message}
    </div>
  );
}

function LoadingDots() {
  return (
    <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <span className="typing-dot" style={{ background: 'white' }} />
      <span className="typing-dot" style={{ background: 'white' }} />
      <span className="typing-dot" style={{ background: 'white' }} />
    </span>
  );
}
