# 🚀 How to Run FillSync Locally

This guide explains exactly how to start the project on your computer — step by step.

---

## ⚡ Fastest Method (1-Click `run.bat` or Single Command)

### Option A: Double-Click `run.bat`
1. Go to your project folder in Windows File Explorer.
2. Double-click **`run.bat`**.
3. Both Backend (`http://localhost:5000`) and Frontend (`http://localhost:5173`) start together in one window!

### Option B: Single Command in VS Code Terminal
1. In VS Code, open the integrated terminal (press **`Ctrl + \``** or `Terminal → New Terminal`).
2. Type:
   ```powershell
   .\run.bat
   ```
   *(or `cd fillsync; node start-project.js`)*
3. Open **`http://localhost:5173`** in your browser!

---

## ✅ One-Click Method (VS Code — Recommended)

> Use this when showing to sir or running for demo.

1. Open VS Code
2. Go to **File → Open Folder** and select the `fillsync` folder
3. Press **`Ctrl + Shift + P`** (opens the Command Palette)
4. Type **`Tasks: Run Task`** and press Enter
5. Select **`🚀 Start FillSync (Both Servers)`** and press Enter
6. Two terminal panels open (Backend + Frontend) — wait about 5 seconds
7. Open your browser and go to: **`http://localhost:5173`**

That's it! The website is running. ✅

---

## 🛑 How to Stop

- Click on each terminal panel in VS Code
- Press **`Ctrl + C`** in each one to stop the server

---

## 🔧 Manual Method (If VS Code tasks don't work)

Open **two separate terminal windows** and run these commands:

### Terminal 1 — Backend Server
```
cd d:\BMU\5th sem\PRJ-1\fillsync\users\backend
node server.js
```
> You should see: `✅ FillSync backend running on port 5000`

### Terminal 2 — Frontend Server
```
cd d:\BMU\5th sem\PRJ-1\fillsync\users\frontend
npx.cmd vite --port 5173
```
> You should see: `Local: http://localhost:5173/`

Then open **`http://localhost:5173`** in your browser.

---

## 🔑 Login Details

| Role | Email | Password |
|------|-------|----------|
| **SuperAdmin** | `admin@fillsync.com` | `Admin@123` |
| **New User** | Sign up yourself at `/signup` | Your own password |

> **Note:** The SuperAdmin credentials are only in this file. The login page does NOT pre-fill any credentials — users must type them manually.

---

## 📁 Project Structure (Quick Reference)

```
fillsync/
├── users/
│   ├── backend/      ← Node.js API server (Port 5000)
│   └── frontend/     ← React + Vite website (Port 5173)
├── superadmin/
│   ├── backend/      ← Admin controllers (shared with users/backend)
│   └── frontend/     ← Admin dashboard pages
├── extension/        ← Chrome browser extension code
├── shared-database/  ← local_storage.json (created automatically)
└── .vscode/          ← VS Code run configuration (tasks.json, launch.json)
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 already in use | Open Task Manager → End `node.exe` processes |
| Port 5173 already in use | Open Task Manager → End `node.exe` processes |
| `node` not found | Install Node.js from nodejs.org |
| `npx.cmd` not found | Use `npx vite --port 5173` instead |
| Website shows blank page | Wait 5 seconds and refresh — the backend needs to start first |

---

*FillSync — PRJ-1 Capstone Project, BML Munjal University (5th Sem)*
*Team: Bhargavesh • Neal Soni • Yash Yadav • Mayank Verma • Nitin Rao*
