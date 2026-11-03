/**
 * ============================================================================
 * FILE: superadmin/frontend/src/pages/system-settings/AdminSettingsTab.jsx
 * PURPOSE: SuperAdmin Credentials Customizer (Email & Password) and Platform
 *          Configuration Screen.
 * ============================================================================
 */

import React from "react";
import { KeyRound } from "lucide-react";

export default function AdminSettingsTab({
  settingsForm,
  setSettingsForm,
  onSaveSettings
}) {
  return (
    <form
      onSubmit={onSaveSettings}
      className="max-w-3xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
    >
      <div className="pb-4 border-b border-slate-100">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-amber-500" />
          Set Your Custom SuperAdmin Login & Password
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Change the SuperAdmin email and password below. This updates both the
          live shared database and <code className="text-teal-600">superadmin/backend/.env</code>!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            SuperAdmin Login Email
          </label>
          <input
            type="email"
            required
            value={settingsForm.newSuperAdminEmail}
            onChange={(e) =>
              setSettingsForm({
                ...settingsForm,
                newSuperAdminEmail: e.target.value
              })
            }
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            New SuperAdmin Password (leave blank to keep current)
          </label>
          <input
            type="password"
            placeholder="Enter new SuperAdmin password..."
            value={settingsForm.newSuperAdminPassword}
            onChange={(e) =>
              setSettingsForm({
                ...settingsForm,
                newSuperAdminPassword: e.target.value
              })
            }
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Platform Limits & Pricing Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Free Plan Folder Limit
            </label>
            <input
              type="number"
              value={settingsForm.freeFolderLimit}
              onChange={(e) =>
                setSettingsForm({
                  ...settingsForm,
                  freeFolderLimit: e.target.value
                })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Free Plan Template Limit
            </label>
            <input
              type="number"
              value={settingsForm.freeTemplateLimit}
              onChange={(e) =>
                setSettingsForm({
                  ...settingsForm,
                  freeTemplateLimit: e.target.value
                })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Premium Price (₹ / month)
            </label>
            <input
              type="number"
              value={settingsForm.premiumMonthlyPriceINR}
              onChange={(e) =>
                setSettingsForm({
                  ...settingsForm,
                  premiumMonthlyPriceINR: e.target.value
                })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm transition-colors"
        >
          Save SuperAdmin Credentials & Settings
        </button>
      </div>
    </form>
  );
}
