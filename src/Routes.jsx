import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Pages
import Dashboard from './pages/dashboard';
import TradeManagement from './pages/trade-management';
import Analytics from './pages/analytics';
import BrokerIntegration from './pages/broker-integration';
import ProfileSettings from './pages/profile-settings';
import HelpSupport from './pages/help-support';
import Security from './pages/security';
import Notifications from './pages/notifications';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';
import PrivacyPolicy from './pages/privacy-policy';
import TermsOfService from './pages/terms-of-service';
import NotFound from './pages/NotFound';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <ScrollToTop />
            <RouterRoutes>
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Main Application Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trade-management" element={<TradeManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/broker-integration" element={<BrokerIntegration />} />

              {/* User Management Routes */}
              <Route path="/profile-settings" element={<ProfileSettings />} />
              <Route path="/security" element={<Security />} />
              <Route path="/notifications" element={<Notifications />} />

              {/* Support & Legal Routes */}
              <Route path="/help-support" element={<HelpSupport />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;