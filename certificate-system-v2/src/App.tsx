import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardPage } from './pages/DashboardPage';
import { PreviewPage } from './pages/PreviewPage';
import { OfferLetterPage } from './pages/OfferLetterPage';
import { StudentVerifyPage } from './pages/StudentVerifyPage';
import { VerifyPage } from './pages/VerifyPage';
import { LoginPage } from './pages/LoginPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-semibold text-xs">
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Protected Admin Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preview"
            element={
              <ProtectedRoute>
                <PreviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offer-letter"
            element={
              <ProtectedRoute>
                <OfferLetterPage />
              </ProtectedRoute>
            }
          />

          {/* Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Public Verification Routes */}
          <Route path="/studentverify/:id" element={<StudentVerifyPage />} />
          <Route path="/studentverify" element={<StudentVerifyPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
