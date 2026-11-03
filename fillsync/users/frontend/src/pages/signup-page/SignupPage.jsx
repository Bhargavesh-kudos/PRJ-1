/**
 * ============================================================================
 * FILE: frontend/src/pages/signup-page/SignupPage.jsx
 * PURPOSE: Dedicated User Registration Screen with "Register with Google (Gmail)"
 *          and automatic local account remembering for the login dropdown.
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, User, Mail, Lock, CheckCircle2, ArrowLeft, X } from "lucide-react";
import { apiRequest } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [knownAccounts, setKnownAccounts] = useState([]);

  const { saveAuthSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadKnown() {
      try {
        const res = await apiRequest("/auth/known-accounts");
        setKnownAccounts(res.accounts || []);
      } catch (e) {
        // Ignore
      }
    }
    loadKnown();
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

  async function handleSignupSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password })
      });

      rememberAccountLocally(res.user);
      saveAuthSession(res.token, res.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup(selectedEmail, selectedName) {
    const targetEmail = (selectedEmail || googleEmail).trim();
    const targetName = (selectedName || googleName).trim();

    if (!targetEmail) {
      setError("Please enter your Gmail address.");
      return;
    }

    setError("");
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Branded Panel */}
      <div className="lg:col-span-6 bg-slate-900 text-white p-10 lg:p-16 flex flex-col justify-between">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-teal-300 hover:text-white mb-10"
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

          <h2 className="text-xl font-bold text-teal-300 mt-2">
            What You Get on Sign Up:
          </h2>

          <ul className="space-y-3.5 mt-6 text-sm text-slate-200">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
              <span>
                <strong>3 Pre-Built Data Folders:</strong> Travel Profile,
                Professional Profile, and Personal Profile ready to use.
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
              <span>
                <strong>Custom Folder Builder:</strong> Create your own folders with
                dynamic key-value fields.
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
              <span>
                <strong>Smart Templates:</strong> Pre-loaded HR &amp; LinkedIn outreach
                templates with <code className="text-teal-300">{"{Variable}"}</code> placeholders.
              </span>
            </li>
          </ul>
        </div>

        <p className="text-xs text-slate-400 mt-8">
          PRJ-1 Capstone Project • BML Munjal University
        </p>
      </div>

      {/* Right Signup Form */}
      <div className="lg:col-span-6 flex items-center justify-center p-8 lg:p-16 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">Create Your Account</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Register with Gmail or fill in your details below
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* Register with Google (Gmail) Button */}
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
            Register with Google (Gmail)
          </button>

          <div className="relative flex py-1 items-center mb-5">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium">
              OR REGISTER WITH EMAIL
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-teal-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          GOOGLE (GMAIL) SIGNUP / LOGIN MODAL
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
                <h3 className="text-base font-bold text-slate-900">Continue with Google</h3>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {knownAccounts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500">
                    Choose an account:
                  </p>
                  {knownAccounts.map((acc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleGoogleSignup(acc.email, acc.name)}
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

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <p className="text-xs font-semibold text-slate-600">
                  Register / Sign in with your Gmail:
                </p>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="Your Full Name"
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
                  onClick={() => handleGoogleSignup()}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm transition-colors"
                >
                  {loading ? "Creating Account..." : "Continue with Gmail"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
