/**
 * ============================================================================
 * FILE: superadmin/backend/controllers/adminSettingsController.js
 * PURPOSE: Allows the SuperAdmin to change their own Login Email & Password
 *          AND configure platform-wide Free Plan limits & Premium Pricing.
 * ============================================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { readDB, saveDB, addActivityLog } from "../../../users/backend/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_ENV_PATH = path.resolve(__dirname, "../.env");
const USER_ENV_PATH = path.resolve(__dirname, "../../../users/backend/.env");

/**
 * Helper to update `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD` inside `.env` files.
 */
function syncEnvFile(filePath, newEmail, newPass) {
  try {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf-8");

    if (newEmail && newEmail.trim()) {
      content = content.replace(
        /^SUPERADMIN_EMAIL=.*$/m,
        `SUPERADMIN_EMAIL=${newEmail.trim().toLowerCase()}`
      );
    }
    if (newPass && newPass.trim().length >= 4) {
      content = content.replace(
        /^SUPERADMIN_PASSWORD=.*$/m,
        `SUPERADMIN_PASSWORD=${newPass.trim()}`
      );
    }
    fs.writeFileSync(filePath, content, "utf-8");
  } catch (err) {
    console.error("Could not sync .env file:", err.message);
  }
}

/**
 * PUT /api/admin/settings
 * Updates system configuration and SuperAdmin login credentials.
 */
export function updateAdminSettings(req, res) {
  const {
    freeFolderLimit,
    freeTemplateLimit,
    premiumMonthlyPriceINR,
    maintenanceMode,
    newSuperAdminEmail,
    newSuperAdminPassword
  } = req.body;

  const db = readDB();

  if (freeFolderLimit !== undefined) {
    db.systemSettings.freeFolderLimit = Number(freeFolderLimit);
  }
  if (freeTemplateLimit !== undefined) {
    db.systemSettings.freeTemplateLimit = Number(freeTemplateLimit);
  }
  if (premiumMonthlyPriceINR !== undefined) {
    db.systemSettings.premiumMonthlyPriceINR = Number(premiumMonthlyPriceINR);
  }
  if (maintenanceMode !== undefined) {
    db.systemSettings.maintenanceMode = Boolean(maintenanceMode);
  }

  const adminUser = db.users.find((u) => u.role === "superadmin");
  if (adminUser) {
    if (newSuperAdminEmail && newSuperAdminEmail.trim()) {
      adminUser.email = newSuperAdminEmail.trim().toLowerCase();
    }
    if (newSuperAdminPassword && newSuperAdminPassword.trim().length >= 4) {
      adminUser.passwordHash = bcrypt.hashSync(newSuperAdminPassword.trim(), 10);
    }

    syncEnvFile(ADMIN_ENV_PATH, newSuperAdminEmail, newSuperAdminPassword);
    syncEnvFile(USER_ENV_PATH, newSuperAdminEmail, newSuperAdminPassword);
  }

  saveDB(db);
  addActivityLog(
    req.user.id,
    req.user.email,
    "ADMIN_SETTINGS_UPDATED",
    "Updated SuperAdmin credentials / system limits"
  );

  return res.json({
    success: true,
    message: "SuperAdmin credentials & system settings saved!",
    systemSettings: db.systemSettings,
    superAdminEmail: adminUser?.email
  });
}
