import React, { useState } from 'react';
import {
  Moon, Sun, Shield, Bell, Globe, Database, Lock, ChevronRight,
  Check, Palette, Smartphone, Trash2, Download, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function SettingRow({ label, sub, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-light)', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 12, background: checked ? 'var(--color-primary)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: checked ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </button>
  );
}

export default function Settings() {
  const { user, theme, setTheme, toggleTheme, updateProfile } = useAuth();

  const [notifications, setNotifications] = useState({
    email: true, push: true, sms: false, weeklyReport: true, expiryAlerts: true, incidentAlerts: true,
  });
  const [saved, setSaved] = useState(false);

  const setNotif = (key, val) => setNotifications(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: 740, display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div className="animate-up">
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Manage your account preferences and platform settings</p>
      </div>

      {/* ── APPEARANCE ── */}
      <div className="card animate-up stagger-1">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--color-primary-ultra)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Palette size={17} color="var(--color-primary)" />
            </div>
            <div>
              <div className="card-title">Appearance</div>
              <div className="card-subtitle">Customize the look and feel</div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <SettingRow label="Theme" sub="Choose your preferred color scheme">
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { key: 'light', label: '☀️ Light', icon: Sun },
                { key: 'dark',  label: '🌙 Dark',  icon: Moon },
              ].map(t => (
                <button key={t.key} onClick={() => setTheme(t.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: `2px solid ${theme === t.key ? 'var(--color-primary)' : 'var(--border)'}`, background: theme === t.key ? 'var(--color-primary-ultra)' : 'var(--bg-card)', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: theme === t.key ? 'var(--color-primary)' : 'var(--text-secondary)', transition: 'all 0.15s', fontFamily: 'var(--font)' }}>
                  <t.icon size={14} />
                  {t.label}
                  {theme === t.key && <Check size={13} />}
                </button>
              ))}
            </div>
          </SettingRow>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Theme Preview</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div onClick={() => setTheme('light')} style={{ padding: 16, background: '#F7FAF8', border: `2px solid ${theme === 'light' ? '#1F6F50' : '#E5E7EB'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'border-color 0.15s' }}>
                <div style={{ width: '100%', height: 8, background: '#1F6F50', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ display: 'flex', gap: 4 }}>
                  {['#E5E7EB', '#DFF3E8', '#F0F5F2'].map((c, i) => <div key={i} style={{ flex: 1, height: 20, background: c, borderRadius: 3 }} />)}
                </div>
                <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: '#1F6F50', textAlign: 'center' }}>🌿 Forest Green Light</div>
              </div>
              <div onClick={() => setTheme('dark')} style={{ padding: 16, background: '#07120D', border: `2px solid ${theme === 'dark' ? '#2ECC71' : '#1F3D2D'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'border-color 0.15s' }}>
                <div style={{ width: '100%', height: 8, background: '#2ECC71', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ display: 'flex', gap: 4 }}>
                  {['#0F1E18', '#1A2E22', '#152219'].map((c, i) => <div key={i} style={{ flex: 1, height: 20, background: c, borderRadius: 3 }} />)}
                </div>
                <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: '#2ECC71', textAlign: 'center' }}>🌑 Forest Green Dark</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── NOTIFICATIONS ── */}
      <div className="card animate-up stagger-2">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={17} color="#B45309" />
            </div>
            <div>
              <div className="card-title">Notifications</div>
              <div className="card-subtitle">Control how you receive alerts</div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {[
            { key: 'email', label: 'Email Notifications', sub: 'Receive alerts via email' },
            { key: 'push', label: 'Push Notifications', sub: 'Browser notifications for critical alerts' },
            { key: 'sms', label: 'SMS Alerts', sub: 'Text messages for emergencies' },
            { key: 'weeklyReport', label: 'Weekly Compliance Report', sub: 'Summary email every Monday' },
            { key: 'expiryAlerts', label: 'Extinguisher Expiry Alerts', sub: 'Alert 30 days before expiry' },
            { key: 'incidentAlerts', label: 'Fire Incident Alerts', sub: 'Immediate notification on new incidents' },
          ].map(item => (
            <SettingRow key={item.key} label={item.label} sub={item.sub}>
              <Toggle checked={notifications[item.key]} onChange={v => setNotif(item.key, v)} />
            </SettingRow>
          ))}
        </div>
      </div>

      {/* ── SECURITY ── */}
      <div className="card animate-up stagger-3">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={17} color="#4338CA" />
            </div>
            <div>
              <div className="card-title">Security</div>
              <div className="card-subtitle">Account security settings</div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <SettingRow label="Two-Factor Authentication" sub="Add an extra layer of security">
            <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={13} /> Enable 2FA
            </button>
          </SettingRow>
          <SettingRow label="Change Password" sub="Update your account password">
            <button className="btn btn-secondary btn-sm">Change Password</button>
          </SettingRow>
          <SettingRow label="Active Sessions" sub="Manage devices signed in to your account">
            <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Smartphone size={13} /> View Sessions
            </button>
          </SettingRow>
          <SettingRow label="API Access" sub="Manage API tokens for integrations">
            <button className="btn btn-secondary btn-sm">Manage Tokens</button>
          </SettingRow>
        </div>
      </div>

      {/* ── DATA & PRIVACY ── */}
      <div className="card animate-up stagger-4">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={17} color="#0369A1" />
            </div>
            <div>
              <div className="card-title">Data & Privacy</div>
              <div className="card-subtitle">Manage your data</div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <SettingRow label="Export My Data" sub="Download a copy of your account data">
            <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={13} /> Export
            </button>
          </SettingRow>
          <SettingRow label="Clear Cache" sub="Clear locally stored data">
            <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={13} /> Clear Cache
            </button>
          </SettingRow>
          <SettingRow label="Delete Account" sub="Permanently remove your account">
            <button className="btn btn-sm" style={{ background: 'var(--status-danger-bg)', color: 'var(--status-danger)', border: '1px solid var(--status-danger)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Trash2 size={13} /> Delete
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button className={`btn ${saved ? 'btn-success' : 'btn-primary'}`} onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 140, justifyContent: 'center' }}>
          {saved ? <><Check size={15} /> Saved!</> : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
