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
    transporter = nodemailer.createTransport({
      // Explicit host/port instead of the "gmail" shorthand — same servers,
      // but this path respects the IPv4 preference above; the shorthand
      // sometimes doesn't.
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        // Google shows App Passwords with spaces for readability
        // ("ekfn symr gsnr poqk"), but SMTP auth needs the raw 16
        // characters — spaces left in here cause a silent auth failure.
        pass: (process.env.EMAIL_PASS || "").replace(/\s+/g, ""),
      },
      connectionTimeout: 15000, // fail fast instead of hanging for minutes
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });
  }
  return transporter;
};

// Generic sender — used by contactController.js for admin replies to
// customer queries, and by anything else that just needs to send an email.
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

const sendMail = async ({ to, subject, html }) => {
  if (!isEmailConfigured) {
    console.log("=".repeat(50));
    console.log(`[DEV MODE - no email configured] Email to ${to}: ${subject}`);
    console.log("=".repeat(50));
    return;
  }

  try {
    const info = await getTransporter().sendMail({
      from: `"CRM App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error.code || "", error.message);
    throw error;
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
