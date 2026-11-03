/**
 * ============================================================================
 * FILE: superadmin/frontend/src/pages/overview-page/AdminOverviewTab.jsx
 * PURPOSE: SuperAdmin Platform Overview Screen showing Total Users, Active
 *          Premium Subscribers, Monthly Recurring Revenue (MRR), and Forms Filled.
 * ============================================================================
 */

import React from "react";
import { Users, Crown, IndianRupee, CheckCircle2 } from "lucide-react";

export default function AdminOverviewTab({ stats, onOpenUsersTab }) {
  return (
    <div className="space-y-6">
      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400">Registered</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.totalUsers}</p>
          <p className="text-xs text-slate-500 mt-1">Total Platform Users</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-amber-600">Paid Tier</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.premiumUsers}</p>
          <p className="text-xs text-slate-500 mt-1">Active Premium Subscribers</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600">MRR</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            ₹{stats.monthlyRevenueINR}
          </p>
          <p className="text-xs text-slate-500 mt-1">Monthly Recurring Revenue</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-purple-600">Automation</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {stats.totalFormsFilled}
          </p>
          <p className="text-xs text-slate-500 mt-1">Total Forms Automated</p>
        </div>
      </div>

      {/* Quick Action Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            User &amp; Subscription Management
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            View registered users, upgrade or downgrade plans, and manage account status.
            Personal phone numbers are masked for user privacy.
          </p>
        </div>
        <button
          onClick={onOpenUsersTab}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shrink-0"
        >
          Manage Users →
        </button>
      </div>
    </div>
  );
}
