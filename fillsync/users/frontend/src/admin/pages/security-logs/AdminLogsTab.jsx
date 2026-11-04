/**
 * ============================================================================
 * FILE: superadmin/frontend/src/pages/security-logs/AdminLogsTab.jsx
 * PURPOSE: SuperAdmin Chronological Security & System Audit Logs Screen.
 * ============================================================================
 */

import React from "react";

export default function AdminLogsTab({ activityLogs }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-base font-bold text-slate-900">
          Chronological System & Security Logs ({activityLogs.length})
        </h3>
      </div>

      <div className="divide-y divide-slate-200 max-h-[65vh] overflow-y-auto">
        {activityLogs.map((log) => (
          <div
            key={log.id}
            className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-0.5 rounded font-mono font-bold ${
                  log.severity === "warning"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-teal-50 text-teal-700"
                }`}
              >
                {log.action}
              </span>
              <span className="font-semibold text-slate-900">{log.details}</span>
              <span className="text-slate-400">({log.userEmail})</span>
            </div>
            <span className="text-slate-400 font-mono">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
