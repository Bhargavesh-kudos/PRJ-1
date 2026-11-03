/**
 * ============================================================================
 * FILE: backend/controllers/folderController.js
 * PURPOSE: Manages Categorized Data Folders (3 Built-In: Travel, Professional,
 *          Personal + User-Created Custom Folders).
 *
 * FEATURES:
 * - Every user gets 3 built-in folders automatically.
 * - Free users can create up to 2 extra custom folders (total 5 folders).
 * - Premium users can create UNLIMITED custom folders.
 * - Sensitive fields (Passport, Aadhaar, PAN, ID, Phone) are encrypted with
 *   AES-256 before saving to disk.
 * ============================================================================
 */

import { readDB, saveDB, getDefaultFoldersForUser, addActivityLog } from "../config/db.js";
import { encryptText, decryptText } from "../utils/encryption.js";

/**
 * Helper: Determines if a field name looks like sensitive PII that should be
 * encrypted at rest using AES-256.
 */
function shouldEncryptField(fieldKey = "") {
  const lower = fieldKey.toLowerCase();
  return (
    lower.includes("passport") ||
    lower.includes("aadhaar") ||
    lower.includes("pan") ||
    lower.includes("phone") ||
    lower.includes("contact") ||
    lower.includes("irctc") ||
    lower.includes("id") ||
    lower.includes("license")
  );
}

/**
 * GET /api/folders
 * Returns all Data Folders belonging to the logged-in user (decrypted for owner).
 */
export function getUserFolders(req, res) {
  const db = readDB();
  let userFolders = db.dataFolders.filter((f) => f.userId === req.user.id);

  // If user somehow has no folders yet, seed the 3 built-in folders
  if (userFolders.length === 0) {
    const defaults = getDefaultFoldersForUser(req.user.id);
    db.dataFolders.push(...defaults);
    saveDB(db);
    userFolders = defaults;
  }

  // Decrypt field values for the authenticated owner
  const decryptedFolders = userFolders.map((folder) => ({
    ...folder,
    fields: (folder.fields || []).map((field) => ({
      key: field.key,
      value: decryptText(field.value),
      type: field.type || "text",
      fileName: field.fileName || null,
      fileSize: field.fileSize || null,
      section: field.section || null,
      isEncrypted: Boolean(field.isEncrypted),
      rawEncryptedValue: field.isEncrypted ? field.value : null
    }))
  }));

  return res.json({
    success: true,
    folders: decryptedFolders,
    limit: req.user.role === "premium" ? "Unlimited" : db.systemSettings.freeFolderLimit
  });
}

/**
 * POST /api/folders
 * Creates a new custom Data Folder for the logged-in user.
 */
export function createFolder(req, res) {
  const { folderName, category, fields } = req.body;

  if (!folderName || !folderName.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide a Folder Name."
    });
  }

  const db = readDB();
  const userFolders = db.dataFolders.filter((f) => f.userId === req.user.id);
  const freeLimit = db.systemSettings?.freeFolderLimit || 5;

  // Enforce Free Plan limit
  if (req.user.role === "free" && userFolders.length >= freeLimit) {
    return res.status(403).json({
      success: false,
      message: `Free Plan allows up to ${freeLimit} folders (3 built-in + ${freeLimit - 3} custom). Upgrade to Premium for unlimited folders!`
    });
  }

  // Process and encrypt sensitive fields
  const processedFields = Array.isArray(fields)
    ? fields
        .filter((f) => f.key && f.key.trim() !== "")
        .map((f) => {
          const isSens = Boolean(f.isEncrypted) || shouldEncryptField(f.key);
          return {
            key: f.key.trim(),
            value: isSens ? encryptText(String(f.value || "")) : String(f.value || ""),
            isEncrypted: isSens
          };
        })
    : [];

  const newFolder = {
    id: `folder_custom_${Date.now()}`,
    userId: req.user.id,
    folderName: folderName.trim(),
    category: category || "Custom",
    icon: category === "Travel" ? "Plane" : category === "Professional" ? "Briefcase" : category === "Personal" ? "User" : "Folder",
    isBuiltIn: false,
    fields: processedFields,
    createdAt: new Date().toISOString()
  };

  db.dataFolders.push(newFolder);
  saveDB(db);

  addActivityLog(req.user.id, req.user.email, "FOLDER_CREATED", `Created folder: ${newFolder.folderName}`);

  return res.status(201).json({
    success: true,
    message: `Folder "${newFolder.folderName}" created successfully!`,
    folder: {
      ...newFolder,
      fields: newFolder.fields.map((f) => ({
        ...f,
        value: decryptText(f.value)
      }))
    }
  });
}

