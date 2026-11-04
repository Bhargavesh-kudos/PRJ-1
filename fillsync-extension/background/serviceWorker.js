/**
 * ============================================================================
 * FILE: extension/background/serviceWorker.js
 * PURPOSE: Manifest V3 Background Service Worker for the FillSync Extension.
 *          Listens for installation events and coordinates messages between
 *          the Extension Popup (`popup/`) and Content Script (`content/`).
 * ============================================================================
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log("FillSync Manifest V3 Service Worker Installed & Ready.");
});
