/**
 * ============================================================================
 * FILE: start-project.js
 * PURPOSE: Starts both the Backend Server (Port 5000) and Frontend Server
 *          (Port 5173) from a single terminal inside Visual Studio Code.
 *
 * HOW TO RUN IN VS CODE TERMINAL:
 *   node start-project.js
 * ============================================================================
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("==========================================================");
console.log("  🚀 Starting FillSync Localhost Servers...");
console.log("  Backend API:  http://localhost:5000");
console.log("  Frontend Web: http://localhost:5173");
console.log("==========================================================");

// 1. Start Backend Server (Port 5000)
const backendDir = path.join(__dirname, "users", "backend");
const backend = spawn("node", ["server.js"], {
  cwd: backendDir,
  stdio: "inherit",
  shell: true
});

// 2. Start Frontend Vite Server (Port 5173)
const frontendDir = path.join(__dirname, "users", "frontend");
const frontend = spawn("npx.cmd", ["vite", "--port", "5173"], {
  cwd: frontendDir,
  stdio: "inherit",
  shell: true
});

process.on("SIGINT", () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
