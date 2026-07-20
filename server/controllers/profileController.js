const User = require("../models/User");

// GET /api/profile
const getProfile = async (req, res) => {
  return res.status(200).json({ success: true, profile: req.user });
};

// PATCH /api/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const editableFields = [
      "fullName",
      "companyName",
      "employeeId",
      "designation",
      "department",
      "officeLocation",
      "phoneNumber",
      "reportingManager",
      "employmentStatus",
      "employmentType",
      "bio",
      "skills",
      "experience",
      "languagesKnown",
      "linkedin",
      "github",
      "portfolio",
      "website",
      "avatarUrl",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    const { password, otpCode, otpExpiresAt, resetToken, resetTokenExpiresAt, ...safeUser } = user.toJSON();

    return res.status(200).json({ success: true, profile: safeUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Server error updating profile" });
  }
};

// DELETE /api/profile  — permanently removes the logged-in user's account
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.destroy();

    return res.status(200).json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ success: false, message: "Unable to delete account. Please try again." });
  }
};

module.exports = { getProfile, updateProfile, deleteAccount };
