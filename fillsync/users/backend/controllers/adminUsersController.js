/**
 * ============================================================================
 * FILE: users/backend/controllers/adminUsersController.js
 * PURPOSE: SuperAdmin User Account Management (Grant/Revoke Premium,
 *          Suspend/Activate Account, Delete User Account).
 * ============================================================================
 */

import { readDB, saveDB, addActivityLog } from "../config/db.js";

/**
 * PUT /api/admin/users/:id/role
 * Updates a user's Subscription Role (free/premium) or Account Status (active/suspended).
 */
export function updateUserByAdmin(req, res) {
  const { id } = req.params;
  const { role, status } = req.body;

  const db = readDB();
  const user = db.users.find((u) => u.id === id && u.role !== "superadmin");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  if (role && ["free", "premium"].includes(role)) {
    user.role = role;
  }
  if (status && ["active", "suspended"].includes(status)) {
    user.status = status;
  }

  saveDB(db);
  addActivityLog(
    req.user.id,
    req.user.email,
    "ADMIN_USER_UPDATE",
    `SuperAdmin updated ${user.email} -> role: ${user.role}, status: ${user.status}`
  );

  return res.json({
    success: true,
    message: `Updated user ${user.name} (${user.role.toUpperCase()} / ${user.status.toUpperCase()})`
  });
}

/**
 * DELETE /api/admin/users/:id
 * Permanently deletes a user account and all their folders/templates.
 */
export function deleteUserByAdmin(req, res) {
  const { id } = req.params;
  const db = readDB();

  const user = db.users.find((u) => u.id === id && u.role !== "superadmin");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  db.users = db.users.filter((u) => u.id !== id);
  db.masterProfiles = db.masterProfiles.filter((p) => p.userId !== id);
  db.dataFolders = db.dataFolders.filter((f) => f.userId !== id);
  db.templates = db.templates.filter((t) => t.userId !== id);

  saveDB(db);
  addActivityLog(
    req.user.id,
    req.user.email,
    "ADMIN_USER_DELETED",
    `Deleted user: ${user.email}`,
    "warning"
  );

  return res.json({
    success: true,
    message: `User ${user.email} and all their encrypted records have been deleted.`
  });
}
