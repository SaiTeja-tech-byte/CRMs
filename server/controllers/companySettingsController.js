const { CompanySettings, SINGLETON_ID } = require("../models/CompanySettings");
const { emitToAll } = require("../utils/socket");

const EDITABLE_FIELDS = [
  "companyName", "companyEmail", "phoneNumber", "website", "companyAddress",
  "city", "state", "country", "postalCode", "businessType", "industry",
  "companySize", "foundedYear", "workingDays", "workingHours", "timezone",
  "currency", "dateFormat", "smtpHost", "smtpPort", "senderEmail", "senderName",
  "replyToEmail", "enableEmailNotif", "enablePushNotif", "enableEmployeeAlerts",
  "enableCompanyAnnouncements", "enableTaskNotif", "enableCalendarReminders",
  "enableNewsNotif", "sessionTimeout", "passwordPolicy", "maxLoginAttempts",
  "enableAuditLogs", "allowEmployeeProfileEditing",
];

// GET /api/company-settings — any logged-in user can read (e.g. employees
// may need working hours / timezone), only admins can write.
const getCompanySettings = async (req, res) => {
  try {
    const [settings] = await CompanySettings.findOrCreate({ where: { id: SINGLETON_ID } });
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("Get company settings error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching company settings" });
  }
};

// PUT /api/company-settings — admin only (locked in the route file).
const updateCompanySettings = async (req, res) => {
  try {
    const [settings] = await CompanySettings.findOrCreate({ where: { id: SINGLETON_ID } });

    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) settings[field] = req.body[field];
    }

    await settings.save();
    emitToAll("settings:updated", { settings });
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error("Update company settings error:", error);
    return res.status(500).json({ success: false, message: "Server error updating company settings" });
  }
};

module.exports = { getCompanySettings, updateCompanySettings };
