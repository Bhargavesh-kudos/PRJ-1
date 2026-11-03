/**
 * ============================================================================
 * FILE: frontend/src/pages/landing-page/LandingPage.jsx
 * PURPOSE: Public Website Homepage:
 *          1. Hero Section
 *          2. Features Section (6 Feature Cards)
 *          3. How It Works (3 Steps)
 *          4. Pricing (Free vs Premium)
 *          5. Contact / Support Ticket Form
 * ============================================================================
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  MousePointerClick,
  FileCode2,
  BrainCircuit,
  FolderKanban,
  Bot,
  Layers,
  CheckCircle2,
  ArrowRight,
  Chrome,
  Send
} from "lucide-react";
import PublicNavbar from "../../components/navbar/PublicNavbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { apiRequest } from "../../services/api.js";

export default function LandingPage() {
  // State for the Contact / Support Ticket form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    category: "Feature Request",
    subject: "",
    message: ""
  });
  const [contactStatus, setContactStatus] = useState(null);

  async function handleContactSubmit(e) {
    e.preventDefault();
    setContactStatus({ type: "loading", text: "Submitting ticket..." });
    try {
      const res = await apiRequest("/support/contact", {
        method: "POST",
        body: JSON.stringify(contactForm)
      });
      setContactStatus({ type: "success", text: res.message });
      setContactForm({
        name: "",
        email: "",
        category: "Feature Request",
        subject: "",
        message: ""
      });
    } catch (err) {
      setContactStatus({ type: "error", text: err.message });
    }
  }

  const featuresList = [
    {
      icon: MousePointerClick,
      title: "1-Click Form Fill",
      desc: "Populate lengthy job applications, travel portals (IRCTC), and checkouts in under 3 seconds.",
      premium: false
    },
    {
      icon: FolderKanban,
      title: "3 Built-In + Custom Folders",
      desc: "Comes pre-loaded with Travel, Professional, and Personal folders — plus create your own categories.",
      premium: false
    },
    {
      icon: FileCode2,
      title: "Smart Templates ({Variables})",
      desc: "Save cold emails and LinkedIn notes with dynamic {HR_Name} and {Company_Name} placeholders.",
      premium: false
    },
    {
      icon: Bot,
      title: "Human-Like Automation",
      desc: "Uses natural typing delays so websites don't flag you as a bot.",
      premium: false
    },
    {
      icon: BrainCircuit,
      title: "AI Field Mapping (Gemini)",
      desc: "Automatically maps obscure or dynamically generated HTML input fields using Google Gemini AI.",
      premium: true
    },
    {
      icon: Layers,
      title: "Multi-Step Form Automation",
      desc: "Fills multi-page forms and triggers Next buttons while halting safely at CAPTCHAs.",
      premium: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      {/* =================================================================
          SECTION 1: HERO
      ================================================================= */}
      <section className="pt-16 pb-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Fill Forms in One Click.{" "}
            <span className="text-teal-500">Automate Everything.</span>
          </h1>

          <p className="text-lg text-slate-600 mt-5 max-w-2xl mx-auto leading-relaxed">
            Store your categorized profiles (Travel, Job, Personal), create Smart
            Templates with dynamic{" "}
            <code className="px-1.5 py-0.5 rounded bg-slate-200 text-teal-700 font-mono text-sm">{"{variables}"}</code>,
            and let FillSync handle the typing across any website.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow-sm transition-all"
            >
              <Chrome className="w-5 h-5" />
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-600 font-semibold transition-all"
            >
              Login to Dashboard
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-500" /> Works on Chrome, Edge &amp; Brave
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-500" /> Halts safely at CAPTCHAs
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-500" /> Your data stays private
            </span>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 2: FEATURES (3x2 GRID)
      ================================================================= */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900">Features</h2>
            <p className="text-slate-600 mt-3">
              Everything you need to stop typing the same information over and over.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200 hover:border-teal-400 bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    {feat.premium && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        ★ Premium
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 3: HOW IT WORKS (3 STEPS)
      ================================================================= */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900">How FillSync Works</h2>
            <p className="text-slate-600 mt-3">Get started in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Create Your Profile
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Set up your Master Profile and fill in your 3 built-in folders
                (Travel, Professional, Personal) or create new custom ones.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Install the Browser Extension
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Add the FillSync extension to Chrome, Edge, or Brave. It
                connects to your dashboard automatically when you log in.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Fill Forms in 1 Click
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Click "Fill This Form" in the extension popup and watch your data
                get typed into any web form — Gmail, IRCTC, LinkedIn, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 4: PRICING (FREE vs PREMIUM)
      ================================================================= */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900">Choose Your Plan</h2>
            <p className="text-slate-600 mt-3">
              Start free, upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Free Plan</h3>
                <p className="text-sm text-slate-500 mt-1">Ideal for students &amp; beginners</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-slate-500 text-sm"> / forever</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    3 Built-In Folders (Travel, Professional, Personal)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    2 Additional Custom Folders
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    Up to 5 Smart Templates with {"{Variables}"}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    1-Click Human-Like Form Injection
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className="mt-8 w-full py-3 rounded-xl border border-slate-300 hover:border-teal-500 text-center font-semibold text-sm text-slate-800 hover:text-teal-600 transition-colors"
              >
                Start Free Forever
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="p-8 rounded-2xl border-2 border-teal-500 bg-slate-900 text-white relative flex flex-col justify-between shadow-xl">
              <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h3 className="text-xl font-bold">Premium Plan</h3>
                <p className="text-sm text-slate-400 mt-1">Special Student Plan • Full Placement Season</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-teal-400">₹99</span>
                  <span className="text-slate-300 text-sm font-semibold"> / 3 months</span>
                  <p className="text-xs text-teal-300/80 mt-1">Just ₹33/month • Billed quarterly</p>
                </div>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <strong>Unlimited</strong> Folders &amp; 220+ Built-In Fields
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <strong>Full 6-Passenger Roster</strong> (IRCTC, Flights, Buses)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <strong>Smart Image Resizer Studio</strong> (Govt Exam 20-50KB)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    Google Gemini AI Dynamic Field Mapping
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    Multi-Step Form Automation
                  </li>
                </ul>
              </div>
              <Link
                to="/signup"
                className="mt-8 w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-center font-bold text-sm transition-colors"
              >
                Get Started &amp; Upgrade Anytime
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          SECTION 5: CONTACT FORM
      ================================================================= */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Contact Us
            </h2>
            <p className="text-sm text-slate-600 mt-1 mb-6">
              Have a question or feedback? Send us a message.
            </p>

            {contactStatus && (
              <div
                className={`mb-5 p-4 rounded-xl text-sm font-medium ${
                  contactStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : contactStatus.type === "error"
                    ? "bg-rose-50 text-rose-800 border border-rose-200"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {contactStatus.text}
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                  >
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Billing / Subscription">Billing / Subscription</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Short summary"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message
                </label>
                <textarea
                  rows="3"
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Describe your question or feedback..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
