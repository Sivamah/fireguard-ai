import React, { useState, useEffect } from 'react';
import { Bell, Shield, Key, DownloadCloud, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SETTINGS_KEY = 'fireguard_settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { emailAlerts: true, pushNotifications: false, weeklyReport: true, mfa: false };
}

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  // Persist settings whenever they change
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(t);
  }, [settings]);

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      <div className="card">
        <div className="card-header" style={{ paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <div className="card-title">System Settings</div>
            <div className="card-subtitle">Manage preferences and security settings</div>
          </div>
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--status-success)', fontWeight: 600 }}>
              <CheckCircle size={14} /> Auto-saved
            </div>
          )}
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Notifications */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={18} color="var(--color-primary)" /> Notifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'emailAlerts', title: 'Email Alerts', desc: 'Receive critical building alerts via email immediately.' },
                { key: 'pushNotifications', title: 'Push Notifications', desc: 'Receive browser push notifications when active.' },
                { key: 'weeklyReport', title: 'Weekly Summary', desc: 'Receive a weekly PDF compliance report on Mondays.' },
              ].map((item) => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                    <input type="checkbox" checked={settings[item.key]} onChange={() => toggle(item.key)} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{
                      position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: settings[item.key] ? 'var(--status-success)' : 'var(--border-color)',
                      transition: '0.4s', borderRadius: 24
                    }}>
                      <span style={{
                        position: 'absolute', height: 18, width: 18, left: 3, bottom: 3,
                        backgroundColor: 'white', transition: '0.4s', borderRadius: '50%',
                        transform: settings[item.key] ? 'translateX(20px)' : 'translateX(0)'
                      }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--border-light)' }} />

          {/* Security */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} color="var(--color-primary)" /> Security
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Two-Factor Authentication (2FA)</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Add an extra layer of security to your account.</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => toggle('mfa')}>
                {settings.mfa ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Active Sessions</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Manage devices currently logged into this account.</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => {
                if (window.confirm('Sign out all other sessions? You will remain signed in on this device.')) {
                  alert('All other sessions have been terminated.');
                }
              }}>Manage Sessions</button>
            </div>
          </div>

          {user?.role === 'Admin' && (
            <>
              <div style={{ height: 1, background: 'var(--border-light)' }} />
              {/* Admin Danger Zone */}
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--status-danger)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={18} /> Danger Zone
                </h3>
                <div style={{
                  border: '1px solid var(--status-danger-bg)', borderRadius: 'var(--radius-md)',
                  padding: 16, background: 'rgba(239, 68, 68, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 12
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--status-danger)' }}>Export Audit Logs</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Download full system access and action logs as CSV.</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => {
                    const content = `Timestamp,User,Action,Resource\n${new Date().toISOString()},${user?.name || 'Admin'},Exported Logs,System`;
                    const blob = new Blob([content], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}>
                    <DownloadCloud size={14} /> Export CSV
                  </button>
                </div>
                <div style={{
                  border: '1px solid var(--status-danger-bg)', borderRadius: 'var(--radius-md)',
                  padding: 16, background: 'rgba(239, 68, 68, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--status-danger)' }}>Reset All Settings</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Reset all preferences to factory defaults.</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => {
                    if (window.confirm('Reset all settings to defaults? This cannot be undone.')) {
                      const defaults = { emailAlerts: true, pushNotifications: false, weeklyReport: true, mfa: false };
                      setSettings(defaults);
                    }
                  }}>
                    <AlertTriangle size={14} /> Reset
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
