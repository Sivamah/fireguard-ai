import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageSkeleton } from './components/ui/Skeleton';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// ── Lazy load pages ──────────────────────────────────────────
const Dashboard    = React.lazy(() => import('./pages/Dashboard'));
const Buildings    = React.lazy(() => import('./pages/Buildings'));
const Equipment    = React.lazy(() => import('./pages/Equipment'));
const Inspections  = React.lazy(() => import('./pages/Inspections'));
const Incidents    = React.lazy(() => import('./pages/Incidents'));
const AIPrediction = React.lazy(() => import('./pages/AIPrediction'));
const Compliance   = React.lazy(() => import('./pages/Compliance'));
const Reports      = React.lazy(() => import('./pages/Reports'));
const Settings     = React.lazy(() => import('./pages/Settings'));
const Profile      = React.lazy(() => import('./pages/Profile'));
const Login        = React.lazy(() => import('./pages/Login'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));

import './index.css';

// ── Role groups ──────────────────────────────────────────────
const ALL   = ['Admin', 'Facility Manager', 'Inspector'];
const ADMIN = ['Admin', 'Facility Manager'];

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
                <Route path="/"            element={<Dashboard />} />
                <Route path="/buildings"   element={<Buildings />} />
                <Route path="/equipment"   element={<Equipment />} />
                <Route path="/inspections" element={<Inspections />} />
                <Route path="/incidents"   element={<Incidents />} />
                <Route path="/settings"    element={<Settings />} />
                <Route path="/profile"     element={<Profile />} />

                {/* Admin + Facility Manager only */}
                <Route path="/ai-prediction" element={
                  <ProtectedRoute allowedRoles={ADMIN}>
                    <AIPrediction />
                  </ProtectedRoute>
                } />

                <Route path="/compliance" element={
                  <ProtectedRoute allowedRoles={ADMIN}>
                    <Compliance />
                  </ProtectedRoute>
                } />

                <Route path="/reports" element={
                  <ProtectedRoute allowedRoles={ADMIN}>
                    <Reports />
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
