import React from 'react';

export default function PageHeader({ title, description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginBottom: 24,
      background: 'var(--bg-card)',
      padding: '24px',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{title}</h1>
          {description && <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
