const nodemailer = require("nodemailer");

// Gmail SMTP via an App Password (EMAIL_USER / EMAIL_PASS) — this is what's
// actually configured in .env. Resend was tried earlier but needs a
// RESEND_API_KEY that was never set here, and its sandbox sender
// (onboarding@resend.dev) can only deliver to the Resend account owner's
// own inbox anyway, which is exactly why admin replies to real customers
// were going nowhere.
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

let transporter = null;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        // Google shows App Passwords with spaces for readability
        // ("ekfn symr gsnr poqk"), but SMTP auth needs the raw 16
        // characters — spaces left in here cause a silent auth failure.
        pass: (process.env.EMAIL_PASS || "").replace(/\s+/g, ""),
      },
    });
  }
  return transporter;
};

// Generic sender — used by contactController.js for admin replies to
// customer queries, and by anything else that just needs to send an email.
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
