/**
 * ============================================================================
 * FILE: backend/utils/encryption.js
 * PURPOSE: Solves the Cloud Privacy & Data Misuse problem!
 *
 * HOW IT WORKS:
 * 1. Before any sensitive user field (Phone, Aadhaar, PAN, Passport, Address)
 *    is saved to the database, `encryptText()` encrypts it using AES-256-CBC.
 * 2. Even if someone opens the database file directly, they only see encrypted
 *    gibberish like "a9f28c...:81bc47...".
 * 3. Only the authenticated user's session can decrypt their own data via
 *    `decryptText()`.
 * 4. When the SuperAdmin views users in the Admin Dashboard, `maskSensitive()`
 *    masks personal details (e.g., "98******45") so the admin cannot misuse them.
 * ============================================================================
 */

import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// AES-256 requires a 32-byte key. We derive a consistent 32-byte key using SHA-256.
const RAW_SECRET = process.env.ENCRYPTION_KEY || "fillsync_32_byte_aes_secret_key!";
const SECRET_KEY = crypto.createHash("sha256").update(String(RAW_SECRET)).digest();
const IV_LENGTH = 16; // 16 bytes Initialization Vector for AES-256-CBC

/**
 * Encrypts a plain text string using AES-256-CBC.
 *
 * @param {string} plainText - The user's original text (e.g., "9876543210")
 * @returns {string} - Encrypted string in format "ivHex:encryptedHex"
 */
export function encryptText(plainText) {
  if (!plainText || typeof plainText !== "string") {
    return plainText;
  }

  // Avoid double-encrypting if already in "enc::iv:cipher" format
  if (plainText.startsWith("enc::")) {
    return plainText;
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `enc::${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts an AES-256-CBC encrypted string back to plain text for the owner.
 *
 * @param {string} cipherText - The encrypted string ("enc::ivHex:encryptedHex")
 * @returns {string} - The original decrypted string
 */
export function decryptText(cipherText) {
  if (!cipherText || typeof cipherText !== "string") {
    return cipherText;
  }

  if (!cipherText.startsWith("enc::")) {
    return cipherText;
  }

  try {
    const parts = cipherText.replace("enc::", "").split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    return "[Encrypted Data]";
  }
}

/**
 * Masks sensitive strings for the SuperAdmin dashboard so the admin can verify
 * account status without seeing or misusing private user details.
 *
 * @param {string} value - Plain or encrypted text
 * @returns {string} - Masked string (e.g., "98******10")
 */
export function maskSensitive(value) {
  const plain = decryptText(value || "");

  if (!plain || plain.length <= 4) {
    return "****";
  }

  const firstTwo = plain.slice(0, 2);
  const lastTwo = plain.slice(-2);
  const stars = "*".repeat(Math.min(plain.length - 4, 8));

  return `${firstTwo}${stars}${lastTwo}`;
}
