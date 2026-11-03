/**
 * ============================================================================
 * FILE: extension/popup/popup.js
 * PURPOSE: Connects the Browser Extension Popup to the FillSync Backend
 *          (http://localhost:5000/api) and adapts features based on whether
 *          the logged-in user is on the Normal (Free) Plan or Premium Plan.
 * ============================================================================
 */

const API_BASE = "http://localhost:5000/api";

const loginSection = document.getElementById("loginSection");
const controlsSection = document.getElementById("controlsSection");
const folderSelect = document.getElementById("folderSelect");
const templateSelect = document.getElementById("templateSelect");
const statusMsg = document.getElementById("statusMsg");
const planBadge = document.getElementById("planBadge");
const userNameDisplay = document.getElementById("userNameDisplay");

// Premium toggles
const aiMappingToggle = document.getElementById("aiMappingToggle");
const multiStepToggle = document.getElementById("multiStepToggle");
const turboSpeedToggle = document.getElementById("turboSpeedToggle");
const freeUpgradeBanner = document.getElementById("freeUpgradeBanner");

let currentUser = null;
let cachedProfile = null;
let cachedFolders = [];
let cachedTemplates = [];

// Check if already logged in
const savedToken = localStorage.getItem("fillsync_ext_token");
if (savedToken) {
  loadUserData(savedToken);
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value;

  if (!email || !password) {
    statusMsg.textContent = "Please enter both email and password.";
    return;
  }

  statusMsg.textContent = "Signing in...";

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("fillsync_ext_token", data.token);
    await loadUserData(data.token);
  } catch (err) {
    statusMsg.textContent = "Error: " + err.message;
  }
});

async function loadUserData(token) {
  try {
    const [meRes, profRes, foldRes, tplRes] = await Promise.all([
      fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_BASE}/profiles/me`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_BASE}/folders`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_BASE}/templates`, { headers: { Authorization: `Bearer ${token}` } })
    ]);

    if (!meRes.ok) throw new Error("Session expired. Please sign in again.");

    const meData = await meRes.json();
    const profData = await profRes.json();
    const foldData = await foldRes.json();
    const tplData = await tplRes.json();

    currentUser = meData.user;
    cachedProfile = profData.profile;
    cachedFolders = foldData.folders || [];
    cachedTemplates = tplData.templates || [];

    // Update User Name & Plan Badge (Normal Free vs Premium)
    userNameDisplay.textContent = currentUser.name;
    const isPremium = currentUser.role === "premium";

    if (isPremium) {
      planBadge.textContent = "★ PREMIUM";
      planBadge.className = "badge-premium";
      aiMappingToggle.disabled = false;
      aiMappingToggle.checked = true;
      multiStepToggle.disabled = false;
      multiStepToggle.checked = true;
      turboSpeedToggle.disabled = false;
      freeUpgradeBanner.style.display = "none";
    } else {
      planBadge.textContent = "FREE PLAN";
      planBadge.className = "badge-free";
      aiMappingToggle.disabled = true;
      aiMappingToggle.checked = false;
      multiStepToggle.disabled = true;
      multiStepToggle.checked = false;
      turboSpeedToggle.disabled = true;
      turboSpeedToggle.checked = false;
      freeUpgradeBanner.style.display = "block";
    }

    // Populate Folders Dropdown
    folderSelect.innerHTML = "";
    cachedFolders.forEach((f, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = `${f.folderName} (${f.category})`;
      folderSelect.appendChild(opt);
    });

    // Populate Smart Templates Dropdown
    templateSelect.innerHTML = "";
    cachedTemplates.forEach((t, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = t.title;
      templateSelect.appendChild(opt);
    });

    loginSection.style.display = "none";
    controlsSection.style.display = "block";
    statusMsg.textContent = isPremium
      ? "Premium Mode Active: All features unlocked!"
      : "Free Mode Active: Standard form fill ready.";
  } catch (err) {
    localStorage.removeItem("fillsync_ext_token");
    loginSection.style.display = "block";
    controlsSection.style.display = "none";
    statusMsg.textContent = err.message;
  }
}

// 1-Click Form Fill Handler
document.getElementById("fillFormBtn").addEventListener("click", async () => {
  const selectedFolder = cachedFolders[folderSelect.value] || { fields: [] };
  const isPremium = currentUser?.role === "premium";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(
    tab.id,
    {
      action: "FILLSYNC_INJECT_FORM",
      masterProfile: cachedProfile,
      folderFields: selectedFolder.fields,
      isPremium,
      useAiMapping: isPremium && aiMappingToggle.checked,
      useMultiStep: isPremium && multiStepToggle.checked,
      useTurboSpeed: isPremium && turboSpeedToggle.checked
    },
    (response) => {
      if (response && response.status) {
        statusMsg.textContent = response.status;
      } else {
        statusMsg.textContent = "Form filled on active page!";
      }
    }
  );
});

// Smart Template Injection Handler
document.getElementById("injectTemplateBtn").addEventListener("click", async () => {
  const selectedTemplate = cachedTemplates[templateSelect.value];
  if (!selectedTemplate) {
    statusMsg.textContent = "No template selected.";
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(
    tab.id,
    {
      action: "FILLSYNC_INJECT_TEMPLATE",
      templateBody: selectedTemplate.body,
      variables: selectedTemplate.variables || [],
      userName: currentUser?.name || ""
    },
    (response) => {
      if (response && response.status) {
        statusMsg.textContent = response.status;
      } else {
        statusMsg.textContent = "Template injected!";
      }
    }
  );
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("fillsync_ext_token");
  currentUser = null;
  planBadge.textContent = "Not Signed In";
  planBadge.className = "badge-free";
  loginSection.style.display = "block";
  controlsSection.style.display = "none";
  statusMsg.textContent = "Logged out.";
});