/**
 * PUT /api/folders/:id
 * Updates an existing Data Folder (both Built-In and Custom folders can have their fields edited).
 */
export function updateFolder(req, res) {
  const { id } = req.params;
  const { folderName, category, fields } = req.body;

  const db = readDB();
  const folderIndex = db.dataFolders.findIndex(
    (f) => f.id === id && f.userId === req.user.id
  );

  if (folderIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Data Folder not found."
    });
  }

  const existingFolder = db.dataFolders[folderIndex];

  const processedFields = Array.isArray(fields)
    ? fields
        .filter((f) => f.key && f.key.trim() !== "")
        .map((f) => {
          const isSens = Boolean(f.isEncrypted) || shouldEncryptField(f.key);
          return {
            key: f.key.trim(),
            value: isSens ? encryptText(String(f.value || "")) : String(f.value || ""),
            type: f.type || "text",
            fileName: f.fileName || null,
            fileSize: f.fileSize || null,
            section: f.section || null,
            isEncrypted: isSens
          };
        })
    : existingFolder.fields;

  const updatedFolder = {
    ...existingFolder,
    folderName: folderName ? folderName.trim() : existingFolder.folderName,
    category: category || existingFolder.category,
    fields: processedFields,
    updatedAt: new Date().toISOString()
  };

  db.dataFolders[folderIndex] = updatedFolder;
  saveDB(db);

  addActivityLog(req.user.id, req.user.email, "FOLDER_UPDATED", `Updated folder: ${updatedFolder.folderName}`);

  return res.json({
    success: true,
    message: `Folder "${updatedFolder.folderName}" updated!`,
    folder: {
      ...updatedFolder,
      fields: updatedFolder.fields.map((f) => ({
        ...f,
        value: decryptText(f.value)
      }))
    }
  });
}

/**
 * POST /api/folders/reset-builtin
 * Resets / synchronizes the user's 3 built-in folders with the full exhaustive official fields.
 */
export function resetBuiltinFolders(req, res) {
  const db = readDB();
  const defaults = getDefaultFoldersForUser(req.user.id);

  // Preserve any custom folders created by user
  const customFolders = db.dataFolders.filter(
    (f) => f.userId === req.user.id && !f.isBuiltIn
  );

  // Remove old built-in folders for this user and add the fresh exhaustive defaults
  db.dataFolders = db.dataFolders.filter(
    (f) => !(f.userId === req.user.id && f.isBuiltIn)
  );
  db.dataFolders.push(...defaults);
  saveDB(db);

  addActivityLog(
    req.user.id,
    req.user.email,
    "FOLDERS_RESET",
    "Synchronized built-in profiles with all official fields"
  );

  return res.json({
    success: true,
    message: "Successfully synchronized Travel, Professional & Personal profiles with all official fields!",
    folders: [...defaults, ...customFolders]
  });
}

/**
 * DELETE /api/folders/:id
 * Deletes a user's custom Data Folder (Built-In folders are protected from accidental deletion).
 */
export function deleteFolder(req, res) {
  const { id } = req.params;
  const db = readDB();

  const folder = db.dataFolders.find((f) => f.id === id && f.userId === req.user.id);
  if (!folder) {
    return res.status(404).json({
      success: false,
      message: "Folder not found."
    });
  }

  if (folder.isBuiltIn) {
    return res.status(400).json({
      success: false,
      message: "Built-in folders (Travel, Professional, Personal) cannot be deleted, but you can edit their fields anytime!"
    });
  }

  db.dataFolders = db.dataFolders.filter((f) => !(f.id === id && f.userId === req.user.id));
  saveDB(db);

  addActivityLog(req.user.id, req.user.email, "FOLDER_DELETED", `Deleted folder: ${folder.folderName}`);

  return res.json({
    success: true,
    message: `Folder "${folder.folderName}" deleted.`
  });
}
