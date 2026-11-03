/**
 * ============================================================================
 * FILE: frontend/src/pages/smart-templates/SmartTemplatesPage.jsx
 * PURPOSE: Smart Templates Management Screen + Live `{Variable}` Editor.
 *
 * FEATURES:
 * - Automatically detects `{Variable}` tags as the user types.
 * - Adapts between Free Plan (up to 5 templates) and Premium Plan (Unlimited
 *   templates + Golden "✨ AI Enhance" button).
 * - Includes an interactive "Test Variable Injection" modal so you can fill
 *   variables and copy the final formatted text in 1 click!
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Sparkles,
  Crown,
  X,
  Check
} from "lucide-react";
import { apiRequest } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Helper to extract `{Variable_Name}` placeholders on the client side in real time.
 */
function extractVarsClient(text = "") {
  const regex = /\{([a-zA-Z0-9_ -]+)\}/g;
  const set = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    set.add(match[1].trim());
  }
  return Array.from(set);
}

export default function SmartTemplatesPage() {
  const { user } = useAuth();
  const isPremium = user?.role === "premium";

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Job Search");
  const [body, setBody] = useState("");

  // Variable Test / Copy Modal State
  const [activeTemplateForFill, setActiveTemplateForFill] = useState(null);
  const [variableValues, setVariableValues] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const res = await apiRequest("/templates");
      setTemplates(res.templates || []);
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  function openNewTemplateEditor() {
    setEditingId(null);
    setTitle("");
    setCategory("Job Search");
    setBody(
      "Dear {HR_Name},\n\nI am writing to express my interest in the {Position} role at {Company_Name}. With my background in {Skill}, I believe I can contribute significantly to your team.\n\nBest regards,\n{My_Name}"
    );
    setIsEditorOpen(true);
  }

  function openEditTemplate(tpl) {
    setEditingId(tpl.id);
    setTitle(tpl.title);
    setCategory(tpl.category);
    setBody(tpl.body);
    setIsEditorOpen(true);
  }

  async function handleSaveTemplate(e) {
    e.preventDefault();
    setBanner(null);

    try {
      if (editingId) {
        const res = await apiRequest(`/templates/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ title, category, body })
        });
        setBanner({ type: "success", text: res.message });
      } else {
        const res = await apiRequest("/templates", {
          method: "POST",
          body: JSON.stringify({ title, category, body })
        });
        setBanner({ type: "success", text: res.message });
      }
      setIsEditorOpen(false);
      fetchTemplates();
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    }
  }

  async function handleDeleteTemplate(id) {
    try {
      const res = await apiRequest(`/templates/${id}`, { method: "DELETE" });
      setBanner({ type: "success", text: res.message });
      fetchTemplates();
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    }
  }

  // Premium Feature: AI Enhance Template
  async function handleAiEnhance(tpl) {
    const enhancedBody =
      tpl.body +
      "\n\nP.S. I would welcome a quick 10-minute chat this week if your schedule permits. Thank you for your time and consideration!";
    try {
      await apiRequest(`/templates/${tpl.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: tpl.title,
          category: tpl.category,
          body: enhancedBody
        })
      });
      setBanner({
        type: "success",
        text: `✨ Gemini AI enhanced "${tpl.title}" with a high-conversion call-to-action!`
      });
      fetchTemplates();
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    }
  }

  // Open Variable Fill & Inject Modal
  function openFillVariablesModal(tpl) {
    const initialVals = {};
    (tpl.variables || []).forEach((v) => {
      initialVals[v] = "";
    });
    setVariableValues(initialVals);
    setActiveTemplateForFill(tpl);
  }

  function computeFilledPreview() {
    if (!activeTemplateForFill) return "";
    let output = activeTemplateForFill.body;
    Object.entries(variableValues).forEach(([varName, val]) => {
      const safeVal = val && val.trim() !== "" ? val : `[${varName}]`;
      output = output.replaceAll(`{${varName}}`, safeVal);
    });
    return output;
  }

  function handleCopyFilledText() {
    const finalString = computeFilledPreview();
    navigator.clipboard.writeText(finalString);
    setCopiedId(activeTemplateForFill.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const detectedVarsInEditor = extractVarsClient(body);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900">Smart Templates</h1>
            {isPremium && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                Unlimited + AI Enhance
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Reusable text paragraphs with dynamic{" "}
            <code className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-mono text-xs">
              {"{Variables}"}
            </code>{" "}
            for Gmail, LinkedIn & Job Portals
          </p>
        </div>

        <button
          onClick={openNewTemplateEditor}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Free Plan Limit Notice */}
      {!isPremium && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <span>
            <strong>Free Plan Usage:</strong> You have used{" "}
            <strong>{templates.length} of 5</strong> Smart Templates. Upgrade to
            Premium for unlimited templates and ✨ AI Enhance.
          </span>
        </div>
      )}

      {banner && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold ${
            banner.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {banner.text}
        </div>
      )}

      {/* Templates Grid */}
      {loading ? (
        <div className="text-sm text-slate-500">Loading Smart Templates...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-teal-400 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{tpl.title}</h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                      {tpl.category}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {(tpl.variables || []).length} variables
                  </span>
                </div>

                {/* Template Body Preview */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-mono">
                  {tpl.body}
                </div>

                {/* Extracted Variable Chips */}
                {(tpl.variables || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {tpl.variables.map((v, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 font-mono text-[11px] font-semibold"
                      >
                        {`{${v}}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => openFillVariablesModal(tpl)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Fill Variables & Inject
                </button>

                <div className="flex items-center gap-2">
                  {isPremium && (
                    <button
                      onClick={() => handleAiEnhance(tpl)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-bold shadow-sm hover:from-amber-500 hover:to-amber-600"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Enhance
                    </button>
                  )}

                  <button
                    onClick={() => openEditTemplate(tpl)}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Edit Template"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteTemplate(tpl.id)}
                    className="p-2 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                    title="Delete Template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          MODAL 1: CREATE / EDIT TEMPLATE EDITOR (WITH LIVE VARIABLE DETECTOR)
      ===================================================================== */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingId ? "Edit Smart Template" : "Create New Smart Template"}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveTemplate}
              className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[82vh] overflow-y-auto"
            >
              {/* Left 8 cols: Form Inputs */}
              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Job Application Email"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                    >
                      <option value="Job Search">Job Search</option>
                      <option value="Outreach">Outreach</option>
                      <option value="Travel">Travel</option>
                      <option value="Personal">Personal</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Template Body (Wrap dynamic variables in curly braces like{" "}
                    <code className="text-teal-600">{"{HR_Name}"}</code>)
                  </label>
                  <textarea
                    rows="7"
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Right 4 cols: Detected Variables Panel */}
              <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                    Detected Variables ({detectedVarsInEditor.length})
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    FillSync will prompt you to fill these values before injecting into
                    a webpage:
                  </p>

                  {detectedVarsInEditor.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      No {"{variables}"} detected yet.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {detectedVarsInEditor.map((v, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-teal-500 text-white font-mono text-xs font-semibold shadow-sm"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold"
                  >
                    Save Template
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: FILL VARIABLES & INJECT PREVIEW
      ===================================================================== */}
      {activeTemplateForFill && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Inject Smart Template</h3>
                <p className="text-xs text-teal-400">{activeTemplateForFill.title}</p>
              </div>
              <button
                onClick={() => setActiveTemplateForFill(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {(activeTemplateForFill.variables || []).map((varName) => (
                <div key={varName}>
                  <label className="block text-xs font-mono text-teal-300 mb-1">
                    {`{${varName}}`}
                  </label>
                  <input
                    type="text"
                    placeholder={`Enter value for ${varName}...`}
                    value={variableValues[varName] || ""}
                    onChange={(e) =>
                      setVariableValues({
                        ...variableValues,
                        [varName]: e.target.value
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-400"
                  />
                </div>
              ))}

              {/* Live Rendered Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Live Output Preview:
                </label>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {computeFilledPreview()}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyFilledText}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {copiedId === activeTemplateForFill.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied & Ready to Paste!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Formatted Text
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
