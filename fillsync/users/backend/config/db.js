/**
 * ============================================================================
 * FILE: users/backend/config/db.js
 * PURPOSE: Shared Localhost Database Manager for FillSync.
 *          Both `users/backend` and `superadmin/backend` read and write to
 *          `fillsync/shared-database/local_storage.json`.
 * ============================================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { encryptText } from "../utils/encryption.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolves database directory safely: uses root shared-database if available,
// or falls back to self-contained shared-database for isolated cloud deployments.
const candidateSharedDir = path.resolve(__dirname, "../../../shared-database");
const internalSharedDir = path.resolve(__dirname, "../shared-database");
const DB_DIR = fs.existsSync(candidateSharedDir) ? candidateSharedDir : internalSharedDir;
const DB_FILE = path.join(DB_DIR, "local_storage.json");

// Also check superadmin/backend/.env if present
const SUPERADMIN_ENV_PATH = path.resolve(__dirname, "../../../superadmin/backend/.env");
if (fs.existsSync(SUPERADMIN_ENV_PATH)) {
  dotenv.config({ path: SUPERADMIN_ENV_PATH, override: true });
}

import {
  getComprehensiveTravelFields,
  getComprehensiveProfessionalFields,
  getComprehensivePersonalFields
} from "./defaultFolderData.js";

/**
 * Default 3 Built-In Data Folders given to every new user automatically.
 * Contains exhaustive real-world fields for:
 * 1. Travel Profile (Train/IRCTC, Flight/Aero, Bus/redBus)
 * 2. Professional Profile (OTR/10th Base, Govt Exams SSC/UPSC, College/Admissions CUET/JEE, Portfolio)
 * 3. Personal Profile (Identity, Contact, Address, IDs, Banking, File Uploads)
 */
export function getDefaultFoldersForUser(userId) {
  return [
    {
      id: `folder_travel_${Date.now()}_1`,
      userId,
      folderName: "Travel Profile",
      category: "Travel",
      icon: "Plane",
      isBuiltIn: true,
      fields: getComprehensiveTravelFields(),
      createdAt: new Date().toISOString()
    },
    {
      id: `folder_prof_${Date.now()}_2`,
      userId,
      folderName: "Professional Profile",
      category: "Professional",
      icon: "Briefcase",
      isBuiltIn: true,
      fields: getComprehensiveProfessionalFields(),
      createdAt: new Date().toISOString()
    },
    {
      id: `folder_pers_${Date.now()}_3`,
      userId,
      folderName: "Personal Profile",
      category: "Personal",
      icon: "User",
      isBuiltIn: true,
      fields: getComprehensivePersonalFields(),
      createdAt: new Date().toISOString()
    }
  ];
}

/**
 * Default Starter Smart Templates given to every new user.
 */
export function getDefaultTemplatesForUser(userId) {
  return [
    {
      id: `tpl_${Date.now()}_1`,
      userId,
      title: "Job / Internship Application Email",
      category: "Job Search",
      body: "Dear {HR_Name},\n\nI am writing to express my interest in the {Position} role at {Company_Name}. With my experience in {Key_Skill}, I would love to contribute to your team.\n\nPlease find my resume attached.\n\nBest regards,\n{My_Name}",
      variables: ["HR_Name", "Position", "Company_Name", "Key_Skill", "My_Name"],
      createdAt: new Date().toISOString()
    },
    {
      id: `tpl_${Date.now()}_2`,
      userId,
      title: "LinkedIn Referral & Networking Note",
      category: "Outreach",
      body: "Hi {Connection_Name},\n\nI hope you're doing well! I noticed an opening for {Position} at {Company_Name}. Given my background in {Key_Skill}, would you be open to referring me?\n\nThanks,\n{My_Name}",
      variables: ["Connection_Name", "Company_Name", "Position", "Key_Skill", "My_Name"],
      createdAt: new Date().toISOString()
    }
  ];
}

/**
 * Initializes the shared database file and syncs SuperAdmin credentials.
 */
export function initDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const superAdminEmail = (process.env.SUPERADMIN_EMAIL || "admin@fillsync.com").toLowerCase();
  const superAdminPassword = process.env.SUPERADMIN_PASSWORD || "Admin@123";
  const superAdminName = process.env.SUPERADMIN_NAME || "SuperAdmin";

  let dbData = null;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      dbData = JSON.parse(raw);
    } catch (err) {
      console.error("Error reading local_storage.json, recreating...", err);
    }
  }

  if (!dbData) {
    dbData = {
      users: [
        {
          id: "user_superadmin_1",
          name: superAdminName,
          email: superAdminEmail,
          passwordHash: bcrypt.hashSync(superAdminPassword, 10),
          role: "superadmin",
          status: "active",
          formsFilledCount: 0,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        }
      ],
      masterProfiles: [],
      dataFolders: [],
      templates: [],
      subscriptions: [],
      activityLogs: [
        {
          id: `log_${Date.now()}_1`,
          userId: "user_superadmin_1",
          userEmail: superAdminEmail,
          action: "SYSTEM_INIT",
          details: "Database initialized",
          severity: "info",
          timestamp: new Date().toISOString()
        }
      ],
      supportTickets: [],
      systemSettings: {
        freeFolderLimit: 5,
        freeTemplateLimit: 5,
        premiumMonthlyPriceINR: 99,
        aiDailyLimitFree: 10,
        aiDailyLimitPremium: 500,
        maintenanceMode: false,
        encryptionEnabled: true
      }
    };
  }

  saveDB(dbData);
  return dbData;
}

export function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    return initDatabase();
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw);
}

export function saveDB(data) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function addActivityLog(userId, userEmail, action, details, severity = "info") {
  const db = readDB();
  db.activityLogs.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    userEmail,
    action,
    details,
    severity,
    timestamp: new Date().toISOString()
  });

  if (db.activityLogs.length > 200) {
    db.activityLogs = db.activityLogs.slice(0, 200);
  }
  saveDB(db);
}
