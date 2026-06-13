import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageSkeleton } from './components/ui/Skeleton';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy load pages
const Dashboard      = React.lazy(() => import('./pages/Dashboard'));
const Buildings      = React.lazy(() => import('./pages/Buildings'));
const Extinguishers  = React.lazy(() => import('./pages/Extinguishers'));
const Audits         = React.lazy(() => import('./pages/Audits'));
const AIRisk         = React.lazy(() => import('./pages/AIRisk'));
const AIAssistant    = React.lazy(() => import('./pages/AIAssistant'));
const Reports        = React.lazy(() => import('./pages/Reports'));
const UserPermissions = React.lazy(() => import('./pages/UserPermissions'));
const Settings       = React.lazy(() => import('./pages/Settings'));
const About          = React.lazy(() => import('./pages/About'));
const Profile        = React.lazy(() => import('./pages/Profile'));
const Login          = React.lazy(() => import('./pages/Login'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Unauthorized   = React.lazy(() => import('./pages/Unauthorized'));
// Additional pages
const Suppliers      = React.lazy(() => import('./pages/Suppliers'));
const Contracts      = React.lazy(() => import('./pages/Contracts'));
const FireIncidents  = React.lazy(() => import('./pages/FireIncidents'));

import './index.css';

// 4 Core roles — Analyst removed
const ALL_ROLES = ['Super Admin', 'Company Admin', 'Supplier', 'Building Owner', 'Auditor'];
const MGMT      = ['Super Admin', 'Company Admin'];
const SUPP      = ['Super Admin', 'Company Admin', 'Supplier'];
const INTEL     = ['Super Admin', 'Company Admin'];
const AUDIT_ACCESS = ['Super Admin', 'Company Admin', 'Auditor', 'Building Owner'];
// AI Assistant: Super Admin, Building Owner, Auditor (opened up from Analyst-only)
const AI_ACCESS = ['Super Admin', 'Company Admin', 'Building Owner', 'Auditor'];

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login"          element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized"   element={<Unauthorized />} />

              {/* Protected App Routes */}
              <Route element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                {/* All roles */}
                <Route path="/"             element={<Dashboard />} />
                <Route path="/buildings"    element={<Buildings />} />
                <Route path="/extinguishers" element={<Extinguishers />} />
                <Route path="/settings"     element={<Settings />} />
                <Route path="/profile"      element={<Profile />} />
                <Route path="/about"        element={<About />} />

                {/* Audits — auditors, building owners, admins */}
                <Route path="/audits" element={
                  <ProtectedRoute allowedRoles={AUDIT_ACCESS}>
                    <Audits />
                  </ProtectedRoute>
                } />

                {/* Fire Incidents — all except restricted */}
                <Route path="/fire-incidents" element={
                  <ProtectedRoute allowedRoles={ALL_ROLES}>
                    <FireIncidents />
                  </ProtectedRoute>
                } />

                {/* AI Risk Analysis — Super Admin only */}
                <Route path="/ai-risk" element={
                  <ProtectedRoute allowedRoles={INTEL}>
                    <AIRisk />
                  </ProtectedRoute>
                } />

                {/* AI Assistant — Super Admin, Building Owner, Auditor */}
                <Route path="/ai-assistant" element={
                  <ProtectedRoute allowedRoles={AI_ACCESS}>
                    <AIAssistant />
                  </ProtectedRoute>
                } />

                {/* Reports */}
                <Route path="/reports" element={
                  <ProtectedRoute allowedRoles={[...INTEL, 'Auditor', 'Supplier']}>
                    <Reports />
                  </ProtectedRoute>
                } />

                {/* Suppliers */}
                <Route path="/suppliers" element={
                  <ProtectedRoute allowedRoles={SUPP}>
                    <Suppliers />
                  </ProtectedRoute>
                } />

                {/* Contracts */}
                <Route path="/contracts" element={
                  <ProtectedRoute allowedRoles={[...SUPP, 'Auditor']}>
                    <Contracts />
                  </ProtectedRoute>
                } />

                {/* User Permissions — admins only */}
                <Route path="/users" element={
                  <ProtectedRoute allowedRoles={MGMT}>
                    <UserPermissions />
                  </ProtectedRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
