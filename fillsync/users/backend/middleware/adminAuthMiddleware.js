/**
 * ============================================================================
 * FILE: users/backend/middleware/adminAuthMiddleware.js
 * PURPOSE: Strictly verifies that the incoming request is authenticated with a
 *          valid JWT token AND belongs to the `superadmin` role.
 * ============================================================================
 */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { readDB } from "../config/db.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fillsync_super_secret_jwt_key_2026_prj1";

/**
 * Middleware: Ensures only the SuperAdmin can access `/api/admin/*` endpoints.
 */
export function verifySuperAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: SuperAdmin token required."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = readDB();
    const adminUser = db.users.find((u) => u.id === decoded.id);

    if (!adminUser || adminUser.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access restricted strictly to SuperAdmin."
      });
    }

    req.user = adminUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired SuperAdmin token."
    });
  }
}
