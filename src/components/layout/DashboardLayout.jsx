import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Wrench, ClipboardList, AlertTriangle,
  BrainCircuit, ShieldCheck, FileBarChart2, Settings,
  Bell, Search, ChevronRight, LogOut, User, Sun, Moon, X, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { alerts as mockAlerts } from '../../data/mockData';

// ── Nav Items ──────────────────────────────────────────────────────────────────
function buildNav(role) {
  const ALL   = ['Admin', 'Facility Manager', 'Inspector'];
  const ADMIN = ['Admin', 'Facility Manager'];

  return [
    { path: '/',               label: 'Dashboard',          icon: LayoutDashboard, roles: ALL   },
    { path: '/buildings',      label: 'Buildings',           icon: Building2,       roles: ALL   },
    { path: '/equipment',      label: 'Equipment',           icon: Wrench,          roles: ALL   },
    { path: '/inspections',    label: 'Inspections',         icon: ClipboardList,   roles: ALL   },
    { path: '/incidents',      label: 'Incidents',           icon: AlertTriangle,   roles: ALL   },
    { path: '/ai-prediction',  label: 'AI Prediction',       icon: BrainCircuit,    roles: ADMIN },
    { path: '/compliance',     label: 'Compliance',          icon: ShieldCheck,     roles: ADMIN },
    { path: '/reports',        label: 'Reports',             icon: FileBarChart2,   roles: ADMIN },
    { path: '/settings',       label: 'Settings',            icon: Settings,        roles: ALL   },
  ].filter(item => !item.roles || item.roles.includes(role));
}

const PAGE_TITLES = {
  '/':               { title: 'Dashboard',           sub: 'Fire Safety Intelligence Overview' },
  '/buildings':      { title: 'Buildings',            sub: 'Manage your building portfolio' },
  '/equipment':      { title: 'Equipment',            sub: 'Fire safety equipment management' },
  '/inspections':    { title: 'Digital Inspections',  sub: 'Conduct and track safety inspections' },
  '/incidents':      { title: 'Incidents',            sub: 'Fire incident tracking & response' },
  '/ai-prediction':  { title: 'AI Prediction',        sub: 'Explainable AI-based fire risk analysis' },
  '/compliance':     { title: 'Compliance',           sub: 'Safety compliance scoring & monitoring' },
  '/reports':        { title: 'Reports',              sub: 'Generate & export safety reports' },
  '/settings':       { title: 'Settings',             sub: 'System preferences & security' },
  '/profile':        { title: 'My Profile',           sub: 'Manage your account' },
};

const initials = (name) => name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

const ROLE_BADGES = {
  'Admin':            { bg: 'rgba(37,99,235,0.15)',  color: '#60A5FA' },
  'Facility Manager': { bg: 'rgba(34,197,94,0.15)',  color: '#4ADE80' },
  'Inspector':        { bg: 'rgba(245,158,11,0.15)', color: '#FCD34D' },
};

