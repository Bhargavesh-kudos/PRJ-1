/**
 * ============================================================================
 * FILE: frontend/src/components/navbar/PublicNavbar.jsx
 * PURPOSE: Top Navigation Bar for all Public Website sections.
 * ============================================================================
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, LayoutDashboard, Download, Chrome } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import ExtensionInstallModal from "../extension-install-modal/ExtensionInstallModal.jsx";

export default function PublicNavbar() {
  const { user } = useAuth();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  function handleDownloadClick() {
    setIsInstallModalOpen(true);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Fill<span className="text-teal-500">Sync</span>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-teal-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-teal-600 transition-colors">
            How It Works
          </a>
          <button
            type="button"
            onClick={() => setIsInstallModalOpen(true)}
            className="hover:text-teal-600 transition-colors cursor-pointer"
          >
            Install Guide
          </button>
          <a href="#pricing" className="hover:text-teal-600 transition-colors">
            Pricing
          </a>
          <a href="#contact" className="hover:text-teal-600 transition-colors">
            Contact
          </a>
        </nav>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadClick}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-teal-500/40 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="View Setup Guide & Download Extension"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Install Extension</span>
          </button>

          {user ? (
            <Link
              to={user.role === "superadmin" ? "/admin" : "/dashboard"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              {user.role === "superadmin" ? "Admin Panel" : "Dashboard"}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-slate-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold shadow-sm transition-all"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>

      <ExtensionInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </header>
  );
}
