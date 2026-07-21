const ContactQuery = require("../models/ContactQuery");
const User = require("../models/User");
const { emitToAdmins, emitToUser } = require("../utils/socket");
const { sendMail } = require("../utils/sendEmail");

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

    // Respond to the customer right away — don't make them wait on Gmail's
    // SMTP round trip (this was the cause of the slow submit). The emails
    // still go out, just after the response, not before it.
    res.status(201).json({
      success: true,
      message: "Thanks for reaching out — our team will get back to you soon.",
    });

    User.findAll({ where: { role: "admin" }, attributes: ["email"] })
      .then((admins) =>
        Promise.all(
          admins.map((admin) =>
            sendMail({
              to: admin.email,
              subject: `New contact query from ${name}`,
              html: `<p><strong>${name}</strong> (${email}) sent a message:</p><p>${message}</p>`,
            }).catch((emailErr) =>
              console.error(`Admin notification email to ${admin.email} failed:`, emailErr.code || "", emailErr.message)
            )
          )
        )
      )
      .catch((err) => console.error("Admin notification lookup failed:", err.message));
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

    // Best-effort: the reply is already saved above, so a mail hiccup
    // shouldn't make the admin think their reply vanished. It's logged
    // either way so a real delivery problem is still visible in the logs.
    let emailWarning = null;
    try {
      await sendMail({
        to: query.email,
        subject: "Re: Your message to our team",
        html: `
          <p>Hi ${query.name},</p>
          <p>Thanks for reaching out. Here's our reply:</p>
          <blockquote style="border-left:3px solid #2563eb;padding-left:12px;color:#0f172a;">${query.reply}</blockquote>
          <p>— The team</p>
        `,
      });
    } catch (emailErr) {
      console.error("Reply email failed to send:", emailErr.code || "", emailErr.message);
      emailWarning = "Reply was saved, but the email to the customer could not be sent.";
    }

    return res.status(200).json({ success: true, query, emailWarning });
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
