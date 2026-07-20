

const RESEND_API_URL = "https://api.resend.com/emails";

const isEmailConfigured = process.env.RESEND_API_KEY;

const sendViaResend = async ({ to, subject, html }) => {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "CRM App <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorBody}`);
  }

  return response.json();
};

const sendOtpEmail = async (to, otp, purpose = "verification") => {
  if (!isEmailConfigured) {
    console.log("=".repeat(50));
    console.log(`[DEV MODE - no email configured] OTP for ${to}: ${otp}`);
    console.log(`Purpose: ${purpose}`);
    console.log("=".repeat(50));
    return;
  }

  const subject =
    purpose === "login"
      ? "Your CRM Login Verification Code"
      : "Verify Your CRM Account";

  try {
    const result = await sendViaResend({
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
    console.log("OTP email sent via Resend:", result.id);
  } catch (error) {
    console.error("Failed to send OTP email:", error.message);
    throw error;
  }
};

const sendResetEmail = async (to, resetUrl) => {
  if (!isEmailConfigured) {
    console.log("=".repeat(50));
    console.log(`[DEV MODE - no email configured] Password reset link for ${to}:`);
    console.log(resetUrl);
    console.log("=".repeat(50));
    return;
  }

  try {
    const result = await sendViaResend({
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
    console.log("Reset email sent via Resend:", result.id);
  } catch (error) {
    console.error("Failed to send reset email:", error.message);
    throw error;
  }
};

module.exports = { sendOtpEmail, sendResetEmail };
