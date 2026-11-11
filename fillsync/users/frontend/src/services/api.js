/**
 * ============================================================================
 * FILE: frontend/src/services/api.js
 * PURPOSE: Centralized API helper for communicating with the FillSync
 *          Backend Server on http://localhost:5000/api.
 *          Automatically attaches the JWT Bearer token from localStorage.
 * ============================================================================
 */

// Automatically uses VITE_API_URL, or defaults to localhost if testing locally, otherwise live Render API
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : "https://fillsync-api.onrender.com/api");

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong with the request.");
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Server request timed out. The backend might still be waking up on Render. Please try again in a few seconds.");
    }
    if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
      throw new Error("Cannot connect to server. If running locally, please ensure 'node server.js' is running on port 5000.");
    }
    throw err;
  }
}
