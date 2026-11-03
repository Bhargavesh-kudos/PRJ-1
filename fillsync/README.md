# FillSync — Smart Form Automation & Profile Management System

> **PRJ-1 Capstone Project | BML Munjal University (5th Semester)**
> **Team:** Bhargavesh, Neal Soni, Yash Yadav, Mayank Verma, Nitin Rao

---

## 📂 Organised Top-Level Folder Structure

Inside `d:\BMU\5th sem\PRJ-1\fillsync\`, the project is cleanly separated into **4 top-level directories**:

1. **`users/`** — User Website & User Dashboard (`frontend/` and `backend/`)
2. **`superadmin/`** — SuperAdmin Management Console (`frontend/` and `backend/`)
3. **`extension/`** — Chromium Browser Extension (`popup/`, `background/`, `content/`)
4. **`shared-database/`** — Shared AES-256 Encrypted Localhost Storage (`local_storage.json`)

```text
fillsync/
│
├── users/                                        # 👤 USER MODULE (Website + User Dashboard)
│   ├── backend/                                  # User Backend Code
│   │   ├── .env                                  # User Backend Config & Encryption Keys
│   │   ├── server.js                             # Main Localhost API Server (Port 5000)
│   │   ├── config/db.js                          # Shared Encrypted Database Manager
│   │   ├── utils/encryption.js                   # AES-256-CBC Encryption & Admin PII Masking
│   │   ├── middleware/authMiddleware.js          # User JWT Guard
│   │   ├── controllers/                          # Separate Controller per User Feature
│   │   │   ├── authController.js                 # User Login, Signup & Default Folders Seeding
│   │   │   ├── profileController.js              # Master Profile CRUD (Encrypted Phone/Street)
│   │   │   ├── folderController.js               # 3 Built-In + Custom Data Folders CRUD
│   │   │   ├── templateController.js             # Smart Templates & {Variable} Extractor
│   │   │   └── subscriptionController.js         # Mock Razorpay Upgrade / Cancel
│   │   └── routes/                               # Separate Route File per User Feature
│   │       ├── authRoutes.js
│   │       ├── profileRoutes.js
│   │       ├── folderRoutes.js
│   │       ├── templateRoutes.js
│   │       └── subscriptionRoutes.js
│   │
│   └── frontend/                                 # User Frontend Code (Port 5173)
│       └── src/
│           ├── components/
│           │   ├── navbar/PublicNavbar.jsx
│           │   ├── footer/Footer.jsx
│           │   ├── sidebar/UserSidebar.jsx
│           │   └── extension-simulator/ExtensionSimulatorModal.jsx
│           └── pages/                            # Separate Folder for Every User Screen!
│               ├── landing-page/LandingPage.jsx
│               ├── login-page/LoginPage.jsx
│               ├── signup-page/SignupPage.jsx
│               ├── user-dashboard/UserDashboard.jsx
│               ├── master-profile/MasterProfilePage.jsx
│               ├── data-folders/DataFoldersPage.jsx
│               ├── smart-templates/SmartTemplatesPage.jsx
│               ├── subscription-page/SubscriptionPage.jsx
│               └── settings-page/SettingsPage.jsx
│
├── superadmin/                                   # 🛡️ SUPERADMIN MODULE (Admin Control Panel)
│   ├── backend/                                  # SuperAdmin Backend Code
│   │   ├── .env                                  # SuperAdmin Login Email & Password Config
│   │   ├── server.js                             # SuperAdmin Server Entry
│   │   ├── middleware/adminAuthMiddleware.js     # Strict SuperAdmin Role Guard
│   │   ├── controllers/                          # Separate Controller per Admin Task
│   │   │   ├── adminOverviewController.js        # Platform Analytics & MRR Stats
│   │   │   ├── adminUsersController.js           # PII-Masked User Management
│   │   │   ├── adminTicketsController.js         # Support Ticket Reply & Resolution
│   │   │   └── adminSettingsController.js        # SuperAdmin Email/Password & Limits Updater
│   │   └── routes/
│   │       └── adminRoutes.js
│   │
│   └── frontend/                                 # SuperAdmin Frontend Code
│       └── src/
│           ├── components/sidebar/AdminSidebar.jsx
│           └── pages/                            # Separate Folder for Every Admin Screen!
│               ├── admin-dashboard/AdminDashboard.jsx
│               ├── overview-page/AdminOverviewTab.jsx
│               ├── users-management/AdminUsersTab.jsx
│               ├── subscriptions-mrr/AdminSubscriptionsTab.jsx
│               ├── security-logs/AdminLogsTab.jsx
│               ├── support-tickets/AdminTicketsTab.jsx
│               └── system-settings/AdminSettingsTab.jsx
│
├── extension/                                    # 🧩 CHROMIUM BROWSER EXTENSION (Manifest V3)
│   ├── manifest.json
│   ├── popup/
│   │   ├── popup.html
│   │   └── popup.js
│   ├── background/
│   │   └── serviceWorker.js
│   └── content/
│       └── domInjector.js
│
└── shared-database/                              # 🔒 SHARED ENCRYPTED LOCALHOST STORAGE
    └── local_storage.json
```
