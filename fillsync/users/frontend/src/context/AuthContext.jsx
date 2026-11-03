/**
 * ============================================================================
 * FILE: frontend/src/context/AuthContext.jsx
 * PURPOSE: Global Authentication State Provider for FillSync.
 *          Manages the logged-in user (Free User, Premium User, or SuperAdmin)
 *          and persists session state across page reloads.
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("fillsync_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Verify token on initial load
  useEffect(() => {
    async function verifySession() {
      const token = localStorage.getItem("fillsync_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiRequest("/auth/me");
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem("fillsync_user", JSON.stringify(res.user));
        }
      } catch (err) {
        // Token expired or invalid -> clear session
        localStorage.removeItem("fillsync_token");
        localStorage.removeItem("fillsync_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, []);

  /**
   * Saves token and user object after successful Login or Signup.
   */
  function saveAuthSession(token, userData) {
    localStorage.setItem("fillsync_token", token);
    localStorage.setItem("fillsync_user", JSON.stringify(userData));
    setUser(userData);
  }

  /**
   * Updates the user object in state & localStorage (e.g., after upgrading to Premium).
   */
  function updateUserState(updatedUser) {
    localStorage.setItem("fillsync_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  /**
   * Logs out the current User or SuperAdmin.
   */
  function logout() {
    localStorage.removeItem("fillsync_token");
    localStorage.removeItem("fillsync_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        saveAuthSession,
        updateUserState,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
