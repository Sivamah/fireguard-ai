import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageSkeleton } from './components/ui/Skeleton';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy load pages for performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Buildings = React.lazy(() => import('./pages/Buildings'));
const Extinguishers = React.lazy(() => import('./pages/Extinguishers'));
const Audits = React.lazy(() => import('./pages/Audits'));
const AIRisk = React.lazy(() => import('./pages/AIRisk'));
const AIAssistant = React.lazy(() => import('./pages/AIAssistant'));
const Reports = React.lazy(() => import('./pages/Reports'));
const UserPermissions = React.lazy(() => import('./pages/UserPermissions'));
const About = React.lazy(() => import('./pages/About'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Login = React.lazy(() => import('./pages/Login'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));

import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected App Routes */}
                <Route element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/buildings" element={<Buildings />} />
                  <Route path="/extinguishers" element={<Extinguishers />} />
                  
                  {/* Role Protected Routes */}
                  <Route path="/audits" element={
                    <ProtectedRoute allowedRoles={['Admin', 'Auditor']}>
                      <Audits />
                    </ProtectedRoute>
                  } />
                  <Route path="/ai-risk" element={
                    <ProtectedRoute allowedRoles={['Admin', 'Analyst']}>
                      <AIRisk />
                    </ProtectedRoute>
                  } />
                  <Route path="/ai-assistant" element={
                    <ProtectedRoute allowedRoles={['Admin', 'Analyst']}>
                      <AIAssistant />
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/users" element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <UserPermissions />
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  
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
