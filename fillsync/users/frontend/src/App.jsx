/**
 * ============================================================================
 * FILE: users/frontend/src/App.jsx
 * PURPOSE: Main Application Router connecting:
 *          1. Public & User Dashboard Screens (`users/frontend/src/pages/*`)
 *          2. SuperAdmin Control Panel (`superadmin/frontend/src/pages/*`)
 *          3. Interactive Extension Simulator Modal
 * ============================================================================
 */

import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Public & Auth Screens (in users/frontend/src/pages/)
import LandingPage from "./pages/landing-page/LandingPage.jsx";
import LoginPage from "./pages/login-page/LoginPage.jsx";
import SignupPage from "./pages/signup-page/SignupPage.jsx";

// User Dashboard Screens (in users/frontend/src/pages/)
import UserSidebar from "./components/sidebar/UserSidebar.jsx";
import UserDashboard from "./pages/user-dashboard/UserDashboard.jsx";
import MasterProfilePage from "./pages/master-profile/MasterProfilePage.jsx";
import DataFoldersPage from "./pages/data-folders/DataFoldersPage.jsx";
import SmartTemplatesPage from "./pages/smart-templates/SmartTemplatesPage.jsx";
import SubscriptionPage from "./pages/subscription-page/SubscriptionPage.jsx";
import SettingsPage from "./pages/settings-page/SettingsPage.jsx";

// SuperAdmin Screen (imported from dedicated superadmin/frontend/ folder!)
import AdminDashboard from "../../../superadmin/frontend/src/pages/admin-dashboard/AdminDashboard.jsx";

// Interactive Extension Popup Simulator Modal
import ExtensionSimulatorModal from "./components/extension-simulator/ExtensionSimulatorModal.jsx";

/**
 * Layout wrapper for all `/dashboard/*` User routes.
 */
function UserDashboardLayout() {
  const { user, loading } = useAuth();
  const [extModalOpen, setExtModalOpen] = useState(false);

  if (loading) {
    return <div className="p-10 text-sm text-slate-500">Verifying session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "superadmin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <UserSidebar onOpenExtensionSimulator={() => setExtModalOpen(true)} />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
      <ExtensionSimulatorModal
        isOpen={extModalOpen}
        onClose={() => setExtModalOpen(false)}
      />
    </div>
  );
}

/**
 * Protected wrapper for `/admin` SuperAdmin route.
 */
function SuperAdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-sm text-slate-500">Verifying admin session...</div>;
  }

  if (!user || user.role !== "superadmin") {
    return <Navigate to="/login" replace />;
  }

  return <AdminDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Public Website Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 2. Protected User Dashboard Routes */}
          <Route path="/dashboard" element={<UserDashboardLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<MasterProfilePage />} />
            <Route path="folders" element={<DataFoldersPage />} />
            <Route path="templates" element={<SmartTemplatesPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 3. Protected SuperAdmin Control Panel Route */}
          <Route path="/admin" element={<SuperAdminRoute />} />

          {/* 4. Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
