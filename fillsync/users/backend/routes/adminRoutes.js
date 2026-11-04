/**
 * ============================================================================
 * FILE: users/backend/routes/adminRoutes.js
 * PURPOSE: Express Router for all SuperAdmin Management Endpoints.
 *          Self-contained inside users/backend for seamless cloud deployment.
 * ============================================================================
 */

import express from "express";
import { verifySuperAdmin } from "../middleware/adminAuthMiddleware.js";
import { getAdminDashboardData } from "../controllers/adminOverviewController.js";
import {
  updateUserByAdmin,
  deleteUserByAdmin
} from "../controllers/adminUsersController.js";
import { replySupportTicket } from "../controllers/adminTicketsController.js";
import { updateAdminSettings } from "../controllers/adminSettingsController.js";

const router = express.Router();

// GET /api/admin/overview -> Platform stats, PII-masked users, logs, tickets
router.get("/overview", verifySuperAdmin, getAdminDashboardData);

// PUT /api/admin/users/:id/role -> Grant/Revoke Premium or Suspend/Activate User
router.put("/users/:id/role", verifySuperAdmin, updateUserByAdmin);

// DELETE /api/admin/users/:id -> Delete User & their encrypted records
router.delete("/users/:id", verifySuperAdmin, deleteUserByAdmin);

// POST /api/admin/tickets/:id/reply -> Reply to & resolve support ticket
router.post("/tickets/:id/reply", verifySuperAdmin, replySupportTicket);

// PUT /api/admin/settings -> Update SuperAdmin Login/Password & System Limits
router.put("/settings", verifySuperAdmin, updateAdminSettings);

export default router;
