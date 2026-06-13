import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { users as DEMO_USERS } from '../data/mockData';

// ─── Session Config ──────────────────────────────────────────────────────────
const SESSION_DURATION_MS = 60 * 60 * 1000; // 60 minutes
const SESSION_KEY = 'fireguard_session';
const TOKEN_KEY   = 'fireguard_token';
const THEME_KEY   = 'fireguard_theme';

// ─── Fake JWT Generator ──────────────────────────────────────────────────────
function generateToken(user) {
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id, name: user.name, role: user.role,
    companyId: user.companyId,
    iat: Date.now(), exp: Date.now() + SESSION_DURATION_MS,
  }));
  const sig = btoa(`${user.id}-${user.role}-fireguard-secret`);
  return `${header}.${payload}.${sig}`;
}

function parseToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(null);
  const [isLoading, setIsLoading]         = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [theme, setThemeState]            = useState(() => localStorage.getItem(THEME_KEY) || 'light');

  // ── Apply theme to DOM ──
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((t) => setThemeState(t), []);

  // ── Restore session on mount ──
  useEffect(() => {
    const token       = localStorage.getItem(TOKEN_KEY);
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (token && sessionData) {
      const payload = parseToken(token);
      if (payload) {
        const session = JSON.parse(sessionData);
        setUser(session.user);
        setSessionExpiry(payload.exp);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // ── Session timeout warning (warn 10 min before expiry) ──
  useEffect(() => {
    if (!sessionExpiry) return;
    const warnAt = sessionExpiry - 10 * 60 * 1000;
    const now    = Date.now();
    if (warnAt <= now) { setSessionWarning(true); return; }
    const warnTimer   = setTimeout(() => setSessionWarning(true), warnAt - now);
    const expireTimer = setTimeout(() => logout(), sessionExpiry - now);
    return () => { clearTimeout(warnTimer); clearTimeout(expireTimer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionExpiry]);

  // ── Password Login (primary demo flow) ──
  const login = useCallback(async (email, password, rememberMe = false) => {
    await new Promise(r => setTimeout(r, 700));
    const account = DEMO_USERS.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!account) throw new Error('Invalid email or password. Please try again.');
    if (account.status !== 'Active') throw new Error('Your account is inactive. Please contact support.');
    return _createSession(account, rememberMe);
  }, []);

  // ── Send OTP ──
  const sendOtp = useCallback(async (email) => {
    await new Promise(r => setTimeout(r, 800));
    const account = DEMO_USERS.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!account) throw new Error('Email not found. Please contact your administrator.');
    if (account.status !== 'Active') throw new Error('Your account is inactive. Please contact support.');
    return true;
  }, []);

  // ── Verify OTP & Login ──
  const verifyOtp = useCallback(async (email, code) => {
    await new Promise(r => setTimeout(r, 600));
    if (code !== '123456') throw new Error('Invalid code. For this demo, use 123456.');
    const account = DEMO_USERS.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!account) throw new Error('Account not found.');
    return _createSession(account);
  }, []);

  function _createSession(account, rememberMe = false) {
    // Strip password before storing
    // eslint-disable-next-line no-unused-vars
    const { password: _pw, ...safeUser } = account;
    const token   = generateToken(safeUser);
    const payload = parseToken(token);
    const storage = rememberMe ? localStorage : sessionStorage;
    // Always write to localStorage for session restore; sessionStorage for non-remember
    localStorage.setItem(TOKEN_KEY,   token);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: safeUser, rememberMe }));
    setUser(safeUser);
    setSessionExpiry(payload.exp);
    setSessionWarning(false);
    return safeUser;
  }

  // ── Logout ──
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.clear();
    setUser(null);
    setSessionExpiry(null);
    setSessionWarning(false);
  }, []);

  // ── Extend session ──
  const extendSession = useCallback(() => {
    if (!user) return;
    const newToken = generateToken(user);
    const payload  = parseToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    setSessionExpiry(payload.exp);
    setSessionWarning(false);
  }, [user]);

  // ── Update user profile ──
  const updateProfile = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, user: updated }));
      return updated;
    });
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    sessionWarning,
    sessionExpiry,
    theme,
    toggleTheme,
    setTheme,
    login,
    sendOtp,
    verifyOtp,
    logout,
    extendSession,
    updateProfile,
    // Role Helpers (4 core roles — Analyst removed)
    isSuperAdmin:    user?.role === 'Super Admin',
    isCompanyAdmin:  user?.role === 'Company Admin',
    isSupplier:      user?.role === 'Supplier',
    isBuildingOwner: user?.role === 'Building Owner',
    isAuditor:       user?.role === 'Auditor',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
