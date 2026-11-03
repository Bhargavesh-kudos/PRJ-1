/**
 * ============================================================================
 * FILE: users/frontend/vite.config.js
 * PURPOSE: Vite Development Server Configuration for FillSync.
 *          Allows serving files across both `users/frontend` and
 *          `superadmin/frontend` on http://localhost:5173.
 * ============================================================================
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    fs: {
      allow: [path.resolve(__dirname, "../..")]
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
});
