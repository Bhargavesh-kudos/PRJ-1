/**
 * ============================================================================
 * FILE: frontend/src/pages/settings-page/SettingsPage.jsx
 * PURPOSE: User Account & Extension Automation Preferences Screen.
 * ============================================================================
 */

import React, { useState } from "react";
import { Download, ShieldCheck, Sliders, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../services/api.js";

export default function SettingsPage() {
  const { user } = useAuth();
  const [humanDelay, setHumanDelay] = useState(true);
  const [delayMs, setDelayMs] = useState(120);
  const [autoDetectAi, setAutoDetectAi] = useState(true);
  const [captchaHalt, setCaptchaHalt] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  function handleSavePreferences(e) {
    e.preventDefault();
    localStorage.setItem(
      "fillsync_ext_prefs",
      JSON.stringify({ humanDelay, delayMs, autoDetectAi, captchaHalt })
    );
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  }

  async function handleExportUserData() {
    try {
      const [profileRes, foldersRes, templatesRes] = await Promise.all([
        apiRequest("/profiles/me"),
        apiRequest("/folders"),
        apiRequest("/templates")
      ]);

      const exportBundle = {
        exportedAt: new Date().toISOString(),
        user,
        masterProfile: profileRes.profile,
        dataFolders: foldersRes.folders,
        smartTemplates: templatesRes.templates
      };

      const blob = new Blob([JSON.stringify(exportBundle, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fillsync_data_export_${user?.name || "user"}.json`;
      a.click();
    } catch (err) {
      alert("Failed to export data: " + err.message);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure your extension automation behavior and data privacy controls
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          Extension & Automation preferences saved!
        </div>
      )}

      {/* Extension Automation Settings Card */}
      <form
        onSubmit={handleSavePreferences}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">
            Extension Automation Preferences
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Enable Human-Like Typing Delays
            </p>
            <p className="text-xs text-slate-500">
              Uses setTimeout and native browser events to prevent anti-bot flags
            </p>
          </div>
          <input
            type="checkbox"
            checked={humanDelay}
            onChange={(e) => setHumanDelay(e.target.checked)}
            className="w-5 h-5 accent-teal-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>Simulated Typing Delay per Field</span>
            <span className="text-teal-600">{delayMs} ms</span>
          </div>
          <input
            type="range"
            min="40"
            max="300"
            step="20"
            value={delayMs}
            onChange={(e) => setDelayMs(Number(e.target.value))}
            className="w-full accent-teal-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              AI Fallback Field Mapping (Gemini API)
            </p>
            <p className="text-xs text-slate-500">
              Automatically resolve unconventional HTML input IDs when DOM parsing fails
            </p>
          </div>
          <input
            type="checkbox"
            checked={autoDetectAi}
            onChange={(e) => setAutoDetectAi(e.target.checked)}
            className="w-5 h-5 accent-teal-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Mandatory CAPTCHA & Payment Gateway Halt
            </p>
            <p className="text-xs text-slate-500">
              Immediately pauses automated filling when a CAPTCHA or payment iframe is detected
            </p>
          </div>
          <input
            type="checkbox"
            checked={captchaHalt}
            disabled
            className="w-5 h-5 accent-teal-500"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Data Ownership & Export Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">Data Privacy & Portability</h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          You have 100% ownership of your stored profiles, folders, and templates.
          You can export a complete decrypted JSON backup of your data at any time.
        </p>

        <button
          type="button"
          onClick={handleExportUserData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-teal-500 text-teal-700 hover:bg-teal-50 text-xs font-bold transition-colors"
        >
          <Download className="w-4 h-4" />
          Export My Data (JSON)
        </button>
      </div>
    </div>
  );
}
