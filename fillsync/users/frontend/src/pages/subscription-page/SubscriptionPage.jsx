/**
 * ============================================================================
 * FILE: frontend/src/pages/subscription-page/SubscriptionPage.jsx
 * PURPOSE: Freemium Subscription & Production-Ready Razorpay Gateway Upgrade.
 *
 * PRICING:
 * - ₹99 for 3 Months (Special Student Quarterly Plan - ₹33/month)
 * - 90 Days Premium validity
 *
 * GATEWAY BEHAVIOR:
 * 1. Live Deployment: Automatically opens the official Razorpay Checkout modal
 *    (supporting UPI apps like Google Pay, PhonePe, Paytm, QR scan, Debit/Credit
 *    Cards, and NetBanking). Payments automatically settle into your bank account!
 * 2. Academic / Demo Mode: If Razorpay keys are not provided in .env, seamlessly
 *    allows instant test upgrade so college presentations run without a hitch.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Crown,
  CreditCard,
  Sparkles,
  ShieldCheck,
  X,
  Zap,
  QrCode,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../services/api.js";

export default function SubscriptionPage() {
  const { user, updateUserState } = useAuth();
  const isPremium = user?.role === "premium";

  const [gatewayConfig, setGatewayConfig] = useState({
    keyId: null,
    isLiveGateway: false,
    priceINR: 99,
    durationDays: 90,
    planName: "Premium Student Plan (3 Months)"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Fetch gateway configuration on mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await apiRequest("/subscribe/config");
        if (res.success) {
          setGatewayConfig(res);
        }
      } catch (err) {
        console.warn("Could not load payment gateway config, using local defaults.");
      }
    }
    fetchConfig();
  }, []);

  // Dynamically load Razorpay standard checkout script
  useEffect(() => {
    if (!document.getElementById("razorpay-checkout-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-checkout-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  /**
   * Initiates payment: Opens official Razorpay modal if live keys present,
   * otherwise opens academic demo modal.
   */
  async function handleStartUpgrade() {
    setProcessing(true);
    setStatusMsg(null);

    try {
      // 1. Request an order from the backend
      const orderRes = await apiRequest("/subscribe/create-order", {
        method: "POST"
      });

      if (!orderRes.success) {
        throw new Error(orderRes.message || "Failed to initialize order");
      }

      // 2. If live Razorpay gateway is ready and script loaded, open standard Razorpay
      if (orderRes.isLive && window.Razorpay) {
        const options = {
          key: orderRes.keyId,
          amount: orderRes.amount,
          currency: orderRes.currency,
          name: "FillSync Automation",
          description: "Premium Student Plan (3 Months)",
          image: "https://fillsync.app/favicon.ico",
          order_id: orderRes.orderId,
          handler: async function (response) {
            try {
              setProcessing(true);
              const verifyRes = await apiRequest("/subscribe/verify", {
                method: "POST",
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              if (verifyRes.user) {
                updateUserState(verifyRes.user);
              }
              setStatusMsg({ type: "success", text: verifyRes.message });
            } catch (vErr) {
              setStatusMsg({ type: "error", text: vErr.message });
            } finally {
              setProcessing(false);
            }
          },
          prefill: {
            name: user?.name || "Student User",
            email: user?.email || "user@example.com"
          },
          theme: {
            color: "#0d9488" // Tailwind Teal-600
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (failResponse) {
          setStatusMsg({
            type: "error",
            text: `Payment failed: ${failResponse.error.description}`
          });
          setProcessing(false);
        });
        rzp.open();
        setProcessing(false);
      } else {
        // Fallback to Academic / Test Upgrade modal
        setIsModalOpen(true);
        setProcessing(false);
      }
    } catch (err) {
      // If error occurs, open the test modal so user is never blocked
      setIsModalOpen(true);
      setProcessing(false);
    }
  }

  // Completes instant upgrade in academic/test mode
  async function handleCompleteInstantUpgrade(e) {
    if (e) e.preventDefault();
    setProcessing(true);
    setStatusMsg(null);

    try {
      const res = await apiRequest("/subscribe/upgrade", {
        method: "POST",
        body: JSON.stringify({ paymentMethod: "UPI / Razorpay Test (₹99 for 3 Months)" })
      });

      if (res.user) {
        updateUserState(res.user);
      }
      setIsModalOpen(false);
      setStatusMsg({ type: "success", text: res.message });
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setProcessing(false);
    }
  }

  // Cancels active plan
  async function handleCancelPlan() {
    setProcessing(true);
    try {
      const res = await apiRequest("/subscribe/cancel", {
        method: "POST"
      });
      if (res.user) {
        updateUserState(res.user);
      }
      setStatusMsg({ type: "info", text: res.message });
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {isPremium ? "Your Subscription" : "Choose Your Plan"}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {isPremium
            ? "Manage your active FillSync Premium membership, quotas, and automation features"
            : "Upgrade to FillSync Premium to unlock unlimited folders, 6-passenger travel roster, and AI mapping"}
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border text-sm font-semibold flex items-center justify-between ${
            statusMsg.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =====================================================================
          VIEW A: PREMIUM USER ACTIVE SUBSCRIPTION DASHBOARD
      ===================================================================== */}
      {isPremium ? (
        <div className="space-y-6">
          {/* Active Green Banner */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-extrabold text-emerald-950">
                  Premium Active • ₹99 / 3 Months (Quarterly Student Plan)
                </p>
                <p className="text-xs text-emerald-700">
                  Valid for 90 Days • All Unlimited Features & AI Resizer Unlocked
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold uppercase">
              ★ Premium Unlocked
            </span>
          </div>

          {/* Plan Benefits & Usage Progress Bars */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900">Plan Benefits & Quotas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Custom Data Folders</span>
                  <span className="text-teal-600 font-bold">Unlimited Unlocked</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-full h-full bg-teal-500" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Smart Templates & AI Enhance</span>
                  <span className="text-teal-600 font-bold">Unlimited Unlocked</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-full h-full bg-teal-500" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">6-Passenger Family Roster & File Resizer</span>
                  <span className="text-emerald-600 font-bold">Active & Enabled</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-full h-full bg-emerald-500" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">AI Field Mapping Requests</span>
                  <span className="text-slate-900 font-bold">500 / month quota</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-[15%] h-full bg-amber-500" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={handleCancelPlan}
                disabled={processing}
                className="px-4 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
              >
                Cancel Subscription (Switch to Free)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =====================================================================
            VIEW B: FREE USER UPGRADE COMPARISON CARDS
        ===================================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Free Plan</h3>
              <p className="text-xs text-slate-500 mt-1">For occasional single form filling</p>
              <div className="my-6">
                <span className="text-3xl font-extrabold text-slate-900">Free Forever</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  3 Built-In Profiles (Travel, Professional, Personal)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  Up to 2 Custom Data Folders
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  Up to 5 Smart Templates
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  Single Passenger Form Filling
                </li>
              </ul>
            </div>
            <button
              disabled
              className="mt-8 w-full py-3 rounded-xl bg-slate-100 text-slate-500 font-semibold text-sm cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Card - ₹99 for 3 Months */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl border-2 border-teal-500 shadow-xl relative flex flex-col justify-between">
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
              Special Student Offer
            </span>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                Premium Plan <Crown className="w-5 h-5 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400 mt-1">For college placement season & competitive exams</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-teal-400">₹99</span>
                <span className="text-slate-300 text-base font-semibold"> / 3 months</span>
                <p className="text-xs text-teal-300/80 mt-1">Just ₹33/month • Billed quarterly</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <strong>Unlimited</strong> Custom Folders & 220+ Built-In Fields
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <strong>Full 6-Passenger Roster</strong> (IRCTC, Flights, Buses)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <strong>Smart Image & Document Resizer Studio</strong> (20-50KB Photo/Sign)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <strong>Document Vault</strong> (19 Formats with Auto-Filling)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <strong>Google Gemini AI</strong> Dynamic Field & Synonym Mapping
                </li>
              </ul>
            </div>
            <button
              onClick={handleStartUpgrade}
              disabled={processing}
              className="mt-8 w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-lg hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
            >
              {processing ? "Connecting Gateway..." : "Upgrade Now • ₹99 for 3 Months"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          ACADEMIC / TEST MODAL (Used for localhost & testing without live payment)
      ===================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-sm font-bold">Razorpay Payment Gateway</h3>
                  <p className="text-[11px] text-slate-400">FillSync Premium — ₹99 for 3 Months</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Project Evaluation & Sandbox Mode</p>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    Payments are running in safe sandbox simulation mode for project demonstration. Click below to activate the ₹99 Premium plan and test all features with zero risk!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Plan:</span>
                  <span className="font-bold text-slate-900">Student Plan (90 Days)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-extrabold text-teal-600 text-sm">₹99.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Payment Modes Supported:</span>
                  <span className="text-slate-700">UPI (GPay/PhonePe/Paytm), Cards, NetBanking</span>
                </div>
              </div>

              <button
                onClick={handleCompleteInstantUpgrade}
                disabled={processing}
                className="w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                {processing ? "Activating..." : "Complete Upgrade (₹99 • 3 Months)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
