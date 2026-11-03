/**
 * ============================================================================
 * FILE: superadmin/frontend/src/pages/support-tickets/AdminTicketsTab.jsx
 * PURPOSE: SuperAdmin Support Tickets Management & Reply Screen.
 * ============================================================================
 */

import React from "react";
import { Send } from "lucide-react";

export default function AdminTicketsTab({
  supportTickets,
  replyTextMap,
  setReplyTextMap,
  onReplyTicket
}) {
  return (
    <div className="space-y-4">
      {supportTickets.map((tkt) => (
        <div
          key={tkt.id}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-teal-600">
                {tkt.id} • {tkt.category}
              </span>
              <h4 className="text-base font-bold text-slate-900">{tkt.subject}</h4>
              <p className="text-xs text-slate-500">
                From: {tkt.userName} ({tkt.userEmail})
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                tkt.status === "Resolved"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {tkt.status}
            </span>
          </div>

          <p className="p-3.5 rounded-xl bg-slate-50 text-sm text-slate-700">
            {tkt.message}
          </p>

          {tkt.adminReply && (
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
              <strong>Admin Reply:</strong> {tkt.adminReply}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Write a reply to resolve this ticket..."
              value={replyTextMap[tkt.id] || ""}
              onChange={(e) =>
                setReplyTextMap({ ...replyTextMap, [tkt.id]: e.target.value })
              }
              className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-xs"
            />
            <button
              onClick={() => onReplyTicket(tkt.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              Reply & Resolve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
