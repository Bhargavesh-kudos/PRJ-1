/**
 * ============================================================================
 * FILE: superadmin/frontend/src/pages/users-management/AdminUsersTab.jsx
 * PURPOSE: SuperAdmin User Management Screen.
 *          Allows the SuperAdmin to Grant/Revoke Premium, Suspend/Activate,
 *          or Delete User Accounts.
 * ============================================================================
 */

import React from "react";
import { Trash2 } from "lucide-react";

export default function AdminUsersTab({
  users,
  onToggleRole,
  onToggleStatus,
  onDeleteUser
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Registered Users ({users.length})
          </h3>
          <p className="text-xs text-slate-500">
            Manage user plans and account status
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
              <th className="py-3.5 px-5 font-semibold">User</th>
              <th className="py-3.5 px-5 font-semibold">Plan</th>
              <th className="py-3.5 px-5 font-semibold">Phone</th>
              <th className="py-3.5 px-5 font-semibold">Folders / Templates</th>
              <th className="py-3.5 px-5 font-semibold">Status</th>
              <th className="py-3.5 px-5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80">
                <td className="py-4 px-5">
                  <p className="font-bold text-slate-900">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </td>
                <td className="py-4 px-5">
                  {u.role === "premium" ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                      ★ PREMIUM
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      FREE
                    </span>
                  )}
                </td>
                <td className="py-4 px-5 font-mono text-xs text-slate-600">
                  {u.maskedPhone}
                </td>
                <td className="py-4 px-5 text-xs text-slate-600">
                  {u.folderCount} Folders • {u.templateCount} Templates
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      u.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onToggleRole(u)}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold"
                    >
                      {u.role === "premium" ? "Make Free" : "Grant Premium"}
                    </button>

                    <button
                      onClick={() => onToggleStatus(u)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      {u.status === "suspended" ? "Activate" : "Suspend"}
                    </button>

                    <button
                      onClick={() => onDeleteUser(u)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
