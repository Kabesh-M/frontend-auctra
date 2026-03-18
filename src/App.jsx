import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/authCore';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ManageChit from './pages/ManageChit';
import AuctionScreen from './pages/AuctionScreen';
import LandingPage from './pages/LandingPage';
import AdminPanel from './pages/AdminPanel';
import SettingsPage from './pages/SettingsPage';
import KYCPage from './pages/KYCPage';
import TransactionPage from './pages/TransactionPage';
import CompliancePage from './pages/CompliancePage';
import Navbar from './components/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-primary font-bold uppercase tracking-widest animate-pulse">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center text-primary font-bold uppercase tracking-widest animate-pulse">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

// Guest Route - redirect authenticated users to dashboard
const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-dark">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            <Route
              path="/manage/:id"
              element={
                <ProtectedRoute>
                  <ManageChit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/auction/:id"
              element={
                <ProtectedRoute>
                  <AuctionScreen />
                </ProtectedRoute>
              }
            />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/kyc"
                element={
                  <ProtectedRoute>
                    <KYCPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <TransactionPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/compliance"
                element={
                  <AdminRoute>
                    <CompliancePage />
                  </AdminRoute>
                }
              />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
