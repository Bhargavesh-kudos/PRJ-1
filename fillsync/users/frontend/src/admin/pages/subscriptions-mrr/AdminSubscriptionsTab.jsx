/**
 * ============================================================================
 * FILE: superadmin/frontend/src/pages/subscriptions-mrr/AdminSubscriptionsTab.jsx
 * PURPOSE: SuperAdmin Subscriptions & Monthly Recurring Revenue (MRR) Screen.
 * ============================================================================
 */

import React from "react";

export default function AdminSubscriptionsTab({ subscriptions }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-base font-bold text-slate-900">
          Subscription Transactions ({subscriptions.length})
        </h3>
      </div>

      {subscriptions.length === 0 ? (
        <div className="p-8 text-sm text-slate-500">
          No Razorpay transactions yet. Log in as a user and upgrade to Premium to
          see transactions appear here!
        </div>
      ) : (
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
              <th className="py-3.5 px-6">Transaction ID</th>
              <th className="py-3.5 px-6">User</th>
              <th className="py-3.5 px-6">Amount</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td className="py-3.5 px-6 font-mono text-xs text-slate-700">
                  {sub.id}
                </td>
                <td className="py-3.5 px-6 font-semibold text-slate-900">
                  {sub.userName} ({sub.userEmail})
                </td>
                <td className="py-3.5 px-6 font-bold text-emerald-600">
                  ₹{sub.amountINR}
                </td>
                <td className="py-3.5 px-6">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {sub.status}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-xs text-slate-500">
                  {new Date(sub.paidAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
