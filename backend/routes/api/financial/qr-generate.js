/**
 * POST /api/financial/qr-generate
 * Body: { transactionId, orderId, amount?, channel?: 'email'|'whatsapp' }
 * Generates QR payload, optionally saves to DB and sends via Resend.
 * Connect to existing MongoDB transactions collection when getDb() is available.
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

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { transactionId, orderId, amount, channel = "email" } = req.body || {};
    if (!orderId) {
      return res.status(400).json({ success: false, error: "orderId required" });
    }

    const qrData = `mineralbridge://pay/${orderId}/${amount ?? 0}`;

    // Optional: generate QR image (server-side) if qrcode is installed
    let qrImage = null;
    try {
      // eslint-disable-next-line global-require
      const QRCode = require("qrcode");
      qrImage = await QRCode.toDataURL(qrData);
    } catch {
      // no qrcode package – frontend can generate from qrData
    }

    const db = getDb();
    if (db) {
      await db.collection("transactions").updateOne(
        { orderRef: orderId },
        { $set: { qrGenerated: true, qrData, updatedAt: new Date() } },
        { upsert: false }
      );
    }

    // Optional: send email via Resend when RESEND_API_KEY is set
    if (channel === "email" && process.env.RESEND_API_KEY) {
      try {
        // eslint-disable-next-line global-require
        const { Resend } = require("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const to = req.body.buyerEmail || process.env.FINANCIAL_BUYER_EMAIL;
        if (to) {
          await resend.emails.send({
            from: process.env.RESEND_FROM || "Mineral Bridge <noreply@mineralbridge.com>",
            to,
            subject: `Payment QR – Order ${orderId}`,
            html: `<p>Scan the QR to pay for order <strong>${orderId}</strong>.</p><p>Link: ${qrData}</p>`,
          });
        }
      } catch (e) {
        console.warn("Resend send failed:", e.message);
      }
    }

    return res.status(200).json({
      success: true,
      qrData,
      qrImage: qrImage || undefined,
    });
  } catch (err) {
    console.error("qr-generate error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = handler;
