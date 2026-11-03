/**
 * ============================================================================
 * FILE: frontend/src/pages/user-dashboard/UserDashboard.jsx
 * PURPOSE: Main User Dashboard Overview Screen.
 *          Dynamically adapts between Free User View and Premium User View.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  FileCode2,
  CreditCard,
  CheckCircle2,
  UserCheck,
  PlusCircle,
  Sparkles,
  Crown,
  Layers,
  Chrome,
  Download
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../services/api.js";

export default function UserDashboard() {
  const { user } = useAuth();
  const [foldersCount, setFoldersCount] = useState(3);
  const [templatesCount, setTemplatesCount] = useState(3);

  const isPremium = user?.role === "premium";

  useEffect(() => {
    async function loadCounts() {
      try {
        const [fRes, tRes] = await Promise.all([
          apiRequest("/folders"),
          apiRequest("/templates")
        ]);
        if (fRes.folders) setFoldersCount(fRes.folders.length);
        if (tRes.templates) setTemplatesCount(tRes.templates.length);
      } catch (err) {
        // Ignore initial load error
      }
    }
    loadCounts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Welcome back, {user?.name}!
            </h1>
            {isPremium ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                Premium Member
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                Free Plan
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal profile, data folders, and templates from one place.
          </p>
        </div>

        {!isPremium && (
          <Link
            to="/dashboard/subscription"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-sm transition-all"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Premium
          </Link>
        )}
      </div>

      {/* Chrome Extension Download & Quick Setup Card */}
      <div className="bg-gradient-to-r from-teal-500/10 via-slate-50 to-teal-500/5 p-5 rounded-2xl border border-teal-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center shrink-0 shadow-sm">
            <Chrome className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Install FillSync Browser Extension</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase">
                Chrome &bull; Edge &bull; Brave
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Auto-fill government portals (UPSC/SSC), college admission forms, and IRCTC train tickets directly inside your browser.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="/fillsync-extension.zip"
            download="fillsync-extension.zip"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Extension (.zip)</span>
          </a>
        </div>
      </div>

      {/* 4 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Data Folders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {isPremium ? "Unlimited" : "Max 5 (Free)"}
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{foldersCount}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Data Folders (3 Built-In + Custom)
          </p>
        </div>

        {/* Card 2: Smart Templates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {isPremium ? "Unlimited" : "Max 5 (Free)"}
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {templatesCount}
          </p>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Smart Templates Saved
          </p>
        </div>

        {/* Card 3: Current Plan */}
        <div
          className={`p-6 rounded-2xl border shadow-sm ${
            isPremium
              ? "bg-amber-50/50 border-amber-300"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isPremium ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isPremium
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              ● Active
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {isPremium ? "Premium Plan" : "Free Plan"}
          </p>
          <div className="mt-2">
            {isPremium ? (
              <span className="text-xs font-semibold text-amber-700">
                ★ All Premium Features Unlocked
              </span>
            ) : (
              <Link
                to="/dashboard/subscription"
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                Upgrade for Unlimited →
              </Link>
            )}
          </div>
        </div>

        {/* Card 4: Forms Filled */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600">Avg 2.1s</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {user?.formsFilledCount || 0}
          </p>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Forms Filled
          </p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Edit Master Profile</p>
              <p className="text-xs text-slate-500">Personal &amp; address info</p>
            </div>
          </Link>

          <Link
            to="/dashboard/folders"
            className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Create Data Folder</p>
              <p className="text-xs text-slate-500">Travel, Job, Personal or Custom</p>
            </div>
          </Link>

          <Link
            to="/dashboard/templates"
            className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Create Smart Template</p>
              <p className="text-xs text-slate-500">Dynamic {"{Variable}"} text</p>
            </div>
          </Link>

          <Link
            to="/dashboard/subscription"
            className={`flex items-center gap-3.5 p-4 rounded-xl border shadow-sm transition-all ${
              isPremium
                ? "bg-amber-50/70 border-amber-300 hover:border-amber-500"
                : "bg-slate-50 border-slate-200 hover:border-teal-500"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                isPremium ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                Multi-Step Automation
                <span className="text-amber-500 text-xs">★</span>
              </p>
              <p className="text-xs text-slate-500">
                {isPremium ? "Enabled in Extension" : "Unlock with Premium"}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
          <span className="text-xs text-slate-500">Synced with Browser Extension</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <th className="py-3.5 px-6 font-semibold">Activity / Target Form</th>
                <th className="py-3.5 px-6 font-semibold">Folder / Template Used</th>
                <th className="py-3.5 px-6 font-semibold">Mode</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">
                  IRCTC Passenger Reservation Form
                </td>
                <td className="py-3.5 px-6 text-slate-600">✈️ Travel Profile (Built-In)</td>
                <td className="py-3.5 px-6">
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-teal-50 text-teal-700 font-medium">
                    Auto-Fill
                  </span>
                </td>
                <td className="py-3.5 px-6 text-emerald-600 font-semibold">✓ Completed</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">
                  Summer Internship Application Portal
                </td>
                <td className="py-3.5 px-6 text-slate-600">💼 Professional Profile (Built-In)</td>
                <td className="py-3.5 px-6">
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 font-medium">
                    AI Field Mapped
                  </span>
                </td>
                <td className="py-3.5 px-6 text-emerald-600 font-semibold">✓ Completed</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-slate-900">
                  LinkedIn Cold Outreach Message
                </td>
                <td className="py-3.5 px-6 text-slate-600">📝 Job Application Email Template</td>
                <td className="py-3.5 px-6">
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700 font-medium">
                    Template Injected
                  </span>
                </td>
                <td className="py-3.5 px-6 text-emerald-600 font-semibold">✓ Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
