/**
 * ============================================================================
 * FILE: backend/controllers/authController.js
 * PURPOSE: Handles User Registration, User Login, Google (Gmail) Login/Signup,
 *          SuperAdmin Login, and Session Verification.
 * ============================================================================
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  readDB,
  saveDB,
  getDefaultFoldersForUser,
  getDefaultTemplatesForUser,
  addActivityLog
} from "../config/db.js";
import { encryptText } from "../utils/encryption.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fillsync_super_secret_jwt_key_2026_prj1";

/**
 * Helper to create a signed JWT token valid for 7 days.
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * POST /api/auth/register
 * Registers a new user and sets up their Master Profile + 3 Built-In Folders.
 */
export function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide Full Name, Email, and Password."
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = readDB();

  // Check if email already exists
  const existingUser = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "An account with this email already exists."
    });
  }

  const newUserId = `user_${Date.now()}`;
  const newUser = {
    id: newUserId,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: bcrypt.hashSync(password, 10),
    role: "free",
    status: "active",
    formsFilledCount: 0,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };

  // 1. Save User
  db.users.push(newUser);

  // 2. Create initial Master Profile
  db.masterProfiles.push({
    userId: newUserId,
    fullName: name.trim(),
    email: normalizedEmail,
    phone: encryptText(""),
    dob: "",
    gender: "Prefer not to say",
    address: {
      street: encryptText(""),
      city: "",
      state: "",
      pinCode: "",
      country: "India"
    },
    updatedAt: new Date().toISOString()
  });

  // 3. Provision 3 Built-In Data Folders (Travel, Professional, Personal)
  const builtInFolders = getDefaultFoldersForUser(newUserId);
  db.dataFolders.push(...builtInFolders);

  // 4. Provision Starter Smart Templates
  const starterTemplates = getDefaultTemplatesForUser(newUserId);
  db.templates.push(...starterTemplates);

  saveDB(db);
  addActivityLog(newUserId, normalizedEmail, "USER_SIGNUP", `New user registered: ${name}`);

  const token = generateToken(newUser);

  return res.status(201).json({
    success: true,
    message: "Account created successfully with 3 built-in folders!",
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      formsFilledCount: newUser.formsFilledCount
    }
  });
}

/**
 * POST /api/auth/login
 * Authenticates either a regular User (Free/Premium) OR the SuperAdmin.
 */
export function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter both email and password."
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = readDB();

  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password."
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    addActivityLog(user.id, user.email, "LOGIN_FAILED", "Incorrect password attempt", "warning");
    return res.status(401).json({
      success: false,
      message: "Invalid email or password."
    });
  }

  if (user.status === "suspended") {
    return res.status(403).json({
      success: false,
      message: "Your account has been suspended by the administrator."
    });
  }

  user.lastActive = new Date().toISOString();
  saveDB(db);

  addActivityLog(
    user.id,
    user.email,
    user.role === "superadmin" ? "SUPERADMIN_LOGIN" : "USER_LOGIN",
    `${user.name} logged in (${user.role})`
  );

  const token = generateToken(user);

  return res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      formsFilledCount: user.formsFilledCount
    }
  });
}

/**
 * POST /api/auth/google
 * Handles 1-Click "Continue with Google (Gmail)" for both Login and Registration.
 * If the Gmail account already exists in the database, logs the user in.
 * If it is a new Gmail account, automatically creates their account + 3 Built-In Folders.
 */
export function googleAuthUser(req, res) {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please enter or select your Gmail address."
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = readDB();

  // Check if user already exists
  let user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (user) {
    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended by the administrator."
      });
    }
    user.lastActive = new Date().toISOString();
    saveDB(db);
    addActivityLog(user.id, user.email, "GOOGLE_LOGIN", `${user.name} signed in with Google`);
  } else {
    // Auto-register new Gmail user
    const derivedName =
      (name && name.trim()) ||
      normalizedEmail
        .split("@")[0]
        .replace(/[._0-9]+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase()) ||
      "Google User";

    const newUserId = `user_google_${Date.now()}`;
    user = {
      id: newUserId,
      name: derivedName,
      email: normalizedEmail,
      passwordHash: bcrypt.hashSync(`google_oauth_${Date.now()}`, 10),
      role: "free",
      status: "active",
      formsFilledCount: 0,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    db.users.push(user);

    db.masterProfiles.push({
      userId: newUserId,
      fullName: derivedName,
      email: normalizedEmail,
      phone: encryptText(""),
      dob: "",
      gender: "Prefer not to say",
      address: {
        street: encryptText(""),
        city: "",
        state: "",
        pinCode: "",
        country: "India"
      },
      updatedAt: new Date().toISOString()
    });

    db.dataFolders.push(...getDefaultFoldersForUser(newUserId));
    db.templates.push(...getDefaultTemplatesForUser(newUserId));

    saveDB(db);
    addActivityLog(
      newUserId,
      normalizedEmail,
      "GOOGLE_SIGNUP",
      `New user registered via Google: ${derivedName}`
    );
  }

  const token = generateToken(user);

  return res.json({
    success: true,
    message: `Signed in with Google as ${user.name}!`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      formsFilledCount: user.formsFilledCount
    }
  });
}

/**
 * GET /api/auth/known-accounts
 * Returns non-admin registered user emails & names so the Login/Google chooser
 * can show a downward dropdown suggestion for previously registered accounts.
 */
export function getKnownUserAccounts(req, res) {
  const db = readDB();
  const accounts = db.users
    .filter((u) => u.role !== "superadmin")
    .map((u) => ({ name: u.name, email: u.email }));

  return res.json({
    success: true,
    accounts
  });
}

/**
 * GET /api/auth/me
 * Returns the currently logged-in user's profile and subscription status.
 */
export function getCurrentUser(req, res) {
  const user = req.user;
  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      formsFilledCount: user.formsFilledCount,
      createdAt: user.createdAt
    }
  });
}

/**
 * POST /api/auth/reset-password
 * Sets a new password for any registered user email.
 */
export function resetPassword(req, res) {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide both Email and New Password."
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = readDB();

  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No user found with this email."
    });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  saveDB(db);
  addActivityLog(user.id, user.email, "PASSWORD_RESET", "Password was reset by user", "info");

  const token = generateToken(user);

  return res.json({
    success: true,
    message: "Password updated successfully!",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      formsFilledCount: user.formsFilledCount
    }
  });
}
