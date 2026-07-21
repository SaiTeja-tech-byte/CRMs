const ContactQuery = require("../models/ContactQuery");
const User = require("../models/User");
const { emitToAdmins, emitToUser } = require("../utils/socket");

// sendEmail.js only exports OTP/reset-specific helpers today - build a small
// generic sender here using the same Resend API pattern rather than
// stretching those functions to mean something else.
const RESEND_API_URL = "https://api.resend.com/emails";
const isEmailConfigured = process.env.RESEND_API_KEY;

const sendGenericEmail = async ({ to, subject, html }) => {
  if (!isEmailConfigured) {
    console.log("=".repeat(50));
    console.log(`[DEV MODE - no email configured] Email to ${to}: ${subject}`);
    console.log("=".repeat(50));
    return;
  }
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: "CRM App <onboarding@resend.dev>", to: [to], subject, html }),
  });
  if (!response.ok) {
    console.error("Contact email send failed:", await response.text());
  }
};

// POST /api/contact - PUBLIC, no auth required
const submitQuery = async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required" });
    }

    const query = await ContactQuery.create({ name, email, phone, company, message });

    // Notify every currently-connected admin in real time
    emitToAdmins("contact:new-query", { query });

    // Best-effort email notification to admins - failure here shouldn't
    // block the customer's submission from succeeding.
    try {
      const admins = await User.findAll({ where: { role: "admin" }, attributes: ["email"] });
      for (const admin of admins) {
        await sendGenericEmail({
          to: admin.email,
          subject: `New contact query from ${name}`,
          html: `<p><strong>${name}</strong> (${email}) sent a message:</p><p>${message}</p>`,
        });
      }
    } catch (emailErr) {
      console.error("Admin notification email failed:", emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Thanks for reaching out — our team will get back to you soon.",
    });
  } catch (error) {
    console.error("Submit contact query error:", error);
    return res.status(500).json({ success: false, message: "Server error submitting your message" });
  }
};

// GET /api/contact - admin only
const getQueries = async (req, res) => {
  try {
    const queries = await ContactQuery.findAll({ order: [["createdAt", "DESC"]] });
    return res.status(200).json({ success: true, queries });
  } catch (error) {
    console.error("Get contact queries error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching queries" });
  }
};

// PATCH /api/contact/:id/assign  body: { assignedToId }
const assignQuery = async (req, res) => {
  try {
    const query = await ContactQuery.findByPk(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    query.assignedToId = req.body.assignedToId || req.user.id;
    query.status = "assigned";
    await query.save();

    if (query.assignedToId !== req.user.id) {
      emitToUser(query.assignedToId, "contact:assigned-to-you", { query });
    }

    return res.status(200).json({ success: true, query });
  } catch (error) {
    console.error("Assign contact query error:", error);
    return res.status(500).json({ success: false, message: "Server error assigning query" });
  }
};

// PATCH /api/contact/:id/reply  body: { reply }
const replyToQuery = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply?.trim()) {
      return res.status(400).json({ success: false, message: "Reply text is required" });
    }

    const query = await ContactQuery.findByPk(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    query.reply = reply.trim();
    query.repliedAt = new Date();
    query.repliedById = req.user.id;
    query.status = "replied";
    await query.save();

    await sendGenericEmail({
      to: query.email,
      subject: "Re: Your message to our team",
      html: `
        <p>Hi ${query.name},</p>
        <p>Thanks for reaching out. Here's our reply:</p>
        <blockquote style="border-left:3px solid #2563eb;padding-left:12px;color:#0f172a;">${query.reply}</blockquote>
        <p>— The team</p>
      `,
    });

    return res.status(200).json({ success: true, query });
  } catch (error) {
    console.error("Reply to contact query error:", error);
    return res.status(500).json({ success: false, message: "Server error sending reply" });
  }
};

// PATCH /api/contact/:id/close
const closeQuery = async (req, res) => {
  try {
    const query = await ContactQuery.findByPk(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    query.status = "closed";
    await query.save();

    return res.status(200).json({ success: true, query });
  } catch (error) {
    console.error("Close contact query error:", error);
    return res.status(500).json({ success: false, message: "Server error closing query" });
  }
};

module.exports = { submitQuery, getQueries, assignQuery, replyToQuery, closeQuery };
