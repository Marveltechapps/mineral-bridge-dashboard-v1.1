# Backend – Financial APIs

This folder contains API route handlers for the Financial flow. The **frontend** works without a backend (mock mode). When you run a Node/Express server, mount these routes to enable real QR, Twilio, and Stripe.

## Routes (mount at `/api/financial`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/send-qr` | Generate QR payload; optional Resend email. Body: `{ transactionId, orderId, channel?, amount? }` |
| POST | `/call-buyer` | Twilio voice/SMS + log to Enquiry. Body: `{ transactionId, orderId, action?, phone? }` |
| POST | `/reserve-escrow` | Stripe (PaymentIntent) or mock escrow. Body: `{ transactionId, orderId, amount, currency? }` |

## Wiring in Express

```js
const express = require("express");
const app = express();
app.use(express.json());
app.use("/api/financial", require("./routes/financial"));
```

## Frontend

Set `VITE_FINANCIAL_API_URL` to your backend origin (e.g. `http://localhost:3001`) so the dashboard calls these endpoints instead of mocks.

## Optional env and dependencies

- **MongoDB** – `getDb()` in `lib/mongodb.js`; used to update `transactions` / `enquiry` when available.
- **QR** – `qrcode` package for server-side QR image in `/send-qr`.
- **Resend** – `RESEND_API_KEY`, `RESEND_FROM`, `FINANCIAL_BUYER_EMAIL` for email in `/send-qr`.
- **Twilio** – `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE`, optional `TWILIO_VOICE_URL`.
- **Stripe** – `STRIPE_SECRET_KEY` for `/reserve-escrow`.

If env or DB are missing, handlers still return success with mock data where needed.
