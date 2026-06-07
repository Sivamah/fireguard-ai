import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Demo User Accounts ─────────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    id: 'USR-001',
    name: 'Arjun Kapoor',
    email: 'admin@fireguard.ai',
    password: 'admin123',
    role: 'Admin',
    avatar: 'AK',
    buildings: 'All',
    status: 'Active',
  },
  {
    id: 'USR-004',
    name: 'Anjali Nair',
    email: 'analyst@fireguard.ai',
    password: 'analyst123',
    role: 'Analyst',
    avatar: 'AN',
    buildings: 'Prism Corporate Center',
    status: 'Active',
  },
  {
    id: 'USR-002',
    name: 'Priya Sharma',
    email: 'auditor@fireguard.ai',
    password: 'auditor123',
    role: 'Auditor',
    avatar: 'PS',
    buildings: 'Nexus Tower, Meridian Plaza',
    status: 'Active',
  },
];

// ─── Session Config ──────────────────────────────────────────────────────────
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const SESSION_KEY = 'fireguard_session';
const TOKEN_KEY = 'fireguard_token';

// ─── Fake JWT Generator ──────────────────────────────────────────────────────
function generateToken(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    name: user.name,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + SESSION_DURATION_MS,
  }));
  const signature = btoa(`${user.id}-${user.role}-fireguard-secret`);
  return `${header}.${payload}.${signature}`;
}

function parseToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [sessionWarning, setSessionWarning] = useState(false);

  // ── Restore session on mount ──
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (token && sessionData) {
      const payload = parseToken(token);
      if (payload) {
        const session = JSON.parse(sessionData);
        setUser(session.user);
        setSessionExpiry(payload.exp);
      } else {
        // Token expired
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // ── Session timeout warning (warn 5 min before expiry) ──
  useEffect(() => {
    if (!sessionExpiry) return;
    const warnAt = sessionExpiry - 5 * 60 * 1000;
    const now = Date.now();
    if (warnAt <= now) {
      setSessionWarning(true);
      return;
    }
    const warnTimer = setTimeout(() => setSessionWarning(true), warnAt - now);
    const expireTimer = setTimeout(() => logout(), sessionExpiry - now);
    return () => {
      clearTimeout(warnTimer);
      clearTimeout(expireTimer);
    };
  }, [sessionExpiry]);

  // ── Login ──
  const login = useCallback(async (email, password) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    const account = DEMO_ACCOUNTS.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!account) {
      throw new Error('Invalid email or password. Please try again.');
    }
    const { password: _pw, ...safeUser } = account;
    const token = generateToken(safeUser);
    const payload = parseToken(token);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: safeUser }));
    setUser(safeUser);
    setSessionExpiry(payload.exp);
    setSessionWarning(false);
    return safeUser;
  }, []);

  // ── Logout ──
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setSessionExpiry(null);
    setSessionWarning(false);
  }, []);

  // ── Extend session ──
  const extendSession = useCallback(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!user || !token) return;
    const newToken = generateToken(user);
    const payload = parseToken(newToken);
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
    login,
    logout,
    extendSession,
    updateProfile,
    // Helpers
    isAdmin: user?.role === 'Admin',
    isAnalyst: user?.role === 'Analyst',
    isAuditor: user?.role === 'Auditor',
    DEMO_ACCOUNTS: DEMO_ACCOUNTS.map(({ password: _p, ...a }) => a),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
