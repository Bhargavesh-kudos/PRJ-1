/**
 * ============================================================================
 * FILE: frontend/src/pages/login-page/LoginPage.jsx
 * PURPOSE: Login Screen for Regular Users and SuperAdmin.
 *          Features:
 *          1. Downward email suggestion dropdown for previously registered/used
 *             emails when clicking or typing in the Email box.
 *          2. "Continue with Google (Gmail)" option to login/register with Gmail.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowLeft, X, UserCheck } from "lucide-react";
import { apiRequest } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Downward email suggestion dropdown state
  const [knownAccounts, setKnownAccounts] = useState([]);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);

  // Google Sign-In Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [googleError, setGoogleError] = useState("");

  // Forgot / Reset Password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const { saveAuthSession } = useAuth();
  const navigate = useNavigate();

  // Load previously registered / logged-in emails for downward suggestion
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await apiRequest("/auth/known-accounts");
        const localSaved = JSON.parse(localStorage.getItem("fillsync_recent_emails") || "[]");
        const merged = [...(res.accounts || [])];

        localSaved.forEach((item) => {
          if (!merged.some((m) => m.email.toLowerCase() === item.email.toLowerCase())) {
            merged.push(item);
          }
        });
        setKnownAccounts(merged);
      } catch (err) {
        const localSaved = JSON.parse(localStorage.getItem("fillsync_recent_emails") || "[]");
        setKnownAccounts(localSaved);
      }
    }
    fetchAccounts();
  }, []);

  function rememberAccountLocally(userObj) {
    if (!userObj || userObj.role === "superadmin") return;
    const existing = JSON.parse(localStorage.getItem("fillsync_recent_emails") || "[]");
    const filtered = existing.filter(
      (x) => x.email.toLowerCase() !== userObj.email.toLowerCase()
    );
    filtered.unshift({ name: userObj.name, email: userObj.email });
    localStorage.setItem("fillsync_recent_emails", JSON.stringify(filtered.slice(0, 5)));
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password })
      });

      rememberAccountLocally(res.user);
      saveAuthSession(res.token, res.user);

      if (res.user.role === "superadmin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPasswordSubmit(e) {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    setResetLoading(true);

    try {
      const res = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: resetEmail.trim(), newPassword })
      });

      setResetSuccess("Password updated successfully! Logging you in...");
      rememberAccountLocally(res.user);
      saveAuthSession(res.token, res.user);

      setTimeout(() => {
        setShowForgotModal(false);
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  }

  async function handleGoogleLogin(selectedEmail, selectedName) {
    const targetEmail = (selectedEmail || googleEmail).trim();
    const targetName = (selectedName || googleName).trim();

    if (!targetEmail) {
      setGoogleError("Please enter your Gmail address.");
      setError("Please enter your Gmail address.");
      return;
    }

    setError("");
    setGoogleError("");
    setLoading(true);

    try {
      const res = await apiRequest("/auth/google", {
        method: "POST",
        body: JSON.stringify({ email: targetEmail, name: targetName })
      });

      rememberAccountLocally(res.user);
      saveAuthSession(res.token, res.user);
      setShowGoogleModal(false);
      navigate("/dashboard");
    } catch (err) {
      setGoogleError(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPasswordSubmit(e) {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");
    setResetLoading(true);

    try {
      const res = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: resetEmail.trim(), newPassword })
      });

      setResetSuccess("Password updated successfully! Logging you in...");
      rememberAccountLocally(res.user);
      saveAuthSession(res.token, res.user);

      setTimeout(() => {
        setShowForgotModal(false);
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  }

  // Filter suggestions matching what the user is typing
  const matchingSuggestions = knownAccounts.filter((acc) =>
    acc.email.toLowerCase().includes(email.toLowerCase())
  );

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Branded Panel */}
      <div className="lg:col-span-6 bg-slate-900 text-white p-10 lg:p-16 flex flex-col justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-teal-300 hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">FillSync</h1>
        </div>

        <p className="text-lg font-semibold text-teal-300">
          Smart Form Automation &amp; Profile Management
        </p>
        <p className="text-sm text-slate-300 mt-3 max-w-md leading-relaxed">
          Sign in with your email or Gmail account to manage your Master Profile,
          Data Folders, and Smart Templates.
        </p>
      </div>

      {/* Right Login Form */}
      <div className="lg:col-span-6 flex items-center justify-center p-8 lg:p-16 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">Sign In</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Enter your email and password or continue with Gmail
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex flex-col gap-1.5">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email || "bhargaveshpandit@gmail.com");
                  setShowForgotModal(true);
                }}
                className="text-teal-700 font-bold hover:underline text-left inline-flex items-center gap-1 cursor-pointer"
              >
                ⚡ Click here to set your original password in 5 seconds →
              </button>
            </div>
          )}

          {/* Continue with Google (Gmail) Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-3 text-sm font-semibold text-slate-700 transition-colors mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.08.72-2.45 1.16-4.22 1.16-3.24 0-5.98-2.18-6.96-5.12H1.05v3.14C3.06 21.16 7.21 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.04 14.03c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.33H1.05C.38 7.66 0 9.16 0 11.75s.38 4.09 1.05 5.42l3.99-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.8 0 3.41.62 4.68 1.84l3.51-3.51C18.07 1.19 15.3 0 12 0 7.21 0 3.06 2.84 1.05 6.83l3.99 3.14c.98-2.94 3.72-5.22 6.96-5.22z"
              />
            </svg>
            Continue with Google (Gmail)
          </button>

          <div className="relative flex py-1 items-center mb-5">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium">
              OR SIGN IN WITH EMAIL
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field with Downward Suggestion Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onFocus={() => setShowEmailDropdown(true)}
                  onBlur={() => setTimeout(() => setShowEmailDropdown(false), 180)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowEmailDropdown(true);
                  }}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Downward Registered Email Suggestions Dropdown */}
              {showEmailDropdown && matchingSuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                  <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                    Saved Accounts on this Device
                  </div>
                  {matchingSuggestions.map((acc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={() => {
                        setEmail(acc.email);
                        setShowEmailDropdown(false);
                      }}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-teal-50 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserCheck className="w-4 h-4 text-teal-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{acc.email}</p>
                          <p className="text-[11px] text-slate-500">{acc.name}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-teal-600 font-semibold">Select</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email || "bhargaveshpandit@gmail.com");
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                >
                  Forgot / Set Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-teal-600 hover:underline">
                Create New Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          GOOGLE (GMAIL) ACCOUNT CHOOSER MODAL
      ===================================================================== */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.08.72-2.45 1.16-4.22 1.16-3.24 0-5.98-2.18-6.96-5.12H1.05v3.14C3.06 21.16 7.21 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.04 14.03c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.33H1.05C.38 7.66 0 9.16 0 11.75s.38 4.09 1.05 5.42l3.99-3.14z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.8 0 3.41.62 4.68 1.84l3.51-3.51C18.07 1.19 15.3 0 12 0 7.21 0 3.06 2.84 1.05 6.83l3.99 3.14c.98-2.94 3.72-5.22 6.96-5.22z"
                  />
                </svg>
                <h3 className="text-base font-bold text-slate-900">Sign in with Google</h3>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {googleError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium leading-relaxed">
                  {googleError}
                </div>
              )}

              {/* Show Saved Gmail Accounts to Click in 1 Tap */}
              {knownAccounts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500">
                    Choose an account to continue to FillSync:
                  </p>
                  {knownAccounts.map((acc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleGoogleLogin(acc.email, acc.name)}
                      className="w-full p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 flex items-center gap-3 text-left transition-all"
                    >
                      <div className="w-9 h-9 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center text-sm shrink-0">
                        {acc.name?.[0]?.toUpperCase() || "G"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{acc.name}</p>
                        <p className="text-xs text-slate-500">{acc.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Or Type Any Gmail Account */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <p className="text-xs font-semibold text-slate-600">
                  {knownAccounts.length > 0 ? "Or use another Gmail account:" : "Enter your Gmail account:"}
                </p>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Your Name (optional for existing users)"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                />
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-colors"
                >
                  {loading ? "Signing in..." : "Continue with Gmail"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          FORGOT / SET ORIGINAL PASSWORD MODAL
      ===================================================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-sm font-bold">Set Your FillSync Password</h3>
                  <p className="text-[11px] text-slate-400">Sync with your original preferred password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-4">
              {resetError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {resetError}
                </div>
              )}
              {resetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {resetSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Account Email
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="bhargaveshpandit@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter Your Original / Desired Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your original password here"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-teal-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  This will immediately become your permanent login password.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  {resetLoading ? "Saving..." : "Save & Login Instantly"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
