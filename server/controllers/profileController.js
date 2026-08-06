const User = require("../models/User");


const serializeProfile = (user) => {
  const { password, otpCode, otpExpiresAt, resetToken, resetTokenExpiresAt, googleId, ...safe } = user.toJSON();

  const [fallbackFirst, ...fallbackRest] = (safe.fullName || "").split(" ");

  return {
    ...safe,
    firstName: safe.firstName || fallbackFirst || "",
    lastName: safe.lastName || fallbackRest.join(" ") || "",
    company: safe.companyName || "",
    officialEmail: safe.officialEmail || safe.email || "",
  };
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, profile: serializeProfile(user) });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching profile" });
  }
};

// PATCH /api/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // NOTE: "employeeId" and "company" (companyName) are intentionally left
    // out of this list. They're shown read-only on the employee's own Me
    // page — only an admin can set them, from the Employees section
    // (see adminController.updateUser) — so they must never be accepted
    // here, even if a request happens to include them.
    const editableFields = [
      // Personal Information
      "firstName",
      "lastName",
      "displayName",
      "dob",
      "gender",
      "nationality",
      // Work Information
      "designation",
      "department",
      "officeLocation",
      "employmentType",
      "joiningDate",
      "reportingManager",
      "employmentStatus",
      // Contact Information
      "officialEmail",
      "personalEmail",
      "phoneNumber",
      "alternatePhone",
      "emergencyContact",
      "emergencyPhone",
      "address",
      "city",
      "state",
      "country",
      "zipCode",
      // About / social
      "bio",
      "skills",
      "experience",
      "languagesKnown",
      "avatar",
      "linkedin",
      "github",
      "portfolio",
      "website",
      "avatarUrl",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        // Empty-string dates blow up Postgres DATEONLY columns — store as null instead.
        user[field] = req.body[field] === "" && ["dob", "joiningDate"].includes(field) ? null : req.body[field];
      }
    });

    // Keep fullName (used elsewhere — team lists, headers) in sync when the
    // person edits their first/last name on the Me page.
    if (req.body.firstName !== undefined || req.body.lastName !== undefined) {
      const first = req.body.firstName ?? user.firstName ?? "";
      const last = req.body.lastName ?? user.lastName ?? "";
      const combined = `${first} ${last}`.trim();
      if (combined) user.fullName = combined;
    }

    await user.save();

    return res.status(200).json({ success: true, profile: serializeProfile(user) });
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