/* ── Search Modal ─────────────────────────────────────── */
function SearchModal({ query, setQuery, onClose, navigate }) {
  const { buildings: mockBuildings, inspections: mockInspections } = useMemo(() => {
    try {
      // dynamic import would cause re-renders, just use static refs
      return { buildings: [], inspections: [] };
    } catch { return { buildings: [], inspections: [] }; }
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <Search size={17} color="var(--text-muted)" style={{ marginRight: 12, flexShrink: 0 }} />
          <input
            autoFocus
            placeholder="Search buildings, equipment, inspections…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font)' }}
          />
          <kbd style={{ fontSize: 11, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 5, padding: '2px 7px', color: 'var(--text-muted)' }}>ESC</kbd>
        </div>
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          {!query.trim()
            ? 'Type to search across buildings, equipment, and inspections…'
            : 'Navigate to the relevant page to search with full filters.'}
        </div>
      </div>
    </div>
  );
}

/* ── Main Layout ──────────────────────────────────────── */
export default function DashboardLayout() {
  const { user, logout, sessionWarning, extendSession, theme, toggleTheme } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();

  const [notifOpen,      setNotifOpen]      = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');

  const navItems = useMemo(() => buildNav(user?.role || ''), [user?.role]);

  const [localAlerts, setLocalAlerts] = useState([]);
  useEffect(() => {
    if (user) setLocalAlerts(mockAlerts.map(a => ({ ...a })));
  }, [user]);

  const unread      = localAlerts.filter(a => !a.read).length;
  const markAllRead = () => setLocalAlerts(p => p.map(a => ({ ...a, read: true })));
  const markRead    = id => setLocalAlerts(p => p.map(a => a.id === id ? { ...a, read: true } : a));

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  useEffect(() => {
    setNotifOpen(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const page         = PAGE_TITLES[location.pathname] || { title: 'FireGuard AI', sub: '' };
  const userInitials = initials(user?.name);
  const roleBadge    = ROLE_BADGES[user?.role] || { bg: 'var(--bg-elevated)', color: 'var(--text-muted)' };

  // Mobile bottom nav — 5 items
  const mobileNavItems = navItems.filter(i => ['/', '/buildings', '/inspections', '/ai-prediction', '/incidents'].includes(i.path));

  return (
    <div className="app-shell">
      {/* Session Warning */}
      {sessionWarning && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#F59E0B', color: 'white', padding: '10px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, fontSize: 13, fontWeight: 600, boxShadow: 'var(--shadow-md)' }}>
          ⏱ Your session expires soon.
          <button onClick={extendSession} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', padding: '5px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font)' }}>Stay Signed In</button>
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" onClick={() => navigate('/')} role="button" aria-label="Dashboard">
          <div className="sidebar-logo-icon">
            <BrainCircuit size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <div className="sidebar-logo-name">FireGuard AI</div>
            <div className="sidebar-logo-sub">IEEE Safety System</div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map(item => {
            const Icon     = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                role="button"
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}>
                <Icon size={16} className="nav-icon" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={() => navigate('/profile')} role="button">
            <div className="sidebar-avatar" style={{ overflow: 'hidden' }}>
              {user?.avatarData
                ? <img src={user.avatarData} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : userInitials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">{user?.name || 'Guest'}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.role}</div>
            </div>
            <LogOut size={14} onClick={e => { e.stopPropagation(); handleLogout(); }} style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', flexShrink: 0 }} aria-label="Sign out" />
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
            <button className="topbar-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search" id="topbar-search">
              <Search size={16} />
            </button>

            <button className="topbar-icon-btn hidden-on-mobile" onClick={toggleTheme} id="topbar-theme" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button className="topbar-icon-btn" onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }} aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`} id="topbar-notifications">
              <Bell size={16} />
              {unread > 0 && <span className="topbar-badge" aria-hidden="true">{unread}</span>}
            </button>

            {/* Role Badge */}
            <div className="hidden-on-mobile" style={{ padding: '5px 12px', borderRadius: 'var(--radius-full)', background: roleBadge.bg, color: roleBadge.color, fontSize: 11.5, fontWeight: 700 }}>
              {user?.role}
            </div>

            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div
                id="topbar-avatar"
                onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
                role="button" aria-label="User menu" aria-expanded={profileOpen}
                style={{ width: 36, height: 36, borderRadius: '50%', background: user?.avatarData ? 'transparent' : 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', border: '2px solid var(--border)', overflow: 'hidden' }}>
                {user?.avatarData ? <img src={user.avatarData} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : userInitials}
              </div>

              {profileOpen && (
                <div id="profile-dropdown" style={{ position: 'absolute', top: 46, right: 0, width: 230, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 200, padding: 6, animation: 'fadeInScale 0.15s both' }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-light)', marginBottom: 4 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
                    <div style={{ marginTop: 8, display: 'inline-flex', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: roleBadge.bg, color: roleBadge.color, fontSize: 11, fontWeight: 700 }}>{user?.role}</div>
                  </div>
                  {[{ label: 'My Profile', icon: User, path: '/profile' }, { label: 'Settings', icon: Settings, path: '/settings' }].map(item => {
                    const Icon = item.icon;
                    return (
                      <button key={item.path}
                        onClick={() => { navigate(item.path); setProfileOpen(false); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)', borderRadius: 6, fontFamily: 'var(--font)', minHeight: 36 }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Icon size={14} /> {item.label}
                      </button>
                    );
                  })}
                  <div style={{ height: 1, background: 'var(--border-light)', margin: '4px 0' }} />
                  <button id="profile-signout-btn" onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--status-danger)', borderRadius: 6, fontFamily: 'var(--font)', minHeight: 36 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--status-danger-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Search Modal */}
        {searchOpen && <SearchModal query={searchQuery} setQuery={setSearchQuery} onClose={() => { setSearchOpen(false); setSearchQuery(''); }} navigate={navigate} />}

        {/* Notifications Panel */}
        {notifOpen && (
          <div id="notifications-panel"
            style={{ position: 'fixed', top: 72, right: 28, width: 360, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 151, animation: 'fadeInScale 0.15s both' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Alerts</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{unread} unread</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {localAlerts.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No alerts</div>
              ) : localAlerts.slice(0, 8).map(alert => {
                const dotColor = alert.type === 'Critical' ? 'var(--risk-critical)' : alert.type === 'High' ? 'var(--risk-high)' : alert.type === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)';
                return (
                  <div key={alert.id} onClick={() => markRead(alert.id)}
                    style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-light)', background: alert.read ? 'transparent' : 'var(--bg-subtle)', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = alert.read ? 'transparent' : 'var(--bg-subtle)'}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 6, background: dotColor, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{alert.building}</span>
                        <span style={{ fontSize: 10, color: dotColor, fontWeight: 700 }}>{alert.type}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{alert.message}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{alert.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Overlay for dropdowns */}
        {(notifOpen || profileOpen || mobileMenuOpen) && (
          <div className="mobile-overlay" onClick={() => { setNotifOpen(false); setProfileOpen(false); setMobileMenuOpen(false); }} style={{ display: 'block', zIndex: 140 }} />
        )}

        {/* Page Content */}
        <main className="page-content"><Outlet /></main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {mobileNavItems.map(item => (
          <div key={item.path}
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            role="button"
            aria-label={item.label}>
            <item.icon size={21} />
            <span>{item.label.split(' ')[0]}</span>
          </div>
        ))}
        <div className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          role="button" aria-label="More">
          <Menu size={21} />
          <span>More</span>
        </div>
      </nav>

      {/* ── MOBILE MORE DRAWER ── */}
      {mobileMenuOpen && <div className="mobile-more-overlay" onClick={() => setMobileMenuOpen(false)} />}
      <div className={`mobile-more-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>More</div>
          <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'var(--bg-elevated)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={17} />
          </button>
        </div>
        <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path}
                className={`mobile-more-item ${isActive ? 'active' : ''}`}
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}>
                <Icon size={18} color={isActive ? 'var(--color-primary)' : 'var(--text-secondary)'} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-light)' }}>
          <button id="mobile-signout-btn" onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 20px', background: 'var(--status-danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'var(--status-danger)', fontFamily: 'var(--font)' }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
