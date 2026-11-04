/**
 * ============================================================================
 * FILE: users/backend/server.js
 * PURPOSE: Main Localhost Backend API Server (Port 5000).
 *          Connects all `users/backend/routes/*` AND mounts the dedicated
 *          `superadmin/backend/routes/adminRoutes.js` so everything works
 *          together on http://localhost:5000!
 * ============================================================================
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import { initDatabase, readDB, saveDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

// Import SuperAdmin routes (self-contained inside users/backend)
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Initialize Shared Localhost Encrypted Database
initDatabase();

// 2. Global Middleware
app.use(cors());
app.use(express.json());

// 3. Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "FillSync Backend API (Users + SuperAdmin)",
    encryption: "AES-256-CBC Active",
    timestamp: new Date().toISOString()
  });
});

// 3.5 Extension Download Route (Serves the ZIP file)
app.get("/api/extension/download", (req, res) => {
  const zipPath = path.resolve(process.cwd(), "../frontend/public/fillsync-extension.zip");
  if (fs.existsSync(zipPath)) {
    return res.download(zipPath, "fillsync-extension.zip");
  }
  return res.status(404).json({ success: false, message: "Extension ZIP not found." });
});

// 4. Public Contact / Support Ticket Submission Route
app.post("/api/support/contact", (req, res) => {
  const { name, email, category, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields to submit a support ticket."
    });
  }

  const db = readDB();
  const newTicket = {
    id: `TKT-${1000 + db.supportTickets.length + 1}`,
    userName: name,
    userEmail: email,
    subject,
    category: category || "General Inquiry",
    status: "Open",
    priority: "Medium",
    message,
    adminReply: "",
    createdAt: new Date().toISOString()
  };

  db.supportTickets.unshift(newTicket);
  saveDB(db);

  return res.status(201).json({
    success: true,
    message: `Support Ticket ${newTicket.id} submitted! Our admin team will review it.`,
    ticket: newTicket
  });
});

// 5. Register User API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/subscribe", subscriptionRoutes);

// 6. Register SuperAdmin API Routes (from superadmin/backend/routes/adminRoutes.js)
app.use("/api/admin", adminRoutes);
// Also keep /api/admin/subscribe/* alias for backward compatibility
app.use("/api/admin/subscribe", subscriptionRoutes);

// 7. Start Server (binds to 0.0.0.0 for Cloud Deployment & Localhost)
app.listen(PORT, "0.0.0.0", () => {
  console.log("============================================================");
  console.log(`🚀 FillSync Backend Server running on http://localhost:${PORT}`);
  console.log(`🔒 AES-256 Field Encryption: ENABLED`);
  console.log(`🛡️  SuperAdmin Email: ${process.env.SUPERADMIN_EMAIL || "admin@fillsync.com"}`);
  console.log("============================================================");
});
