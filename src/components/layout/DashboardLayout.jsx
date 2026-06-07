import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Flame, ClipboardCheck, BrainCircuit,
  MessageSquareText, FileBarChart2, Users, Settings,
  Bell, Search, Palette, ChevronRight, LogOut, User,
  AlertTriangle, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { alerts as mockAlerts, buildings, audits } from '../../data/mockData';

const NAV_ITEMS = [
  { label: 'Main', type: 'section' },
  { path: '/',             label: 'Dashboard',          icon: LayoutDashboard },
  { path: '/buildings',   label: 'Buildings',          icon: Building2 },
  { path: '/extinguishers', label: 'Extinguishers',   icon: Flame, badge: 3 },
  { path: '/audits',      label: 'Audits',             icon: ClipboardCheck },
  { label: 'Intelligence', type: 'section' },
  { path: '/ai-risk',     label: 'AI Risk Analysis',   icon: BrainCircuit, reqRole: ['Admin', 'Analyst'] },
  { path: '/ai-assistant', label: 'AI Assistant',      icon: MessageSquareText, reqRole: ['Admin', 'Analyst'] },
  { label: 'Reports & Admin', type: 'section' },
  { path: '/reports',     label: 'Reports',            icon: FileBarChart2 },
  { path: '/users',       label: 'Users & Permissions', icon: Users, reqRole: ['Admin'] },
  { path: '/settings',    label: 'Settings',           icon: Settings },
];

const PAGE_TITLES = {
  '/':              { title: 'Dashboard',          sub: 'Fire Safety Intelligence Overview' },
  '/buildings':    { title: 'Buildings',          sub: 'Manage your building portfolio' },
  '/extinguishers': { title: 'Extinguishers',    sub: 'Track all fire suppression equipment' },
  '/audits':       { title: 'Audit Management',  sub: 'Compliance audit records & scheduling' },
  '/ai-risk':      { title: 'AI Risk Analysis',  sub: 'Intelligent risk assessment & insights' },
  '/ai-assistant': { title: 'AI Assistant',      sub: 'Your intelligent fire safety advisor' },
  '/reports':      { title: 'Reports',           sub: 'Generate & export compliance reports' },
  '/users':        { title: 'Users & Permissions', sub: 'Role-based access control' },
  '/profile':      { title: 'My Profile',        sub: 'Manage your personal settings' },
  '/settings':     { title: 'Settings',          sub: 'System preferences & security' },
};

const initials = (name) => name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'U';

