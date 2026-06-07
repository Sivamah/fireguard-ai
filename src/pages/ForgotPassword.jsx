import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flame, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F1F15 0%, #1E3A28 40%, #0F1F15 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: 36, backdropFilter: 'blur(20px)',
        }}>
          
          <button onClick={() => navigate('/login')} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', marginBottom: 24, padding: 0
          }}>
            <ArrowLeft size={14} /> Back to Login
          </button>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
              Reset Password
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
              Enter your email address and we'll send you a link to securely reset your password.
            </div>
          </div>

          {success ? (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: 12, padding: 20, textAlign: 'center'
            }}>
              <CheckCircle size={32} color="#22C55E" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>Check your inbox</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                We've sent a password reset link to <strong>{email}</strong>.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                  <input
                    type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@company.com"
                    style={{
                      width: '100%', padding: '11px 14px 11px 40px',
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${error ? '#EF444460' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: 10, color: '#FFFFFF', fontSize: 13.5, outline: 'none'
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,111,71,0.6)'}
                    onBlur={e => e.target.style.borderColor = error ? '#EF444460' : 'rgba(255,255,255,0.12)'}
                  />
                </div>
              </div>

              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                  fontSize: 12.5, color: '#FCA5A5',
                }}>
                  <AlertCircle size={14} style={{ flexShrink: 0 }} /> {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                padding: '12px 24px', background: loading ? 'rgba(139,111,71,0.5)' : 'linear-gradient(135deg, #8B6F47, #B08D57)',
                border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 8
              }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
