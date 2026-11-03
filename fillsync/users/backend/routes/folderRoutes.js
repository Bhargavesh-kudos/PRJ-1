/**
 * ============================================================================
 * FILE: backend/routes/folderRoutes.js
 * PURPOSE: Express Router for Categorized Data Folders (3 Built-In + Custom).
 * ============================================================================
 */

import express from "express";
import {
  getUserFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  resetBuiltinFolders
} from "../controllers/folderController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/folders -> List all folders for logged-in user
router.get("/", protectRoute, getUserFolders);

// POST /api/folders/reset-builtin -> Synchronize built-in folders with all official fields
router.post("/reset-builtin", protectRoute, resetBuiltinFolders);

// POST /api/folders -> Create a new custom folder
router.post("/", protectRoute, createFolder);

// PUT /api/folders/:id -> Update an existing folder
router.put("/:id", protectRoute, updateFolder);

// DELETE /api/folders/:id -> Delete a custom folder
router.delete("/:id", protectRoute, deleteFolder);

export default router;
