/**
 * ============================================================================
 * FILE: superadmin/backend/controllers/adminOverviewController.js
 * PURPOSE: Computes Platform-Wide Analytics, Revenue (MRR), Audit Logs, and
 *          PII-Masked User List for the SuperAdmin Console.
 * ============================================================================
 */

import { readDB } from "../../../users/backend/config/db.js";
import { maskSensitive } from "../../../users/backend/utils/encryption.js";

/**
 * GET /api/admin/overview
 * Returns complete dashboard telemetry for the SuperAdmin while masking all
 * personal phone numbers and street addresses (`+9********10`).
 */
export function getAdminDashboardData(req, res) {
  const db = readDB();

  const regularUsers = db.users.filter((u) => u.role !== "superadmin");
  const premiumUsers = regularUsers.filter((u) => u.role === "premium");
  const totalFormsFilled = regularUsers.reduce(
    (acc, u) => acc + (u.formsFilledCount || 0),
    0
  );
  const monthlyRevenueINR =
    premiumUsers.length * (db.systemSettings?.premiumMonthlyPriceINR || 99);

  // Build PII-Masked user records so even SuperAdmin cannot misuse personal data
  const maskedUsers = regularUsers.map((u) => {
    const profile = db.masterProfiles.find((p) => p.userId === u.id);
    const folderCount = db.dataFolders.filter((f) => f.userId === u.id).length;
    const templateCount = db.templates.filter((t) => t.userId === u.id).length;

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      formsFilledCount: u.formsFilledCount || 0,
      folderCount,
      templateCount,
      maskedPhone: profile?.phone ? maskSensitive(profile.phone) : "Not set",
      maskedStreet: profile?.address?.street
        ? maskSensitive(profile.address.street)
        : "Not set",
      createdAt: u.createdAt,
      lastActive: u.lastActive
    };
  });

  return res.json({
    success: true,
    stats: {
      totalUsers: regularUsers.length,
      premiumUsers: premiumUsers.length,
      freeUsers: regularUsers.length - premiumUsers.length,
      totalFormsFilled,
      totalFolders: db.dataFolders.length,
      totalTemplates: db.templates.length,
      monthlyRevenueINR
    },
    users: maskedUsers,
    subscriptions: db.subscriptions,
    activityLogs: db.activityLogs,
    supportTickets: db.supportTickets,
    systemSettings: db.systemSettings
  });
}
