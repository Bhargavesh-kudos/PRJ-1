/**
 * ============================================================================
 * FILE: frontend/src/pages/data-folders/DataFoldersPage.jsx
 * PURPOSE: Comprehensive Data Folders Screen for FillSync.
 *          Displays the 3 Exhaustive Built-In Folders:
 *          1. Travel Profile (IRCTC Train, Aero/Flight, Bus)
 *          2. Professional Profile (OTR Base, Govt Exams SSC/UPSC, College/CUET, Portfolio)
 *          3. Personal Profile (Bio, Contact, Addresses, Official IDs, Bank, File Uploads)
 *          + Document/Image File Upload & Smart Resizer Studio (Premium Feature)
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Briefcase,
  User,
  Folder,
  Plus,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Crown,
  Search,
  Download,
  Eye,
  Check,
  AlertCircle
} from "lucide-react";
import { apiRequest } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { OPTIMIZER_PRESETS, optimizeImage } from "../../utils/imageOptimizer.js";

export default function DataFoldersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPremium = user?.role === "premium";

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Modal State for Create / Edit Folder
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [category, setCategory] = useState("Custom");
  const [fields, setFields] = useState([]);

  // Filter & Search inside modal
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("All");

  // Smart Resizer Studio State
  const [resizerModalOpen, setResizerModalOpen] = useState(false);
  const [resizerFieldIndex, setResizerFieldIndex] = useState(null);
  const [resizerPreset, setResizerPreset] = useState("passport_photo");
  const [resizing, setResizing] = useState(false);
  const [premiumPromptOpen, setPremiumPromptOpen] = useState(false);

  // Image / Document Preview Modal
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  async function fetchFolders() {
    setLoading(true);
    try {
      const res = await apiRequest("/folders");
      setFolders(res.folders || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncOfficialFields() {
    if (!window.confirm("Synchronize Travel, Professional, and Personal profiles with all official fields? Your existing values will be retained.")) {
      return;
    }
    setSyncing(true);
    setMessage(null);
    try {
      const res = await apiRequest("/folders/reset-builtin", { method: "POST" });
      setMessage({ type: "success", text: res.message });
      fetchFolders();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSyncing(false);
    }
  }

  function openCreateModal() {
    setEditingFolderId(null);
    setFolderName("");
    setCategory("Custom");
    setSearchTerm("");
    setSelectedSection("All");
    setFields([
      { section: "General", key: "Account / ID Number", value: "", type: "text" },
      { section: "General", key: "Preferred Option", value: "", type: "text" },
      { section: "General", key: "Notes", value: "", type: "text" }
    ]);
    setIsModalOpen(true);
  }

  function openEditModal(folder) {
    setEditingFolderId(folder.id);
    setFolderName(folder.folderName);
    setCategory(folder.category);
    setSearchTerm("");
    setSelectedSection("All");
    setFields(
      folder.fields?.length
        ? folder.fields.map((f) => ({
            key: f.key,
            value: f.value || "",
            type: f.type || (f.key.toLowerCase().includes("pdf") || f.key.toLowerCase().includes("photo") || f.key.toLowerCase().includes("signature") ? "file" : "text"),
            fileName: f.fileName || null,
            fileSize: f.fileSize || null,
            section: f.section || "General",
            isEncrypted: f.isEncrypted || false
          }))
        : [{ section: "General", key: "", value: "", type: "text" }]
    );
    setIsModalOpen(true);
  }

  function handleAddFieldRow() {
    setFields([
      ...fields,
      {
        section: selectedSection === "All" ? "Custom Fields" : selectedSection,
        key: "",
        value: "",
        type: "text"
      }
    ]);
  }

  function handleRemoveFieldRow(idx) {
    setFields(fields.filter((_, i) => i !== idx));
  }

  function handleFieldChange(idx, prop, val) {
    const updated = [...fields];
    updated[idx][prop] = val;
    setFields(updated);
  }

  // Handle standard File Upload
  function handleFileUpload(idx, event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const sizeKB = (file.size / 1024).toFixed(1);

      const updated = [...fields];
      updated[idx].value = dataUrl;
      updated[idx].fileName = file.name;
      updated[idx].fileSize = `${sizeKB} KB`;
      setFields(updated);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveFile(idx) {
    const updated = [...fields];
    updated[idx].value = "";
    updated[idx].fileName = null;
    updated[idx].fileSize = null;
    setFields(updated);
  }

  // Trigger Smart Resizer (Premium Feature)
  function handleOpenResizer(idx) {
    if (!isPremium) {
      setPremiumPromptOpen(true);
      return;
    }
    setResizerFieldIndex(idx);
    setResizerModalOpen(true);
  }

  // Execute Smart Optimization
  async function handleExecuteResizer() {
    if (resizerFieldIndex === null) return;
    const currentField = fields[resizerFieldIndex];
    if (!currentField?.value) {
      alert("Please upload a picture or document first before optimizing.");
      return;
    }

    setResizing(true);
    try {
      const optimized = await optimizeImage(currentField.value, {
        preset: resizerPreset
      });

      const updated = [...fields];
      updated[resizerFieldIndex].value = optimized.dataUrl;
      updated[resizerFieldIndex].fileName = optimized.fileName;
      updated[resizerFieldIndex].fileSize = `${optimized.sizeKB} KB (Optimized)`;
      setFields(updated);

      setResizerModalOpen(false);
      alert(`✓ Success! Image perfectly resized to ${optimized.width}x${optimized.height} (${optimized.sizeKB} KB) for portal requirements without blur.`);
    } catch (err) {
      alert("Error optimizing image: " + err.message);
    } finally {
      setResizing(false);
    }
  }

  async function handleSaveFolder(e) {
    e.preventDefault();
    setMessage(null);

    try {
      if (editingFolderId) {
        const res = await apiRequest(`/folders/${editingFolderId}`, {
          method: "PUT",
          body: JSON.stringify({ folderName, category, fields })
        });
        setMessage({ type: "success", text: res.message });
      } else {
        const res = await apiRequest("/folders", {
          method: "POST",
          body: JSON.stringify({ folderName, category, fields })
        });
        setMessage({ type: "success", text: res.message });
      }
      setIsModalOpen(false);
      fetchFolders();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  async function handleDeleteFolder(folder) {
    if (folder.isBuiltIn) {
      setMessage({
        type: "error",
        text: "Built-In folders cannot be deleted, but you can click Edit to customize their fields!"
      });
      return;
    }

    try {
      const res = await apiRequest(`/folders/${folder.id}`, { method: "DELETE" });
      setMessage({ type: "success", text: res.message });
      fetchFolders();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  function renderCategoryIcon(cat) {
    if (cat === "Travel") return <Plane className="w-5 h-5" />;
    if (cat === "Professional") return <Briefcase className="w-5 h-5" />;
    if (cat === "Personal") return <User className="w-5 h-5" />;
    return <Folder className="w-5 h-5" />;
  }

  // Derive unique sections for current folder
  const currentSections = Array.from(
    new Set(fields.map((f) => f.section || "General"))
  ).filter(Boolean);

  // Filter fields based on active section and search
  const filteredFields = fields.map((f, originalIndex) => ({ ...f, originalIndex })).filter((f) => {
    const matchesSection = selectedSection === "All" || (f.section || "General") === selectedSection;
    const matchesSearch =
      searchTerm === "" ||
      f.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.section && f.section.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSection && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900">Data Folders</h1>
            {isPremium ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-sm">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                Premium Active • Unlimited Custom Folders &amp; Smart Resizer
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                Free Plan • 3 Built-In Profiles + 2 Custom Folders
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Includes exhaustive official field sets for <strong>Travel (Train, Flight, Bus)</strong>, <strong>Professional (OTR, Govt Exams, College)</strong>, and <strong>Personal Profile</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncOfficialFields}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors"
            title="Reset or update the 3 built-in folders with all official fields"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync All Official Fields"}
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Custom Folder
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Folder Cards Grid */}
      {loading ? (
        <div className="text-sm text-slate-500 p-8 text-center bg-white rounded-2xl border border-slate-200">
          Loading your Data Folders and fields...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => {
            const totalFields = folder.fields?.length || 0;
            const sections = Array.from(new Set((folder.fields || []).map((f) => f.section))).filter(Boolean);

            return (
              <div
                key={folder.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between p-6 hover:border-teal-500 transition-all hover:shadow-md"
              >
                <div>
                  {/* Folder Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                        {renderCategoryIcon(folder.category)}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                          {folder.folderName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                            {totalFields} Fields Configured
                          </span>
                        </div>
                      </div>
                    </div>

                    {folder.isBuiltIn ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        Built-In
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Sub-Section Badges */}
                  {sections.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {sections.map((sec, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Fields Sample Preview */}
                  <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                    {(folder.fields || []).slice(0, 5).map((field, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2">
                        <span className="text-slate-500 font-medium truncate max-w-[170px]" title={field.key}>
                          {field.key}
                        </span>
                        <span className="text-slate-900 font-semibold truncate max-w-[140px] text-right">
                          {field.type === "file" ? (
                            field.fileName ? (
                              <span className="text-teal-600 font-bold">📄 {field.fileSize || "Attached"}</span>
                            ) : (
                              <span className="text-slate-400 italic">No file</span>
                            )
                          ) : (
                            field.value || "—"
                          )}
                        </span>
                      </div>
                    ))}

                    {totalFields > 5 && (
                      <div className="text-[11px] font-bold text-teal-600 pt-1 text-center bg-slate-50 rounded-lg py-1 border border-slate-100">
                        + {totalFields - 5} more fields configured
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    1-Click AutoFill Ready
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(folder)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      View &amp; Edit All Fields
                    </button>

                    {!folder.isBuiltIn && (
                      <button
                        onClick={() => handleDeleteFolder(folder)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete folder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          EXPANDED CREATE / EDIT DATA FOLDER MODAL (WITH FILE UPLOAD & TABS)
      ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  {renderCategoryIcon(category)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {editingFolderId ? `Edit ${folderName}` : "Create New Data Folder"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {fields.length} Total Fields • All values auto-sync with the Chrome Extension
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Folder Name & Category Settings */}
            <div className="p-6 border-b border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. Travel Profile, Job Portal Details"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Folder Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-teal-500 bg-white"
                >
                  <option value="Travel">Travel (Train, Flight, Bus)</option>
                  <option value="Professional">Professional (Govt Exams, College, Jobs)</option>
                  <option value="Personal">Personal (Identity, Address, Banking, Documents)</option>
                  <option value="Custom">Custom User Category</option>
                </select>
              </div>
            </div>

            {/* Section Tabs & Search Filter */}
            <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Section Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedSection("All")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    selectedSection === "All"
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  All ({fields.length})
                </button>
                {currentSections.map((sec, idx) => {
                  const count = fields.filter((f) => (f.section || "General") === sec).length;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSection(sec)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                        selectedSection === sec
                          ? "bg-teal-600 text-white shadow-sm"
                          : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {sec} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter fields (e.g. berth, 10th, photo)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-teal-500 bg-white"
                />
              </div>
            </div>

            {/* Fields List Form */}
            <form onSubmit={handleSaveFolder} className="flex-1 overflow-y-auto p-6 space-y-3">
              {filteredFields.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No fields match your search "{searchTerm}".
                </div>
              ) : (
                filteredFields.map((field) => {
                  const idx = field.originalIndex;
                  const isFileField =
                    field.type === "file" ||
                    field.key.toLowerCase().includes("pdf") ||
                    field.key.toLowerCase().includes("photo") ||
                    field.key.toLowerCase().includes("signature") ||
                    field.key.toLowerCase().includes("impression");

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      {/* Left: Field Key & Section Tag */}
                      <div className="md:w-5/12 flex items-start gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={field.key}
                            onChange={(e) => handleFieldChange(idx, "key", e.target.value)}
                            className="w-full text-xs font-extrabold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-none pb-0.5"
                            placeholder="Field Name"
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              {field.section || "General"}
                            </span>
                            {field.isEncrypted && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                🔒 AES-256
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Input Value OR File Upload Component */}
                      <div className="md:w-7/12 flex items-center gap-2">
                        {isFileField ? (
                          // File Upload Card
                          <div className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 truncate">
                              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                                {field.value ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4 text-slate-400" />}
                              </div>
                              <div className="truncate">
                                {field.value ? (
                                  <>
                                    <p className="text-xs font-bold text-slate-800 truncate" title={field.fileName || "File Attached"}>
                                      {field.fileName || "document_attached.jpg"}
                                    </p>
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                      {field.fileSize || "Uploaded"}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-xs font-semibold text-slate-500">No file uploaded</p>
                                    <p className="text-[10px] text-slate-400">Accepts JPG, PNG, PDF</p>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* File Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Smart Portal Resizer Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenResizer(idx)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition-colors"
                                title="Resize to exact Govt Portal Spec (20KB - 50KB without blur)"
                              >
                                <Sparkles className="w-3 h-3 text-slate-950" />
                                ⚡ Portal Resizer
                              </button>

                              {/* Choose File Input */}
                              <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors">
                                <Upload className="w-3 h-3" />
                                {field.value ? "Replace" : "Upload"}
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(idx, e)}
                                />
                              </label>

                              {field.value && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewFile(field)}
                                    className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                                    title="Preview Document"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(idx)}
                                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-100"
                                    title="Remove file"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Standard Text / Date / Number Input
                          <input
                            type={field.type || "text"}
                            placeholder="Enter value..."
                            value={field.value}
                            onChange={(e) => handleFieldChange(idx, "value", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-teal-500 bg-white"
                          />
                        )}

                        {/* Remove Field Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveFieldRow(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete field"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Add Field Button */}
              <button
                type="button"
                onClick={handleAddFieldRow}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Another Custom Field
              </button>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Changes saved here will immediately reflect in the Chrome extension.
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFolder}
                  className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Save Folder Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SMART DOCUMENT & PHOTO RESIZER STUDIO MODAL (PREMIUM FEATURE)
      ===================================================================== */}
      {resizerModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    ⚡ Smart Image &amp; Document Resizer Studio
                  </h3>
                  <p className="text-xs text-amber-700 font-semibold">
                    ★ Premium Feature: Auto-Scale &amp; Compress without blur
                  </p>
                </div>
              </div>
              <button onClick={() => setResizerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <p className="text-xs text-slate-600">
                Govt exams (SSC, UPSC, NTA, JEE, Banking) and travel portals reject photos if the file size is outside their strict threshold (e.g. 20 KB to 50 KB). Choose a portal preset below:
              </p>

              {/* Preset Radios */}
              <div className="space-y-2.5">
                {Object.values(OPTIMIZER_PRESETS).map((p) => (
                  <label
                    key={p.id}
                    onClick={() => setResizerPreset(p.id)}
                    className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      resizerPreset === p.id
                        ? "border-teal-500 bg-teal-50/50 shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{p.label}</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Target: {p.minKB}–{p.maxKB} KB
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{p.description}</p>
                  </label>
                ))}
              </div>

              {/* Clarity Guarantee Badge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Anti-Blur Technology:</strong> Uses high-precision bicubic resampling with sharpness &amp; ink contrast boosting, guaranteeing text and faces stay 100% crisp.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setResizerModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteResizer}
                disabled={resizing}
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {resizing ? "Optimizing..." : "Apply & Optimize Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PREMIUM UPGRADE ALERT MODAL (FOR FREE USERS)
      ===================================================================== */}
      {premiumPromptOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-amber-300 shadow-2xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Crown className="w-7 h-7 text-amber-600" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              Unlock Smart Portal Resizer
            </h3>
            <p className="text-xs text-amber-800 font-bold mb-3">
              ★ Exclusive FillSync Premium Feature
            </p>

            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Government portals like <strong>SSC, UPSC, NTA, IBPS, and State PSCs</strong> require uploaded passport photos to strictly be between <strong>20 KB – 50 KB</strong> and signatures between <strong>10 KB – 20 KB</strong>.
              <br /><br />
              With <strong>FillSync Premium</strong>, our Smart Resizer automatically scales your documents, enhances contrast, and compresses them to exact portal specifications <strong>without blurring</strong>!
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPremiumPromptOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setPremiumPromptOpen(false);
                  navigate("/dashboard/subscription");
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-sm"
              >
                <Crown className="w-3.5 h-3.5" />
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          DOCUMENT / PHOTO PREVIEW MODAL
      ===================================================================== */}
      {previewFile && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 overflow-hidden flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{previewFile.key}</h4>
                <p className="text-xs text-slate-400">{previewFile.fileName} • {previewFile.fileSize}</p>
              </div>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewFile.value?.startsWith("data:image") ? (
              <img
                src={previewFile.value}
                alt="Document Preview"
                className="max-h-[350px] rounded-xl object-contain border border-slate-200 shadow-xs mb-4"
              />
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200 w-full mb-4">
                📄 PDF Document Attached ({previewFile.fileName || "document.pdf"})
              </div>
            )}

            <div className="w-full flex items-center justify-end gap-2">
              <a
                href={previewFile.value}
                download={previewFile.fileName || "download"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
              >
                <Download className="w-3.5 h-3.5" />
                Download File
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
