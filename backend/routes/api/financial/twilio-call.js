/**
 * POST /api/financial/call-buyer
 * Body: { transactionId, orderId, action?: 'voice'|'sms', phone? }
 * Initiates Twilio call/SMS and logs to Enquiry collection.
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
    const { transactionId, orderId, action = "voice", phone } = req.body || {};
    if (!orderId) {
      return res.status(400).json({ success: false, error: "orderId required" });
    }

    const to = phone || process.env.TWILIO_BUYER_PHONE || "+1234567890";
    let callSid = null;

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE) {
      try {
        // eslint-disable-next-line global-require
        const twilio = require("twilio")(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        if (action === "voice") {
          const call = await twilio.calls.create({
            to,
            from: process.env.TWILIO_PHONE,
            url: process.env.TWILIO_VOICE_URL || "http://demo.twilio.com/docs/voice.xml",
          });
          callSid = call.sid;
        } else {
          const msg = await twilio.messages.create({
            to,
            from: process.env.TWILIO_PHONE,
            body: `Mineral Bridge: Please contact us regarding order ${orderId}.`,
          });
          callSid = msg.sid;
        }
      } catch (e) {
        console.warn("Twilio error:", e.message);
      }
    }

    const db = getDb();
    if (db) {
      await db.collection("enquiry").insertOne({
        orderId,
        transactionId: transactionId || null,
        phone: to,
        action,
        callSid,
        timestamp: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      callSid: callSid || undefined,
    });
  } catch (err) {
    console.error("call-buyer error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = handler;
