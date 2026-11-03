/**
 * ============================================================================
 * FILE: frontend/src/main.jsx
 * PURPOSE: React DOM Entry Point mounting the FillSync Application.
 * ============================================================================
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
