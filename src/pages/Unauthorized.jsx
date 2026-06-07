import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg-primary)', padding: 24, textAlign: 'center'
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 'var(--radius-xl)',
        background: 'var(--status-danger-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, border: '1px solid rgba(239, 68, 68, 0.2)'
      }}>
        <ShieldAlert size={40} color="var(--status-danger)" />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
        Access Restricted
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 400, marginBottom: 32, lineHeight: 1.6 }}>
        You do not have the required role permissions to view this page. If you believe this is an error, please contact your system administrator.
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Return to Dashboard
      </button>
    </div>
  );
}
