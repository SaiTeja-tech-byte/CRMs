const nodemailer = require("nodemailer");
const dns = require("dns");

// Render's outbound networking resolves Gmail's SMTP host to an IPv6
// address by default, and that route hangs until it times out (the
// ETIMEDOUT errors in the logs) — Gmail's SMTP servers work fine, this is
// purely a routing problem on Render's side. Forcing Node to resolve
// hostnames as IPv4-first avoids it.
dns.setDefaultResultOrder("ipv4first");

let transporter = null;
const getTransporter = () => {
  if (!transporter) {
    const emailUser = (process.env.EMAIL_USER || "").trim();
    const emailPass = (process.env.EMAIL_PASS || "").trim().replace(/\s+/g, "");

    transporter = nodemailer.createTransport({
      // Explicit host/port instead of the "gmail" shorthand — same servers,
      // but this path respects the IPv4 preference above; the shorthand
      // sometimes doesn't.
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      connectionTimeout: 15000, // fail fast instead of hanging for minutes
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });
  }
  return transporter;
};

// Check which email configuration is available.
// Note: Render's Free tier blocks SMTP ports (25, 465, 587). If you run on
// the Free tier, configure RESEND_API_KEY to send emails via HTTP API (Port 443).
const sendMail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const emailUser = (process.env.EMAIL_USER || "").trim();
  const emailPass = (process.env.EMAIL_PASS || "").trim().replace(/\s+/g, "");
  
  const isResendConfigured = !!apiKey;
  const isSmtpConfigured = !!(emailUser && emailPass);
  const isEmailConfigured = isResendConfigured || isSmtpConfigured;

  const targetTo = (to || "").trim();

  if (!isEmailConfigured) {
    console.log("=".repeat(50));
    console.log(`[DEV MODE - no email configured] Email to ${targetTo}: ${subject}`);
    console.log("=".repeat(50));
    return;
  }

  if (isResendConfigured) {
    // Send via Resend HTTP API (Port 443 - not blocked by Render Free Tier)
    const fromEmail = process.env.EMAIL_FROM || "CRM App <onboarding@resend.dev>";
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [targetTo],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Resend API error (${response.status}): ${errorBody}`);
      }

      const result = await response.json();
      console.log("Email sent via Resend HTTP API:", result.id);
      return result;
    } catch (error) {
      console.error("Failed to send email via Resend HTTP API:", error.message);
      throw error;
    }
  } else {
    // Send via Gmail SMTP (Nodemailer)
    try {
      const info = await getTransporter().sendMail({
        from: `"CRM App" <${emailUser}>`,
        to: targetTo,
        subject,
        html,
      });
      console.log("Email sent via Gmail SMTP:", info.messageId);
      return info;
    } catch (error) {
      console.error("Failed to send email via Gmail SMTP:", error.code || "", error.message);
      throw error;
    }
  }
};

const sendOtpEmail = async (to, otp, purpose = "verification") => {
  const subject =
    purpose === "login"
      ? "Your CRM Login Verification Code"
      : "Verify Your CRM Account";

  await sendMail({
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Your verification code</h2>
        <p>Use the code below to ${purpose === "login" ? "sign in" : "verify your account"}. It expires in 10 minutes.</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

const sendResetEmail = async (to, resetUrl) => {
  await sendMail({
    to,
    subject: "Reset your CRM password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Reset your password</h2>
        <p>Click the link below to set a new password. It expires in 15 minutes.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendMail, sendOtpEmail, sendResetEmail };