/* ── Search Modal ─────────────────────────────────────────── */
function SearchModal({ query, setQuery, onClose, navigate }) {
  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const bldResults = buildings
      .filter(b => b.name.toLowerCase().includes(q) || b.location.toLowerCase().includes(q))
      .slice(0, 4)
      .map(b => ({ type: 'Building', label: b.name, sub: b.location, path: '/buildings', emoji: '🏢' }));
    const auditResults = audits
      .filter(a => a.building.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
      .slice(0, 3)
      .map(a => ({ type: 'Audit', label: a.id, sub: `${a.building} · ${a.status}`, path: '/audits', emoji: '📋' }));
    return [...bldResults, ...auditResults];
  }, [query]);

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: 14, flexShrink: 0 }} />
          <input
            autoFocus
            placeholder="Search buildings, audits, alerts…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 15, outline: 'none', color: 'var(--text-primary)' }}
          />
          <kbd style={{ fontSize: 11, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px', color: 'var(--text-muted)' }}>ESC</kbd>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 80 }}>
          {!query.trim() ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Type to search buildings, audits, and alerts…
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No results found for "<strong>{query}</strong>"
            </div>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {results.map((r, i) => (
                <div
                  key={i}
                  style={{ padding: '10px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { navigate(r.path); onClose(); }}
                >
                  <span style={{ fontSize: 18 }}>{r.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{r.sub}</div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', padding: '2px 7px', background: 'var(--bg-elevated)', borderRadius: 4 }}>{r.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Layout ──────────────────────────────────────────── */
export default function DashboardLayout() {
  const { user, logout, sessionWarning, extendSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localAlerts, setLocalAlerts] = useState(mockAlerts.map(a => ({ ...a })));

  const unread = localAlerts.filter(a => !a.read).length;
  const markAllRead = () => setLocalAlerts(p => p.map(a => ({ ...a, read: true })));
  const markRead = id => setLocalAlerts(p => p.map(a => a.id === id ? { ...a, read: true } : a));

  const handleLogout = () => { logout(); navigate('/login'); };

  const page = PAGE_TITLES[location.pathname] || { title: 'FireGuard AI', sub: '' };
  const userInitials = initials(user?.name);

  return (
    <div className="app-shell">
      {/* Session Warning Banner */}
      {sessionWarning && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: '#F59E0B', color: 'white', padding: '10px 24px',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16,
          fontSize: 13, fontWeight: 600, boxShadow: 'var(--shadow-md)'
        }}>
          ⏱ Your session will expire soon.
          <button onClick={extendSession} style={{ background: 'rgba(0,0,0,0.15)', border: 'none', color: 'white', padding: '5px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>
            Stay Signed In
          </button>
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo" onClick={() => navigate('/')}>
          <div className="sidebar-logo-icon">
            <Flame size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="sidebar-logo-name">FireGuard AI</div>
            <div className="sidebar-logo-sub">Safety Intelligence</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item, idx) => {
            if (item.type === 'section') {
              return <div key={idx} className="sidebar-section">{item.label}</div>;
            }
            if (item.reqRole && !item.reqRole.includes(user?.role)) return null;
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={16} className="nav-icon" />
                <span>{item.label}</span>
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </div>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={() => navigate('/profile')}>
            <div className="sidebar-avatar">{userInitials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">{user?.name || 'Guest'}</div>
              <div className="sidebar-user-role">{user?.role || 'Viewer'}</div>
            </div>
            <LogOut
              size={14}
              onClick={e => { e.stopPropagation(); handleLogout(); }}
              style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', flexShrink: 0 }}
            />
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">{page.title}</h1>
            <div className="topbar-breadcrumb">
              <span>FireGuard AI</span>
              <ChevronRight size={11} />
              <span>{page.title}</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Search */}
            <button className="topbar-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={16} />
            </button>

            {/* Notifications */}
            <button
              className="topbar-icon-btn"
              onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unread > 0 && <span className="topbar-badge">{unread}</span>}
            </button>

            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22C55E, #1F6F50)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer',
                  border: '2px solid var(--border)', userSelect: 'none'
                }}
              >
                {userInitials}
              </div>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 48, right: 0, width: 220,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  zIndex: 200, padding: 6, animation: 'fadeInScale 0.15s both'
                }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-light)', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                  {[
                    { label: 'My Profile', icon: User, path: '/profile' },
                    { label: 'Settings',   icon: Settings, path: '/settings' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => { navigate(item.path); setProfileOpen(false); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)', borderRadius: 6, textAlign: 'left' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Icon size={14} /> {item.label}
                      </button>
                    );
                  })}
                  <div style={{ height: 1, background: 'var(--border-light)', margin: '4px 0' }} />
                  <button
                    onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--status-danger)', borderRadius: 6, textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--status-danger-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Search Modal */}
        {searchOpen && (
          <SearchModal
            query={searchQuery}
            setQuery={setSearchQuery}
            onClose={() => { setSearchOpen(false); setSearchQuery(''); }}
            navigate={navigate}
          />
        )}

        {/* Notifications Panel */}
        {notifOpen && (
          <div style={{
            position: 'absolute', top: 76, right: 36, width: 340,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
            zIndex: 151, animation: 'fadeInScale 0.15s both'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Alerts</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{unread} unread notifications</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
            </div>
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {localAlerts.slice(0, 6).map(alert => (
                <div
                  key={alert.id}
                  onClick={() => markRead(alert.id)}
                  style={{
                    padding: '14px 20px', borderBottom: '1px solid var(--border-light)',
                    background: alert.read ? 'transparent' : 'var(--bg-subtle)',
                    cursor: 'pointer', transition: 'background 0.12s',
                    display: 'flex', gap: 12, alignItems: 'flex-start'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background = alert.read ? 'transparent' : 'var(--bg-subtle)'}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                    background: alert.type === 'Critical' ? '#EF4444' : alert.type === 'High' ? '#F97316' : alert.type === 'Medium' ? '#F59E0B' : '#3B82F6'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{alert.building}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{alert.message}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overlay */}
        {(notifOpen || profileOpen) && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
        )}

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
