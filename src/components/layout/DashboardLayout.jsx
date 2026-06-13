import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Flame, ClipboardCheck, BrainCircuit,
  MessageSquareText, FileBarChart2, Users, Settings,
  Bell, Search, ChevronRight, LogOut, User,
  AlertTriangle, Handshake, FileText, Sun, Moon, ShieldAlert,
  Info, X, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { alerts as mockAlerts, buildings as mockBuildings, audits as mockAudits } from '../../data/mockData';
import FloatingAIAssistant from '../ui/FloatingAIAssistant';

// ── Role-aware nav items ──────────────────────────────────────────────────────
function buildNav(role) {
  const ALL   = ['Super Admin', 'Company Admin', 'Supplier', 'Building Owner', 'Auditor'];
  const MGMT  = ['Super Admin', 'Company Admin'];
  const SUPP  = ['Super Admin', 'Company Admin', 'Supplier'];
  const AUDIT = ['Super Admin', 'Company Admin', 'Auditor', 'Building Owner'];
  const AI_ACCESS = ['Super Admin', 'Company Admin', 'Building Owner', 'Auditor'];

  return [
    { label: 'Main', type: 'section' },
    { path: '/',               label: 'Dashboard',          icon: LayoutDashboard,   roles: ALL },
    { path: '/buildings',      label: 'Buildings',          icon: Building2,         roles: ALL },
    { path: '/extinguishers',  label: 'Extinguishers',      icon: Flame,             roles: ALL },
    { path: '/audits',         label: 'Audits',             icon: ClipboardCheck,    roles: AUDIT },
    { path: '/fire-incidents', label: 'Fire Incidents',     icon: ShieldAlert,       roles: ALL },
    { label: 'Intelligence', type: 'section' },
    { path: '/ai-risk',        label: 'AI Risk Analysis',   icon: BrainCircuit,      roles: MGMT },
    { path: '/ai-assistant',   label: 'AI Assistant',       icon: MessageSquareText, roles: AI_ACCESS },
    { label: 'Supply & Admin', type: 'section' },
    { path: '/suppliers',      label: 'Suppliers',          icon: Handshake,         roles: SUPP },
    { path: '/contracts',      label: 'Contracts',          icon: FileText,          roles: [...SUPP, 'Auditor'] },
    { path: '/reports',        label: 'Reports',            icon: FileBarChart2,     roles: [...MGMT, 'Auditor', 'Supplier'] },
    { path: '/users',          label: 'Users & Permissions',icon: Users,             roles: MGMT },
    { path: '/settings',       label: 'Settings',           icon: Settings,          roles: ALL },
  ].filter(item => item.type === 'section' || !item.roles || item.roles.includes(role));
}

const PAGE_TITLES = {
  '/':               { title: 'Dashboard',           sub: 'Fire Safety Intelligence Overview' },
  '/buildings':      { title: 'Buildings',           sub: 'Manage your building portfolio' },
  '/extinguishers':  { title: 'Extinguishers',       sub: 'Track all fire suppression equipment' },
  '/audits':         { title: 'Audit Management',    sub: 'Compliance audit records & scheduling' },
  '/fire-incidents': { title: 'Fire Incidents',      sub: 'Track & manage fire events' },
  '/ai-risk':        { title: 'AI Risk Analysis',    sub: 'Intelligent risk assessment & insights' },
  '/ai-assistant':   { title: 'AI Assistant',        sub: 'Your intelligent fire safety advisor' },
  '/suppliers':      { title: 'Supplier Management', sub: 'Manage fire safety suppliers' },
  '/contracts':      { title: 'Contracts',           sub: 'Supplier & building contract management' },
  '/reports':        { title: 'Reports',             sub: 'Generate & export compliance reports' },
  '/users':          { title: 'Users & Permissions', sub: 'Role-based access control' },
  '/profile':        { title: 'My Profile',          sub: 'Manage your personal settings' },
  '/settings':       { title: 'Settings',            sub: 'System preferences & security' },
  '/about':          { title: 'About',               sub: 'Platform information & help' },
};

const initials = (name) => name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

