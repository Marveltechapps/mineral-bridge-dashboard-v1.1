/**
 * POST /api/financial/reserve-escrow
 * Body: { transactionId, orderId, amount, currency }
 * Reserves escrow (Stripe or mock). Updates transactions collection.
 */

function getDb() {
  try {
    // eslint-disable-next-line global-require
    const { getDb: db } = require("../../../lib/mongodb");
    return db && db();
  } catch {
    return null;
  }
}

function parseAmount(amount) {
  if (typeof amount === "number" && !Number.isNaN(amount)) return Math.round(amount);
  if (typeof amount === "string") return Math.round(parseFloat(amount.replace(/[$,]/g, "")) || 0);
  return 0;
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { transactionId, orderId, amount, currency = "usd" } = req.body || {};
    if (!orderId) {
      return res.status(400).json({ success: false, error: "orderId required" });
    }

    const amountCents = parseAmount(amount);
    let escrowId = null;

    if (process.env.STRIPE_SECRET_KEY) {
      try {
        // eslint-disable-next-line global-require
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        // Stripe: use PaymentIntents or custom escrow product; here we simulate with a placeholder
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountCents,
          currency: currency.toLowerCase(),
          automatic_payment_methods: { enabled: true },
          metadata: { orderId, transactionId: transactionId || "", type: "escrow" },
        });
        escrowId = paymentIntent.id;
      } catch (e) {
        console.warn("Stripe error:", e.message);
      }
    }

    if (!escrowId) {
      escrowId = `escrow_${orderId}_${Date.now()}`;
    }

    const db = getDb();
    if (db) {
      await db.collection("transactions").updateOne(
        { orderRef: orderId },
        {
          $set: {
            escrowId,
            status: "Reserved",
            updatedAt: new Date(),
          },
        },
        { upsert: false }
      );
    }

    return res.status(200).json({
      success: true,
      escrowId,
    });
  } catch (err) {
    console.error("reserve-escrow error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = handler;
