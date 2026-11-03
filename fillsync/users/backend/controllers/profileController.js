/**
 * ============================================================================
 * FILE: backend/controllers/profileController.js
 * PURPOSE: Manages the User's Master Profile (Universal Personal & Address Data).
 *
 * PRIVACY & ENCRYPTION GUARANTEE:
 * - Phone number and Street Address are encrypted with AES-256-CBC before being
 *   stored in the database (`encryptText`).
 * - When the owner requests their profile, `decryptText` decrypts it for them.
 * - We also return `encryptedPreview` so you can demonstrate to your professor
 *   how the data looks inside the database (encrypted gibberish)!
 * ============================================================================
 */

import { readDB, saveDB, addActivityLog } from "../config/db.js";
import { encryptText, decryptText } from "../utils/encryption.js";

/**
 * GET /api/profiles/me
 * Retrieves the logged-in user's Master Profile (decrypted for the owner).
 */
export function getMyMasterProfile(req, res) {
  const db = readDB();
  let profile = db.masterProfiles.find((p) => p.userId === req.user.id);

  // If no profile exists yet, initialize one
  if (!profile) {
    profile = {
      userId: req.user.id,
      fullName: req.user.name,
      email: req.user.email,
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
    };
    db.masterProfiles.push(profile);
    saveDB(db);
  }

  return res.json({
    success: true,
    profile: {
      userId: profile.userId,
      fullName: profile.fullName,
      email: profile.email,
      phone: decryptText(profile.phone),
      dob: profile.dob,
      gender: profile.gender,
      address: {
        street: decryptText(profile.address?.street || ""),
        city: profile.address?.city || "",
        state: profile.address?.state || "",
        pinCode: profile.address?.pinCode || "",
        country: profile.address?.country || "India"
      },
      // Included so user/professor can inspect how AES-256 stores it in DB!
      encryptedDatabasePreview: {
        phoneInDb: profile.phone,
        streetInDb: profile.address?.street
      },
      updatedAt: profile.updatedAt
    }
  });
}

/**
 * PUT /api/profiles/me
 * Updates the logged-in user's Master Profile and encrypts sensitive fields.
 */
export function updateMyMasterProfile(req, res) {
  const { fullName, email, phone, dob, gender, address } = req.body;
  const db = readDB();

  let profileIndex = db.masterProfiles.findIndex((p) => p.userId === req.user.id);

  const updatedProfile = {
    userId: req.user.id,
    fullName: fullName ?? req.user.name,
    email: email ?? req.user.email,
    // Encrypt sensitive personal details before saving to database!
    phone: encryptText(phone || ""),
    dob: dob || "",
    gender: gender || "Prefer not to say",
    address: {
      street: encryptText(address?.street || ""),
      city: address?.city || "",
      state: address?.state || "",
      pinCode: address?.pinCode || "",
      country: address?.country || "India"
    },
    updatedAt: new Date().toISOString()
  };

  if (profileIndex >= 0) {
    db.masterProfiles[profileIndex] = updatedProfile;
  } else {
    db.masterProfiles.push(updatedProfile);
  }

  // Also sync user display name if changed
  const userRecord = db.users.find((u) => u.id === req.user.id);
  if (userRecord && fullName) {
    userRecord.name = fullName;
  }

  saveDB(db);
  addActivityLog(req.user.id, req.user.email, "PROFILE_UPDATED", "Updated Master Profile (AES-256 encrypted)");

  return res.json({
    success: true,
    message: "Master Profile saved & encrypted with AES-256!",
    profile: {
      ...updatedProfile,
      phone: decryptText(updatedProfile.phone),
      address: {
        ...updatedProfile.address,
        street: decryptText(updatedProfile.address.street)
      },
      encryptedDatabasePreview: {
        phoneInDb: updatedProfile.phone,
        streetInDb: updatedProfile.address.street
      }
    }
  });
}
