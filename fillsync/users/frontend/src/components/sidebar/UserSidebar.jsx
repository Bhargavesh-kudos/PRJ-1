/**
 * ============================================================================
 * FILE: frontend/src/components/sidebar/UserSidebar.jsx
 * PURPOSE: Left Navigation Sidebar for the User Dashboard (both Free and
 *          Premium users). Displays plan badge and quick navigation links.
 * ============================================================================
 */

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  FolderKanban,
  FileCode2,
  CreditCard,
  Settings,
  LogOut,
  Zap,
  Crown,
  Puzzle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function UserSidebar({ onOpenExtensionSimulator }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isPremium = user?.role === "premium";

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/dashboard/profile", label: "Master Profile", icon: UserCheck },
    { to: "/dashboard/folders", label: "Data Folders", icon: FolderKanban },
    { to: "/dashboard/templates", label: "Smart Templates", icon: FileCode2 },
    { to: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
    { to: "/dashboard/settings", label: "Settings", icon: Settings }
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col min-h-screen border-r border-slate-800 select-none shrink-0">
      {/* Top Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-teal-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">
              Fill<span className="text-teal-400">Sync</span>
            </span>
            {isPremium ? (
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">
                ★ Premium Tier
              </span>
            ) : (
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Free Tier
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal-500 text-white shadow-sm shadow-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.label === "Subscription" && isPremium && (
                <Crown className="w-3.5 h-3.5 text-amber-300 ml-auto" />
              )}
            </NavLink>
          );
        })}

        {/* Interactive Extension Popup Preview Button */}
        <div className="pt-4 mt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onOpenExtensionSimulator}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-slate-800/90 hover:bg-slate-800 text-teal-300 border border-teal-500/30 transition-all"
          >
            <Puzzle className="w-4 h-4 text-teal-400" />
            <span>Extension Simulator</span>
          </button>
        </div>
      </nav>

      {/* Bottom User Card & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
