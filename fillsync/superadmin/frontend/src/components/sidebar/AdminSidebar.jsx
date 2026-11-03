/**
 * ============================================================================
 * FILE: superadmin/frontend/src/components/sidebar/AdminSidebar.jsx
 * PURPOSE: Dedicated Left Sidebar for the SuperAdmin Control Panel.
 *          Allows switching between Overview, Users (PII Masked),
 *          Subscriptions, Security Logs, Support Tickets, and System Settings.
 * ============================================================================
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  BarChart3,
  Users,
  CreditCard,
  ScrollText,
  LifeBuoy,
  Settings,
  LogOut,
  Home
} from "lucide-react";

export default function AdminSidebar({ activeTab, setActiveTab, user, onLogout }) {
  const navigate = useNavigate();

  const tabs = [
    { id: "overview", label: "Platform Overview", icon: BarChart3 },
    { id: "users", label: "Users (PII Masked)", icon: Users },
    { id: "subscriptions", label: "Subscriptions & MRR", icon: CreditCard },
    { id: "logs", label: "Security & Audit Logs", icon: ScrollText },
    { id: "tickets", label: "Support Tickets", icon: LifeBuoy },
    { id: "settings", label: "SuperAdmin & Settings", icon: Settings }
  ];

  function handleSignOut() {
    if (onLogout) onLogout();
    navigate("/login");
  }

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 flex flex-col min-h-screen border-r border-slate-800 shrink-0">
      {/* Admin Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-white tracking-tight">
              FillSync <span className="text-amber-400">Admin</span>
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
              SuperAdmin Control
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 p-4 space-y-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>View Public Website</span>
          </button>
        </div>
      </nav>

      {/* Bottom SuperAdmin Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="mb-3 px-2">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Logged in as SuperAdmin
          </p>
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
