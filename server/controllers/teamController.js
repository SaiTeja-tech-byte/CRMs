const User = require("../models/User");

// GET /api/team — any logged-in employee can browse colleagues (read-only).
// Same field exclusions as the admin listing, just without the requireAdmin gate.
const listTeam = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "otpCode", "otpExpiresAt", "resetToken", "resetTokenExpiresAt", "googleId"] },
      order: [["fullName", "ASC"]],
    });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("List team error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching team" });
  }
};

module.exports = { listTeam };
