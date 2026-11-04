/**
 * ============================================================================
 * FILE: frontend/src/services/api.js
 * PURPOSE: Centralized API helper for communicating with the FillSync
 *          Backend Server on http://localhost:5000/api.
 *          Automatically attaches the JWT Bearer token from localStorage.
 * ============================================================================
 */

// Automatically uses VITE_API_URL, defaulting to your live deployed Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://fillsync-api.onrender.com/api";

/**
 * Generic helper to send HTTP requests (GET, POST, PUT, DELETE) to the backend.
 *
 * @param {string} endpoint - API path (e.g., "/auth/login" or "/folders")
 * @param {object} options  - Fetch options (method, body, headers)
 * @returns {Promise<object>} - Parsed JSON response
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("fillsync_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong with the request.");
  }

  return data;
}
