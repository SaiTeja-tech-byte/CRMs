const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");
const generateOtp = require("../utils/generateOtp");
const { sendOtpEmail, sendResetEmail } = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

const OTP_TTL_MINUTES = 10;

const setOtpOnUser = async (user, purpose) => {
  const otp = generateOtp();
  user.otpCode = otp;
  user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await user.save();
  await sendOtpEmail(user.email, otp, purpose);
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { fullName, companyName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      companyName,
      email,
      password: hashedPassword,
      isEmailVerified: true, // 2FA/email verification disabled — see note in login()
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// POST /api/auth/login  (step 1: password check, triggers OTP)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Admin accounts must sign in from the admin login page." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 2FA (email OTP) disabled: password check alone is enough to log in.
    // See note above — real email delivery to arbitrary recipients needs a
    // verified sending domain, which this project doesn't have set up yet.
    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// POST /api/auth/admin/login
// Same password + OTP flow as employee login, but only allows role === "admin".
// Admin accounts aren't created through public registration - they're created
// directly in the database (or via a future admin-invite flow).
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "This account does not have admin access." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 2FA (email OTP) disabled — same as employee login, see note above.
    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// POST /api/auth/verify-otp  (step 2: works for both signup verification and login 2FA)
// body: { email, otp, purpose: "signup" | "login" }
const verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ success: false, message: "No OTP requested. Please try again." });
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (user.otpCode !== otp) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    // OTP is valid - clear it so it can't be reused
    user.otpCode = null;
    user.otpExpiresAt = null;
    if (purpose === "signup") {
      user.isEmailVerified = true;
    }
    await user.save();

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Verified successfully",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ success: false, message: "Server error during OTP verification" });
  }
};

// POST /api/auth/resend-otp
// body: { email, purpose: "signup" | "login" }
const resendOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await setOtpOnUser(user, purpose || "signup");

    return res.status(200).json({ success: true, message: "A new OTP has been sent to your email" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ success: false, message: "Server error while resending OTP" });
  }
};

// POST /api/auth/google
// body: { credential }  <- the idToken from Google's frontend button
const googleAuth = async (req, res) => {
  try {
    const { accessToken, isAdminLogin } = req.body;

    if (!accessToken) {
      return res.status(400).json({ success: false, message: "Missing Google access token" });
    }

    // Ask Google directly who this access token belongs to.
    const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!googleRes.ok) {
      return res.status(401).json({ success: false, message: "Invalid or expired Google token" });
    }

    const payload = await googleRes.json();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ where: { email } });

    if (isAdminLogin) {
      // Admin accounts are provisioned manually (DB/seed) — never auto-created here.
      if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "This account does not have admin access." });
      }
      if (!user.googleId) {
        user.googleId = googleId;
        user.isEmailVerified = true;
        await user.save();
      }
    } else {
      if (!user) {
        user = await User.create({
          fullName: name,
          email,
          googleId,
          isEmailVerified: true, // Google has already verified this email
        });
      } else if (!user.googleId) {
        // Existing local account signing in with Google for the first time
        user.googleId = googleId;
        user.isEmailVerified = true;
        await user.save();
      }
    }

    // Google has already proven identity, so we skip the email-OTP 2FA step here.
    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Signed in with Google",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        companyName: user.companyName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(401).json({ success: false, message: "Google sign-in failed" });
  }
};

// POST /api/auth/forgot-password
// body: { email }
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    // Always return the same generic message, whether or not the email exists,
    // so this endpoint can't be used to check which emails are registered.
    const genericMessage = "If that email is registered, a reset link has been sent.";

    if (!user) {
      return res.status(200).json({ success: true, message: genericMessage });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, resetUrl);

    return res.status(200).json({ success: true, message: genericMessage });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: "Server error during password reset request" });
  }
};

// POST /api/auth/reset-password
// body: { token, newPassword }
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    const user = await User.findOne({ where: { resetToken: token } });

    if (!user || !user.resetTokenExpiresAt || new Date() > new Date(user.resetTokenExpiresAt)) {
      return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Server error during password reset" });
  }
};

module.exports = { register, login, adminLogin, verifyOtp, resendOtp, googleAuth, forgotPassword, resetPassword };
