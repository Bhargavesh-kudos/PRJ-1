/**
 * ============================================================================
 * FILE: frontend/src/components/extension-simulator/ExtensionSimulatorModal.jsx
 * PURPOSE: Interactive Browser Extension Popup Preview inside the Web Dashboard.
 *          Clearly shows how the Extension Popup looks and works differently
 *          for Normal (Free) Users vs Premium Users!
 * ============================================================================
 */

import React, { useState } from "react";
import {
  Zap,
  Wand2,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  X,
  Crown,
  Lock
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ExtensionSimulatorModal({ isOpen, onClose }) {
  const { user } = useAuth();

  // Allows previewing how the extension looks for Free vs Premium users
  const [previewPlan, setPreviewPlan] = useState(
    user?.role === "premium" ? "premium" : "free"
  );
  const isPremium = previewPlan === "premium";

  // States: "ready" | "filling" | "success" | "template" | "captcha"
  const [extState, setExtState] = useState("ready");
  const [selectedFolder, setSelectedFolder] = useState("Travel Profile (Built-In)");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        {/* Top Switcher Bar: Switch between Normal User vs Premium User & States */}
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl flex flex-wrap items-center justify-center gap-2 text-xs">
          {/* Free vs Premium Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 mr-2">
            <button
              onClick={() => setPreviewPlan("free")}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${
                !isPremium ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Normal User (Free)
            </button>
            <button
              onClick={() => setPreviewPlan("premium")}
              className={`px-3 py-1 rounded-md font-bold flex items-center gap-1 transition-colors ${
                isPremium
                  ? "bg-amber-500 text-slate-950"
                  : "text-amber-400 hover:text-amber-300"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              Premium User
            </button>
          </div>

          {/* Popup State Buttons */}
          {[
            { id: "ready", label: "1. Home" },
            { id: "filling", label: "2. Filling..." },
            { id: "success", label: "3. Done" },
            { id: "template", label: "4. Template" },
            { id: "captcha", label: "5. CAPTCHA" }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setExtState(st.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                extState === st.id
                  ? "bg-teal-500 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {st.label}
            </button>
          ))}
          <button
            onClick={onClose}
            className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Extension Popup Frame */}
        <div className="w-[370px] bg-slate-900 text-white rounded-3xl border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col justify-between p-6 min-h-[510px]">
          {/* Popup Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">FillSync</span>
            </div>
            {isPremium ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-extrabold flex items-center gap-1">
                <Crown className="w-3 h-3" /> PREMIUM
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold">
                FREE PLAN
              </span>
            )}
          </div>

          {/* STATE 1: READY TO FILL */}
          {extState === "ready" && (
            <div className="space-y-3.5 my-auto py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">
                  Signed in as: {user?.name || "User"}
                </span>
                <span className="text-emerald-400 font-semibold">● Connected</span>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Select Data Folder ({isPremium ? "Unlimited Folders" : "Max 5 Folders"})
                </label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                >
                  <option>✈️ Travel Profile (Built-In)</option>
                  <option>💼 Professional Profile (Built-In)</option>
                  <option>👤 Personal Profile (Built-In)</option>
                </select>
              </div>

              <button
                onClick={() => setExtState("filling")}
                className="w-full py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
              >
                <Wand2 className="w-4 h-4" />
                Fill This Form (1-Click)
              </button>

              <button
                onClick={() => setExtState("template")}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <FileCode2 className="w-4 h-4 text-teal-400" />
                Inject Smart Template ({isPremium ? "Unlimited" : "Max 5"})
              </button>

              {/* Premium vs Normal Controls Box */}
              <div
                className={`p-3.5 rounded-2xl border space-y-2.5 text-xs ${
                  isPremium
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-slate-800/50 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Advanced Automation</span>
                  {isPremium ? (
                    <span className="text-[10px] font-extrabold text-amber-300 uppercase">
                      ★ Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" /> Premium Only
                    </span>
                  )}
                </div>

                <label
                  className={`flex items-center justify-between ${
                    isPremium ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  <span>AI Smart Field Mapping</span>
                  <input
                    type="checkbox"
                    checked={isPremium}
                    disabled={!isPremium}
                    readOnly
                    className="accent-teal-400"
                  />
                </label>

                <label
                  className={`flex items-center justify-between ${
                    isPremium ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  <span>Multi-Step Form Auto-Next</span>
                  <input
                    type="checkbox"
                    checked={isPremium}
                    disabled={!isPremium}
                    readOnly
                    className="accent-teal-400"
                  />
                </label>

                <label
                  className={`flex items-center justify-between ${
                    isPremium ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  <span>Instant Turbo Fill Speed</span>
                  <input
                    type="checkbox"
                    checked={isPremium}
                    disabled={!isPremium}
                    readOnly
                    className="accent-teal-400"
                  />
                </label>
              </div>

              {!isPremium && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 text-center">
                  🔒 Upgrade to Premium on Dashboard to unlock AI Mapping &amp; Multi-Step Fill
                </div>
              )}
            </div>
          )}

          {/* STATE 2: FILLING IN PROGRESS */}
          {extState === "filling" && (
            <div className="space-y-4 my-auto py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-teal-400">
                  ⏳ {isPremium ? "AI Smart Filling Form..." : "Filling Standard Fields..."}
                </span>
                <span className="text-xs text-slate-400">60%</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-800 flex justify-between">
                  <span>Full Name</span>
                  <span className="text-emerald-400 font-bold">✓ Injected</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800 flex justify-between">
                  <span>Email Address</span>
                  <span className="text-emerald-400 font-bold">✓ Injected</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800 flex justify-between">
                  <span>Phone Number</span>
                  <span className="text-emerald-400 font-bold">✓ Injected</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-teal-500/40 flex justify-between">
                  <span>{isPremium ? "Unlabeled Field (AI Mapped)" : "Passport Number"}</span>
                  <span className="text-teal-300">Typing...</span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-3/5 h-full bg-teal-400" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setExtState("success")}
                  className="flex-1 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
                >
                  Complete Fill →
                </button>
                <button
                  onClick={() => setExtState("ready")}
                  className="px-4 py-2.5 rounded-xl border border-rose-500/50 text-rose-400 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: FILL SUCCESS */}
          {extState === "success" && (
            <div className="text-center space-y-4 my-auto py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-extrabold">Form Filled Successfully!</h3>
              <div className="p-4 rounded-2xl bg-slate-800/80 text-left text-xs space-y-1.5 text-slate-300">
                <p>
                  ✓ <strong>{isPremium ? "8 fields filled (including AI mapped)" : "5 standard fields filled"}</strong>
                </p>
                <p>📁 Folder: <strong>{selectedFolder}</strong></p>
                <p>
                  ⚡ Mode: <strong>{isPremium ? "Premium (AI + Multi-Step)" : "Free Standard Mode"}</strong>
                </p>
              </div>
              <button
                onClick={() => setExtState("ready")}
                className="w-full py-3 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs"
              >
                Fill Another Form
              </button>
            </div>
          )}

          {/* STATE 4: TEMPLATE INJECTION */}
          {extState === "template" && (
            <div className="space-y-3 my-auto py-3 text-xs">
              <p className="text-sm font-bold text-teal-400">
                Inject Template: Job Application Email
              </p>
              <div>
                <label className="text-slate-400 block mb-1">{"{HR_Name}"}</label>
                <input
                  type="text"
                  defaultValue="Mr. Sharma"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{"{Position}"}</label>
                <input
                  type="text"
                  defaultValue="Software Developer Intern"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">{"{Company_Name}"}</label>
                <input
                  type="text"
                  defaultValue="Google India"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
                />
              </div>
              <button
                onClick={() => setExtState("success")}
                className="w-full py-3 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs mt-2"
              >
                Inject into Textbox
              </button>
            </div>
          )}

          {/* STATE 5: CAPTCHA / PAYMENT HALT */}
          {extState === "captcha" && (
            <div className="text-center space-y-4 my-auto py-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-amber-300">
                CAPTCHA / Payment Gateway Detected
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                For your security, FillSync automatically pauses at CAPTCHAs and
                payment screens. Please complete this step manually.
              </p>
              <button
                onClick={() => setExtState("ready")}
                className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
              >
                I Understand — Back to Popup
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
            <span>FillSync Extension</span>
            <button onClick={onClose} className="text-teal-400 hover:underline">
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
