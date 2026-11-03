/**
 * ============================================================================
 * FILE: users/backend/routes/subscriptionRoutes.js
 * PURPOSE: Express Router for User Subscription Upgrade, Razorpay Orders,
 *          Signature Verification & Cancellations.
 * ============================================================================
 */

import express from "express";
import {
  getSubscriptionConfig,
  createSubscriptionOrder,
  verifySubscriptionPayment,
  upgradeToPremium,
  cancelSubscription
} from "../controllers/subscriptionController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/subscribe/config -> Get Razorpay key & plan details
router.get("/config", protectRoute, getSubscriptionConfig);

// POST /api/subscribe/create-order -> Create Razorpay order (₹99 for 3 months)
router.post("/create-order", protectRoute, createSubscriptionOrder);

// POST /api/subscribe/verify -> Verify Razorpay payment signature & activate premium
router.post("/verify", protectRoute, verifySubscriptionPayment);

// POST /api/subscribe/upgrade -> Direct upgrade (supports test / demo flow)
router.post("/upgrade", protectRoute, upgradeToPremium);

// POST /api/subscribe/cancel -> Cancel Premium subscription
router.post("/cancel", protectRoute, cancelSubscription);

export default router;
