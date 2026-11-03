/**
 * ============================================================================
 * FILE: backend/routes/templateRoutes.js
 * PURPOSE: Express Router for Smart Templates with `{Variables}` extraction.
 * ============================================================================
 */

import express from "express";
import {
  getUserTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from "../controllers/templateController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/templates -> List all templates for logged-in user
router.get("/", protectRoute, getUserTemplates);

// POST /api/templates -> Create a new Smart Template
router.post("/", protectRoute, createTemplate);

// PUT /api/templates/:id -> Update an existing template
router.put("/:id", protectRoute, updateTemplate);

// DELETE /api/templates/:id -> Delete a template
router.delete("/:id", protectRoute, deleteTemplate);

export default router;
