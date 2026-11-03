/**
 * ============================================================================
 * FILE: superadmin/backend/server.js
 * PURPOSE: Dedicated SuperAdmin Backend Server (Port 5001).
 *          Note: These routes are also mounted on the unified localhost port
 *          5000 so both standalone and unified modes work seamlessly!
 * ============================================================================
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDatabase } from "../../users/backend/config/db.js";
import authRoutes from "../../users/backend/routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const ADMIN_PORT = process.env.ADMIN_PORT || 5001;

initDatabase();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.listen(ADMIN_PORT, () => {
  console.log(`🛡️  SuperAdmin Backend Server running on http://localhost:${ADMIN_PORT}`);
});
