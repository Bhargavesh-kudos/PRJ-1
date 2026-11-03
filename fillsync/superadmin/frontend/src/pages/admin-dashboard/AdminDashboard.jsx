/**
 * ============================================================================
 * FILE: superadmin/frontend/src/pages/admin-dashboard/AdminDashboard.jsx
 * PURPOSE: Master SuperAdmin Dashboard Container that connects the dedicated
 *          SuperAdmin screen folders:
 *          - `pages/overview-page/AdminOverviewTab.jsx`
 *          - `pages/users-management/AdminUsersTab.jsx`
 *          - `pages/subscriptions-mrr/AdminSubscriptionsTab.jsx`
 *          - `pages/security-logs/AdminLogsTab.jsx`
 *          - `pages/support-tickets/AdminTicketsTab.jsx`
 *          - `pages/system-settings/AdminSettingsTab.jsx`
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import AdminSidebar from "../../components/sidebar/AdminSidebar.jsx";
import AdminOverviewTab from "../overview-page/AdminOverviewTab.jsx";
import AdminUsersTab from "../users-management/AdminUsersTab.jsx";
import AdminSubscriptionsTab from "../subscriptions-mrr/AdminSubscriptionsTab.jsx";
import AdminLogsTab from "../security-logs/AdminLogsTab.jsx";
import AdminTicketsTab from "../support-tickets/AdminTicketsTab.jsx";
import AdminSettingsTab from "../system-settings/AdminSettingsTab.jsx";

import { apiRequest } from "../../../../../users/frontend/src/services/api.js";
import { useAuth } from "../../../../../users/frontend/src/context/AuthContext.jsx";

export default function AdminDashboard() {
  const { user, updateUserState, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [banner, setBanner] = useState(null);

  const [data, setData] = useState({
    stats: {
      totalUsers: 0,
      premiumUsers: 0,
      freeUsers: 0,
      totalFormsFilled: 0,
      totalFolders: 0,
      totalTemplates: 0,
      monthlyRevenueINR: 0
    },
    users: [],
    subscriptions: [],
    activityLogs: [],
    supportTickets: [],
    systemSettings: {
      freeFolderLimit: 5,
      freeTemplateLimit: 5,
      premiumMonthlyPriceINR: 99,
      maintenanceMode: false
    }
  });

  const [settingsForm, setSettingsForm] = useState({
    freeFolderLimit: 5,
    freeTemplateLimit: 5,
    premiumMonthlyPriceINR: 99,
    maintenanceMode: false,
    newSuperAdminEmail: user?.email || "admin@fillsync.com",
    newSuperAdminPassword: ""
  });

  const [replyTextMap, setReplyTextMap] = useState({});

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    try {
      const res = await apiRequest("/admin/overview");
      setData(res);
      if (res.systemSettings) {
        setSettingsForm((prev) => ({
          ...prev,
          freeFolderLimit: res.systemSettings.freeFolderLimit,
          freeTemplateLimit: res.systemSettings.freeTemplateLimit,
          premiumMonthlyPriceINR: res.systemSettings.premiumMonthlyPriceINR,
          maintenanceMode: res.systemSettings.maintenanceMode
        }));
      }
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    }
  }

  async function handleToggleUserRole(targetUser) {
    const nextRole = targetUser.role === "premium" ? "free" : "premium";
    try {
      const res = await apiRequest(`/admin/users/${targetUser.id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: nextRole })
      });
      setBanner({ type: "success", text: res.message });
      fetchAdminData();
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    }
  }

  async function handleToggleUserStatus(targetUser) {
    const nextStatus = targetUser.status === "suspended" ? "active" : "suspended";
    try {
      const res = await apiRequest(`/admin/users/${targetUser.id}/role`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus })
      });
      setBanner({ type: "success", text: res.message });
      fetchAdminData();
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    }
  }

  async function handleDeleteUser(targetUser) {
    try {
      const res = await apiRequest(`/admin/users/${targetUser.id}`, {
        method: "DELETE"
      });
      setBanner({ type: "success", text: res.message });
      fetchAdminData();
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    }
  }

  async function handleSaveAdminSettings(e) {
    e.preventDefault();
    setBanner(null);
    try {
      const res = await apiRequest("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settingsForm)
      });
      setBanner({ type: "success", text: res.message });
      if (res.superAdminEmail && user) {
        updateUserState({ ...user, email: res.superAdminEmail });
      }
      setSettingsForm((prev) => ({ ...prev, newSuperAdminPassword: "" }));
      fetchAdminData();
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    }
  }

  async function handleTicketReply(ticketId) {
    const reply = replyTextMap[ticketId] || "";
    try {
      const res = await apiRequest(`/admin/tickets/${ticketId}/reply`, {
        method: "POST",
        body: JSON.stringify({ adminReply: reply, status: "Resolved" })
      });
      setBanner({ type: "success", text: res.message });
      fetchAdminData();
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={logout}
      />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
              🛡️ SuperAdmin Management Console
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {activeTab === "overview" && "Platform Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "subscriptions" && "Subscriptions & Revenue"}
              {activeTab === "logs" && "Activity Logs"}
              {activeTab === "tickets" && "Support Tickets"}
              {activeTab === "settings" && "System Settings"}
            </h1>
          </div>

          <button
            onClick={fetchAdminData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
        </div>

        {banner && (
          <div
            className={`p-4 rounded-xl text-sm font-semibold ${
              banner.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {banner.text}
          </div>
        )}

        {activeTab === "overview" && (
          <AdminOverviewTab
            stats={data.stats}
            onOpenUsersTab={() => setActiveTab("users")}
          />
        )}

        {activeTab === "users" && (
          <AdminUsersTab
            users={data.users}
            onToggleRole={handleToggleUserRole}
            onToggleStatus={handleToggleUserStatus}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === "subscriptions" && (
          <AdminSubscriptionsTab subscriptions={data.subscriptions} />
        )}

        {activeTab === "logs" && <AdminLogsTab activityLogs={data.activityLogs} />}

        {activeTab === "tickets" && (
          <AdminTicketsTab
            supportTickets={data.supportTickets}
            replyTextMap={replyTextMap}
            setReplyTextMap={setReplyTextMap}
            onReplyTicket={handleTicketReply}
          />
        )}

        {activeTab === "settings" && (
          <AdminSettingsTab
            settingsForm={settingsForm}
            setSettingsForm={setSettingsForm}
            onSaveSettings={handleSaveAdminSettings}
          />
        )}
      </main>
    </div>
  );
}