/* ── Search Modal ─────────────────────────────────────────── */
function SearchModal({ query, setQuery, onClose, navigate, user, isSuperAdmin }) {
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const safeBuildings = isSuperAdmin
      ? mockBuildings
      : mockBuildings.filter(b =>
          b.companyId === user?.companyId ||
          (user?.role === 'Supplier' && b.supplierId === user?.supplierId) ||
          (user?.role === 'Building Owner' && b.id === user?.buildingId)
        );
    const safeAudits = isSuperAdmin
      ? mockAudits
      : mockAudits.filter(a => a.companyId === user?.companyId || a.auditorId === user?.id);
    const bldResults   = safeBuildings.filter(b => b.name.toLowerCase().includes(q) || b.location.toLowerCase().includes(q)).slice(0, 4).map(b => ({ type: 'Building', label: b.name, sub: b.location, path: '/buildings', emoji: '🏢' }));
    const auditResults = safeAudits.filter(a => a.building.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)).slice(0, 3).map(a => ({ type: 'Audit', label: a.id, sub: `${a.building} · ${a.status}`, path: '/audits', emoji: '📋' }));
    return [...bldResults, ...auditResults];
  }, [query, isSuperAdmin, user]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

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
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 15, outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font)' }}
          />
          <kbd style={{ fontSize: 11, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px', color: 'var(--text-muted)' }}>ESC</kbd>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 80 }}>
          {!query.trim() ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Type to search buildings, audits…</div>
          ) : results.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No results for "<strong>{query}</strong>"</div>
          ) : (
            <div style={{ padding: '8px 0' }}>
              {results.map((r, i) => (
                <div key={i}
                  style={{ padding: '10px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { navigate(r.path); onClose(); }}>
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
  const { user, logout, sessionWarning, extendSession, isSuperAdmin, theme, toggleTheme } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notifOpen,      setNotifOpen]      = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');

  const navItems = useMemo(() => buildNav(user?.role || ''), [user?.role]);

  const [localAlerts, setLocalAlerts] = useState([]);
  useEffect(() => {
    if (user) {
      let scoped;
      if (isSuperAdmin) scoped = mockAlerts;
      else if (user.role === 'Supplier') scoped = mockAlerts;
      else if (user.role === 'Auditor') scoped = mockAlerts;
      else scoped = mockAlerts.filter(a => a.companyId === user.companyId);
      setLocalAlerts(scoped.map(a => ({ ...a })));
    }
  }, [user, isSuperAdmin]);

  const unread      = localAlerts.filter(a => !a.read).length;
  const markAllRead = () => setLocalAlerts(p => p.map(a => ({ ...a, read: true })));
  const markRead    = id => setLocalAlerts(p => p.map(a => a.id === id ? { ...a, read: true } : a));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Close menus when route changes
  useEffect(() => {
    setNotifOpen(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const page         = PAGE_TITLES[location.pathname] || { title: 'FireGuard AI', sub: '' };
  const userInitials = initials(user?.name);

  const ROLE_COLORS = {
    'Super Admin':    { bg: '#DFF3E8', color: '#1F6F50' },
    'Supplier':       { bg: '#F3E8FF', color: '#7C3AED' },
    'Building Owner': { bg: '#E0F2FE', color: '#0369A1' },
    'Auditor':        { bg: '#FEF3C7', color: '#B45309' },
    'Company Admin':  { bg: '#E0E7FF', color: '#4338CA' },
  };

  const roleBadge = ROLE_COLORS[user?.role] || { bg: 'var(--bg-elevated)', color: 'var(--text-muted)' };

  // Mobile more menu items
  const moreItems = [
    { path: '/extinguishers',  label: 'Extinguishers',       icon: Flame,           roles: null },
    { path: '/fire-incidents', label: 'Fire Incidents',      icon: ShieldAlert,     roles: null },
    { path: '/suppliers',      label: 'Suppliers',           icon: Handshake,       roles: ['Super Admin', 'Company Admin', 'Supplier'] },
    { path: '/contracts',      label: 'Contracts',           icon: FileText,        roles: ['Super Admin', 'Company Admin', 'Supplier', 'Auditor'] },
    { path: '/ai-risk',        label: 'AI Risk Analysis',    icon: BrainCircuit,    roles: ['Super Admin', 'Company Admin'] },
    { path: '/reports',        label: 'Reports',             icon: FileBarChart2,   roles: ['Super Admin', 'Company Admin', 'Auditor', 'Supplier'] },
    { path: '/users',          label: 'Users & Permissions', icon: Users,           roles: ['Super Admin', 'Company Admin'] },
    { path: '/settings',       label: 'Settings',            icon: Settings,        roles: null },
    { path: '/about',          label: 'About',               icon: Info,            roles: null },
  ].filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="app-shell">
      {/* Session Warning Banner */}
      {sessionWarning && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: '#F59E0B', color: 'white', padding: '10px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, fontSize: 13, fontWeight: 600, boxShadow: 'var(--shadow-md)' }}>
          ⏱ Your session expires soon.
          <button onClick={extendSession} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', padding: '5px 14px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font)', minHeight: 32 }}>Stay Signed In</button>
        </div>
      )}

      {/* ── SIDEBAR (Desktop) ── */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')} role="button" aria-label="Go to dashboard">
          <div className="sidebar-logo-icon"><Flame size={20} color="white" strokeWidth={2.5} /></div>
          <div>
            <div className="sidebar-logo-name">FireGuard AI</div>
            <div className="sidebar-logo-sub">Safety Intelligence</div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item, idx) => {
            if (item.type === 'section') return <div key={idx} className="sidebar-section">{item.label}</div>;
            const Icon     = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                role="button"
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}>
                <Icon size={16} className="nav-icon" />
                <span>{item.label}</span>
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={() => navigate('/profile')} role="button" aria-label="Profile">
            <div className="sidebar-avatar" style={{ overflow: 'hidden', padding: user?.avatarData ? 0 : undefined }}>
              {user?.avatarData ? <img src={user.avatarData} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : userInitials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">{user?.name || 'Guest'}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                {user?.role}
              </div>
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
              <span>{user?.companyName || 'FireGuard AI'}</span>
              <ChevronRight size={11} />
              <span>{page.title}</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Search */}
            <button className="topbar-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search" id="topbar-search">
              <Search size={16} />
            </button>

            {/* Theme Toggle */}
            <button className="topbar-icon-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'} id="topbar-theme-toggle" title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications */}
            <button className="topbar-icon-btn" onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }} aria-label={`Notifications ${unread > 0 ? `(${unread} unread)` : ''}`} id="topbar-notifications">
              <Bell size={16} />
              {unread > 0 && <span className="topbar-badge" aria-hidden="true">{unread}</span>}
            </button>

            {/* Role Badge (Desktop only) */}
            <div className="hidden-on-mobile" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 'var(--radius-full)', background: roleBadge.bg, color: roleBadge.color, fontSize: 11.5, fontWeight: 700 }}>
              {user?.role}
            </div>

            {/* Avatar + Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <div
                id="topbar-avatar"
                onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
                role="button"
                aria-label="User menu"
                aria-expanded={profileOpen}
                style={{ width: 38, height: 38, borderRadius: '50%', background: user?.avatarData ? 'transparent' : 'linear-gradient(135deg, #22C55E, #1F6F50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', border: '2px solid var(--border)', userSelect: 'none', overflow: 'hidden' }}>
                {user?.avatarData ? <img src={user.avatarData} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : userInitials}
              </div>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div id="profile-dropdown" style={{ position: 'absolute', top: 48, right: 0, width: 240, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 200, padding: 6, animation: 'fadeInScale 0.15s both' }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-light)', marginBottom: 4 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</div>
                    <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: roleBadge.bg, color: roleBadge.color, fontSize: 11, fontWeight: 700 }}>
                      {user?.role}
                    </div>
                  </div>
                  {[
                    { label: 'My Profile', icon: User, path: '/profile' },
                    { label: 'Settings', icon: Settings, path: '/settings' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button key={item.path}
                        onClick={() => { navigate(item.path); setProfileOpen(false); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)', borderRadius: 6, textAlign: 'left', fontFamily: 'var(--font)', minHeight: 36 }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Icon size={14} /> {item.label}
                      </button>
                    );
                  })}
                  <div style={{ height: 1, background: 'var(--border-light)', margin: '4px 0' }} />
                  <button
                    id="profile-signout-btn"
                    onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--status-danger)', borderRadius: 6, textAlign: 'left', fontFamily: 'var(--font)', minHeight: 36 }}
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
        {searchOpen && (
          <SearchModal
            query={searchQuery}
            setQuery={setSearchQuery}
            onClose={() => { setSearchOpen(false); setSearchQuery(''); }}
            navigate={navigate}
            user={user}
            isSuperAdmin={isSuperAdmin}
          />
        )}

        {/* Notifications Panel */}
        {notifOpen && (
          <div id="notifications-panel"
            style={{ position: 'fixed', top: 76, right: 36, width: 360, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 151, animation: 'fadeInScale 0.15s both' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Alerts & Notifications</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{unread} unread</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
            </div>
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {localAlerts.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No alerts</div>
              ) : localAlerts.slice(0, 7).map(alert => (
                <div key={alert.id}
                  onClick={() => markRead(alert.id)}
                  style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', background: alert.read ? 'transparent' : 'var(--bg-subtle)', cursor: 'pointer', transition: 'background 0.12s', display: 'flex', gap: 12, alignItems: 'flex-start', minHeight: 64 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background = alert.read ? 'transparent' : 'var(--bg-subtle)'}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 6, background: alert.type === 'Critical' ? 'var(--status-danger)' : alert.type === 'High' ? 'var(--status-warning)' : alert.type === 'Medium' ? '#F59E0B' : 'var(--status-info)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{alert.building}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>{alert.type}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{alert.message}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overlay for dropdowns */}
        {(notifOpen || profileOpen || mobileMenuOpen) && (
          <div
            className="mobile-overlay"
            onClick={() => { setNotifOpen(false); setProfileOpen(false); setMobileMenuOpen(false); }}
            style={{ zIndex: 140 }}
          />
        )}

        {/* Page Content */}
        <main className="page-content"><Outlet /></main>

        <FloatingAIAssistant />
      </div>

      {/* ── MOBILE BOTTOM NAV (5 tabs as specified) ── */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {[
          { path: '/',            label: 'Dashboard', icon: LayoutDashboard,   roles: null },
          { path: '/buildings',   label: 'Buildings', icon: Building2,         roles: null },
          { path: '/audits',      label: 'Audits',    icon: ClipboardCheck,    roles: ['Super Admin', 'Company Admin', 'Auditor', 'Building Owner'] },
          { path: '/ai-assistant',label: 'AI',        icon: MessageSquareText, roles: ['Super Admin', 'Company Admin', 'Building Owner', 'Auditor'] },
        ].filter(item => !item.roles || item.roles.includes(user?.role)).map(item => (
          <div key={item.path}
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            role="button"
            aria-current={location.pathname === item.path ? 'page' : undefined}
            aria-label={item.label}>
            <item.icon size={22} />
            <span>{item.label}</span>
          </div>
        ))}
        {/* More tab — always visible */}
        <div
          className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          role="button"
          aria-label="More options"
          aria-expanded={mobileMenuOpen}>
          <Menu size={22} />
          <span>More</span>
        </div>
      </nav>

      {/* ── MOBILE MORE DRAWER ── */}
      {mobileMenuOpen && (
        <div className="mobile-more-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`mobile-more-menu ${mobileMenuOpen ? 'open' : ''}`} role="dialog" aria-label="More navigation options">
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>More</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.name}</div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: 'var(--bg-elevated)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Nav Grid */}
        <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, overflowY: 'auto', flex: 1 }}>
          {moreItems.map(item => {
            const Icon     = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path}
                className={`mobile-more-item ${isActive ? 'active' : ''}`}
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                role="button"
                aria-current={isActive ? 'page' : undefined}
                style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', minHeight: 80 }}>
                <Icon size={20} color={isActive ? 'var(--color-primary)' : 'var(--text-secondary)'} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* ── SIGN OUT — Always Visible ── */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-light)' }}>
          <button
            id="mobile-signout-btn"
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px 20px', background: 'var(--status-danger-bg)', border: '1px solid var(--status-danger)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'var(--status-danger)', fontFamily: 'var(--font)', minHeight: 48 }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
