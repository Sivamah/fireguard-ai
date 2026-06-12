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
// New pages
const Suppliers      = React.lazy(() => import('./pages/Suppliers'));
const Contracts      = React.lazy(() => import('./pages/Contracts'));
const FireIncidents  = React.lazy(() => import('./pages/FireIncidents'));

import './index.css';

const ALL_ROLES = ['Super Admin', 'Company Admin', 'Supplier', 'Building Owner', 'Auditor', 'Analyst'];

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

                {/* Audits — most roles except Supplier/Building Owner (can view) */}
                <Route path="/audits" element={
                  <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Auditor', 'Building Owner', 'Analyst']}>
                    <Audits />
                  </ProtectedRoute>
                } />

                {/* Fire Incidents */}
                <Route path="/fire-incidents" element={
                  <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Supplier', 'Building Owner', 'Auditor']}>
                    <FireIncidents />
                  </ProtectedRoute>
                } />

                {/* AI Risk Analysis */}
                <Route path="/ai-risk" element={
                  <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Analyst']}>
                    <AIRisk />
                  </ProtectedRoute>
                } />

                {/* AI Assistant */}
                <Route path="/ai-assistant" element={
                  <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Analyst']}>
                    <AIAssistant />
                  </ProtectedRoute>
                } />

                {/* Reports */}
                <Route path="/reports" element={
                  <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Analyst', 'Auditor', 'Supplier']}>
                    <Reports />
                  </ProtectedRoute>
                } />

                {/* Suppliers */}
                <Route path="/suppliers" element={
                  <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Supplier']}>
                    <Suppliers />
                  </ProtectedRoute>
                } />

                {/* Contracts */}
                <Route path="/contracts" element={
                  <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'Supplier', 'Auditor']}>
                    <Contracts />
                  </ProtectedRoute>
                } />

                {/* User Permissions — admins only */}
                <Route path="/users" element={
                  <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin']}>
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
