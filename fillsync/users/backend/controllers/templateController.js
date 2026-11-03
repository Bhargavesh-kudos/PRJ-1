/**
 * ============================================================================
 * FILE: backend/controllers/templateController.js
 * PURPOSE: Manages Smart Templates with dynamic `{Variables}` extraction and
 *          AI Enhancement for Premium users.
 * ============================================================================
 */

import { readDB, saveDB, getDefaultTemplatesForUser, addActivityLog } from "../config/db.js";

/**
 * Helper: Extracts all `{Variable_Name}` placeholders from a template string.
 * Example: "Hello {HR_Name} at {Company}" -> ["HR_Name", "Company"]
 */
export function extractTemplateVariables(bodyText = "") {
  const regex = /\{([a-zA-Z0-9_ -]+)\}/g;
  const found = new Set();
  let match;

  while ((match = regex.exec(bodyText)) !== null) {
    found.add(match[1].trim());
  }

  return Array.from(found);
}

/**
 * GET /api/templates
 * Lists all Smart Templates belonging to the logged-in user.
 */
export function getUserTemplates(req, res) {
  const db = readDB();
  let userTemplates = db.templates.filter((t) => t.userId === req.user.id);

  if (userTemplates.length === 0) {
    const defaults = getDefaultTemplatesForUser(req.user.id);
    db.templates.push(...defaults);
    saveDB(db);
    userTemplates = defaults;
  }

  return res.json({
    success: true,
    templates: userTemplates,
    limit: req.user.role === "premium" ? "Unlimited" : db.systemSettings.freeTemplateLimit
  });
}

/**
 * POST /api/templates
 * Creates a new Smart Template and automatically extracts `{variables}`.
 */
export function createTemplate(req, res) {
  const { title, category, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({
      success: false,
      message: "Please provide both Template Title and Template Body."
    });
  }

  const db = readDB();
  const userTemplates = db.templates.filter((t) => t.userId === req.user.id);
  const freeLimit = db.systemSettings?.freeTemplateLimit || 5;

  // Enforce Free Plan limit (5 templates max)
  if (req.user.role === "free" && userTemplates.length >= freeLimit) {
    return res.status(403).json({
      success: false,
      message: `Free Plan allows up to ${freeLimit} Smart Templates. Upgrade to Premium for unlimited templates!`
    });
  }

  const extractedVars = extractTemplateVariables(body);

  const newTemplate = {
    id: `tpl_${Date.now()}`,
    userId: req.user.id,
    title: title.trim(),
    category: category || "Job Search",
    body: body,
    variables: extractedVars,
    createdAt: new Date().toISOString()
  };

  db.templates.push(newTemplate);
  saveDB(db);

  addActivityLog(req.user.id, req.user.email, "TEMPLATE_CREATED", `Created template: ${newTemplate.title}`);

  return res.status(201).json({
    success: true,
    message: "Smart Template saved successfully!",
    template: newTemplate
  });
}

/**
 * PUT /api/templates/:id
 * Updates an existing Smart Template and re-computes `{variables}`.
 */
export function updateTemplate(req, res) {
  const { id } = req.params;
  const { title, category, body } = req.body;

  const db = readDB();
  const tplIndex = db.templates.findIndex((t) => t.id === id && t.userId === req.user.id);

  if (tplIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Template not found."
    });
  }

  const existing = db.templates[tplIndex];
  const updatedBody = body !== undefined ? body : existing.body;

  const updatedTemplate = {
    ...existing,
    title: title ? title.trim() : existing.title,
    category: category || existing.category,
    body: updatedBody,
    variables: extractTemplateVariables(updatedBody),
    updatedAt: new Date().toISOString()
  };

  db.templates[tplIndex] = updatedTemplate;
  saveDB(db);

  addActivityLog(req.user.id, req.user.email, "TEMPLATE_UPDATED", `Updated template: ${updatedTemplate.title}`);

  return res.json({
    success: true,
    message: "Template updated!",
    template: updatedTemplate
  });
}

/**
 * DELETE /api/templates/:id
 * Deletes a Smart Template.
 */
export function deleteTemplate(req, res) {
  const { id } = req.params;
  const db = readDB();

  const existing = db.templates.find((t) => t.id === id && t.userId === req.user.id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: "Template not found."
    });
  }

  db.templates = db.templates.filter((t) => !(t.id === id && t.userId === req.user.id));
  saveDB(db);

  addActivityLog(req.user.id, req.user.email, "TEMPLATE_DELETED", `Deleted template: ${existing.title}`);

  return res.json({
    success: true,
    message: "Template deleted."
  });
}
