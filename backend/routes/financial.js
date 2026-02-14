/**
 * Financial & Reporting API routes (Node.js + Express).
 * Mount at: app.use('/api/financial', require('./routes/financial'));
 * MongoDB: transactions collection (txId, user, order, amount, status, etc.) when getDb() is available.
 */

const express = require("express");
const router = express.Router();
const qrGenerate = require("./api/financial/qr-generate");
const twilioCall = require("./api/financial/twilio-call");
const stripeEscrow = require("./api/financial/stripe-escrow");

// POST /api/financial/send-qr – Generate QR + optional Resend email
router.post("/send-qr", qrGenerate);

// POST /api/financial/call-buyer – Twilio Voice/SMS + Enquiry log
router.post("/call-buyer", twilioCall);

// POST /api/financial/reserve-escrow – Stripe escrow / PaymentIntent
router.post("/reserve-escrow", stripeEscrow);

// Placeholder routes (return 501 until implemented)
router.post("/testing", (req, res) => res.status(501).json({ success: false, error: "Not implemented" }));
router.post("/lc-issue", (req, res) => res.status(501).json({ success: false, error: "Not implemented" }));
router.post("/release", (req, res) => res.status(501).json({ success: false, error: "Not implemented" }));
router.get("/transactions", (req, res) => res.status(501).json({ success: false, error: "Not implemented" }));

module.exports = router;
