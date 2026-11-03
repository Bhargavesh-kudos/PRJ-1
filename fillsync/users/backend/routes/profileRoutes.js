/**
 * ============================================================================
 * FILE: backend/routes/profileRoutes.js
 * PURPOSE: Express Router for the User's Master Profile (AES-256 Encrypted).
 * ============================================================================
 */

import express from "express";
import { getMyMasterProfile, updateMyMasterProfile } from "../controllers/profileController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/profiles/me -> Retrieve Master Profile
router.get("/me", protectRoute, getMyMasterProfile);

// PUT /api/profiles/me -> Update Master Profile
router.put("/me", protectRoute, updateMyMasterProfile);

export default router;
