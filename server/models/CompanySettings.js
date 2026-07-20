const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// Singleton table — only ever one row. The controller always uses
// findOrCreate with a fixed id so there's never a second row to get
// out of sync.
const SINGLETON_ID = "00000000-0000-0000-0000-000000000001";

const CompanySettings = sequelize.define(
  "CompanySettings",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: SINGLETON_ID,
      primaryKey: true,
    },
    companyName: { type: DataTypes.STRING, defaultValue: "" },
    companyEmail: { type: DataTypes.STRING, defaultValue: "" },
    phoneNumber: { type: DataTypes.STRING, defaultValue: "" },
    website: { type: DataTypes.STRING, defaultValue: "" },
    companyAddress: { type: DataTypes.STRING, defaultValue: "" },
    city: { type: DataTypes.STRING, defaultValue: "" },
    state: { type: DataTypes.STRING, defaultValue: "" },
    country: { type: DataTypes.STRING, defaultValue: "" },
    postalCode: { type: DataTypes.STRING, defaultValue: "" },
    businessType: { type: DataTypes.STRING, defaultValue: "" },
    industry: { type: DataTypes.STRING, defaultValue: "" },
    companySize: { type: DataTypes.STRING, defaultValue: "" },
    foundedYear: { type: DataTypes.STRING, defaultValue: "" },
    workingDays: { type: DataTypes.STRING, defaultValue: "Monday - Friday" },
    workingHours: { type: DataTypes.STRING, defaultValue: "9:00 AM - 5:00 PM" },
    timezone: { type: DataTypes.STRING, defaultValue: "" },
    currency: { type: DataTypes.STRING, defaultValue: "" },
    dateFormat: { type: DataTypes.STRING, defaultValue: "MM/DD/YYYY" },
    smtpHost: { type: DataTypes.STRING, defaultValue: "" },
    smtpPort: { type: DataTypes.STRING, defaultValue: "" },
    senderEmail: { type: DataTypes.STRING, defaultValue: "" },
    senderName: { type: DataTypes.STRING, defaultValue: "" },
    replyToEmail: { type: DataTypes.STRING, defaultValue: "" },
    enableEmailNotif: { type: DataTypes.BOOLEAN, defaultValue: true },
    enablePushNotif: { type: DataTypes.BOOLEAN, defaultValue: true },
    enableEmployeeAlerts: { type: DataTypes.BOOLEAN, defaultValue: true },
    enableCompanyAnnouncements: { type: DataTypes.BOOLEAN, defaultValue: true },
    enableTaskNotif: { type: DataTypes.BOOLEAN, defaultValue: true },
    enableCalendarReminders: { type: DataTypes.BOOLEAN, defaultValue: true },
    enableNewsNotif: { type: DataTypes.BOOLEAN, defaultValue: true },
    sessionTimeout: { type: DataTypes.STRING, defaultValue: "30 minutes" },
    passwordPolicy: { type: DataTypes.STRING, defaultValue: "Strong" },
    maxLoginAttempts: { type: DataTypes.STRING, defaultValue: "5" },
    enableAuditLogs: { type: DataTypes.BOOLEAN, defaultValue: true },
    allowEmployeeProfileEditing: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "company_settings",
    timestamps: true,
  }
);

module.exports = { CompanySettings, SINGLETON_ID };
