/**
 * ============================================================================
 * FILE: backend/routes/authRoutes.js
 * PURPOSE: Express Router for User, Google (Gmail), & SuperAdmin Authentication.
 * ============================================================================
 */

import express from "express";
import {
  registerUser,
  loginUser,
  googleAuthUser,
  getKnownUserAccounts,
  getCurrentUser,
  resetPassword
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register -> Register a new user
router.post("/register", registerUser);

// POST /api/auth/login -> Login for Free User, Premium User, or SuperAdmin
router.post("/login", loginUser);

// POST /api/auth/google -> Login or Register with Google (Gmail)
router.post("/google", googleAuthUser);

// POST /api/auth/reset-password -> Reset or set new password
router.post("/reset-password", resetPassword);

// GET /api/auth/known-accounts -> Registered user emails for downward dropdown suggestions
router.get("/known-accounts", getKnownUserAccounts);

// GET /api/auth/me -> Get current logged-in user session
router.get("/me", protectRoute, getCurrentUser);

export default router;
