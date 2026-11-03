/**
 * ============================================================================
 * FILE: backend/middleware/authMiddleware.js
 * PURPOSE: Protects API routes using JSON Web Tokens (JWT) and Role-Based
 *          Access Control (Free User vs. Premium User vs. SuperAdmin).
 * ============================================================================
 */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { readDB } from "../config/db.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fillsync_super_secret_jwt_key_2026_prj1";

/**
 * Middleware: Verifies that the request contains a valid JWT Bearer token.
 * Attaches `req.user` with the latest user record from the database.
 */
export function protectRoute(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No authentication token provided."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = readDB();
    const user = db.users.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User account no longer exists."
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Account Suspended: Please contact FillSync support."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired session token."
    });
  }
}

/**
 * Middleware: Restricts access strictly to the SuperAdmin account.
 */
export function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: SuperAdmin privileges required."
    });
  }
  next();
}
